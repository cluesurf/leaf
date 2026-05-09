# `Book`. The published bundle type

A `Book` is a **type**, not a class. It's the shape of a published
bundle of schemas and data — Forms, Flows, Folds, Hashes, Lists — with
optional `host` + `name` metadata.

## The type

```typescript
type Book = {
  host?: string // optional informational label
  name?: string // optional informational label
  base?: (Form | Flow | Fold | Hash | List)[]
}
```

`base` is a single mixed array containing every declaration the Book
ships — Forms, Flows, Folds, Hashes, Lists in any order. Codegen
dispatches each entry by its `form:` discriminant (`'form'` / `'flow'` /
`'fold'` / `'hash'` / `'list'`), so order doesn't matter and authors
don't have to predict which bucket a declaration belongs in.

`host` + `name` are informational only. They do **not** participate in
colon-key generation — bead assumes globally unique entry names across
all registered Books, with codegen-time duplicate detection if two Books
contribute colliding entries (see [`codegen.md`](./codegen.md)). The
labels are used in error messages to identify which Book a colliding
entry came from.

```typescript
const cluesurfBase: Book = {
  host: 'cluesurf',
  name: 'base',
  base: [
    /* every Form / Flow / Fold / Hash / List, in any order */
  ],
}
```

## Books are plain data

A Book is just a TypeScript object. Anything you can do with plain
object data, you can do with a Book:

```typescript
// Compose two Books:
const merged: Book = {
  host: 'my-org',
  name: 'merged',
  base: [...(a.base ?? []), ...(b.base ?? [])],
}

// Filter entries:
const safe: Book = {
  ...risky,
  base: risky.base!.filter(
    e => !(e.form === 'flow' && e.name === 'experimental_classify'),
  ),
}

// Patch one entry:
const renamed: Book = {
  ...source,
  base: source.base!.map(e =>
    e.form === 'flow' && e.name === 'is_ipa'
      ? { ...e, name: 'check_if_ipa' }
      : e,
  ),
}
```

There is no special "Book builder" or "Book DSL." The type itself is the
API. Customizing a Book before passing it to `Make` uses the same
vocabulary as authoring one.

## Where Books come from

Three common sources:

1. **Published packages.** A library author writes their schemas, runs
   their own codegen, and ships an `index.ts` that default-exports a
   `Book`. Consumers `import standard from '@cluesurf/bead'` and pass it
   to `make.load(...)`.
2. **In-tree authoring.** A host application authors Forms and Flows in
   its own source tree, collects them into a Book, registers it with
   `Make` like any external Book.
3. **Composition.** A host wraps another Book (filter, patch, merge)
   before registering. The result is still a Book; no further ceremony.

All three paths produce the same type, registered the same way.

## Relationship to other pieces

| piece  | shape | relationship to Book                                                            |
| ------ | ----- | ------------------------------------------------------------------------------- |
| `Book` | type  | THIS DOC. The bundle.                                                           |
| `Code` | type  | Generated. Aggregates every registered Book's entries into one type.            |
| `Base` | class | Runtime. Hosts attach handlers to its registered flows and dispatch calls.      |
| `Make` | class | Build-time. `make.load(book)` registers a Book; `make.save()` emits the bundle. |

See [`architecture.md`](./architecture.md) for the end-to-end flow and
[`schema.md`](./schema.md) for the shape of `Form`, `Flow`, etc.

## What about `Find`?

`Find` declarations go in the unified `base` array alongside Forms,
Flows, Folds, Hashes, and Lists. Codegen recognizes them by their
`form: 'find'` discriminant. (Conceptually a Find is a kind of Fold — a
query tree is a tree of Calls — so a Book that doesn't formally
distinguish Find from Fold can park its query trees as Folds without
losing information.)

## Worked example

A small Book that ships one bare Form and one Flow:

```typescript
import type { Book, Form, Flow } from '@cluesurf/bead'

const language: Form = {
  form: 'form',
  cast: 'language',
  like: {
    id: { like: 'string' },
    iso_639_3: { like: 'string' },
  },
}

const select_language: Flow = {
  form: 'flow',
  name: 'select',
  base: 'language',
  take: { id: { like: 'string' } },
  make: 'language', // string ref to the Form above
}

export const myBook: Book = {
  host: 'cluesurf',
  name: 'languages',
  base: [language, select_language],
}
```

Consumers register this with:

```typescript
import { Make } from '@cluesurf/bead/make'
import { myBook } from '@cluesurf/bead-languages'

const make = new Make({ link: './libs' })

make.load(myBook)
await make.save()
```

The generated `Code` will include `form:language` and
`flow:select:language` keys (no host/name prefix).
