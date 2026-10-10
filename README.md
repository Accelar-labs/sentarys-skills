# Sentarys skills for AI agents

Teach Claude Code, Codex, Cursor and other coding agents to use [Sentarys](https://sentarys.com): clip podcasts and long videos into Shorts, edit vlogs from raw footage, make faceless videos, caption and dub videos, and publish or schedule clips, through the Sentarys MCP server, CLI or REST API.

| File | For |
|---|---|
| [`skills/sentarys/SKILL.md`](skills/sentarys/SKILL.md) | Claude Code (skill) and any agent that reads skills |
| [`AGENTS.md`](AGENTS.md) | Codex and other tools that read `AGENTS.md` |
| [`.cursor/rules/sentarys.mdc`](.cursor/rules/sentarys.mdc) | Cursor (project rule) |
| [`skills/sentarys/references/`](skills/sentarys/references) | Full tool list, credit prices, REST endpoints |

## 1. Create an API key

Sign in at [sentarys.com](https://sentarys.com) and create a key in [Settings, API and MCP](https://sentarys.com/settings/api). It starts with `snt_live_` and is shown once. Keep it in an environment variable:

```bash
export SENTARYS_API_KEY=snt_live_...
```

## 2. Install

### Claude Code

As a plugin (skill plus MCP server):

```text
/plugin marketplace add Accelar-labs/sentarys-skills
/plugin install sentarys@sentarys
```

The plugin reads `SENTARYS_API_KEY` from your environment. Or install the parts by hand:

```bash
claude mcp add --transport http sentarys https://api.sentarys.com/v1/mcp \
  --header "Authorization: Bearer $SENTARYS_API_KEY"
mkdir -p ~/.claude/skills && git clone --depth 1 https://github.com/Accelar-labs/sentarys-skills /tmp/sentarys-skills \
  && cp -r /tmp/sentarys-skills/skills/sentarys ~/.claude/skills/
```

### Codex

```bash
curl -fsSL https://raw.githubusercontent.com/Accelar-labs/sentarys-skills/main/AGENTS.md >> AGENTS.md
```

Then add the server to `~/.codex/config.toml`:

```toml
[mcp_servers.sentarys]
url = "https://api.sentarys.com/v1/mcp"

[mcp_servers.sentarys.http_headers]
Authorization = "Bearer snt_live_..."
```

### Cursor

```bash
mkdir -p .cursor/rules && curl -fsSL -o .cursor/rules/sentarys.mdc \
  https://raw.githubusercontent.com/Accelar-labs/sentarys-skills/main/.cursor/rules/sentarys.mdc
```

Then add the server to `~/.cursor/mcp.json`:

```json
{ "mcpServers": { "sentarys": { "url": "https://api.sentarys.com/v1/mcp", "headers": { "Authorization": "Bearer snt_live_..." } } } }
```

### Claude.ai and ChatGPT

These clients cannot send headers. Add a custom connector with your personal URL `https://api.sentarys.com/v1/mcp/k/<your key>` and treat it like a password. Step by step: [sentarys.com/docs/agents](https://sentarys.com/docs/agents).

## 3. Try it

> What is my Sentarys balance, and what would it cost to clip a 40 minute podcast?

> Clip https://www.youtube.com/watch?v=... into Shorts and export the best three in 1080p.

## Without MCP

The [`sentarys` CLI](https://github.com/Accelar-labs/sentarys-cli) wraps the REST API: `npx sentarys import <link>`, `npx sentarys clips`, `npx sentarys download`.

## Contributing

Edit `skills/sentarys/SKILL.md`, then run `node scripts/sync.mjs` to regenerate `AGENTS.md` and the Cursor rule.

MIT licensed. Questions: contact@sentarys.com.
