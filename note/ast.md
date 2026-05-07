# AST

The JSON tree shape that book authors, stores, compiles, and
evaluates.

## Reserved keys

Every node uses at most these reserved keys:

| key | role |
|---|---|
| `form` | discriminant — what kind of node this is |
| `name` | identifier for `call` (verb) or `view` (component) |
| `base` | which Cast instance / variant being operated on |
| `case` | sub-variant of the base |
| `mark` | stable per-node UUID, used for editor identity + memoization |
| `code` | (compiled) flattened registry id |
| `bind` | (compiled) args object ready to dispatch |

Everything else is **snake_case user data** — flow args,
component props, list items, path segments. Reserved keys
cannot collide with user data because they are reserved.

## Two flavors

Same shape, two stages of life.

### Editable

What users author and what's stored at rest. Human-readable,
diff-friendly.

```json
{
  "form": "call",
  "name": "is",
  "base": "ipa",
  "case": "broad",
  "mark": "01h…",
  "text": "fəˈnɛtɪk"
}
```

### Compiled

What the runtime evaluates. Resolved triples, args grouped
under `bind`.

```json
{
  "form": "call",
  "code": "is.ipa.broad",
  "mark": "01h…",
  "bind": {
    "text": "fəˈnɛtɪk"
  }
}
```

The compile step:
- Resolves `(name, base?, case?)` → `code`.
- Moves user-data keys into `bind`.
- Validates args against the Flow's `take` schema.
- Returns a typed error tree if anything fails.

`mark` survives both flavors so editor memoization keys are
stable across compile.

## Node forms

Each `form:` value picks a different node shape.

### `call` — Flow instance

```typescript
type CallEditable = {
  form: 'call'
  name: string                  // verb
  base?: string                 // Form-instance variant
  case?: string                 // sub-variant
  mark?: string
  [arg: string]: unknown        // flow args, snake_case keys
}

type CallCompiled = {
  form: 'call'
  code: string                  // resolved registry id
  mark?: string
  bind: Record<string, unknown> // args, validated
}
```

The whole point of book. Calls compose by referencing other
calls (or paths or literals) as arg values.

### `path` — read from host

```typescript
type Path = {
  form: 'read'
  path: ReadSeg[]
  mark?: string
}

type ReadSeg = VariableSeg | FieldSeg | IndexSeg | SliceSeg

type VariableSeg = { form: 'variable'; name: string; safe?: boolean }
type FieldSeg    = { form: 'field';    name: string; safe?: boolean }
type IndexSeg    = { form: 'index';    value: number | Node; safe?: boolean }
type SliceSeg    = { form: 'slice';    rise?: number | Node | null; fall?: number | Node | null; safe?: boolean }
```

The first segment is a `variable` (the host binding to start
from). Subsequent segments walk into structure. Index segments
take Nodes (so indices can be computed) — wrap literal indices
as Path-with-one-segment, or as integer literals.

`safe: true` on a segment makes it null-tolerant — the
expression short-circuits to null instead of failing if the
parent value is missing.

### `view` — component element

```typescript
type View = {
  form: 'view'
  name: string                  // component slug
  base?: string                 // optional variant
  case?: string                 // sub-variant
  mark?: string
  nest?: Node[]                 // child nodes
  [prop: string]: unknown       // typed props
}
```

The rendering side of the AST. A `view` produces a renderable
element (a React node, a string, an HTML fragment — whichever
the runtime is configured for).

### `fork` — conditional

```typescript
type Fork = {
  form: 'fork'
  test: Node
  then: Node
  fall?: Node
  mark?: string
}
```

Evaluate `test`, run `then` if truthy, `fall` otherwise.

### `walk` — iteration over a list

```typescript
type Walk = {
  form: 'walk'
  list: Node
  item?: string                 // iterator binding name
  index?: string                // optional index binding
  hook: Node                    // body, evaluated per item with `item`/`index` bound
  mark?: string
}
```

### `loop` — numeric range

```typescript
type Loop = {
  form: 'loop'
  start: Node
  end: Node
  step?: Node
  item?: string                 // counter binding
  index?: string
  hook: Node
  mark?: string
}
```

### `attempt` — error catching

```typescript
type Attempt = {
  form: 'attempt'
  flow: Node                    // body
  catch?: Node                  // run if flow throws
  mark?: string
}
```

### Literals

Primitive value nodes:

```typescript
type Text    = { form: 'text';           text: string }
type Integer = { form: 'integer';        value: number }
type Natural = { form: 'natural_number'; value: number }
type Number_ = { form: 'number';         value: number }
type Boolean_= { form: 'boolean';        value: boolean }
type Date_   = { form: 'date';           value: string }      // ISO string
type List_   = { form: 'list';           list: Node[] }
type Weave   = { form: 'weave';          flow: Node[] }       // string concatenation
```

`weave` is a string-concatenation node — the renderer joins its
children's rendered output.

## Auto-promotion

When the Book builder DSL encounters a primitive where a Node
is expected, it wraps the primitive in the matching literal
node automatically:

| input | becomes |
|---|---|
| `'hello'` | `{ form: 'text', text: 'hello' }` |
| `0` | `{ form: 'natural_number', value: 0 }` |
| `-3` | `{ form: 'integer', value: -3 }` |
| `1.5` | `{ form: 'number', value: 1.5 }` |
| `true` | `{ form: 'boolean', value: true }` |
| `Date` | `{ form: 'date', value: <iso> }` |
| `[a, b, c]` | `{ form: 'list', list: [<promoted>...] }` |
| object with `form` key | passed through unchanged |

Promotion keeps authoring concise. The wire format is always
the canonical node shape.

## Reading host

Every node evaluates against a **host** — a chain of name →
value bindings. Built-in host variables (engine-provided):

| name | meaning |
|---|---|
| `value` | the current cell value (per-cell validation) |
| `record` | the current record (record-level validation) |
| `now` | ISO 8601 UTC timestamp at evaluation start |
| `today` | YYYY-MM-DD UTC date at evaluation start |
| `locale` | BCP 47 locale string |
| `stage` | `'draft' | 'commit' | 'export'` |
| `viewer` | viewer's record id (optional) |
| `viewer_roles` | viewer's roles list (optional) |

User-bound variables come from `walk` / `loop` iterators and
from explicit `bind` (let-binding) calls in the standard
catalog.

## Identity (`mark`)

Every editable node carries an optional `mark` (UUID v7
recommended). It's how:

- The editor tracks a node across edits.
- The compiler caches its compiled form.
- The runtime memoizes its evaluated result.
- The renderer correlates DOM mounts.

When an editor creates a new node, it assigns a fresh `mark`.
When it edits an existing node, the `mark` stays. Patches always
target by `mark`.

`mark` survives compile — both editable and compiled forms have
the same `mark` for the same logical node.

## Round-trip guarantee

The editable form serializes deterministically to JSON. The
compile step is mechanical. Decompiling (compiled → editable)
is also mechanical. Authors should never see the compiled
form unless they're debugging.

## Reserved-key mistakes to catch

If a user-data key collides with a reserved key, that's a
schema bug — flag it at flow-registration time, not at runtime.
The runtime then trusts that no Flow accepts an arg called
`form` / `name` / `case` / `mark` / `code` / `bind`,
because the validator already rejected such a Flow at
registration.

This means **flow args are guaranteed not to shadow reserved
keys**, simplifying the dispatch code.
