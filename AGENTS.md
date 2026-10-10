<!-- Generated from skills/sentarys/SKILL.md by scripts/sync.mjs. Edit that file instead. -->

# Sentarys

Sentarys is an AI video editor. It clips long videos into vertical Shorts with hooks and word-level captions, edits long videos from raw footage, makes narrated faceless videos, captions and translates whole videos, dubs clips into other languages and posts to connected social accounts. Every action runs on the user's own Sentarys account and credits.

There are three ways in. Prefer the MCP server when it is connected; it has 100+ tools and returns a `nextAction` with every answer.

| Surface | Endpoint | Auth |
|---|---|---|
| MCP server (Streamable HTTP) | `https://api.sentarys.com/v1/mcp` | `Authorization: Bearer snt_live_...` (or `X-Api-Key`) |
| Connector URL (clients without headers: Claude.ai, ChatGPT) | `https://api.sentarys.com/v1/mcp/k/<key>` | the key is in the URL; treat it like a password |
| CLI | `npx sentarys` | `sentarys login` stores the key in `~/.config/sentarys/config.json` |
| REST API | `https://api.sentarys.com/v1/...` | `Authorization: Bearer snt_live_...` |

## 1. Get a key and connect

1. The user creates an API key at https://sentarys.com/settings/api (Settings, API and MCP). The key starts with `snt_live_` and is shown once. A free account comes with trial credits.
2. Connect it to the agent:
   - Claude Code: `claude mcp add --transport http sentarys https://api.sentarys.com/v1/mcp --header "Authorization: Bearer $SENTARYS_API_KEY"`
   - Claude.ai or Claude Desktop: Settings, Connectors, Add custom connector, URL `https://api.sentarys.com/v1/mcp/k/<key>`.
   - Cursor (`~/.cursor/mcp.json`): `{"mcpServers":{"sentarys":{"url":"https://api.sentarys.com/v1/mcp","headers":{"Authorization":"Bearer snt_live_..."}}}}`
   - Codex (`~/.codex/config.toml`): `[mcp_servers.sentarys]` with `url = "https://api.sentarys.com/v1/mcp"` and `[mcp_servers.sentarys.http_headers]` `Authorization = "Bearer snt_live_..."`.
   - ChatGPT: Settings, Apps and connectors, Advanced, Developer mode, Create; paste the connector URL, choose No authentication.
3. Check the connection with the free tool `get_account` (balance, plan and the price of every action).

Never print, log or commit the key. Read it from `SENTARYS_API_KEY` or the CLI config. If a key leaks, the user revokes it in Settings and it stops working on the next call.

## 2. How every job works

- Long jobs return right away with ids. Poll the status tool (`get_project`, `get_clip`, `get_job`, `get_social_post`...) every 20 to 60 seconds, using `pollAfterSeconds` when the answer has it. Never call the paid tool again to "check" a job.
- Follow `nextAction` in each answer; it names the next tool.
- Check `get_account` before a long or expensive job and tell the user the cost first. Example: clipping a 40 minute podcast costs 40 x 200 = 8,000 credits.
- `previewUrl` (720p) and `exportUrl` (1080p) open without credentials for 10 minutes. Fetch a fresh one with `get_clip` when it expires. `api*` links need the key. `appUrl` opens the project in the app.
- Paid answers report `creditsCharged`. Failed jobs refund their credits automatically.

## 3. Common flows

### Podcast, interview or stream link to clips

1. `create_clips_project(url, templateId?, startSec?, endSec?)` with a YouTube, TikTok or Instagram link. Import and analysis start on their own. Templates: `list_templates` (podcast, viral, tiktok, reels, gameplay, webinar, highlights, memes, motivation and more).
2. Optional: `get_first_ready_clip(projectId)` every 30 s returns the first rendered clip while the rest is still analysed.
3. Poll `get_project(projectId)` until `status` is `ready`. About 5 to 15 minutes for a one hour video. Each clip has `clipId`, title, hook, duration, scores and links.
4. Optional edit: `get_clip` (caption lines with times) then one `edit_clip` call with every change: `trimStartSec`, `trimEndSec`, `removeRanges`, `captionStyle` (pop, karaoke, boxed, minimal, neon, subtitle, cinema, documentary), `captionPosition`, `hookText`, `accent`, `look`, `zoomAt`, `addEmoji`, `addWords`, `shakeAt`, `shotFraming`. Manual edits are free.
5. `download_clip(projectId, clipId)` (or `render_clip mode=export`) then poll `get_clip` until `exportUrl` is set. Exports are free.

If `get_project` returns `stage=import_needs_range` the link is longer than the import limit: call `select_import_range(projectId, startSec, endSec)` within `importMaxDurationSeconds`.

### Local file to clips

1. `start_upload(fileName, sizeBytes)` (MP4, MOV, WEBM; up to 512 MB) returns `projectId`, `uploadId`, `partSizeBytes` and signed part URLs.
2. Split the file into `partSizeBytes` chunks and `PUT` each to its `uploadUrl`; keep the `ETag` header of each response. Get more URLs with `sign_upload_parts` (URLs last 10 minutes).
3. `complete_upload(projectId, uploadId, parts=[{partNumber, etag}])` starts the analysis (`startProcessing=true` by default). Then poll `get_project` as above.

The CLI does all of this in one command: `npx sentarys upload ./episode.mp4`.

### Raw footage to a vlog or long video

1. `create_long_edit(brief, links?, kind=long_edit|recap, style=vlog|travel|documentary|recap|interview, targetSeconds=60..3600, editLevel=minimal|balanced|intense, look=natural|nordic|warm|film)`. Add files with `add_project_files(links)` or `start_upload(projectId=...)`.
2. Poll `list_project_files` until every file is ready, then `start_processing(projectId)`.
3. Poll `get_project`. `get_long_edit_metrics(clipId)` reads pacing and continuity. `create_publish_kit` makes thumbnails, SEO titles, a description with chapters and tags. `create_shorts` cuts 3 to 5 Shorts from the finished video.
4. To edit like a video the user likes: `read_style_reference(url)` until ready, then `create_long_edit(styleReferenceId=...)`.

Trial accounts get one free chapter (up to 4 hours of footage). After the user subscribes to Pro, `unlock_long_edit(projectId)` renders the saved full plan and charges once.

### Faceless video

1. `create_faceless_video(topic, style=dark|history|curiosities|reddit|doodle|gameplay|cartoon|anime, aspect=9:16|16:9, targetSeconds=20..3600, contentLanguage?, useLibrary?)` researches, writes, narrates and picks scenes. It is charged when it starts.
2. Poll `get_project`, then `render_clip mode=export` and `create_publish_kit` if needed.
3. Script first: `write_video_script(source=topic|idea|url, format=faceless, targetSeconds)` then `get_video_script`, `edit_video_script` (free) and `create_faceless_from_script` to narrate it word for word.

### Caption or translate a whole video

- `add_captions_to_video(url, captionStyle?, contentLanguage?)` keeps the original frame and burns in captions. Poll `get_project`; `get_captions_file(projectId, clipId, format=srt|vtt)` returns the subtitle file.
- Translate: after the preview is ready, `dub_clip(projectId, clipId, languages=[...])`.
- Audio to audiogram: `start_upload(kind=full_video, fileName=episode.mp3)`, upload, `complete_upload(startProcessing=false)`, optional cover image upload, then `add_captions_to_video(projectId, uploadId, aspect?)`.

### Dub a clip

`dub_clip(projectId, clipId, languages, captions?, voiceMatch?, review?, glossary?)` makes one new clip per language (en, pt-BR, es, fr, de, it, nl, pl, tr, id, ru, hi). `voiceMatch=true` makes the voices sound like the original speakers. With `review=true` read and fix the translation with `get_dub_draft`, `update_dub_draft`, `approve_dub`. Keep brand terms with `add_dub_glossary_term`.

### Publish or schedule

1. `list_social_accounts` lists connected TikTok, YouTube, Instagram, X and LinkedIn accounts. The user connects accounts in the app (Settings, Social accounts); an agent cannot connect them.
2. The clip needs its final export (`download_clip` first).
3. `publish_clip_to_social(projectId, clipId, accountIds, caption, title?, hashtags?, scheduledAt?, tiktokPrivacy?, youtubePrivacy?, requestId?)`. `scheduledAt` is an ISO time up to 60 days ahead. For TikTok, ask the user for `tiktokPrivacy`; never pick it for them.
4. Poll `get_social_post(postId)` until `published` (with `permalink`), `failed` or `unconfirmed`. `unconfirmed` means the network got the video but did not answer: ask the user to check the profile and never post again blindly. `cancel_social_post` cancels a scheduled post.

### More

Variations of a clip (`create_variations`), carousels (`create_carousel`), episode kits with show notes (`create_episode_kit`), trending references (`search_trends`, `get_trending_videos`, `create_project_from_trend`), the user's video library (`get_library`, `search_library`), brand kit (`get_brand_kit`, `update_brand_kit`), automatic clips from a YouTube channel (`connect_youtube_channel`), Twitch live clips (`connect_live_channel`), recurring faceless series (`create_video_series`), product photo kits (`create_product_kit`) and client review links (`create_client_review`). The full list is in [references/tools.md](skills/sentarys/references/tools.md).

## 4. Credits

Prices come from the Sentarys code and match `get_account`. Plans: Pro is US$10 per month with 30,000 credits; a new account gets 6,000 trial credits once. Trial clips carry a watermark; Pro exports do not.

| Action | Credits |
|---|---|
| Clips from a video | 200 per source minute, minimum 1,000, charged when the analysis starts |
| Caption a whole video or audiogram | 50 per source minute, minimum 200 |
| Long edit or recap | 80 per footage minute, minimum 2,000 |
| Faceless video | 2,500 per finished minute, minimum 1,000 |
| Dubbing | 300 per clip minute per language, minimum 300; `voiceMatch` adds 150 per minute (minimum 100) |
| Shorts from a long video | 200 per minute of the long video, minimum 1,000 |
| Variations | 60 each |
| Publish kit or episode kit | 1,800 |
| Edits, previews, 1080p exports, downloads, posting, status checks | free |

More prices (scripts, music, carousels, series, product kits) are in [references/pricing.md](skills/sentarys/references/pricing.md). When the balance is short a tool answers `INSUFFICIENT_CREDITS` with a billing link and nothing is charged. A link project with a short balance clips the part the balance covers, from 0:00.

## 5. Limits and good practice

- MCP: 120 requests per minute per key and 240 per account. REST with a key: 60 requests per minute. On `RATE_LIMITED`, wait `retryAfterSeconds`.
- Uploads: up to 512 MB per file, 8 MB parts, signed part URLs last 10 minutes.
- Poll, do not repeat: paid tools are not idempotent unless they say so. If a create call timed out, call `list_projects` and look for the project before creating another one.
- Idempotency keys: `publish_clip_to_social` takes `requestId` (8 to 64 letters, digits, `_` or `-`); a retry with the same `requestId` returns the same posts. `remix_video` requires `requestKey` (a UUID); reuse it on retries. Generate the id once per user request and keep it.
- `publish_clip_to_social` never posts the same clip twice on one account unless `allowRepeat=true`.
- Ask before destructive or account-wide actions: disconnecting channels, deleting scripts, posting publicly, starting a series.
- Errors: `INSUFFICIENT_CREDITS`, `INVALID_ARGUMENT` (the detail names the field), `RESOURCE_NOT_FOUND`, `CONFLICT` (busy; read the state first), `DAILY_LIMIT`, `RATE_LIMITED`.
- The user must hold the rights to footage they add to the library (`add_library_links` and library uploads ask for `acceptRights` the first time; pass it only after the user confirms).

## 6. Without MCP

Use the CLI (`npx sentarys --help`) or the REST endpoints in [references/rest-api.md](skills/sentarys/references/rest-api.md).

Docs: https://sentarys.com/docs/agents and https://sentarys.com/docs/mcp
