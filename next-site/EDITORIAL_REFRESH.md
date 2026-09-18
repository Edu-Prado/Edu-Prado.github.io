# Editorial refresh

## Scope

Personal editorial home with the existing author portrait, recent stories, curated reading list, corporate formats, and the existing newsletter form. Shared navigation and footer, redesigned blog cards and filters, accessible field labels, visible keyboard focus, reduced motion, and responsive layouts.

Legacy categories are mapped for display only. Article records are not modified. Markdown tables now render as semantic tables, and a repeated leading article title is removed from the body.

## Advertising

Advertising is paused by default in this revision to prevent overlays from covering content. Existing slots and publisher ID are retained. Re-enabling requires `NEXT_PUBLIC_ADSENSE_ENABLED=true` at build time, after anchor/vignette/automatic insertions are configured in the AdSense account. This change can affect ad revenue when published.

## Content outage and preview

On 2026-09-15 the article source returned HTTP 521. Production builds now stop on a failed or empty article fetch instead of publishing an empty archive. On 2026-09-18 the source returned HTTP 200 and a production build with live data completed successfully, exporting all 24 articles.

For an explicitly offline preview, set `EDUPRADO_PREVIEW_POSTS_FILE` to an absolute path containing the public post array. The reviewed snapshot contains 24 articles extracted from the already published blog on 2026-09-15. This snapshot is local and is not committed or used automatically in production.

## Validation

- `node scripts/check-editorial.mjs [optional-snapshot-path]` checks legacy categories, accent-insensitive search, tables, and repeated title handling.
- Production build verified on 2026-09-18 with live article data, without the preview snapshot override: 37 generated pages including all 24 article routes.
- Export checks verified article routes, internal links, one H1 per article, the repaired table, advertising pause, and lightweight listing summaries.
- Form submissions and newsletter delivery must be verified separately; no test messages were sent.
- Existing dependency versions and hosting architecture are retained. The dependency audit reports existing vulnerabilities that need a separate upgrade review.
