# Bead Spec v3

The complete, current reference. Replaces every other doc in
`note/`.

## What

Bead is a **JSON system for app features** where users author rich
documents or rules and you store their work as JSON. The runtime
renders that JSON to text or vdom, with strongly-typed dispatch
through generated code and a sandbox so user-supplied logic
can't reach the host.

Trees are pure data. Same JSON renders many ways. Survives
editor patches. Travels over the wire. Typechecks against your
catalog.

## When to reach for it

| building | bead gives you |
|---|---|
| Notion-class doc editor | one tree shape for blocks / inline / embeds / database views |
| HTML + React + email + AMP from one source | author once. Text + element renderers share the tree |
| Localization | locale-aware `format(*)`, CLDR plurals, gender select, RTL |
| User- or AI-supplied logic, sandboxed | rules + formulas run against a host scope. No `eval`, no DOM, no network |
| Reusable fragments | `Fold` declarations registered in the Book |
| Wire-format-stable bytecode | `compile(tree)` rewrites call names to integer ids |

## Four pieces

| name | shape | role |
|---|---|---|
| `Book` | type | published bundle: `{ host?, name?, cast?, flow?, code?, view? }` |
| `Code` | type | generated registry. Every entry's colon-key maps to its TS type |
| `Base` | class | runtime. Loads books, dispatches calls, casts named Folds |
| `Make` | class | codegen. Reads books, emits TS / Zod / data files |

## Cast: the JSON tree

`Cast` is the umbrella for every node Bead processes.

**Top-level declarations** (live in `book.cast`):

| `form:` | role |
|---|---|
| `'form'` | data shape. Fields and their types |
| `'flow'` | function signature. Input shape, output shape, identity |
| `'fold'` | renderable tree. Document or template |
| `'hash'` | record with dynamic keys, all values one shape |
| `'list'` | homogeneous list of literals (an enum source) |

**AST primitives** (live inside Fold trees):

| `form:` | role |
|---|---|
| `'text'` | string concatenation of children |
| `'list'` | literal list |
| `'hash'` | literal record |
| `'reference'` | read a top-level scope key |
| `'read'` | read a path through scope |
| `'call'` | invoke a registered Flow or operator |
| `'fork'` | binary branch on a test |
| `'switch'` | tagged union dispatch |
| `'match'` | pattern match |
| `'case'` | arm of switch / match |
| `'pick'` | choose from a list |
| `'walk'` | iterate a list |
| `'fold'` | embed a registered Fold by name |
| `'view'` | element node (for vdom mode) |
| `'join'` | concatenate the items of a list with a separator |

Bare scalars (string, number, boolean, Date, null) sit anywhere
a Cast does. They evaluate to themselves.

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
- `flow` (optional) is the action context. A Form with
  `flow: 'select'` is the response shape of a `select_language`
  Flow.
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
- `case` (optional) is the colon-scoped sub-route. Together
  they form the dispatch key: `'is:email'`, `'is:ipa:broad'`.
- `take` is the input shape.
- `make` is the output shape.

A Flow declaration carries no handler. Implementations live
in the Book's `flow:` map keyed by the same colon path.

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

### Link shape modifiers

`Link` (the field-shape inside `like:` meshes) supports a small
set of modifiers. All optional.

| field | role |
|---|---|
| `like` | the type. Primitive name (`'string'`, `'integer'`, …), Form ref by name, inline `LinkMesh`, or array of either (union) |
| `need: false` | mark the field optional. Adds `.optional()` in Zod, `?` in the TS type alias |
| `list: true` | wrap the type in an array (`T[]` in TS, `z.array(...)` in Zod) |
| `take: [...]` | enum / allowed-values. All-string → `z.enum([...])`; single → `z.literal(...)`; mixed → `z.union([z.literal(...), ...])`. TS emits a string-literal union |
| `base: <value>` | default value (planned, not yet emitted) |
| `test: <ref>` | custom refinement (planned, not yet emitted) |

`take` short-circuits the `like` path. `take` + `list: true`
produces an array of the enum (`('a' \| 'b')[]` / `z.array(z.enum(['a','b']))`).

#### Example: enum field with `take:`

```ts
{
  form: 'form',
  name: 'event',
  like: {
    action:   { take: ['create', 'update', 'delete'] },
    priority: { take: ['high', 'low'], need: false },
    flags:    { take: ['archived', 'pinned'], list: true },
  },
}
```

Emits TS:

```ts
export type Event = {
  action: 'create' | 'update' | 'delete'
  priority?: 'high' | 'low'
  flags: ('archived' | 'pinned')[]
}
```

Emits Zod:

```ts
export const EventForm = z.object({
  action: z.enum(['create', 'update', 'delete']),
  priority: z.enum(['high', 'low']).optional(),
  flags: z.array(z.enum(['archived', 'pinned'])),
}) satisfies z.ZodType<Event>
```

## Mold: validators + normalizers

`mold:` is the unified validator-and-normalizer. It rides on
**Form**, **Flow**, and **Link**. Two flavors:

| flavor | role | shape |
|---|---|---|
| `Norm` | normalize / clean / format. Returns the rewritten value | `{ form: 'norm', take?, make?, hook }` |
| `Test` | validate. Throws with `miss` on failure | `{ form: 'test', hook, miss? }` |

`hook` is a `Call` AST node (or array — sequential pipeline).
Inside the hook, the current value is bound as `self` in
scope. Read it with `make.read('self')` (or
`make.read('self', 'subkey')` for nested record access).

`mold:` accepts a single Mold or an array. Array entries run
in order. For Norms, the threaded `self` is the prior Norm's
output. Tests check whatever `self` is at that point.

### On a Link (per-field)

```ts
import type { Norm, Test } from '@cluesurf/bead'

const trimmed: Norm = {
  form: 'norm',
  take: 'string', make: 'string',
  hook: make.call('make:trimmed', { text: make.read('self') }),
}

const present: Test = {
  form: 'test',
  hook: make.call('is:present', { thing: make.read('self') }),
  miss: 'value must be present',
}

export const blogPost: Form = {
  form: 'form',
  name: 'blog_post',
  like: {
    title: { like: 'string', need: false, mold: trimmed },
    // pipeline: trim then assert non-empty
    slug:  { like: 'string', mold: [trimmed, present] },
  },
}
```

### On a Form (whole input)

```ts
mold: [{
  form: 'test',
  hook: make.call('is:any', {
    values: [
      make.call('is:present', { thing: make.read('self', 'yes') }),
      make.call('is:present', { thing: make.read('self', 'no') }),
    ],
  }),
  miss: 'Need `yes` or `no` at least',
}]
```

### Runtime

```ts
const base = new Base()
base.load(beadBook)

base.mold('  hi  ', trimmed)        // → 'hi'
base.mold('', present)              // throws 'value must be present'
base.mold('  hi  ', [trimmed, present])  // → 'hi'
```

`base.mold(value, mold)` runs the pipeline. For Norms,
`self` flows forward through each hook (single hook or array
of hooks). For Tests, the hook's boolean result decides;
failure throws an `Error` carrying `miss`.

## Book

A bundle of declarations and runtime hooks.

```ts
type Book = {
  host?: string                                // bundle vendor
  name?: string                                // bundle name
  cast?: Cast[]                                // declarations
  flow?: Record<string, Hook>                  // handlers, keyed by colon path
  code?: Record<string, number>                // generated CodeLink
  view?: Record<string, unknown>               // view components
}
```

`flow:` is a map keyed by the **colon-scoped Flow path**. The
runtime registers each handler under `'flow:<path>'` and (when a
matching `code:` integer id is present) under that integer too.

```ts
const flow = {
  'is:email': isEmail,
  'is:ipa:broad': isIpaBroad,
  'make:sum': makeSum,
}
```

The `view:` field carries components for element-mode rendering.
A reserved key `'fragment'` in `view` is what the renderer uses
to wrap sibling lists.

### Authoring layout (one verb)

```
my-app/code/book/email/
├── make.ts         # Flow + Form + Fold declarations
└── flow.ts         # handler map, keyed by colon path
```

```ts
// flow.ts
const isEmail = ({ text }: { text: string }): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)

const flow = {
  'is:email': isEmail,
}

export default flow
```

## Make: the codegen class

```ts
import { Make } from '@cluesurf/bead'

const make = new Make({ link: './host' })   // any path you choose

make.load(beadBook)
make.load(myAppBook)

await make.save()
```

`link` is whatever path you choose. Bead doesn't impose a
directory name. Pick `host/`, `generated/`, `dist/types/`, or
nest it inside an existing tree. The path is the root for all
emitted files.

`make.load(book)` registers a Book. `make.save()`:

1. Validates **identity-tuple uniqueness** across all loaded
   books. Aborts with a list of collisions before writing
   anything.
2. Emits four streams keyed by each cast's `save:` directory:
   - `<link>/code.ts` is the bundled `Code` aggregate type and
     `CodeLink` integer-id table (the kysely-DB equivalent for
     runtime dispatch).
   - `<link>/<save>/index.ts` is TS type aliases per cast.
   - `<link>/<save>/form.ts` is Zod parsers locked via
     `satisfies z.ZodType<TypeName>`.
   - `<link>/<save>/base.ts` is literal data exports for
     Hash/List entries with `load:`.
3. Runs every emitted file through `wash()` which mirrors VS
   Code "Save" semantics:
   - `source.organizeImports` (ts-morph)
   - `source.fixAll.eslint` (when host has an ESLint config)
   - Prettier (when host has a `.prettierrc` or equivalent)

If neither ESLint nor Prettier is configured, `wash()` is just
an organize-imports pass. No bundled defaults are applied.

When `fake: true`, `save()` returns the formatted strings
without touching disk.

### Where each Cast goes

| `form:` | TS types | Zod parsers | Literal data | Code entry |
|---|---|---|---|---|
| `'form'` | `<save>/index.ts` | `<save>/form.ts` | none | `'form:<name>:<flow?>:<case?>'` |
| `'flow'` | `<save>/index.ts` (Take + Make pair) | `<save>/form.ts` | none | `'flow:<call>:<case?>'` |
| `'fold'` | `<save>/index.ts` (`= unknown`) | none | none | `'fold:<case>'` |
| `'hash'` | `<save>/index.ts` | `<save>/form.ts` | `<save>/base.ts` (when `load:`) | `'hash:<name>'` |
| `'list'` | `<save>/index.ts` | `<save>/form.ts` | `<save>/base.ts` (when `load:`) | `'list:<name>'` |

The hash/list handlers live in `code/make/form/typescript.ts`
(`makeBookCode`), `code/make/form/zod.ts` (`makeBookForm`), and
`code/make/form/base.ts` (`makeBookBase`).

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
new Base<Code>(take?)
```

Without `createElement`, Base renders text. With it, Base
renders vdom and resolves view-component lookups against the
loaded Book's `view:` map. The reserved `view['fragment']` is
the fragment value for sibling wrapping.

### load / toss (polymorphic)

```ts
base.load(book)        // Book
base.load(cast)        // single Cast (Flow / Fold / Form / Hash / List)
base.load([book, ...]) // array of either

base.toss(book)        // inverse
```

Idempotent. Calling `load` twice with the same input overwrites
existing registrations. Editor hot-reload works by tossing the
old version and loading the new.

`load(book)` reads `book.flow` directly. Each entry registers
under its colon-scoped key plus (when a matching `book.code` id
is present) under that integer too. There is no separate
registration step. The Book is the authoritative wiring.

### call

```ts
base.call('is:email', { text: 'hi@bead.dev' })       // → boolean
base.call('is:ipa:broad', { text: 'fəˈnɛtɪk' })      // → boolean
base.call('format:capitalized', { text: 'hi' })      // → 'Hi'
```

Synchronous. Returns whatever the registered handler produces.

When the Book carries a `code:` map (the generated `CodeLink`),
each handler also registers under its integer id. Compiled call
sites use `base.call(<id>, args)` for fast dispatch.

Type signatures resolve through the `<Code>` generic. `args`
matches the Flow's `take` and the return matches its `make`.

### cast

```ts
base.cast('email:status', { input: 'hi@bead.dev' })
```

Strict. The first argument is **always a Fold's `case:`**.
Trees come from `Fold` declarations registered via
`base.load(book)`. Never inline.

In text mode returns a string. In element mode returns whatever
your `createElement` builds.

### No `base.flow`

Handler registration is a Book-internal concern. There is no
public `base.flow(...)` method. To wire ad-hoc handlers, build a
Book on the fly:

```ts
base.load({
  flow: {
    'is:palindrome': ({ text }) =>
      text === text.split('').reverse().join(''),
  },
})
```

## Compile: tree → wake

`compile(tree, codeTable)` rewrites every named call in a tree
to its integer id.

```ts
const wake = compile(tree, beadBook.code!)
```

`wake` form:

```ts
{ form: 'call', code: 1, bind: { text: 'hi@bead.dev' } }
```

The runtime hits `hookStore.get(1)` directly. Wire-stable
across catalog renames as long as `CodeLink` is stable.

`decompile(wake, decodeTable)` reverses the rewrite for
debugging.

## Standard book

Shipped at `@cluesurf/bead/book`. Verbs:

| verb | examples |
|---|---|
| `is` | `is:email`, `is:string`, `is:ipa:broad`, `is:among` |
| `make` | `make:sum`, `make:lowercase`, `make:uppercase` |
| `get` | `get:length`, `get:count`, `get:sum`, `get:largest` |
| `has` | `has:prefix`, `has:suffix` |
| `format` | `format:capitalized`, `format:date`, `format:plural` |
| `fork` | `fork` (eager-arg) |
| `bind` | `bind` (introduce names into scope) |
| `validate` | wraps a test in a `{ ok, message? }` envelope |
| `walk` | `walk:chunk`, `walk:distinct` |

`find` is intentionally **not** in the standard book. Resource
lookup is host-specific. Hosts implement their own `find` verb
and load it as a separate Book.

Plus the AST operator set under `code/book/check/flow.ts`:

`eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `negate`, `and`,
`or`, `isNull`, `isEmpty`, `count`, `sum`, `mean`, `min`,
`max`, `length`, `plural`, `lowercase`, `uppercase`, `number`,
`currency`, `percent`, `date`, `time`, `relative`, `list`,
`now`, `uuid`.

These are the bare names `make.eq(a, b)`, `make.gt(...)`, etc.
emit. The runtime resolves them through `DEFAULT_HOOK`.

## Authoring layout

The output directory is whatever you pass as `Make.link`. Put
it wherever fits your project. Bead doesn't impose a name.

A typical layout:

```
my-app/
├── code/
│   └── book/
│       ├── email/
│       │   ├── make.ts       # Flow + Fold declarations
│       │   └── flow.ts       # handler map, default-exported
│       └── index.ts          # Book aggregate
└── <Make.link>/              # configurable; e.g. host/, generated/, …
    ├── code.ts               # bundled Code + CodeLink
    └── email/
        ├── index.ts          # TS types
        ├── form.ts           # Zod parsers
        └── base.ts           # literal data
```

`make.ts` declares the casts. `flow.ts` exports a default
object keyed by colon-scoped path. The Book at
`code/book/index.ts` glues each verb's declarations + handlers.

## End-to-end example

```ts
// code/book/email/make.ts
import type { Flow, Fold } from '@cluesurf/bead'
import { make } from '@cluesurf/bead'

export const isEmail: Flow = {
  form: 'flow', call: 'is', case: 'email',
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
      'Mail to ', make.read('input'), ' is ',
      make.fork(
        make.call('is:email', { text: make.read('input') }),
        'valid', 'invalid',
      ),
    ),
  ],
  save: 'email',
}
```

```ts
// code/book/email/flow.ts
const isEmail = ({ text }: { text: string }): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)

const flow = {
  'is:email': isEmail,
}

export default flow
```

```ts
// code/book/index.ts
import type { Book } from '@cluesurf/bead'
import * as emailFlows from './email/make'
import emailFlow from './email/flow'
import { CodeLink } from './code'   // generated

export default {
  host: 'app',
  name: 'email',
  cast: Object.values(emailFlows),
  flow: emailFlow,
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

`make.view('section', { className: 'x' }, [...])` produces a
view node. The renderer looks up the component by name from the
loaded Book's `view:` map. Falls through to a string tag (raw
`'section'`) when no component is registered.

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

`load` and `toss` are idempotent. Calling `load` with the same
Fold twice is safe. Calling `toss` on an unloaded Fold is safe.

## Sandbox

Trees are JSON. `compile(tree)` produces JSON. The runtime
evaluates JSON. There is no `eval`, no `Function`, no DOM
access, no network access from a tree.

Hosts gate side effects by what they put in `book.flow`. A
handler that reads from the network is the host's choice. The
tree language can't introduce one.

## Conventions

- Discriminant property is always `form:`. Never `type` or
  `kind`.
- File-and-folder names are kebab-case.
- Identifiers are camelCase. Snake_case appears only in `form:`
  string values (e.g. `'natural_number'`).
- API field names in JSON request/response are snake_case.
- Login (not Sign in / Sign up). API at `base.<host>/sessions/*`.
- Three resource actions per resource: `filter | select | mutate`.
