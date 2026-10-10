# Directory listing copy

Shared copy for MCP directories and connector stores. Keep it in sync with https://sentarys.com/docs/mcp.

**Name:** Sentarys

**Short description (under 100 characters):** AI video editing for agents: clip podcasts into Shorts, edit, dub, faceless videos, long edits.

**Long description:**

Sentarys is an MCP server for short-form and long-form video. Agents in Claude Code, Claude, ChatGPT, Cursor, VS Code, Windsurf, Codex and Gemini CLI can turn a podcast, interview or stream (YouTube, TikTok or Instagram link, or a local file) into vertical Shorts with hooks and word-level captions; edit a clip by its spoken words (trims, cuts, caption style, hook, colour look, zooms, emoji); export in 1080p; caption or translate a whole video; dub clips into 12 languages with voices like the original speakers; edit vlogs, travel videos and recaps from raw footage; create narrated faceless videos; and publish or schedule clips to TikTok, YouTube, Instagram, X and LinkedIn. Long jobs return an id and a status tool to poll. Every action uses the account's credits, with the same prices as the app.

**Endpoint:** `https://api.sentarys.com/v1/mcp` (Streamable HTTP, JSON responses, stateless)

**Auth:** `Authorization: Bearer snt_live_...` or `X-Api-Key: snt_live_...`, key from https://sentarys.com/settings/api. Clients without custom headers: `https://api.sentarys.com/v1/mcp/k/<key>`.

**Docs:** https://sentarys.com/docs/mcp and https://sentarys.com/docs/agents

**Skills and CLI:** https://github.com/Accelar-labs/sentarys-skills and https://github.com/Accelar-labs/sentarys-cli

**Categories:** Video, Media, Content creation, Social media, Marketing

**Tags:** video, shorts, clips, podcast, captions, subtitles, dubbing, translation, faceless, youtube, tiktok, reels

**Logo:** `assets/logo-400.png` (400 x 400) and `assets/logo-512.png`

**Support:** contact@sentarys.com

**Privacy policy:** https://sentarys.com/privacy

**Terms:** https://sentarys.com/terms

**Example prompts:**

- What is my Sentarys credit balance and what would 5 clips of a 40 minute podcast cost?
- Clip https://www.youtube.com/watch?v=... into Shorts with the podcast template and give me the 3 best.
- Make the hook of clip 2 shorter, use karaoke captions and export it in 1080p.
- Dub that clip into Spanish and Brazilian Portuguese with voices like the original speakers.
- Make a 60 second faceless video about the history of the espresso machine.
- Schedule clip 1 on my TikTok and YouTube tomorrow at 9am with a caption and three hashtags.

**awesome-mcp-servers line:**

`- [Sentarys](https://sentarys.com/docs/mcp) ☁️ - Clip podcasts into Shorts, edit clips by their words, export 1080p, caption and dub videos, faceless videos, long edits and social publishing.`

**Cursor deeplink:** `cursor://anysphere.cursor-deeplink/mcp/install?name=sentarys&config=eyJ1cmwiOiJodHRwczovL2FwaS5zZW50YXJ5cy5jb20vdjEvbWNwIiwiaGVhZGVycyI6eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyIHNudF9saXZlX1lPVVJfS0VZIn19`
