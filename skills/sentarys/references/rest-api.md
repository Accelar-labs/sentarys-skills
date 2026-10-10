# Sentarys REST API (with an API key)

Base URL: `https://api.sentarys.com/v1`. Send `Authorization: Bearer snt_live_...` on every call. JSON in, JSON out. Limit: 60 requests per minute per key (`X-RateLimit-*` headers; `429` when over).

The MCP server covers more features and adds `nextAction` hints; use REST when an MCP client is not available. The `sentarys` CLI uses exactly these endpoints.

## Account

| Method | Path | Notes |
|---|---|---|
| GET | `/billing/status` | `plan`, `creditsLimit`, `creditsUsed` (remaining = limit minus used) |

## Projects and clips

| Method | Path | Body / notes |
|---|---|---|
| GET | `/video-projects` | All projects, newest activity first, with their clips |
| POST | `/video-projects` | Clip a link: `{"title":"Clips from YouTube","kind":"clips","youtubeReferenceUrl":"https://...","importSource":true,"templateId":"podcast"}`. Optional `startSec`, `endSec`, `locale`. Import and analysis start on their own; charged when the analysis starts |
| GET | `/video-projects/{id}` | Status (`draft`, `importing`, `uploaded`, `queued`, `analyzing`, `rendering`, `ready`, `needs_review`, `failed`), progress and clips. Poll every 20 to 30 s |
| POST | `/video-projects/{id}/analyze` | Start (or retry) the analysis of an uploaded source. Optional `{"windowStartSec":0,"windowEndSec":600}` |
| POST | `/video-projects/{id}/import-range` | `{"startSec":0,"endSec":3600}`: pick the section of a long link when the project stops at stage `import_needs_range` |
| GET | `/video-projects/{id}/transcript` | Timed transcript |
| DELETE | `/video-projects/{id}` | Deletes the project and its private media |

Each clip has `id`, `title`, `status`, `startSeconds`, `endSeconds`, `aspectRatio`, `locked`, `watermarked`, `previewUrl` and `exportUrl` (`null` until rendered).

## Upload a file (multipart)

1. `POST /video-projects` with `{"title":"Episode 12","kind":"clips"}` to get a project id.
2. `POST /video-projects/{id}/uploads` with `{"fileName":"episode-12.mp4","expectedSize":123456789}`. Answer: `id` (upload id), `partSizeBytes` (8 MB), `partCount`. Files up to 512 MB (MP4, MOV, WEBM).
3. For each part `n` (1..partCount): `POST /video-projects/{id}/uploads/{uploadId}/parts/{n}/sign` returns `uploadUrl`; `PUT` the bytes of that part (no auth header) and keep the `ETag` response header.
4. `POST /video-projects/{id}/uploads/{uploadId}/complete` with `{"parts":[{"partNumber":1,"etag":"\"...\""}]}`.
5. `POST /video-projects/{id}/analyze` to start clipping.

## Render and download

| Method | Path | Notes |
|---|---|---|
| POST | `/video-projects/{id}/clips/{clipId}/render` | `{"renderMode":"export"}` makes the 1080p file (free). `"preview"` makes a 720p check |
| GET | `/video-projects/{id}/clips/{clipId}/media?variant=export` | Redirects (302) to a signed file URL valid for 10 minutes. Do not forward the API key to the redirect target |
| GET | `/video-projects/{id}/clips/{clipId}/captions.srt` (or `.vtt`) | Subtitle file |

## Publish or schedule

| Method | Path | Body / notes |
|---|---|---|
| GET | `/social/accounts` | `providers` open for publishing and connected `accounts` (`id`, `provider`, `handle`). Accounts are connected in the app |
| POST | `/video-projects/{id}/clips/{clipId}/social-posts` | `{"targets":[{"connectionId":"<account id>","options":{"privacy":"SELF_ONLY"}}],"caption":"...","hashtags":["podcast"],"scheduledAt":"2026-11-01T15:00:00Z","requestId":"<8 to 64 chars>"}`. `requestId` is required: the same id on a retry returns the same posts. Needs the final export |
| GET | `/social/posts/{postId}` | `status` (`scheduled`, `queued`, `publishing`, `processing`, `published`, `failed`, `canceled`, `unconfirmed`) and `permalink` |
| DELETE | `/social/posts/{postId}` | Cancels a scheduled post that has not started |

TikTok `options.privacy` must be chosen by the user (`PUBLIC_TO_EVERYONE`, `MUTUAL_FOLLOW_FRIENDS`, `FOLLOWER_OF_CREATOR`, `SELF_ONLY`). YouTube takes `options.youtubePrivacy` (`public`, `unlisted`, `private`) and the top-level `title`.

## Errors

Standard HTTP codes with a JSON `message`: `400` invalid field, `401` missing or revoked key, `402` not enough credits (nothing charged), `404` not in this account, `409` busy, `429` rate or daily limit.
