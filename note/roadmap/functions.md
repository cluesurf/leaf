# Functions roadmap — read-only renderer

What a Notion-class read-only renderer needs, in calm's verb-base-case
shape. Single discriminated views over duplicated ones; standard verbs
over bespoke flows.

## Conventions

- `view: <name>` Casts render to elements. Props flat, children in
  `nest`.
- View names allow `:` as a noun-modifier separator (`list:item`,
  `table:cell`, `tab:panel`, `footnote:ref`). Reads as "X of Y".
- `<verb>(<base>: <args>, case?: <case>)` flows compute values.
- Async flows declare `async: true` and are batched.
- Locale-aware flows read `locale`; time-aware flows read `now`.
- Snake_case for arg / prop names.

---

## 1. Block views

```typescript
view(paragraph:        { nest })
view(heading:          { level, anchor?, nest })            // 1..6
view(subhead:          { nest })
view(quote:            { source?, cite?, nest })
view(callout:          { variant, icon?, nest })            // 'note' | 'warn' | 'info' | 'tip' | 'danger'
view(aside:            { side?, nest })                     // 'left' | 'right' | 'inline'
view(footnote:         { id, nest })
view(footnote:ref:     { id })

view(list:             { kind?, start?, nest })             // 'bullet' | 'ordered' | 'check' | 'definition'
view(list:item:        { checked?, level?, term?, nest })

view(code:             { layout?, lang?, source?, filename?, lines?, highlight?, wrap?, theme?, run?, nest })
                                                            // layout: 'inline' (default) | 'block'
view(diff:             { lang?, source })
view(terminal:         { shell?, source })

view(equation:         { tex, inline? })                    // KaTeX / MathJax
view(diagram:          { tool, source, theme? })            // tool: 'mermaid' | 'graphviz' | 'plantuml' | 'excalidraw' | 'tikz'
```

### Media

```typescript
view(media:    { kind, src, alt?, caption?, width?, height?, ratio?, fit?, loading?, srcset?, poster?, controls?, autoplay?, loop?, muted?, captions? })
                                                            // kind: 'image' | 'video' | 'audio' | 'svg'
view(figure:   { caption, nest })
view(gallery:  { items, layout })                           // layout: 'grid' | 'carousel' | 'mosaic'
```

### Embeds

```typescript
view(embed:    { provider, src, ratio?, sandbox?, options? })
                                                            // provider: 'youtube' | 'vimeo' | 'twitter' | 'github_gist' |
                                                            //   'codepen' | 'figma' | 'pdf' | 'spotify' | 'soundcloud' | ...
view(map:      { provider, center, zoom, markers? })        // 'leaflet' | 'mapbox' | 'google'
```

### Layout

```typescript
view(divider:   { kind? })                                  // 'line' | 'dots' | 'space'
view(spacer:    { size })                                   // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
view(stack:     { direction, gap?, align?, ratios?, nest })  // direction: 'row' | 'column'
view(grid:      { columns, gap?, nest })
view(toggle:    { summary, open?, nest })
view(tab:set:   { active?, nest })                          // children are tab:panel
view(tab:panel: { id, label, nest })
view(step:set:  { active?, nest })
view(step:      { title, nest })
view(card:      { title?, subtitle?, cover?, href?, nest })
view(banner:    { variant?, dismissible?, nest })
view(hero:      { title, subtitle?, cover?, actions? })
```

### Tables

```typescript
view(table:       { columns?, rows: Row[], caption?, sticky?, striped? })
                                                            // columns optional → auto-infer from row keys
view(table:row:   { nest })
view(table:cell:  { rowspan?, colspan?, align?, nest })
```

### Page-level

```typescript
view(page:           { title, cover?, icon?, theme?, locale?, nest })
view(section:        { id?, anchor?, nest })
view(article:        { headline, dek?, byline?, published?, nest })
view(table_of_contents: { depth?, scope? })
view(breadcrumbs:    { trail })
view(pagination:     { current, total, base_path })
view(navigation:     { items, orientation? })
```

---

## 2. Inline views

```typescript
view(mark:    { kind, color?, nest })                       // kind: 'bold' | 'italic' | 'underline' | 'strike' |
                                                            //   'highlight' | 'sup' | 'sub' | 'small'
view(link:    { href, title?, target?, rel?, nest })
view(mention: { kind, target })                             // 'user' | 'page' | 'date' | 'tag'
view(anchor:  { id })

view(keys:    { keys })                                     // ['Cmd', 'K']
view(badge:   { label, color?, variant? })                  // 'solid' | 'outline' | 'soft'
view(tag:     { slug, label, color? })
view(emoji:   { code })
view(icon:    { set, name, size? })                         // 'lucide' | 'heroicons' | 'phosphor' | 'tabler'

view(time:    { datetime, format?, relative? })
view(money:   { amount, currency })
view(measure: { value, unit })
```

---

## 3. Database views

```typescript
view(collection: { layout, rows, schema, filter?, sort?, group?, ... })
                                                            // layout: 'table' | 'board' | 'gallery' | 'list' |
                                                            //   'calendar' | 'timeline'
```

Layout-specific knobs sit alongside the discriminator (e.g.
`group_by`, `cover_field`, `date_field`, `start_field` / `end_field`,
`scale`).

Column / property kinds (in `schema`):

```typescript
{ kind, slug, label, ... }
// kind: 'text' | 'number' | 'select' | 'multi_select' | 'date' |
//   'datetime' | 'duration' | 'boolean' | 'person' | 'relation' |
//   'rollup' | 'formula' | 'file' | 'url' | 'email' | 'phone' |
//   'color' | 'progress' | 'rating'
```

---

## 4. Predicate flows (`is_*`, `has_*`)

The standard catalog covers structural / textual / numeric predicates.
Renderer additions:

```typescript
is(visible:        { block, viewer?, viewer_roles? })       // permissions
is(empty_block:    { block })
is(rtl_locale:     { locale })
is(asset_available: { src })

has(child:         { block, kind? })
has(field:         { row, slug })
has(translation:   { page, locale })
```

---

## 5. Transform flows (`make_*`)

### Text

```typescript
make(slug:      { text, locale? })
make(initials:  { name, count? })
make(truncate:  { text, length, by?, ellipsis? })            // by: 'char' (default) | 'word'
make(linkify:   { text, schemes? })
make(escape:    { text, target? })                           // 'html' | 'attribute'
make(safe_html: { html, allowed? })
make(highlight: { text, query, tag? })
make(plain_from_blocks: { blocks })
make(toc:       { blocks, depth? })
make(anchor_id: { text })
```

### Numbers / dates

```typescript
make(number:    { value, format?, decimals?, locale? })       // 'integer' | 'decimal' | 'percent' | 'currency' |
                                                              //   'compact' | 'ordinal' | 'file_size' | 'duration'
make(currency:  { value, code, locale? })
make(date:      { value, format?, locale?, timezone?, relative? })
```

### Color / theme

```typescript
make(color:     { value, to? })                               // to: 'hex' | 'rgb' | 'oklch' | 'contrast'
make(palette:   { seed, count })
make(theme_vars: { theme })
```

### Media

```typescript
make(image_src: { src, width?, height?, format?, quality? })
make(srcset:    { src, widths, format? })
make(lqip:      { src })
make(dominant_color: { src })
make(blur_hash: { src })
```

---

## 6. Accessor flows (`get_*`)

```typescript
get(block_kind:        { block })
get(block_text:        { block })                            // plain text
get(block_html:        { block })                            // serialized HTML
get(block_markdown:    { block })
get(reading_time:      { blocks, wpm? })
get(heading_outline:   { blocks, depth? })
get(footnotes:         { blocks })

get(page_title:        { page })
get(page_description:  { page, max_chars? })
get(page_cover:        { page })
get(page_icon:         { page })
get(page_path:         { page })
get(page_canonical_url: { page, host })
get(page_meta:         { page, kind })                       // kind: 'opengraph' | 'json_ld' |
                                                             //   'rss_item' | 'sitemap_entry'
get(page_authors:      { page })
get(page_locale:       { page })

get(parent / ancestors / siblings / children: { block, ... })
get(field:             { row, slug })
get(aggregate:         { rows, by, kind })                   // 'count' | 'sum' | 'mean' | 'min' | 'max' | 'distinct'
get(rollup:            { row, source_field, kind })
get(formula:           { row, expression })
get(linked_rows:       { row, relation_field })
get(backlinks:         { page })

get(theme:             { case })                             // 'light' | 'dark' | 'system'
get(viewport:          { axis })                             // 'width' | 'height'
get(language_direction: { locale })
get(safe_area_insets:  {})
get(search_snippets:   { blocks, query, around? })
```

---

## 7. Async lookups (`find_*`)

```typescript
find(page:             { id })
find(page_by_slug:     { slug, locale? })
find(block:            { id })
find(user:             { id })
find(tag:              { slug })
find(collection:       { id })
find(collection_rows:  { id, filter?, sort?, group?, page?, page_size? })
find(referenced_pages: { ids })
find(backlinks:        { page_id })
find(suggestions:      { query, kinds?, limit? })
find(translation:      { page_id, locale })
find(comments:         { block_id })
find(reactions:        { block_id })
find(version_at:       { page_id, timestamp })
find(asset:            { id })                               // signed url, dimensions, mime
find(oembed:           { url })
find(opengraph:        { url })
find(font / syntax_theme / katex_macros / emoji_data: { ... })
```

---

## 8. Iteration (`walk_*`)

Same shape as the standard catalog:

```typescript
walk(map / filter / flat_map / reduce / group_by / sort_by / chunk /
     zip / distinct_by: { items, ... })
```

---

## 9. Conditionals + bindings

```typescript
if({ test, then, else? })
case({ test, when, else? })
match({ branches, fall? })
pick({ values })

bind({ names: Record<string, Cast>, then: Cast })
```

---

## 10. Display-time validation

```typescript
validate({ test, kind, message?, fallback? })                // 'permission' | 'media' | 'data'
```

Failure can skip silently, render a placeholder, or fall through to a
fallback Cast — the renderer chooses by `kind`.

---

## 11. Engine-bound host variables (read-side additions)

In addition to the standard set (`value`, `record`, `now`, `today`,
`locale`, `stage`, `viewer`, `viewer_roles`):

| name                       | type    | meaning                              |
| -------------------------- | ------- | ------------------------------------ |
| `viewer_timezone`          | string  | IANA timezone                        |
| `viewer_color_scheme`      | string  | `'light' \| 'dark'`                  |
| `viewer_reduced_motion`    | boolean | system motion-reduction preference   |
| `viewer_high_contrast`     | boolean | high-contrast mode                   |
| `viewport_width / _height` | number  | px                                   |
| `device_kind`              | string  | `'phone' \| 'tablet' \| 'desktop'`   |
| `connection`               | string  | `'4g' \| '3g' \| 'slow-2g'`          |
| `host_origin`              | string  | URL origin                           |
| `path / query / referrer`  | -       | URL pieces                           |
| `is_print / is_amp`        | boolean | render-mode flags                    |
| `feature_flags`            | map     | host gates                           |

---

## 12. Render-time hooks

Engine-injected, not Flow-defined:

- `on_mount(block)` — first render. Triggers prefetch / analytics.
- `on_visible(block, ratio)` — IntersectionObserver pipe (lazy media,
  scroll-triggered).
- `on_link_click(href, block)` — outbound-link instrumentation.
- `on_anchor(id)` — hash-anchor scroll syncs ToC active state.

---

## 13. Export targets

```typescript
make(export: { page, target, options? })                    // target: 'html' | 'markdown' | 'plain' |
                                                            //   'amp' | 'pdf' | 'epub_chapter' |
                                                            //   'print_stylesheet'
```

---

## 14. i18n

Standard catalog covers most via `format(*)`. Additions:

```typescript
make(translated: { block, locale })
make(plural:     { count, locale, options })                 // CLDR plural categories
make(gendered:   { gender, terms, locale })

is(localized:    { block, locale })
get(locale_alternates: { page })
```

---

## 15. Accessibility

```typescript
make(aria_label:     { block })
make(aria_described_by: { block })
make(skip_link:      { section })

is(landmark_block:   { block })
is(decorative:       { block })
get(heading_level:   { block })
get(focus_order:     { blocks })
```

---

## Out of scope

Mutations, editor commands, real-time presence, schema authoring,
notification delivery — those belong in their own roadmap docs.

A renderer that hydrates every Cast above can render Notion-style
pages, databases, blogs, docs sites, wikis, landing pages, and
print/export targets.
