// Generates AGENTS.md (Codex and other AGENTS.md readers) and the Cursor rule from skills/sentarys/SKILL.md.
// Run `node scripts/sync.mjs` after editing SKILL.md; CI checks the outputs are in sync.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'skills/sentarys/SKILL.md'), 'utf8');
const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source);
if (!match) throw new Error('SKILL.md needs YAML frontmatter');
const description = /^description:\s*(.+)$/m.exec(match[1])?.[1].trim();
if (!description) throw new Error('SKILL.md frontmatter needs a description');
const body = match[2].replace(/\]\(references\//g, '](skills/sentarys/references/');
const banner = '<!-- Generated from skills/sentarys/SKILL.md by scripts/sync.mjs. Edit that file instead. -->\n';
const check = process.argv.includes('--check');
const outputs = {
  'AGENTS.md': `${banner}\n${body.trimStart()}`,
  '.cursor/rules/sentarys.mdc': `---\ndescription: ${description}\nglobs:\nalwaysApply: false\n---\n${banner}\n${body.replace(/\]\(skills\/sentarys\/references\//g, '](https://github.com/Accelar-labs/sentarys-skills/blob/main/skills/sentarys/references/').trimStart()}`,
};
let stale = false;
for (const [path, content] of Object.entries(outputs)) {
  const file = join(root, path);
  if (check) {
    let current = '';
    try { current = readFileSync(file, 'utf8'); } catch {}
    if (current !== content) { console.error(`${path} is out of sync; run node scripts/sync.mjs`); stale = true; }
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
    console.log(`wrote ${path}`);
  }
}
if (stale) process.exit(1);
