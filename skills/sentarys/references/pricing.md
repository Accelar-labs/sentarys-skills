# Sentarys credits

The live prices are returned by the MCP tool `get_account` (and the REST endpoint `GET /v1/billing/status` for the balance). This table mirrors the Sentarys pricing code.

## Plans

| Plan | Price | Credits |
|---|---|---|
| Trial | free | 6,000 once; trial clips carry a watermark |
| Pro | US$10 per month | 30,000 per month; clean exports |
| Credit packs (Pro, when the balance runs low) | US$5 / US$13 / US$39 | 10,000 / 30,000 / 100,000 |

## Video

| Action | Credits | When |
|---|---|---|
| Clips from a link, upload or library video | 200 per source minute, minimum 1,000 | when the analysis starts |
| Caption a whole video, or an audiogram | 50 per source minute, minimum 200 (rounded up to 10) | when processing starts |
| Long edit or recap | 80 per footage minute, minimum 2,000 | when processing starts |
| Faceless video, launch video, meme video, narrated slides, documentary | 2,500 per finished minute, minimum 1,000 (some settle from measured use within the quote) | when it starts |
| Shorts from a long edit or faceless video | 200 per minute of the long video, minimum 1,000 | when requested |
| Dubbing | 300 per clip minute per language, minimum 300 | when requested |
| Voices like the original speakers (`voiceMatch`) | plus 150 per minute, minimum 100 | with the dub |
| Variations of a clip | 60 each | per variation |
| Live clips (Twitch) | 1,200 per moment (6 minute window); cap per live 1,000 to 100,000 | per moment |
| Changing the template of an analysed project | free (reuses the cached analysis) | |

## Writing and packaging

| Action | Credits |
|---|---|
| Video script | 50 plus 15 per spoken minute; plus 50 for a page reference or 300 for a YouTube reference |
| Rewrite part of a script | 20 |
| Teleprompter script | 10 per target minute, minimum 5 |
| Publish kit (thumbnails, titles, description with chapters, tags) | 1,800 |
| Episode kit (show notes, chapters, quotes, posts, thumbnails) | 1,800 |
| Voice note to a week of posts | 600 |
| Carousel | up to 200, unused credits returned |
| Original music track | 400 up to 30 seconds, 800 longer |
| Product photo kit | reserves up to 5,700, settles from measured cost (minimum 300) |
| Series Lock bible | 6,000 |
| Series Lock episode | 800 per generated second |
| Ask Sentarys chat reply | 20 |

## Free

Manual edits (`edit_clip`), previews, 1080p exports, downloads, variation exports, posting and scheduling, status checks, script edits, carousel slide edits, music library picks and client review links.

## Refunds

Credits of a job that fails are returned automatically. A tool that needs more credits than the balance answers `INSUFFICIENT_CREDITS` and charges nothing.
