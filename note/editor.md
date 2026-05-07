# Editor protocol

The contract between a `Base` runtime and a document editor
(typically browser-based). Patches go in, render diffs come
out, validation errors flow throughout. Designed so the editor
stays at 60fps on documents with thousands of nodes.

## What the editor's responsibility is

- Render the current tree visually. Chip rows, input widgets
  per `(verb, base, case)`, nested children.
- Translate user gestures (typing, drags, drops, deletes) into
  `TreePatch` objects.
- Send patches to the runtime via `calm.bindPatch(...)`.
- Apply the runtime's render diff: re-render only the subtrees
  whose output changed.
- Surface validation errors inline (squiggles, gutter icons,
  sidebar) and authorization denials with a different visual.

## What the runtime's responsibility is

- Accept patches.
- Re-compile / re-validate / re-evaluate the dirty path.
- Emit the new `BindResult` with errors, warnings, and a render
  diff.
- Cache aggressively so unchanged subtrees don't redo work.

## Patches

The editor sends one patch per user gesture:

```typescript
type TreePatch =
  | { form: 'set';     node_mark: string; arg: string; value: unknown }
  | { form: 'replace'; node_mark: string; new_node: MakeNode }
  | { form: 'insert';  parent_mark: string; arg: string; index: number; new_node: MakeNode }
  | { form: 'remove';  node_mark: string }
  | { form: 'move';    node_mark: string; new_parent_id: string; new_index: number }
```

### `set`. Change one arg of one node

User typed in a text field, picked a value from a dropdown,
toggled a switch:

```json
{ "form": "set", "node_mark": "01h…", "arg": "text", "value": "fəˈnɛtɪk" }
```

The runtime invalidates the node's compile/validate/evaluate
caches and walks upward marking ancestors dirty.

### `replace`. Swap a whole subtree

User picked a different flow in the verb-base picker:

```json
{
  "form": "replace",
  "node_mark": "01h…",
  "new_node": { "form": "call", "name": "is", "base": "uuid", "id": "01h…", "text": "..." }
}
```

The replacement keeps the same `id` so memoization keys
correlate where possible.

### `insert`. Add a child

User dragged a new flow into a slot:

```json
{
  "form": "insert",
  "parent_mark": "01h…",
  "arg": "things",
  "index": 2,
  "new_node": { "form": "call", "name": "is", "base": "string", "id": "01h…", "thing": ... }
}
```

Used for list-shaped args (`things`, `items`, `numbers`,
`children`) and `nest` arrays on view nodes.

### `remove`. Delete a node

User hit delete on a chip or row:

```json
{ "form": "remove", "node_mark": "01h…" }
```

If the parent's slot becomes empty and the slot is required,
the node enters a "missing" validation state. The runtime
flags it but doesn't refuse.

### `move`. Relocate within / across parents

User dragged a chip to reorder or moved a row to a new section:

```json
{
  "form": "move",
  "node_mark": "01h…",
  "new_parent_id": "01h…",
  "new_index": 0
}
```

The node's `id` is preserved; memoization survives. Type-check
runs against the new parent's expected slot type.

## What the runtime returns

Every `bindPatch` (and the cold `bind`) returns:

```typescript
type BindResult = {
  ok: boolean
  output?: unknown
  errors: BindError[]
  warnings: BindError[]
  diff?: RenderDiff
  trace?: ExecutionTrace
}

type RenderDiff = {
  changed: string[]               // node ids whose output changed
  unchanged: string[]              // node ids whose output is reused
}

type BindError = {
  stage: 'compile' | 'validate' | 'execute'
  node_mark: string
  slug?: string
  message?: string
  text__id?: string                // i18n key
  text_link?: Record<string, unknown>  // i18n params
  call?: string
  args?: Record<string, unknown>
  path: (string | number)[]
  severity: 'error' | 'warning' | 'info' | 'hint'
}
```

The editor consumes:

- `output` for the rendered preview.
- `diff.changed` to know which DOM mounts to refresh.
- `errors` and `warnings` for inline annotations.

## Validation tiers

The runtime supports tiered validation (see goals.md). The
editor picks a cadence per tier:

| tier | cost | when to run | what it catches |
|---|---|---|---|
| 1 | very cheap | per keystroke | args shape against `take` |
| 2 | cheap | on edit pause (~100ms) | subtree types via `like` |
| 3 | cheap | on edit pause | compile resolution (unknown flow) |
| 4 | medium | on idle (~1s) | constraint evaluation |
| 5 | expensive | on save / explicit | async checks, DB roundtrips |

`calm.bindPatch` runs tiers 1. 3 by default and skips tiers 4. 5
unless the editor opts in via:

```typescript
calm.bindPatch(prev, patch, { tiers: ['args', 'types', 'resolve', 'constraints'] })
```

The editor can also call `calm.runConstraints(prev)` /
`calm.runAsync(prev)` standalone to fire the deeper tiers when
appropriate.

## Authorship widgets

Each `(verb, base, case)` triple in the base catalog has a
canonical widget:

| triple shape | widget |
|---|---|
| `is(string \| integer \| boolean \| ...)` (type predicate) | type label, no input |
| `is(equal \| above \| below \| min \| max)` | "this" + "that" inputs side-by-side |
| `is(among: { thing, choices })` | thing input + chip-group for choices |
| `is(slug \| uuid \| email \| url \| iso \| ipa)` | text input with format hint + (where applicable) `case` chip group |
| `is(cased: { text, case })` | text input + case picker dropdown |
| `is(ipa: { text, case? })` | IPA palette + broad/narrow toggle |
| `is(every \| some)` | list-shaped slot + iterator name + nested test rows |
| `is(all \| any \| one)` | repeatable boolean rows |
| `make(<transform>)` | input field(s) + read-only output preview |
| `get(<accessor>)` | input field + read-only output |
| `find(record \| enum-members)` | resource picker + async preview |
| `if({ test, then, else? })` | three-row layout |
| `bind({ names, then })` | named-binding rows + body |
| `walk(<iter>)` | list slot + iterator config + body |
| `validate({ test, ... })` | wrap any test row, expose error config |

The widget is derived from the schema, not hand-coded per
flow. New flows added to the catalog get a sensible default
widget automatically. Hosts can override widgets at the
`(verb, base, case)` granularity if they want a richer UI for
specific flows.

## Inline errors

Each `BindError` carries a `node_mark`. The editor:

- Looks up the DOM mount for that `id`.
- Renders a squiggle / gutter icon at that location.
- Surfaces the `message` (or resolves `text__id` + `text_link`
  via i18n) on hover.
- Groups errors of the same `slug` into one sidebar entry with
  a count.

`severity: 'hint'` errors render subtly (small icon, no
underline). For "did you mean…" suggestions and stylistic
nudges. `'warning'` and `'error'` are visually distinct.

`kind: 'authorization'` errors render with a lock icon, not a
red squiggle. Authorization is enforcement, not authoring
guidance.

## Suggestions

When a `validate` call has a `suggest` subtree, the runtime
evaluates it on failure and attaches the result:

```typescript
{ ..., suggestion: 'my-cool-slug' }
```

The editor renders an inline "Apply suggestion" button. On
click, the editor sends a `set` patch replacing the failing
arg with the suggested value.

## Bulk patches

Some user actions (paste, undo, batch delete) produce multiple
patches at once. The editor sends them as a list:

```typescript
calm.bindPatch(prev, [patch1, patch2, patch3])
```

The runtime applies them sequentially, then runs one
re-evaluation pass over the union of dirty paths. Cheaper than
binding three times.

## Undo / redo

The editor maintains its own undo stack of `TreePatch`es. To
undo:

- Compute the inverse patch (the editor knows the old value).
- Send the inverse via `bindPatch`.

Redo is the same. Re-send the original patch.

The runtime doesn't manage undo state; that's the editor's job.

## Cold start

When the editor first loads a document:

```typescript
const prev = calm.bind(initialTree, host)
```

This is the cold path. Slow once (~milliseconds for a typical
document, up to ~200ms for a 10,000-node document). Every
subsequent edit is `bindPatch`, which is fast.

## Save / publish

When the user saves, the editor calls:

```typescript
const final = calm.bindPatch(prev, [], { tiers: ['args', 'types', 'resolve', 'constraints', 'async'] })
```

This forces every validation tier to run, including async
checks against live data. If `final.ok` is true, save the
editable tree to storage. If not, surface the errors and
block the save.

The stored format is the **editable tree** (with `id`s), not
the compiled tree. Compilation re-runs whenever a runtime
loads the document.

## Multi-user / collaborative editing

Out of host for the core spec. Calm deals with one editor
at a time. Hosts wanting collaborative editing layer
operational-transform or CRDT logic between the editor and
`bindPatch`. The patch protocol is OT-friendly: every patch is
addressable by `node_mark`, so concurrent patches that touch
different nodes commute trivially.

Patches that touch the same node are conflict-prone and need
host-level resolution. The runtime processes whichever arrives
first.

## Editor state vs runtime state

| editor owns | runtime owns |
|---|---|
| selection, cursor, drag state | compiled tree cache |
| undo / redo stack | evaluation cache |
| widget configuration | flow registry |
| viewport / layout | host bindings |
| keyboard shortcuts | async result cache |
| theme / brand | render diff |

The runtime never knows where the user is looking; the editor
never knows what's in the cache. Each side stays focused on
its own concern, communicating only via patches in and
results out.

## Performance targets

Same as the runtime targets, restated from the editor's view:

- **Cold load** of a 10,000-node document: feels instant.
- **Single keystroke**: under 16ms total round-trip
  (editor → runtime → editor → DOM).
- **Drag-and-drop reorder**: under 50ms.
- **Paste of 100 nodes**: under 100ms.

Beyond that, the user experience starts to feel laggy. The
runtime's caching strategy and the editor's mount discipline
both have to land for the targets to hold.
