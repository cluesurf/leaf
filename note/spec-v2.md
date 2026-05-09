# Bead Spec v2

The complete, current reference. Replaces every other doc in `note/`.

## What

Bead is a **JSON system for app features** where users author rich
documents or rules and you store their work as JSON. The runtime renders
that JSON to text or vdom, with strongly-typed dispatch through
generated code and a sandbox so user-supplied logic can't reach the
host.

Trees are pure data. Same JSON renders many ways. Survives editor
patches. Travels over the wire. Typechecks against your catalog.

## When to reach for it

| building                                            | bead gives you                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| Notion-class doc editor                             | one tree shape for blocks / inline / embeds / database views             |
| Multi-target rendering (HTML + React + email + AMP) | author once. Text and element renderers share the tree                   |
| Localization                                        | locale-aware `format(*)`, CLDR plurals, gender select, RTL               |
| User- or AI-supplied logic, sandboxed               | rules + formulas run against a host scope. No `eval`, no DOM, no network |
| Reusable fragments (snippets, partials)             | `Fold` declarations registered in the Book                               |
| Wire-format-stable bytecode                         | `compile(tree, codeTable)` rewrites call names to integer ids            |

## Four pieces

| name   | shape | role                                                             |
| ------ | ----- | ---------------------------------------------------------------- |
| `Book` | type  | published bundle: `{ host?, name?, cast?, call?, code?, view? }` |
| `Code` | type  | generated registry. Every entry's colon-key maps to its TS type  |
| `Base` | class | runtime. Loads books, dispatches calls, casts named Folds        |
| `Make` | class | codegen. Reads books, emits TS / Zod / data files                |

## Cast: the JSON tree

`Cast` is the umbrella for every node Bead processes.

**Top-level declarations** (live in `book.cast`):

| `form:`  | role                                           |
| -------- | ---------------------------------------------- |
| `'form'` | data shape. fields and their types             |
| `'flow'` | function. input shape + output shape + handler |
| `'fold'` | renderable tree (document or template)         |
| `'hash'` | record with dynamic keys, all values one shape |
| `'list'` | homogeneous list of literals (an enum source)  |

**AST primitives** (live inside Fold trees):

| `form:`       | role                                             |
| ------------- | ------------------------------------------------ |
| `'text'`      | string concatenation of children                 |
| `'list'`      | literal list                                     |
| `'hash'`      | literal record                                   |
| `'reference'` | read a top-level scope key                       |
| `'read'`      | read a path through scope                        |
| `'call'`      | invoke a registered Flow or operator             |
| `'fork'`      | binary branch on a test                          |
| `'switch'`    | tagged union dispatch                            |
| `'match'`     | pattern match                                    |
| `'case'`      | arm of switch / match                            |
| `'pick'`      | choose from a list                               |
| `'walk'`      | iterate a list                                   |
| `'find'`      | resolve a resource through context.find          |
| `'fold'`      | embed a registered Fold by name                  |
| `'view'`      | element node (for vdom mode)                     |
| `'join'`      | concatenate the items of a list with a separator |

Bare scalars (string, number, boolean, Date, null) sit anywhere a Cast
does. They evaluate to themselves.

## Top-level declarations

### Form

A data shape. Identity is `(name, flow?, case?)`.

```ts
{
  form: 'form',
  name: 'language',
  like: {
    id: { like: 'string' },
    iso_639_3: { like: 'string' },
  },
  save: 'language',
}
```

- `name` is the resource name.
- `flow` (optional) is the action context. A Form with `flow: 'select'`
  is the response shape of a `select_language` Flow.
- `case` (optional) is a variant within an action context.
- `like` is the field map.
- `save` is the output sub-directory under `Make.link`.

### Flow

A function. Identity is `(call, case?)`.

```ts
{
  form: 'flow',
  call: 'is',
  case: 'email',
  take: { text: { like: 'string' } },
  make: 'boolean',
  save: 'is',
}
```

- `call` is the verb.
- `case` (optional) is the colon-scoped sub-route. Together they form
  the dispatch key: `'is:email'`, `'is:ipa:broad'`, etc.
- `take` is the input shape.
- `make` is the output shape.

### Fold

A renderable tree. Identity is `(case)`.

```ts
{
  form: 'fold',
  case: 'email:status',
  take: { input: { like: 'string' } },
  tree: [
    make.text('Mail to ', make.read('input'), ' is ',
      make.fork(make.call('is:email', { text: make.read('input') }),
        'valid', 'invalid')),
  ],
}
```

- `case` is the colon-scoped lookup name.
- `take` is the params shape (what `base.cast` accepts).
- `tree` is the AST the runtime evaluates.

### Hash

A record with dynamic keys.

```ts
{ form: 'hash', name: 'speech_sound', like: { ... } }
```

### List

A homogeneous list of literals.

```ts
{ form: 'list', name: 'iso_639_3', like: { like: 'string' } }
```

## Book

A bundle of declarations and runtime hooks.

```ts
type Book = {
  host?: string // bundle vendor
  name?: string // bundle name
  cast?: Cast[] // declarations
  call?: Record<string, Hook> // Flow handlers
  code?: Record<string, number> // generated CodeLink
  view?: Record<string, unknown> // view components
}
```

Books are passed to `Make.load(book)` (codegen time) and
`Base.load(book)` (runtime).

The `view` field carries components for element-mode rendering. A
reserved key `'fragment'` in `view` is what the renderer uses to wrap
sibling lists.

## Make: the codegen class

```ts
import { Make } from '@cluesurf/bead'

const make = new Make({ link: './libs' })

make.load(beadBook)
make.load(myAppBook)

await make.save()
```

`make.load(book)` registers a Book.

`make.save()`:

1. Validates **identity-tuple uniqueness** across all loaded books.
   Aborts with a list of collisions before writing anything.
2. Emits four streams keyed by each cast's `save:` directory:
   - `code.ts`. bundled `Code` aggregate type and `CodeLink` integer-id
     table (the kysely-DB equivalent for runtime dispatch).
   - `<save>/index.ts`. TS type aliases per cast.
   - `<save>/form.ts`. Zod parsers locked via
     `satisfies z.ZodType<TypeName>`.
   - `<save>/base.ts`. literal data exports (`<TypeName>Base`) for
     Hash/List entries with `load:`.
3. Runs every emitted file through `wash()` which mirrors VS Code "Save"
   semantics:
   - `source.organizeImports` (ts-morph)
   - `source.fixAll.eslint` (when host has an ESLint config)
   - Prettier (when host has a `.prettierrc` or equivalent)

If neither ESLint nor Prettier is configured, `wash()` is just an
organize-imports pass. No bundled defaults are applied.

When `dry: true`, `save()` returns the formatted strings without
touching disk.

## Base: the runtime class

```ts
import { Base } from '@cluesurf/bead'
import beadBook, { type Code } from '@cluesurf/bead/book'
import emailBook from './email'

const base = new Base<Code>({ createElement: React.createElement })

base.load(beadBook)
base.load(emailBook)

base.call('is:email', { text: 'hi@bead.dev' })
base.cast('email:status', { input: 'hi@bead.dev' })
```

### Construction

```ts
type BaseTake = {
  createElement?: ElementBuilder<any>  // omit → text mode
}
new Base<Code>(take?: BaseTake)
```

Without `createElement`, Base renders text. With it, Base renders vdom
and resolves view-component lookups against the loaded Book's `view:`
map. The reserved `view['fragment']` is the fragment value for sibling
wrapping.

### load / toss (polymorphic)

```ts
base.load(book)        // Book
base.load(cast)        // single Cast (Flow / Fold / Form / Hash / List)
base.load([book, ...]) // array of either

base.toss(book)        // inverse
```

Idempotent. Calling `load` twice with the same input overwrites existing
registrations. Editor hot-reload works by tossing the old version and
loading the new.

### call

```ts
base.call('is:email', { text: 'hi@bead.dev' }) // → boolean
base.call('is:ipa:broad', { text: 'fəˈnɛtɪk' }) // → boolean
base.call('format:capitalized', { text: 'hi' }) // → 'Hi'
```

Synchronous. Returns whatever the registered handler produces.

When the Book carries a `code:` map (the generated `CodeLink`), each
handler also registers under its integer id. Compiled call sites use
`base.call(<id>, args)` for fast dispatch.

Type signatures resolve through the `<Code>` generic. `args` matches the
Flow's `take` and the return matches its `make`.

### cast

```ts
base.cast('email:status', { input: 'hi@bead.dev' })
```

Strict. The first argument is **always a Fold's `case:`**. Trees come
from `Fold` declarations registered via `base.load(book)`. Never inline.

In text mode returns a string. In element mode returns whatever your
`createElement` builds.

### flow

For ad-hoc handler registration outside a Book. Pass the
colon-scoped Flow path as a single string and the handler as the
second argument:

```ts
base.flow('is:string', isString)
base.flow('is:email', ({ text }) => /\S+@\S+\.\S+/.test(text))
base.flow('is:palindrome', ({ text }) =>
  text === text.split('').reverse().join(''),
)
base.flow('always_true', () => true)
```

The path typechecks against the `<Code>` registry. `args` is
inferred from the matching Flow's `take`, the return is checked
against `make`.

A Book's bulk shape is the same wiring under the hood: each
`book.cast` Flow plus the matching handler in `book.call` is
exactly one `base.flow(path, handler)` call.

## Compile: tree → wake

`compile(tree, codeTable)` rewrites every named call in a tree to its
integer id.

```ts
const wake = compile(tree, beadBook.code!)
```

`wake` form:

```ts
{ form: 'call', code: 1, bind: { text: 'hi@bead.dev' } }
```

The runtime hits `hookStore.get(1)` directly. Wire-stable across catalog
renames as long as `CodeLink` is stable.

`decompile(wake, decodeTable)` reverses the rewrite for debugging.

## Standard book

Shipped at `@cluesurf/bead/book`. Registers verbs:

| verb       | examples                                             |
| ---------- | ---------------------------------------------------- |
| `is`       | `is:email`, `is:string`, `is:ipa:broad`, `is:among`  |
| `make`     | `make:sum`, `make:lowercase`, `make:uppercase`       |
| `get`      | `get:length`, `get:count`, `get:sum`, `get:largest`  |
| `has`      | `has:prefix`, `has:suffix`                           |
| `format`   | `format:capitalized`, `format:date`, `format:plural` |
| `fork`     | `fork` (eager-arg)                                   |
| `bind`     | `bind` (introduce names into scope)                  |
| `validate` | wraps a test in a `{ ok, message? }` envelope        |
| `walk`     | `walk:chunk`, `walk:distinct`                        |
| `find`     | `find:record`, `find:list`, etc. (host overrides)    |

Plus the AST operator set under `code/book/check/flow.ts`:

`eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `negate`, `and`, `or`,
`isNull`, `isEmpty`, `count`, `sum`, `mean`, `min`, `max`, `length`,
`plural`, `lowercase`, `uppercase`, `number`, `currency`, `percent`,
`date`, `time`, `relative`, `list`, `now`, `uuid`.

These are the bare names `make.eq(a, b)`, `make.gt(...)`, etc. emit. The
runtime resolves them through `DEFAULT_HOOK`.

## Authoring layout

The output directory is whatever you pass as `Make.link`. Put it
wherever fits your project. `host/`, `generated/`, `dist/types/`, inside
an existing `code/` tree, etc. Bead doesn't impose a name.

A typical layout:

```
my-app/
├── <wherever>/
│   └── book/
│       ├── email/
│       │   ├── make.ts       # Flow + Fold declarations
│       │   └── flow.ts       # handler implementations
│       └── index.ts          # Book aggregate
└── <wherever>/
    ├── code.ts               # bundled Code + CodeLink
    └── email/
        ├── index.ts          # TS types
        ├── form.ts           # Zod parsers
        └── base.ts           # literal data
```

`make.ts` declares the casts. `flow.ts` exports handlers whose names
match the Flow identity (`is_email` → `isEmail`). The Book at
`code/book/index.ts` glues them together.

## End-to-end example

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
export const isEmail = ({ text }: { text: string }) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
```

```ts
// code/book/index.ts
import * as emailFlows from './email/make'
import * as emailHooks from './email/flow'
import { CodeLink } from './code'

export default {
  host: 'app',
  name: 'email',
  cast: Object.values(emailFlows),
  call: emailHooks,
  code: CodeLink,
} satisfies Book
```

```ts
// app
import { Base } from '@cluesurf/bead'
import emailBook, { type Code } from './book'

const base = new Base<Code>()
base.load(emailBook)

base.cast('email:status', { input: 'hi@bead.dev' })
// → 'Mail to hi@bead.dev is valid'
```

## React mode

```ts
import { createElement, Fragment } from 'react'
import { Base } from '@cluesurf/bead'

const base = new Base<Code>({ createElement })
base.load({
  ...beadBook,
  view: { fragment: Fragment, callout: Callout },
})

base.cast('page:greeting', { user })
// → React vdom
```

`make.view('section', { className: 'x' }, [...])` produces a view node.
The renderer looks up the component by name from the loaded Book's
`view:` map. Falls through to a string tag (raw `'section'`) when no
component is registered.

### Mounting in a React app

A typical React integration creates the `Base` once (at module
scope or in a context provider) and uses a small `<Bead>`
component to render registered Folds.

```tsx
// app/bead.tsx
import { createElement, Fragment, type ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { Base } from '@cluesurf/bead'
import beadBook, { type Code } from '@cluesurf/bead/book'
import appBook from './book'
import * as components from './components'

const BaseContext = createContext<Base<Code> | null>(null)

export function BeadProvider({ children }: { children: ReactNode }) {
  const base = useMemo(() => {
    const b = new Base<Code>({ createElement })
    b.load(beadBook)
    b.load({
      ...appBook,
      view: { fragment: Fragment, ...components },
    })
    return b
  }, [])
  return (
    <BaseContext.Provider value={base}>{children}</BaseContext.Provider>
  )
}

export function Bead({
  case: foldCase,
  params,
}: {
  case: string
  params?: Record<string, unknown>
}) {
  const base = useContext(BaseContext)
  if (!base) throw new Error('<Bead> must be inside <BeadProvider>')
  return base.cast(foldCase, params) as ReactNode
}
```

```tsx
// app/root.tsx
import { BeadProvider, Bead } from './bead'

export function App() {
  return (
    <BeadProvider>
      <main>
        <Bead case="page:greeting" params={{ name: 'Lance' }} />
        <Bead case="email:status" params={{ input: 'hi@bead.dev' }} />
      </main>
    </BeadProvider>
  )
}
```

The `Base` instance is stable across renders (memoized in the
provider). Editor hot-reload swaps Folds via
`base.toss(oldFold); base.load(newFold)` and React re-renders
the affected `<Bead>` consumers on the next tick.

## Idempotent editor flow

The editor pattern:

1. User edits a Fold's tree in the editor.
2. Editor builds an updated `Fold` object.
3. `base.toss(oldFold); base.load(newFold)`.
4. UI re-renders by calling `base.cast(case, params)`.

`load` and `toss` are idempotent. Calling `load` with the same Fold
twice is safe. Calling `toss` on an unloaded Fold is safe.

## Sandbox

Trees are JSON. `compile(tree)` produces JSON. The runtime evaluates
JSON. There is no `eval`, no `Function`, no DOM access, no network
access from a tree.

Hosts gate side effects by what they put in `book.call` and
`base.flow(...)`. A handler that reads from the network is the host's
choice. The tree language can't introduce one.

## Conventions

- Discriminant property is always `form:`. Never `type` or `kind`.
- File-and-folder names are kebab-case.
- Identifiers are camelCase. Snake_case appears only in `form:` string
  values (e.g. `'natural_number'`).
- API field names in JSON request/response are snake_case.
- Login (not Sign in / Sign up). API at `base.<host>/sessions/*`.
- Three resource actions per resource: `filter | select | mutate`.
