# Find / Test query filters

How the existing find/test query-filter AST consolidates into
Calm's Form + Flow primitives. Calm ships these as part of the
standard catalog so hosts get filter-tree authoring with the
same engine, registry, and editor as everything else.

## What the find/test filter is

A query against a list endpoint. The shape:

```typescript
type Find = {
  test: FindTest                  // the constraint tree
  sort?: FindSort[]               // ordering
  size?: number                   // page size (default 50)
  list?: number                   // page index, 0-based (default 0)
  book?: FindBook                 // optional keyword-reference table
}

type FindTest = Constraints<Constraint>

type Constraints<T extends Constraint = Constraint> = {
  form: 'any' | 'all'
  test: T[]
}

type Constraint =
  | KeywordConstraint
  | StringConstraint
  | NumberConstraint
  | IntegerConstraint
  | BooleanConstraint
  | DateConstraint
  | IndexConstraint
  | ObjectConstraint
```

A URL `?test=(language:english;text:hello*)` parses to a
`Find`; a list endpoint walks the `Find` and emits a Kysely
WHERE clause. The pattern was its own subsystem with its own
types, parser, serializer, and walker.

In calm, **the same shapes become Forms**, and the constraint
tree itself **becomes a Tree of Flow calls**.

## The Forms

Each constraint shape gets a Form. Inherits from the existing
spec verbatim; no semantic change.

```typescript
const find: Form = {
  form: 'form',
  cast: 'find',
  link: {
    test: { like: 'find_test' },
    sort: { like: 'list<find_sort>', need: false },
    size: { like: 'integer',         need: false, base: 50 },
    list: { like: 'integer',         need: false, base: 0 },
    book: { like: 'find_book',       need: false },
  },
}

const find_test: Form = {
  form: 'form',
  cast: 'find_test',
  link: {
    form: { like: 'string', take: ['any', 'all'] },
    test: { like: 'list<constraint>' },
  },
}

const find_sort: Form = {
  form: 'form',
  cast: 'find_sort',
  link: {
    name: { like: 'string' },
    flow: { like: 'string', take: ['+', '-'] },
  },
}

const constraint: Form = {
  form: 'form',
  cast: 'constraint',
  link: [
    {
      like: 'keyword',
      bind: {
        text:   { like: 'string' },
        negate: { like: 'boolean', need: false },
      },
    },
    {
      like: 'string',
      bind: {
        text:   { like: 'string' },
        part:   { like: 'string', take: ['start', 'end', 'any', 'exact'], need: false },
        fuzzy:  { like: 'boolean', need: false },
        negate: { like: 'boolean', need: false },
      },
    },
    {
      like: 'number',
      bind: {
        // either literal or range
        value:         { like: 'number',  need: false },
        min:           { like: 'number',  need: false },
        max:           { like: 'number',  need: false },
        negate:        { like: 'boolean', need: false },
        exclusive_min: { like: 'boolean', need: false },
        exclusive_max: { like: 'boolean', need: false },
      },
    },
    {
      like: 'integer',
      bind: {
        value:         { like: 'integer', need: false },
        min:           { like: 'integer', need: false },
        max:           { like: 'integer', need: false },
        negate:        { like: 'boolean', need: false },
        exclusive_min: { like: 'boolean', need: false },
        exclusive_max: { like: 'boolean', need: false },
      },
    },
    {
      like: 'boolean',
      bind: {
        value:  { like: 'boolean' },
        negate: { like: 'boolean', need: false },
      },
    },
    {
      like: 'date',
      bind: {
        value:  { like: 'date',    need: false },
        min:    { like: 'date',    need: false },
        max:    { like: 'date',    need: false },
        negate: { like: 'boolean', need: false },
      },
    },
    {
      like: 'index',
      bind: {
        value:  { like: 'integer' },
        negate: { like: 'boolean', need: false },
      },
    },
    {
      like: 'object',
      bind: {
        value: { like: 'map<find_test>' },
      },
    },
  ],
}
```

Notes:
- `constraint` is a single Form with cases `keyword`, `string`,
  `number`, `integer`, `boolean`, `date`, `index`, `object`.
  Same discriminated-union pattern as the existing
  `Constraint` type.
- `find_test.test: list<constraint>` accepts a list of
  Constraints under either `form: 'any'` or `form: 'all'`.

A filter tree authored as data is a Cast of `find`. JSON
exactly matching the shape from `query-system-spec`:

```json
{
  "test": {
    "form": "all",
    "test": [
      {
        "form": "object",
        "value": {
          "language": { "form": "all", "test": [{ "form": "keyword", "text": "english" }] },
          "text":     { "form": "all", "test": [{ "form": "string",  "text": "hello*", "part": "end" }] }
        }
      }
    ]
  },
  "sort": [{ "name": "name", "flow": "+" }],
  "size": 25,
  "list": 2
}
```

## The Flows that consume them

A few standard Flows operate on `find` Casts. They live in the
`find` verb namespace:

```typescript
const find_list: Flow = {
  name: 'find',
  base: 'list',
  like: 'list<record>',
  take: {
    resource: { like: 'string' },     // resource name (e.g., 'language_string')
    where:    { like: 'find' },       // a Cast of `find`
  },
  async: true,
}

const find_one: Flow = {
  name: 'find',
  base: 'one',
  like: 'record',
  take: {
    resource: { like: 'string' },
    where:    { like: 'find' },
  },
  async: true,
}

const find_count: Flow = {
  name: 'find',
  base: 'count',
  like: 'integer',
  take: {
    resource: { like: 'string' },
    where:    { like: 'find' },
  },
  async: true,
}
```

Used in a Tree:

```typescript
import { flow } from '@cluesurf/calm'

make.call('find', {
  base: 'list',
  resource: 'language_string',
  where: {
    test: {
      form: 'all',
      test: [
        {
          form: 'object',
          value: {
            language: { form: 'all', test: [{ form: 'keyword', text: 'english' }] },
            text:     { form: 'all', test: [{ form: 'string',  text: 'hello*', part: 'end' }] },
          },
        },
      ],
    },
    sort: [{ name: 'name', flow: '+' }],
    size: 25,
  },
})
```

The host's runtime registers `find.list` / `find.one` /
`find.count` handlers that translate the `where` Cast to a SQL
WHERE (or whatever the host's data layer uses) and return
results.

## Why filters are also expressible as Flow trees

The `find` Cast is a self-contained data object. Pure JSON.
But every constraint inside it has a corresponding **boolean
Flow** in the base catalog:

| filter constraint | boolean Flow |
|---|---|
| `{ form: 'keyword', text: 'x' }` | `is(equal: { this: <field>, that: 'x' })` |
| `{ form: 'string', text: 'x*' }` | `is(starts-with: { text: <field>, prefix: 'x' })` |
| `{ form: 'integer', min: 5, max: 10 }` | `is(between: { thing: <field>, min: 5, max: 10 })` |
| `{ form: 'boolean', value: true }` | `is(equal: { this: <field>, that: true })` |
| `{ form: 'all', test: [...] }` | `is(all: { things: [...] })` |
| `{ form: 'any', test: [...] }` | `is(any: { things: [...] })` |
| `negate: true` | wrap in `is(not: { thing: <inner> })` |

So a filter Cast can be **lowered** to a Tree of Flow calls.
This isn't always done. Most hosts run filters as SQL via
the `find.list` handler, which is faster than evaluating a
Flow tree row-by-row. But for in-memory lists, for client-side
pre-filtering, or for cases where SQL isn't available, the
Flow-tree form is the universal fallback.

The lowering is mechanical:

```typescript
// `lower` walks a `find` Cast and emits an equivalent Flow Tree
// that takes a record argument and returns boolean.
function lower(query: Cast): FlowTree { /* ... */ }
```

A host can then iterate a list and apply the lowered Flow:

```typescript
const filter_fn = calm.compile(lower(query))
const matches = records.filter(record =>
  base.cast(filter_fn, { record }).output as boolean
)
```

## Why this matters

Three benefits from consolidating find/test into calm:

1. **One AST.** Authoring a filter, validating data, rendering
   a document. All the same Tree-of-Calls shape. Editor
   primitives, runtime caches, type-system, codegen. All
   shared.
2. **One editor.** The filter-builder UI and the constraint
   editor are the same widgets at the AST level. The form
   layer renders different widgets for different field types,
   but the AST manipulation is shared.
3. **One spec.** No more parallel grammars (filter URL syntax
   vs constraint JSON vs document JSON). Three subsystems
   collapse into one.

The existing URL syntax (`?test=(language:english;text:hello*)`)
still works at the resource boundary; the URL parser produces
a `find` Cast. From the Cast onward, everything goes through
calm.

## Standard catalog entries

The Forms and Flows above ship in the base catalog. They
live in whichever logical-grouping file fits — typically
one `find/` directory grouping the find Forms and Flows
together:

```
code/base/find/
  make.ts    # exports find / find_test / find_sort + find_list / find_one / find_count Flows
  flow.ts    # handlers for find_list / find_one / find_count
```

Hosts get filtering "for free". Install the base catalog,
register a data-layer adapter, and `find_list` / `find_one`
/ `find_count` work against any registered Form.

## Editor: filter as authored Cast

The filter-builder UI authors a `find` Cast just like the
document editor authors a Tree. Same patches, same render
diffs, same validation tiers. A user dragging a "language is
english" chip into a filter row is patching the `find` Cast in
the same way they'd patch a document Tree.

The filter UI ships as a Fold variant restricting authors to
the `find` shape and the constraint verbs. Other surfaces
(sort selectors, page-size inputs) are slot widgets the Fold
publishes.

## Wire format

Filter Casts serialize to JSON for storage and to the URL
syntax for transport. Both round-trippable per the existing
spec. Within calm, they're just Casts of `find`, indistinguishable
from any other Cast.

## Related

- [`primitives.md`](./primitives.md). Form / Flow / Call
- [`structure.md`](./structure.md). Vocabulary
- [`catalog.md`](./catalog.md). The standard nine-verb
  catalog (`is.among`, `is.between`, `is.matches`, etc.,
  used in lowered filter trees)
- [`runtime.md`](./runtime.md). `base.flow` registration
  with `async: true` for `find.*`
