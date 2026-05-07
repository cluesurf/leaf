# Primitives: `Form` and `Flow`

The whole spec reduces to these two. Every other concept in
book is one of them or made of them.

## Type vs instance, recap

| primitive | type (declaration) | instance (occurrence) |
|---|---|---|
| data model | **`Form`** | **`Cast`** |
| function | **`Flow`** | **`Call`** |

A `Form` describes the shape of data. Its instances are
`Cast` objects — actual records validated against the form.

A `Flow` describes a function. Its instances are `Call` nodes
in the AST — concrete invocations dispatched at runtime.

Documents are trees of `Call`s operating over `Cast` data.

## `Form` — data model schemas

A `Form` declares "this kind of thing has these fields, with
these types, with these constraints." Inherited from the
form-DSL package (eventually copied into book), with the
familiar `Form` / `Hash` / `List` / `Mesh` builders.

### Shape

```typescript
type Form = {
  form: 'form'
  save: string                  // module / save path
  link: FormLinkMesh            // field map
}

type FormLinkMesh = Record<string, FormLink>

type FormLink = {
  like: string                  // type signature ('string', 'list<X>', 'A | B')
  need?: boolean                // required (default true)
  fall?: unknown                // default value
  case?: string[]               // enum members
  link?: FormLinkMesh           // nested record
  test?: Node                   // constraint sub-tree (a Flow call returning boolean)
}
```

The four field-level keys cover the common ground:

- `like` — the type. A primitive (`'string'` / `'integer'` /
  `'boolean'` / `'date'`), a collection (`'list<X>'` /
  `'map<X>'`), a reference to another Form by name, or a union
  (`'A | B'`).
- `need` — required vs optional.
- `fall` — fallback / default.
- `case` — enum-like, the allowed members for a `string`-typed
  field.
- `link` — a nested record (a sub-Form inline).
- `test` — a constraint subtree, which is itself a Flow call
  returning boolean. Field-level constraints live here.

### Worked example

```typescript
const language_string: Form = {
  form: 'form',
  save: '@/code/form/language',
  link: {
    id: { like: 'string' },
    text: { like: 'string', test: validateNonEmpty },
    language__id: { like: 'string' },
    cefr_level: {
      like: 'string',
      need: false,
      case: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    transcriptions: { like: 'list<transcription>' },
  },
}
```

A `Cast` instance of this form looks like:

```json
{
  "id": "ls_001",
  "text": "phonetic",
  "language__id": "lang_en",
  "cefr_level": "B1",
  "transcriptions": [/* ... */]
}
```

### Form variants — `case`

A Form can declare variants (sum types / discriminated unions)
using `case`. Each case is a sub-shape with its own `link`
fields, layered on top of the parent's shared fields:

```typescript
const bear: Form = {
  form: 'form',
  save: '@/code/form/bear',
  link: {
    name:      { like: 'string' },        // shared by every case
    weight_kg: { like: 'number' },
  },
  case: {
    black: {
      link: { climbing_skill: { like: 'integer' } },
    },
    polar: {
      link: { swimming_km: { like: 'number' } },
    },
    grizzly: {
      link: { aggression: { like: 'integer' } },
    },
  },
}
```

A Cast of `bear` with case `black` looks like:

```json
{
  "form": "bear",
  "case": "black",
  "id": "01h…",
  "name": "Yogi",
  "weight_kg": 200,
  "climbing_skill": 9
}
```

Same reserved keys (`form`, `case`, `id`) as Calls — Forms and
Flows share the namespace tree:

| layer | type-name | sub-variant |
|---|---|---|
| Flow → Call | `name` (verb) | `case` |
| Form → Cast | `form` (form-name) | `case` |

Picking a Form-instance is "form + case" exactly the way
picking a Flow-instance is "name + case." The pattern is
parallel.

### Dotted cases (sub-sub-variants)

Cases nest via dots in the case name, same as Flow cases:

```typescript
const error: Form = {
  form: 'form',
  save: '@/code/form/error',
  link: {
    note: { like: 'string' },
  },
  case: {
    'syntax':              { link: { /* ... */ } },
    'syntax.unterminated': { link: { /* ... */ } },
    'syntax.misnested':    { link: { /* ... */ } },
    'runtime':             { link: { /* ... */ } },
    'runtime.timeout':     { link: { /* ... */ } },
    'runtime.cancelled':   { link: { /* ... */ } },
  },
}
```

The case value `'syntax.unterminated'` is a sub-case of
`'syntax'`. The file layout mirrors:

```
code/form/error/
  schema.ts                # the bare error Form
  syntax/
    schema.ts              # error.syntax
    unterminated/schema.ts # error.syntax.unterminated
    misnested/schema.ts    # error.syntax.misnested
  runtime/
    schema.ts
    timeout/schema.ts
    cancelled/schema.ts
```

### Cast AST shape

A Cast is a JSON object with the same reserved keys as a Call:

```typescript
type Cast = {
  form: string                     // the Form's name (e.g., 'bear', 'error')
  case?: string                    // the variant (e.g., 'black', 'syntax.unterminated')
  mark?: string                      // stable per-record uuid
  [field: string]: unknown         // the Form's link fields
}
```

When the runtime sees `{ form: 'bear', case: 'black', ... }`,
it dispatches to the `bear` Form's `black` case schema for
validation. The same dispatch machinery used for Calls
(`name + case` → Flow handler) handles Casts (`form + case`
→ Form schema).

### Form-name reservation

Because the AST's `form` key is also used by built-in node
forms (`'call'`, `'read'`, `'view'`, `'fork'`, `'walk'`,
`'loop'`, `'attempt'`, plus literals like `'text'`,
`'integer'`, `'list'`), Form names cannot collide with those.
The runtime rejects a Form registration whose name is a
reserved built-in.

User Forms get the rest of the namespace. There's plenty of
room.

### Other form kinds

Inherited from form-DSL:

- **`Hash`** — a record with dynamic keys, all values share a
  type (`bond: { like: '...' }`).
- **`List`** — a homogeneous list. The `list:` field is the
  literal items (used for static enum value sets that are
  generated from data).
- **`Mesh`** — a graph / tree-shaped form. Used for nested
  structures the schema language can introspect.

These are the existing form-DSL kinds. Book inherits them as-is
and may add new kinds over time.

## `Flow` — function schemas

A `Flow` declares "this verb, applied to this case, takes
these args and returns this type."

### Shape

```typescript
type Flow = {
  name: string         // the verb (e.g., 'is', 'make', 'get')
  case?: string        // the case (e.g., 'ipa', 'ipa.broad', 'lowercase', 'equal')
  like?: string        // return-type signature
  take?: FormLink      // input args schema, in form-DSL
}

type FormLinkMesh = Record<string, FormLink>
```

`like` allows complex return-type signatures using
TypeScript-style notation: `'string'`, `'boolean'`,
`'integer'`, `'list<record>'`, `'string | null'`,
`'record<image>'`. The runtime parses these to enforce arg-type
compatibility when one Flow call is the arg of another.

`take` is the input shape, in the same form-DSL used to
describe data Forms. Codegen produces TypeScript types and
runtime parsers from it.

### Registration pair

Every Flow is identified by `(name, case)`:

```
(name)            — "is", "make", "get", ...
(name, case)      — "is.ipa", "make.lowercase", "get.length"
                  — "is.ipa.broad", "make.cased.lower"  (dotted case for sub-variants)
```

The pair compiles to a flat `code` id like `is.ipa.broad`. The
registry maps codes to handlers. Sub-variants live in the case
namespace via dots (`ipa.broad`, `ipa.narrow`); the file layout
mirrors with nested folders.

### Worked example

```typescript
const is_ipa_broad: Flow = {
  name: 'is',
  case: 'ipa.broad',
  like: 'boolean',
  take: {
    text: { like: 'string' },
  },
}

const make_sum: Flow = {
  name: 'make',
  case: 'sum',
  like: 'number',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
}

const get_count: Flow = {
  name: 'get',
  case: 'count',
  like: 'integer',
  take: {
    items: { like: 'list' },
  },
}
```

### Implementation handler

A Flow's schema describes the contract; an implementation
handler runs the actual work. Hosts register handlers via the
`Book` class:

```typescript
book.flow('is', { case: 'ipa.broad' }, ({ text }) =>
  Array.from(text).every(is_ipa_symbol),
)
```

The handler signature matches the `take` schema's shape;
TypeScript types flow through automatically.

## Why two primitives, not one

A naive design might collapse Form and Flow into a single
"schema" primitive. That hides the asymmetry that makes book
work:

- A `Form` is **passive** — describes data. No execution.
- A `Flow` is **active** — describes a function. Has an
  implementation. Runs.

Seeds in book are Flows calling Flows; the leaves bottom out
at Form-shaped data. The split mirrors the noun/verb split in
language: nouns describe things, verbs do things, sentences are
verbs operating on nouns. Book trees are sentences.

## How the AST encodes this

The reserved AST keys (`form`, `name`, `case`, `id`) encode
the type-instance lookup chain:

```
{ form: 'call', name: 'is', case: 'ipa.broad', id: '01h…', text: '...' }
  │            │            │                  │           │
  │            │            │                  │           └── arg matching the Flow's `take` schema
  │            │            │                  └── stable per-node identity
  │            │            └── the Cast / variant being operated on
  │            └── the Flow's verb name
  └── this node is a Call (instance of a Flow)
```

Reading the keys top-to-bottom is reading the type-instance
chain: "this is an instance of a Flow; its verb is `is`; its
case is the `ipa.broad` variant of the IPA Form." The args
are then the Form fields filled in.

## Where they live

```
deck/book/code/
  form/                      # the schema DSL (absorbed from form-DSL)
    type.ts
    build.ts
    parse.ts
    ...
  flow/                      # registered Flows + handlers
    is/
      ipa/
        broad/
          schema.ts          # the Flow definition
          handler.ts         # the implementation
        narrow/
          schema.ts
          handler.ts
        schema.ts            # bare `is(ipa)` (no sub-case)
        handler.ts
      equal/
        schema.ts
        handler.ts
      ...
    make/
      ...
    ...
```

Forms live in `code/form/`. Flows live in `code/flow/<verb>/<case>/`.
Each leaf has a `schema.ts` (the declaration) and a
`handler.ts` (the implementation, when in-process).

## Composition

Flows compose. A Flow whose `like` is `boolean` can be the
arg of another Flow whose `take` includes a boolean-typed
field. The runtime checks compatibility at compile time using
the `like` annotations — no implicit coercions, no runtime
type errors that should have been caught earlier.

```typescript
// is(equal: { this: <A>, that: <B> })
//   - this.like must match that.like
// is(all: { things: list<boolean> })
//   - every item in things must have like: 'boolean'
// make(sum: { numbers: list<number> })
//   - every item in numbers must have like: 'number'
```

The type-checker walks the call tree comparing parent-expected
arg types to child-declared `like` types. Mismatches surface as
typed validation errors in the editor before the user runs
anything.
