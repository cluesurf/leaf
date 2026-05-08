<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<h3 align='center'>@cluesurf/calm</h3>
<p align='center'>
  A JSON-structured template language
</p>

<br/>
<br/>
<br/>

## Introduction

Calm is a sandboxed mini-language and runtime where untrusted
users author rich, executable documents. And the only things
they can do are call functions the host explicitly registered.

Think Handlebars / Mustache / EJS, but the template **is** the
AST. No parser, no escape problems, no embedded code strings.
You define the AST; the runtime walks it through a typed
function catalog the host owns.

Use it for templating, DOM rendering, constraint defining,
HTTP request making, query filters, document authoring. Any
place an app needs to give end-users authoring power without
giving them a JavaScript runtime.

## Installation

```bash
pnpm add @cluesurf/calm
```

## At a glance

Two type primitives describe everything:

| primitive | declares | instance |
|---|---|---|
| `Form` | a data shape | `Cast` |
| `Flow` | a function | `Call` |

Plus a small set of utility shapes. `Hash`, `List`, `Fold` (a
tree-shaped Form for documents), `Find` (a query filter).

Authors write declarations as plain TypeScript constants:

```ts
import type { Form, Flow } from '@cluesurf/calm'

export const ipa_form: Form = {
  form: 'form',
  link: { text: { like: 'string' } },
}

export const is_ipa: Flow = {
  name: 'is',
  base: 'ipa',
  like: 'boolean',
  take: { text: { like: 'string' } },
}
```

A codegen pass produces TypeScript types and Zod parsers from
each declaration, plus a single bundled `Base` type that
aggregates everything (kysely-style).

## Codegen

```ts
import Make from '@cluesurf/calm/make'

import * as ipa from './code/base/is/ipa/make'
// import every authored make.ts module

const make = new Make()

make.link('./code/base/is/ipa', ipa)
// ... many more

await make.save()
```

Each `make.link(path, source)` registers a source module at an
output path. `make.save()` walks them all and emits, alongside
each `make.ts`:

- `index.ts`. TypeScript types
- `form.ts`. Zod parsers, `satisfies z.ZodType<T>` from
  `./index`
- `base.ts`. Leaf catalog re-exports

## Runtime

```ts
import { Book } from '@cluesurf/calm'
import type Base from './code/base/base'

import * as is_ipa from './code/base/is/ipa/base'
// ... import every generated leaf catalog

const book = new Book<Base>()

book.deck({ ...is_ipa /* ... */ })

book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
  Array.from(text).every(is_ipa_symbol),
)

const result = book.bind(treeFromUser, { stage: 'draft' })
```

`Book` is generic over `Base`. The bundled type aggregating
every authored constant. Every `book.flow(...)` /
`book.form(...)` / `book.bind(...)` call typechecks against
it. Names, bases, cases, arg shapes, and return types resolve
through the generated `Base`.

## Project structure

```
calm/code/
  form/                      # the schema DSL
  fold/                      # the AST builder DSL (`flow.*`)
  make/                      # the codegen entry (`Make` class)
  base/                      # registered Flows + handlers
    is/
      ipa/
        broad/
          make.ts            # hand: declaration
          flow.ts            # hand: handler
          index.ts           # gen:  TS types
          form.ts            # gen:  Zod parsers
          base.ts            # gen:  leaf catalog
```

`code/base/<verb>/<base>/<case>/` is the canonical layout for
the catalog. Each leaf has at most two hand-written files
(`make.ts`, `flow.ts`) plus three generated ones (`index.ts`,
`form.ts`, `base.ts`).

## Spec

Full design notes live in [`./note/`](./note/):

- [`goals.md`](./note/goals.md). The why
- [`structure.md`](./note/structure.md). Vocabulary spine
- [`primitives.md`](./note/primitives.md). Form and Flow in depth
- [`ast.md`](./note/ast.md). Every node form
- [`calm.md`](./note/calm.md). The `Book` class
- [`runtime.md`](./note/runtime.md). Engine pipeline
- [`types.md`](./note/types.md). TypeScript surface
- [`codegen.md`](./note/codegen.md). The `Make` class + outputs
- [`catalog.md`](./note/catalog.md). Standard nine-verb seed catalog
- [`find.md`](./note/find.md). Query filters
- [`editor.md`](./note/editor.md). Editor protocol

## Status

Pre-release. The spec is converging; the runtime is in
migration from `@cluesurf/form`.
