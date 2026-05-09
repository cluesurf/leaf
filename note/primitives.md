# Primitives: `Form` and `Flow`

The whole spec reduces to these two. Every other concept in bead is one
of them or made of them.

## Type vs instance, recap

| primitive  | type (declaration) | instance (occurrence)            |
| ---------- | ------------------ | -------------------------------- |
| data model | **`Form`**         | **Cast** (with `form: <cast>`)   |
| function   | **`Flow`**         | **`Call`** (with `form: 'call'`) |

A `Form` describes the shape of data. Its instances are records
validated against the Form.

A `Flow` describes a function. Its instances are `Call` nodes in the
AST. Concrete invocations dispatched at runtime.

Documents are trees of `Call`s operating over record data.

## `Form`. Data model schemas

A `Form` declares "this kind of thing has these fields, with these
types, with these constraints."

### Shape

```typescript
type Form = {
  form: 'form'
  cast: string                                // the resource being shaped
  like: LinkMesh                              // the field map
  head?: string[]                             // generic params
}

type LinkMesh = Record<string, Link>

type Link = {
  like?: string | string[] | LinkMesh | LinkMesh[] // type signature
  need?: boolean // required (default true)
  base?: unknown // default value
  take?: string[] // enum members
  test?: Cast // constraint sub-tree (a Flow call returning boolean)
}
```

`like` is the universal "shape" prop. On a Form, it's the
field map. On a `Link` field, it's the field's type
signature. Both layers use the same word at different
scopes.

A Link's `like` can be:

- a **string**: a primitive type name (`'string'`,
  `'integer'`, `'boolean'`) or a reference to a Form by
  name.
- a **`string[]`**: a union of named types
  (`['string', 'integer']` ≈ TypeScript `string | integer`).
- a **`LinkMesh`**: an inline nested record shape.
- a **`LinkMesh[]`**: a union of inline shapes (sum type).

Same polymorphism as a Flow's `take` / `make`. One
vocabulary covers all of them.

The field-level keys cover the common ground:

- `like`. The type. A primitive (`'string'` / `'integer'` / `'boolean'`
  / `'date'`), a Form name, a `LinkMesh` (inline nested record), or an
  array of any of those (a union).
- `need`. Required vs optional.
- `base`. Default value when missing.
- `take`. Enum-like — the allowed values for the field.
- `test`. A constraint subtree, which is itself a Flow call returning
  boolean. Field-level constraints live here.

### Worked example

```typescript
export const language_string = {
  form: 'form',
  cast: 'language_string',
  like: {
    id: { like: 'string' },
    text: { like: 'string', test: validateNonEmpty },
    language__id: { like: 'string' },
    cefr_level: {
      like: 'string',
      need: false,
      take: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
    transcriptions: { like: 'list<transcription>' },
  },
}
```

A record instance of this Form looks like:

```json
{
  "form": "language_string",
  "id": "ls_001",
  "text": "phonetic",
  "language__id": "lang_en",
  "cefr_level": "B1",
  "transcriptions": [
    /* ... */
  ]
}
```

The `form` field on the instance equals the Form's `cast` value — that's
how the runtime resolves a record to its declaring Form.

### Sum-type variants live at the Link level

Variants of a shape are expressed by a Link whose `like`
is an array. Each member uses `like` (variant tag) + `bind`
(field map):

```typescript
export const bear = {
  form: 'form',
  cast: 'bear',
  like: {
    name:      { like: 'string' },
    weight_kg: { like: 'number' },
    body: {
      like: [
        { like: 'black',   bind: { climbing_skill: { like: 'integer' } } },
        { like: 'polar',   bind: { swimming_km:    { like: 'number'  } } },
        { like: 'grizzly', bind: { aggression:     { like: 'integer' } } },
      ],
    },
  },
}
```

A record of `bear` with the `black` body variant:

```json
{
  "form": "bear",
  "name": "Yogi",
  "weight_kg": 200,
  "body": { "like": "black", "climbing_skill": 9 }
}
```

Same `like` + `bind` convention as union members on a Flow's
`take` / `make`. The Link that carries the variants is the
discriminator field.

### Other form kinds

- **`Hash`**. A record with dynamic keys, all values share a type.
- **`List`**. A homogeneous list. The `list:` field is the literal items
  (used for static enum value sets that are generated from data).
- **`Fold`**. A Form whose instances are tree-shaped. Document templates
  and authored documents.
- **`Find`**. A query / test filter shape. See [`find.md`](./find.md).

## `Flow`. Function schemas

A `Flow` declares "this verb, applied to this base, takes this input and
returns this output."

### Shape

```typescript
type Flow = {
  form: 'flow'
  name: string // the verb (e.g., 'is', 'make', 'get')
  base?: string // the resource being acted on
  case?: string // the variant
  take?: string | LinkMesh | string[] | LinkMesh[] // input
  make?: string | LinkMesh | string[] | LinkMesh[] // output
}
```

`take` and `make` are both optional. Each can be:

1. A **string**: the name of a Form to use as the input/output shape
   (reuse a published Form).
2. A **LinkMesh**: an inline shape unique to this Flow.
3. A **`string[]`**: a union of named Forms (TypeScript
   `FormA | FormB`).
4. A **`LinkMesh[]`**: a union of inline shapes.

When `take` or `make` is absent, the corresponding side is typed as
`unknown`.

See [`schema.md`](./schema.md) for the full reserved-prop spec.

### Registration triple

Every Flow is identified by `(name, base?, case?)`:

```
(name).             "is", "make", "get", ...
(name, base).       "is_string", "make_lowercase"
(name, base, case). "is_ipa_broad", "make_sum_long"
```

The triple compiles to a flat numeric id at codegen. The runtime
registry keys handlers by integer id; the string form exists only for
authoring + debug.

### Worked examples

```typescript
// Inline take + named-Form make:
export const select_language = {
  form: 'flow',
  name: 'select',
  base: 'language',
  take: { id: { like: 'string' } },
  make: 'language', // string ref to the language Form
}

// Both inline:
export const make_sum = {
  form: 'flow',
  name: 'make',
  base: 'sum',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
  make: { value: { like: 'number' } },
}

// Variant of a base:
export const is_ipa_broad = {
  form: 'flow',
  name: 'is',
  base: 'ipa',
  case: 'broad',
  take: { text: { like: 'string' } },
  make: { value: { like: 'boolean' } },
}
```

### Implementation handler

A Flow's schema describes the contract; an implementation handler runs
the actual work. Hosts register handlers via the `Base` class:

```typescript
base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
  Array.from(text).every(is_ipa_symbol),
)
```

The handler signature matches the Flow's `take` shape; TypeScript types
flow through automatically.

## Why two primitives, not one

A naive design might collapse Form and Flow into a single "schema"
primitive. That hides the asymmetry that makes bead work:

- A `Form` is **passive**. Describes data. No execution.
- A `Flow` is **active**. Describes a function. Has an implementation.
  Runs.

Documents are Flows calling Flows; the leaves bottom out at Form-shaped
data. The split mirrors the noun/verb split in language: nouns describe
things, verbs do things, sentences are verbs operating on nouns. Trees
are sentences.

## How the AST encodes this

The reserved AST keys on a Call mirror the Flow's identity:

```
{ form: 'call', name: 'is', base: 'ipa', case: 'broad', text: '...' }
  │             │           │            │             │
  │             │           │            │             └── arg matching the Flow's `take`
  │             │           │            └── the variant
  │             │           └── the resource being acted on
  │             └── the Flow's verb
  └── this AST node is a Call (instance of a Flow)
```

Reading the keys top-to-bottom is reading the type-instance chain: "this
is an instance of a Flow; its verb is `is`; its base is `ipa`; its case
is `broad`." The args fill in the Flow's `take` shape.

## Composition

Flows compose. A Flow whose `make` is `boolean` can be the arg of
another Flow whose `take` includes a boolean-typed field. The runtime
checks compatibility at compile time using the `take` and `make`
annotations.

```typescript
// is_all: takes list<boolean>, makes boolean
//   - every item in `things` must have output type boolean
// make_sum: takes list<number>, makes number
//   - every item in `numbers` must have output type number
```

The type-checker walks the Call tree comparing parent-expected arg types
to child-declared `make` types. Mismatches surface as typed validation
errors in the editor before the user runs anything.
