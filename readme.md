<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<p align='center'>
  <img src='https://github.com/cluesurf/leaf/blob/make/view/leaf.svg?raw=true' height='256'/>
</p>

<h3 align='center'>@cluesurf/bead</h3>
<p align='center'>
  A Template Language ⋈
</p>

<br/>
<br/>
<br/>

## What is bead

Bead is a **JSON system for app features**. Author rich documents or
rules. Save them as JSON. The runtime renders that JSON to text or vdom.

Trees are pure data. Same JSON renders many ways. Survives editor
patches. Travels over the wire. Typechecks against your catalog.

Not a templating mini-language. Not an interpreter for a custom DSL.
Just JSON.

## Why you need this

| building                                   | bead gives you                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| Notion-class doc editor                    | one tree shape for blocks / inline / embeds / database views             |
| HTML + React + email + AMP from one source | author once. Text + element renderers share the tree                     |
| Localization                               | locale-aware `format(*)`, CLDR plurals, gender select, RTL               |
| User- or AI-supplied logic, sandboxed      | rules + formulas run against a host scope. No `eval`, no DOM, no network |
| Reusable fragments                         | `Fold` declarations registered in the Book                               |
| Wire-format-stable bytecode                | `compile(tree)` rewrites call names to integer ids                       |

## Install

```sh
pnpm add @cluesurf/bead
```

## Hello world

```ts
import { Base, make } from '@cluesurf/bead'
import beadBook, { type Code } from '@cluesurf/bead/book'

const base = new Base<Code>()
base.load(beadBook)

base.load({
  make: [
    {
      form: 'fold',
      case: 'greeting',
      tree: [make.text('Hello, ', make.read('name'), '!')],
    },
  ],
})

base.cast('greeting', { name: 'Lance' })
// → 'Hello, Lance!'
```

## End-to-end: a typed Book

```ts
// code/book/email/make.ts
import type { Flow, Fold } from '@cluesurf/bead'
import { make } from '@cluesurf/bead'

export const isEmail: Flow = {
  form: 'flow',
  call: 'is',
  case: 'email',
  take: { text: { like: 'string' } },
  make: 'boolean',
  save: 'email',
}

export const emailStatus: Fold = {
  form: 'fold',
  case: 'email:status',
  take: { input: { like: 'string' } },
  tree: [
    make.text(
      'Mail to ',
      make.read('input'),
      ' is ',
      make.fork(
        make.call('is:email', { text: make.read('input') }),
        'valid',
        'invalid',
      ),
    ),
  ],
  save: 'email',
}
```

```ts
// code/book/email/flow.ts
export const isEmail = ({ text }: { text: string }): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
```

```ts
// code/book/index.ts
import type { Book } from '@cluesurf/bead'
import * as emailFlows from './email/make'
import * as emailHooks from './email/flow'
import { CodeLink } from './code' // generated

export default {
  host: 'app',
  name: 'email',
  cast: Object.values(emailFlows),
  call: emailHooks,
  code: CodeLink,
} satisfies Book
```

```ts
// app entry
import { Base } from '@cluesurf/bead'
import emailBook, { type Code } from './book'

const base = new Base<Code>()
base.load(emailBook)

base.cast('email:status', { input: 'hi@bead.dev' })
// → 'Mail to hi@bead.dev is valid'

base.call('is:email', { text: 'hi@bead.dev' })
// → true (typed)
```

## Five top-level shapes

Every entry in `book.cast` carries a `form:` discriminant.

| `form:`  | role                                           |
| -------- | ---------------------------------------------- |
| `'form'` | data shape with fields and types               |
| `'flow'` | function with input, output, and handler       |
| `'fold'` | renderable tree (document or template)         |
| `'hash'` | record with dynamic keys, all values one shape |
| `'list'` | homogeneous list of literals (an enum source)  |

**Form** identity is `(name, flow?, case?)`. **Flow** identity is
`(call, case?)`. **Fold** identity is `(case)`. Hash and List are keyed
by `name`.

### Link modifiers

Each field in a `like:` mesh accepts these modifiers:

| modifier      | role                                                             |
| ------------- | ---------------------------------------------------------------- |
| `like`        | the type (primitive name, Form ref, inline mesh, or union array) |
| `need: false` | mark the field optional                                          |
| `list: true`  | wrap as array (`T[]`)                                            |
| `take: [...]` | enum of allowed values                                           |

```ts
{
  form: 'form', name: 'event',
  like: {
    action:   { take: ['create', 'update', 'delete'] },
    priority: { take: ['high', 'low'], need: false },
    flags:    { take: ['archived', 'pinned'], list: true },
    tags:     { like: 'string', list: true },
  },
}
```

→ TS: `action: 'create' | 'update' | 'delete'`,
`priority?: 'high' | 'low'`, `flags: ('archived' | 'pinned')[]`.

→ Zod: `action: z.enum([...])`, `priority: z.enum([...]).optional()`,
`flags: z.array(z.enum([...]))`.

## AST primitives

Inside a `Fold.tree`. Build with `make.*`:

| primitive             | builder                                                                        |
| --------------------- | ------------------------------------------------------------------------------ |
| string concat         | `make.text(...)`                                                               |
| literal list          | `make.list(...)`                                                               |
| literal record        | `make.hash(k, v, ...)`                                                         |
| join with separator   | `make.join(sep, list)`                                                         |
| read scope key        | `make.reference('name')`                                                       |
| read path             | `make.read('user', 'name')`                                                    |
| call a Flow           | `make.call('is:email', { text })`                                              |
| binary fork           | `make.fork(test, then, else)`                                                  |
| tagged dispatch       | `make.switch(value, [arms])`                                                   |
| pattern match         | `make.match(value, [arms])`                                                    |
| arm                   | `make.case(test, body)` / `make.value(literal, body)` / `make.otherwise(body)` |
| pick from list        | `make.pick(list, index)`                                                       |
| iterate               | `make.walk(list, body)`                                                        |
| resolve resource      | `make.find('page', { where, sort, limit })`                                    |
| embed registered Fold | `make.fold('greeting', { name })`                                              |
| view node             | `make.view('section', props, [children])`                                      |

Bare scalars (string, number, boolean, Date, null) sit anywhere.

## Base: the runtime

```ts
const base = new Base<Code>({ createElement?: ElementBuilder })
```

`createElement` enables vdom mode. Omit it for text mode.

| method                             | what it does                      |
| ---------------------------------- | --------------------------------- |
| `base.load(book \| cast \| array)` | register declarations. Idempotent |
| `base.toss(book \| cast \| array)` | inverse of load                   |
| `base.flow(name, ?options, hook)`  | register one handler ad-hoc       |
| `base.call('verb:case', args)`     | invoke a Flow. Sync. Typed        |
| `base.cast('case', params)`        | render a registered Fold. Sync    |

`base.cast` accepts **only a Fold's `case:`**, never an inline tree.
Production code goes through registered Folds.

## React mode

```ts
import { createElement, Fragment } from 'react'

const base = new Base<Code>({ createElement })
base.load({
  ...beadBook,
  view: { fragment: Fragment, callout: Callout },
})

base.cast('page:greeting', { user })
// → React vdom
```

`view:` carries components keyed by name. The reserved `'fragment'` key
is the fragment value the renderer uses for sibling wrapping.

## Make: the codegen

```ts
import { Make } from '@cluesurf/bead'

const make = new Make({ link: './host' }) // or wherever you want

make.load(beadBook)
make.load(myAppBook)

await make.save()
```

`link` is **whatever path you choose**. Bead doesn't impose a directory
name. pick `host/`, `generated/`, `dist/types/`, or nest it inside an
existing `code/` tree. The path is the root for all emitted files.

`save()` emits four streams keyed by each cast's `save:`:

- `<link>/code.ts` is the bundled `Code` aggregate type and `CodeLink`
  integer-id table.
- `<link>/<save>/index.ts` is TS type aliases.
- `<link>/<save>/form.ts` is the Zod parsers locked via
  `satisfies z.ZodType<TypeName>`.
- `<link>/<save>/base.ts` is the literal data exports for Hash/List with
  `load:`.

Identity-tuple uniqueness is validated across all loaded books.
Collisions abort `save()` before any file write.

Every emitted file is washed through the host's ESLint + Prettier
configs (when present). Mirrors VS Code "Save" semantics:
organize-imports, ESLint --fix, then Prettier. With no host configs, the
only pass is organize-imports. No bundled defaults.

## Compile: tree → wake

```ts
import { compile } from '@cluesurf/bead'

const wake = compile(tree, beadBook.code!)
// every named call rewritten to { form: 'call', code: <int>, bind: {...} }
```

Wire-stable across catalog renames as long as `CodeLink` is stable.

## Standard book

`@cluesurf/bead/book` ships verbs:

`is`, `make`, `get`, `has`, `format`, `fork`, `bind`, `validate`,
`walk`, `find`.

Plus AST operators (`eq`, `gt`, `plural`, `count`, `now`, `uuid`, …)
under `code/book/check/flow.ts`.

Replace any handler by loading your own Book on top:

```ts
base.load(beadBook)
base.load(myAppBook) // overrides matching keys
```

## Sandbox

Trees are JSON. `compile(tree)` produces JSON. The runtime evaluates
JSON. There is no `eval`, no `Function`, no DOM, no network access from
a tree.

Hosts gate side effects through `book.call` and `base.flow(...)`. A
handler that talks to the network is the host's choice. The tree
language can't introduce one.

## Conventions

- Discriminant property is always `form:`.
- File names are kebab-case, identifiers camelCase.
- Snake_case appears only in `form:` string values (e.g.
  `'natural_number'`).

## Reference

Full spec at [`note/spec-v2.md`](./note/spec-v2.md).
