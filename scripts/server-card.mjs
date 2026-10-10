// Builds listings/server-card.json (static MCP server card, served at /.well-known/mcp/server-card.json
// for directories that cannot scan an authenticated server) from the live tools/list.
// Usage: SENTARYS_API_KEY=snt_live_... node scripts/server-card.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const key = process.env.SENTARYS_API_KEY;
if (!key) { console.error('Set SENTARYS_API_KEY'); process.exit(1); }
const url = 'https://api.sentarys.com/v1/mcp';
const call = async (method, params, id) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', authorization: `Bearer ${key}` },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status}`);
  return (await res.json()).result;
};
const init = await call('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'sentarys-server-card', version: '1.0.0' } }, 1);
const tools = [];
let cursor;
do {
  const page = await call('tools/list', cursor ? { cursor } : {}, 2);
  tools.push(...page.tools);
  cursor = page.nextCursor;
} while (cursor);
const card = {
  serverInfo: { name: init.serverInfo.name, title: init.serverInfo.title ?? 'Sentarys', version: init.serverInfo.version },
  authentication: { required: true, schemes: ['bearer'] },
  instructions: init.instructions,
  tools: tools.map(({ name, title, description, inputSchema, annotations }) => ({ name, title, description, inputSchema, annotations })),
  resources: [],
  prompts: [],
};
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'listings', 'server-card.json');
writeFileSync(out, `${JSON.stringify(card, null, 2)}\n`);
console.log(`wrote ${tools.length} tools to listings/server-card.json`);
