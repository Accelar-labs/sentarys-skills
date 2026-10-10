# Installing the Sentarys MCP server (for AI agents)

Sentarys is a remote MCP server; nothing needs to be cloned, built or run locally.

1. Ask the user for a Sentarys API key. They create it at https://sentarys.com/settings/api (Settings, API and MCP); it starts with `snt_live_`. Never print it back or commit it.
2. Add this server to the client's MCP settings (Cline: `cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "sentarys": {
      "type": "streamableHttp",
      "url": "https://api.sentarys.com/v1/mcp",
      "headers": { "Authorization": "Bearer snt_live_..." }
    }
  }
}
```

   Clients that cannot send headers can use `https://api.sentarys.com/v1/mcp/k/<key>` as the URL instead (treat it like a password).
3. Verify the connection by calling the free tool `get_account`. It returns the plan, the credit balance and the price of every action.
4. Optional: load `skills/sentarys/SKILL.md` from https://github.com/Accelar-labs/sentarys-skills as instructions; it describes the common flows (link to clips, upload, long edit, faceless, captions, dubbing, publishing), credit costs and polling rules.

Troubleshooting: `401 API_KEY_INVALID` or `API_KEY_REVOKED` means the key is wrong or revoked; `429 RATE_LIMITED` means more than 120 requests per minute per key.
