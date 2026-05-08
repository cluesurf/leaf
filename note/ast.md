# AST

The JSON tree shape that calm authors, stores, compiles, and evaluates.

## Reserved keys

Every Cast uses at most these reserved keys:

| key    | role                                                         |
| ------ | ------------------------------------------------------------ |
| `form` | discriminant. What kind of Cast this is                      |
| `name` | identifier for `call` (verb) or `view` (component)           |
| `base` | which Cast instance / variant being operated on              |
| `case` | the case (variant) being operated on                         |
| `mark` | stable per-Cast UUID, used for editor identity + memoization |
| `code` | (compiled) flattened registry id                             |
| `bind` | (compiled) args object ready to dispatch                     |

Everything else is **snake_case user data**. Flow args, component props,
list items, path segments. Reserved keys cannot collide with user data
because they are reserved.

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

What the runtime evaluates. Resolved triples, args grouped under `bind`.

```json
{
  "form": "call",
  "code": 3,
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

`mark` survives both flavors so editor memoization keys are stable
across compile.

## Cast forms

Each `form:` value picks a different Cast shape.

### `call`. Flow instance

```typescript
type CallMake<T> = {
  form: 'call'
  name: string // verb
  base?: string // Form-instance variant
  case?: string // the case (variant)
  mark?: string // semver. The schema version this call was authored against
} & T

type CallWake<T> = {
  form: 'call'
  code: number // resolved registry id (integer)
  mark?: string // version
  bind: T // args, validated against the Flow's `take`
}

type Call<T> = CallMake<T> | CallWake<T>
```

`CallMake` is the **make form**. What authors write and what the editor
manipulates. Args sit flat at the top level via the `& T` intersection.

`CallWake` is the **wake form**. What the runtime evaluates. Args sit
under `bind`, and `code` is the integer index into the runtime's
compiled handler array.

`Call<T>` is the union. A Cast may be in either form depending on
lifecycle stage.

`mark` is the schema-version stamp (semver). The compile step checks
that a Call authored against an older `mark` still typechecks against
the current Flow registration.

The whole point of calm. Calls compose by referencing other calls (or
paths or literals) as arg values.

### `read`. Read from host

```typescript
type Read = {
  form: 'read'
  link: ReadLink[]
  mark?: string
}

type ReadLink = VariableSeg | FieldSeg | IndexSeg | SliceSeg

type VariableSeg = { form: 'variable'; name: string; safe?: boolean }
type FieldSeg = { form: 'field'; name: string; safe?: boolean }
type IndexSeg = { form: 'index'; value: number | Cast; safe?: boolean }
type SliceSeg = {
  form: 'slice'
  rise?: number | Cast | null
  fall?: number | Cast | null
  safe?: boolean
}
```

The first segment is a `variable` (the host binding to start from).
Subsequent segments walk into structure. Index segments take Casts (so
indices can be computed). Wrap literal indices as Read-with-one-segment,
or as integer literals.

`safe: true` on a segment makes it null-tolerant. The expression
short-circuits to null instead of failing if the parent value is
missing.

### `view`. Component element

```typescript
type View = {
  form: 'view'
  name: string // component slug
  base?: string // optional variant
  case?: string // the case (variant)
  mark?: string
  nest?: Cast[] // child Casts
  [prop: string]: unknown // typed props
}
```

The rendering side of the AST. A `view` produces a renderable element (a
React Cast, a string, an HTML fragment. Whichever the runtime is
configured for).

### `fork`. Conditional

```typescript
type Fork = {
  form: 'fork'
  test: Cast
  then: Cast
  fall?: Cast
  mark?: string
}
```

Evaluate `test`, run `then` if truthy, `fall` otherwise.

### `walk`. Iteration

One Cast form, four variants distinguished by `case`. Modeled after
Seed-language's iterator design (see Seed's `book/code/iterators.md`).

```typescript
type Walk =
  | WalkTest // condition-based (while loop)
  | WalkList // for-each over a collection
  | WalkSize // numeric range (counted loop)
  | WalkForm // iterator-protocol object

type WalkTest = {
  form: 'walk'
  case: 'test'
  test: Call // boolean condition
  hook: Call // body, evaluated each iteration while test is true
  mark?: string
}

type WalkList = {
  form: 'walk'
  case: 'list'
  bind: Cast // the list being iterated
  take?: {
    head?: Link // iterator binding name (default: 'head')
    slot?: Link // optional index binding
  }
  hook: Cast // body, evaluated per item with the bound names
  mark?: string
}

type WalkSize = {
  form: 'walk'
  case: 'size'
  base: Cast // start value (inclusive)
  head: Cast // end value (exclusive)
  step?: Cast // increment (default 1)
  item?: string // counter binding (default: 'i')
  index?: string
  hook: Cast // body, evaluated per step
  mark?: string
}

type WalkForm = {
  form: 'walk'
  case: 'form'
  source: Cast // an iterator-protocol object
  item?: string // iterator binding name
  hook: Cast // body
  mark?: string
}
```

| variant      | traditional analogue | use                  |
| ------------ | -------------------- | -------------------- |
| `walk(test)` | `while (cond)`       | condition-based loop |
| `walk(list)` | `for x in list`      | collection iteration |
| `walk(size)` | `for i in 0..n`      | counted loop         |
| `walk(form)` | `for x in iter`      | iterator protocol    |

The `walk` family covers every iteration shape calm needs. There is no
separate `loop` Cast form; numeric ranges are `walk` with
`case: 'size'`.

### Literals

Primitive value Casts. All prefixed `Base` so they group as the base /
primitive type-set, and to avoid collision with TypeScript's built-in
`Number`, `Boolean`, `Date`:

```typescript
type BaseString = { form: 'string'; text: string }
type BaseInteger = { form: 'integer'; value: number }
type BaseNaturalNumber = { form: 'natural_number'; value: number }
type BaseNumber = { form: 'number'; value: number }
type BaseBoolean = { form: 'boolean'; value: boolean }
type BaseDate = { form: 'date'; value: string } // ISO string
type BaseList = { form: 'list'; list: Cast[] }
type BaseWeave = { form: 'weave'; list: Cast[] } // string concatenation
```

`weave` is a string-concatenation Cast. The renderer joins its
children's rendered output.

Note: the `Base` prefix on these literal types is a naming convention
for the AST primitives. It is **not** the same as the `Code` interface
that bundles every authored constant (see [`types.md`](./types.md)).
They occupy different namespaces. Primitive-AST-type names start with
`Base` followed by the primitive name; the bundled aggregate is `Base`
alone.

## Auto-promotion

When the Base builder DSL encounters a primitive where a Cast is
expected, it wraps the primitive in the matching literal Cast
automatically:

| input                  | becomes                                   |
| ---------------------- | ----------------------------------------- |
| `'hello'`              | `{ form: 'text', text: 'hello' }`         |
| `0`                    | `{ form: 'natural_number', value: 0 }`    |
| `-3`                   | `{ form: 'integer', value: -3 }`          |
| `1.5`                  | `{ form: 'number', value: 1.5 }`          |
| `true`                 | `{ form: 'boolean', value: true }`        |
| `Date`                 | `{ form: 'date', value: <iso> }`          |
| `[a, b, c]`            | `{ form: 'list', list: [<promoted>...] }` |
| object with `form` key | passed through unchanged                  |

Promotion keeps authoring concise. The wire format is always the
canonical Cast shape.

## Reading host

Every Cast evaluates against a **host**. A chain of name → value
bindings. Built-in host variables (engine-provided):

| name           | meaning                                      |
| -------------- | -------------------------------------------- | -------- | --------- |
| `value`        | the current cell value (per-cell validation) |
| `record`       | the current record (record-level validation) |
| `now`          | ISO 8601 UTC timestamp at evaluation start   |
| `today`        | YYYY-MM-DD UTC date at evaluation start      |
| `locale`       | BCP 47 locale string                         |
| `stage`        | `'draft'                                     | 'commit' | 'export'` |
| `viewer`       | viewer's record id (optional)                |
| `viewer_roles` | viewer's roles list (optional)               |

User-bound variables come from `walk` iterators (any of the four cases.
`test` / `list` / `size` / `form`) and from explicit `bind`
(let-binding) calls in the standard catalog.

## Identity (`mark`)

Every editable Cast carries an optional `mark` (UUID v7 recommended).
It's how:

- The editor tracks a Cast across edits.
- The compiler caches its compiled form.
- The runtime memoizes its evaluated result.
- The renderer correlates DOM mounts.

When an editor creates a new Cast, it assigns a fresh `mark`. When it
edits an existing Cast, the `mark` stays. Patches always target by
`mark`.

`mark` survives compile. Both editable and compiled forms have the same
`mark` for the same logical Cast.

## Round-trip guarantee

The editable form serializes deterministically to JSON. The compile step
is mechanical. Decompiling (compiled → editable) is also mechanical.
Authors should never see the compiled form unless they're debugging.

## Reserved-key mistakes to catch

If a user-data key collides with a reserved key, that's a schema bug.
Flag it at flow-registration time, not at runtime. The runtime then
trusts that no Flow accepts an arg called `form` / `name` / `case` /
`mark` / `code` / `bind`, because the validator already rejected such a
Flow at registration.

This means **flow args are guaranteed not to shadow reserved keys**,
simplifying the dispatch code.
