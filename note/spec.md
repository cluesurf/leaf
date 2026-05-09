# Leaf Spec

The complete, current reference.

## What

Leaf is a **JSON system for app features** where users author
rich documents or rules and you store their work as JSON. The
runtime renders that JSON to text or vdom, with strongly-typed
dispatch through generated code and a sandbox so user-supplied
logic can't reach the host.

Trees are pure data. Same JSON renders many ways. Survives
editor patches. Travels over the wire. Typechecks against your
catalog.

## When to reach for it

| building | leaf gives you |
|---|---|
| Notion-class doc editor | one tree shape for blocks / inline / embeds / database views |
| HTML + React + email + AMP from one source | author once. Text + element renderers share the tree |
| Localization | locale-aware `format(*)`, CLDR plurals, gender select, RTL |
| User- or AI-supplied logic, sandboxed | rules + formulas run against a host scope. No `eval`, no DOM, no network |
| Reusable fragments | `Fold` declarations registered in the Book |
| Data-shape validation + normalization | `Form` + `Mold` compile to per-field closures at load time |

## Five pieces

| name | shape | role |
|---|---|---|
| `Book` | type | published bundle: `{ host?, name?, make?, flow?, code?, view? }` |
| `Code` | type | generated registry. Every entry's colon-key maps to its TS type |
| `Base` | class | runtime. Loads books, dispatches calls, casts named Folds, molds values |
| `cast` | namespace | AST builders. `cast.text(...)`, `cast.read(...)`, `cast.call(...)`, etc. |
| `save` | function | codegen. Reads books, emits TS / data files |

## Make: schema umbrella

`Make` is the umbrella for every top-level declaration.

**Top-level declarations** (live in `book.make`):

| `form:` | role |
|---|---|
| `'form'` | data shape. Fields and their types |
| `'flow'` | function signature. Input shape, output shape, identity |
| `'fold'` | renderable tree. Document or template |
| `'hash'` | record with dynamic keys, all values one shape |
| `'list'` | homogeneous list of literals (an enum source) |

```ts
type Make = Form | Flow | Fold | Hash | List
```

## Cast: AST primitives + scalars

`Cast` is the AST node type. Every node a Fold tree contains.

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
| `'pick'` | first non-null in a list |
| `'walk'` | iterate a list / test / size range |
| `'fold'` | embed a registered Fold by name |
| `'view'` | element node (vdom mode) |
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
- `like` is the field map (`LinkMesh` or array of meshes for
  tagged unions).
- `mold` (optional) is a `Mold` (or array) that runs against
  the whole record after fields validate.
- `save` is the output sub-directory under `save({ link })`.

### Flow

A function signature. Identity is `(call, case?)`.

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
- `mold` (optional) sits on the input.

A Flow declaration carries no handler. Implementations live
in the Book's `flow:` map keyed by the same colon path.

### Fold

A renderable tree. Identity is `(case)`.

```ts
{
  form: 'fold',
  case: 'email:status',
  take: { input: { like: 'string' } },
  cast: [
    cast.text(
      'Mail to ', cast.read('input'), ' is ',
      cast.fork(cast.call('is:email', { text: cast.read('input') }),
        'valid', 'invalid'),
    ),
  ],
}
```

- `case` is the colon-scoped lookup name.
- `take` is the params shape (what `base.cast` accepts).
- `cast` is the array of AST nodes the runtime evaluates.
  Multi-node arrays concatenate (an implicit `text` wrap).

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

## Link shape modifiers

`Link` (the field shape inside `like:` meshes) carries a small
set of modifiers. All optional.

| field | role |
|---|---|
| `like` | the type. Primitive name (`'string'`, `'integer'`, …), Form ref by name, inline `LinkMesh`, or array of either (union) |
| `need: false` | mark the field optional. `?` in the TS type alias |
| `list: true` | wrap in an array (`T[]` in TS) |
| `take: [...]` | enum / allowed-values. String-literal union in TS |
| `mold` | `Mold` or array. Validators / normalizers per-field |

`take` short-circuits the `like` path. `take` + `list: true`
produces an array of the enum.

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

## Mold: validators + normalizers

`Mold` is the unified validator-and-normalizer. It rides on
**Form**, **Flow**, and **Link**. Two flavors:

| flavor | role | shape |
|---|---|---|
| `Norm` | normalize / clean / format. Returns the rewritten value | `{ form: 'norm', take?, make?, hook }` |
| `Test` | validate. Throws with `miss` on failure | `{ form: 'test', hook, miss? }` |

`hook` is a `Cast` AST node (or array — sequential pipeline).
Inside the hook, the current value binds as `self` in scope.
Read it with `cast.read('self')`.

`mold:` accepts a single Mold or an array. Array entries run
in order. For Norms, the threaded `self` is the prior Norm's
output. Tests check whatever `self` is at that point.

### On a Link (per-field)

```ts
import type { Norm, Test } from '@cluesurf/leaf'
import { cast } from '@cluesurf/leaf'

const trimmed: Norm = {
  form: 'norm',
  take: 'string', make: 'string',
  hook: cast.call('make:trimmed', { text: cast.read('self') }),
}

const present: Test = {
  form: 'test',
  hook: cast.call('is:present', { thing: cast.read('self') }),
  miss: 'value must be present',
}

export const blogPost: Form = {
  form: 'form',
  name: 'blog_post',
  like: {
    title: { like: 'string', need: false, mold: trimmed },
    slug:  { like: 'string', mold: [trimmed, present] },
  },
}
```

### On a Form (whole input)

```ts
mold: [{
  form: 'test',
  hook: cast.call('is:any', {
    things: [
      cast.call('is:present', { thing: cast.read('self', 'yes') }),
      cast.call('is:present', { thing: cast.read('self', 'no') }),
    ],
  }),
  miss: 'Need `yes` or `no` at least',
}]
```

### Runtime

```ts
const base = new Base()
base.load(leafBook)

base.mold('blog_post', { title: '  hi  ', slug: 'hello' })
// → { title: 'hi', slug: 'hello' }
```

`base.mold(name, value)` looks up the compiled parser and
applies it. Per-field Molds run inline. Form-level Molds run
after fields. Mold hook trees are compiled once and cached
(WeakMap on tree identity) so bulk validation is closure-fast.

## Book

A bundle of declarations and runtime hooks.

```ts
type Book = {
  host?: string                                // bundle vendor
  name?: string                                // bundle name
  make?: Make[]                                // declarations
  flow?: Record<string, Hook>                  // handlers, keyed by colon path
  code?: Record<string, number>                // generated CodeLink
  view?: Record<string, unknown>               // view components
}
```

`flow:` is keyed by **colon-scoped Flow path**. The runtime
registers each handler under `'flow:<path>'` and (when a
matching `code:` integer id is present) under that integer too.

The `view:` field carries components for element-mode rendering.
A reserved `'fragment'` key is the fragment value the renderer
uses to wrap sibling lists.

A second reserved Flow path enters element mode:

```ts
base.load({ flow: { 'create:element': React.createElement } })
```

Without that registration, `base.cast(...)` returns text.

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

const flow = { 'is:email': isEmail }
export default flow
```

## save: codegen

```ts
import save from '@cluesurf/leaf/save'

await save({
  link: './host',          // any path you choose
  book: [leafBook, myBook],
})
```

`save({ link, book, fake? })`:

1. Validates **identity-tuple uniqueness** across all loaded
   books. Aborts with a list of collisions before writing
   anything.
2. Emits per-Book streams keyed by each declaration's `save:`
   directory:
   - `<link>/code.ts` is the bundled `Code` aggregate type
     and `CodeLink` integer-id table.
   - `<link>/<save>/index.ts` is TS type aliases per cast.
   - `<link>/<save>/data.ts` is literal data exports for
     Hash/List entries with `load:`.
3. Runs every emitted file through `wash()` which mirrors VS
   Code "Save":
   - `source.organizeImports`
   - `source.fixAll.eslint` (when host has an ESLint config)
   - Prettier (when host has a `.prettierrc`)

If neither ESLint nor Prettier is configured, `wash()` is just
an organize-imports pass.

`save({ fake: true })` returns the formatted strings without
touching disk.

### Where each Cast goes

| `form:` | TS types | Literal data | Code entry |
|---|---|---|---|
| `'form'` | `<save>/index.ts` | none | `'form:<name>:<flow?>:<case?>'` |
| `'flow'` | `<save>/index.ts` (Take + Make pair) | none | `'flow:<call>:<case?>'` |
| `'fold'` | `<save>/index.ts` (`= unknown`) | none | `'fold:<case>'` |
| `'hash'` | `<save>/index.ts` | `<save>/data.ts` (when `load:`) | `'hash:<name>'` |
| `'list'` | `<save>/index.ts` | `<save>/data.ts` (when `load:`) | `'list:<name>'` |

## Base: the runtime class

```ts
import { Base } from '@cluesurf/leaf'
import leafBook, { type Code } from '@cluesurf/leaf/book'
import emailBook from './email'

const base = new Base<Code>()
base.load(leafBook)
base.load(emailBook)

base.call('is:email', { text: 'hi@leaf.dev' })
base.cast('email:status', { input: 'hi@leaf.dev' })
base.mold('blog_post', { title: '  hi  ', slug: 'hello' })
```

### Construction

```ts
new Base<Code>()
```

Zero-arg. No render-mode flag, no createElement option. Render
mode is decided by what's loaded:

```ts
// element (vdom) mode
base.load({ flow: { 'create:element': React.createElement } })
base.load({ view: { fragment: Fragment, callout: Callout } })
```

Without the `'create:element'` Flow registered, every
`base.cast(...)` resolves in text mode.

### load / toss (polymorphic)

```ts
base.load(book)        // Book
base.load(make)        // single Make (Flow / Fold / Form / Hash / List)
base.load([book, ...]) // array of either

base.toss(book)        // inverse
```

Idempotent. Calling `load` twice with the same input overwrites
existing registrations. Editor hot-reload works by tossing the
old version and loading the new.

`load(book)` reads `book.flow` directly. Each entry registers
under its colon-scoped key plus (when a matching `book.code`
id is present) under that integer too. There is no separate
registration step. The Book is the authoritative wiring.

### call

```ts
base.call('is:email', { text: 'hi@leaf.dev' })       // → boolean
base.call('is:ipa:broad', { text: 'fəˈnɛtɪk' })      // → boolean
base.call('format:capitalized', { text: 'hi' })      // → 'Hi'
```

Synchronous. Returns whatever the registered handler produces.

When the Book carries a `code:` map (the generated `CodeLink`),
each handler also registers under its integer id. Compiled call
sites use `base.call(<id>, args)` for fast dispatch.

Type signatures resolve through the `<Code>` generic. `args`
matches the Flow's `take`; the return matches its `make`.

### cast

```ts
base.cast('email:status', { input: 'hi@leaf.dev' })
```

Strict. The first argument is **always a Fold's `case:`**.
Trees come from `Fold` declarations registered via
`base.load(book)`. Never inline.

In text mode returns a string-typed JS value. In element mode
returns whatever your `createElement` builds.

Each Fold compiles to a closure pair (text + element) at
`load(book)` time. `base.cast(...)` is a single closure
invocation — no per-call walker setup.

### mold

```ts
base.mold('blog_post', input)        // → typed, normalized record
base.mold('language', untrustedJson)
```

Looks up the closure compiled at `load(book)` time and applies
it. Throws on validation failure. Per-Link `mold:` declarations
on the schema run inline. Form-level `mold:` runs after fields.

The return type resolves through `<Code>`:
`base.mold('language', x)` returns the `Language` type.

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

## Render engine

Each `Cast` node compiles once at `base.load(book)` time into
a `(scope, ctx) => value` closure. Per-call evaluation is a
single function invocation — no `switch (node.form)` at render
time, no per-call walker setup.

Two modes:
- **`'text'`** — returns native JS values (strings, numbers,
  objects, arrays, dates).
- **`'element'`** — returns vdom children (elements, strings,
  fragment-wrapped arrays).

Both modes share one dispatcher. Mode-aware node kinds
(`text`, `list`, `case`, `walk`, `join`, `view`) branch on mode
internally. Value-position arguments (predicates, path indexes,
call args) always compile in `'text'` mode regardless of caller
mode — the value is consumed by the surrounding operator, not
rendered as a child.

Element mode is **view-only**: only `cast.view(...)` nodes pass
through `createElement`. Everything else returns native JS values.
This means `cast.text(...)` of plain strings concatenates;
`cast.view('p', {}, ['hi'])` builds a `<p>hi</p>` element.

## Standard book

Shipped at `@cluesurf/leaf/book`. Verbs:

| verb | examples |
|---|---|
| `is` | `is:string`, `is:integer`, `is:above`, `is:among`, `is:any`, `is:all`, `is:null`, `is:empty` |
| `make` | `make:sum`, `make:lowercase`, `make:uppercase`, `make:trimmed`, `make:now`, `make:uuid` |
| `get` | `get:length`, `get:count`, `get:sum`, `get:largest`, `get:smallest`, `get:mean` |
| `has` | `has:prefix`, `has:suffix` |
| `format` | `format:capitalized`, `format:date`, `format:plural`, `format:number`, `format:currency` |
| `branch` | `if`, `bind` (lazy-arg verbs) |
| `validate` | wraps a test in a `{ ok, message? }` envelope |
| `walk` | iteration helpers |

Plus the AST operator set under `code/book/check/flow.ts`:
`eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `negate`, `and`,
`or`, `isNull`, `isEmpty`, `count`, `sum`, `mean`, `min`,
`max`, `length`, `plural`.

These are the bare names `cast.eq(a, b)`, `cast.gt(...)`, etc.
emit. The runtime resolves them through `DEFAULT_HOOK`.

`find` is intentionally **not** part of the library. Resource
lookup is host-specific. Hosts implement their own `find` verb
and load it as a separate Book.

## cast: the AST builder namespace

`cast` is the namespace import. It re-exports every builder.

```ts
import { cast } from '@cluesurf/leaf'

cast.text('Hello, ', cast.read('name'), '!')
cast.read('user', 'profile', 'email')
cast.read('items', cast.idx(0), cast.field('title'))
cast.read('items', cast.slice({ start: 0, end: 5 }))
cast.call('is:email', { text: cast.read('input') })
cast.fork(cast.call('is:empty', { value: cast.read('list') }), 'empty', 'has items')
cast.switch(cast.read('role'), [
  cast.case('admin', 'Welcome, admin!'),
  cast.case('member', 'Hi there'),
  cast.otherwise('Sign in'),
])
cast.match([
  cast.case(cast.gt(cast.read('n'), 100), 'big'),
  cast.case(cast.gt(cast.read('n'), 10), 'medium'),
  cast.otherwise('small'),
])
cast.walk({ list: cast.read('items'), item: 'item', index: 'i', hook: ... })
cast.join(', ', [cast.walk({ ... })])
cast.fold('greeting', { name: cast.read('user', 'name') })
cast.view('section', { className: 'x' }, [...])
```

`cast.read(...)` accepts a head variable name plus a chain of
field names, indices, or slices. `idx(n)` and `slice({ start,
end })` are the bracket-segment builders. Slice bounds are
named `start` / `end` (not `from` / `to` / `rise` / `fall`).

## Authoring layout

The output directory is whatever you pass as `save({ link })`.
Put it wherever fits your project. Leaf doesn't impose a name.

A typical layout:

```
my-app/
├── code/
│   └── book/
│       ├── email/
│       │   ├── make.ts       # Flow + Fold declarations
│       │   └── flow.ts       # handler map, default-exported
│       └── index.ts          # Book aggregate
└── <link>/                   # configurable; e.g. host/, generated/
    ├── code.ts               # bundled Code + CodeLink
    └── email/
        ├── index.ts          # TS types
        └── data.ts           # literal data
```

`make.ts` declares the casts. `flow.ts` exports a default
object keyed by colon-scoped path. The Book at
`code/book/index.ts` glues each verb's declarations + handlers.

## End-to-end example

```ts
// code/book/email/make.ts
import type { Flow, Fold } from '@cluesurf/leaf'
import { cast } from '@cluesurf/leaf'

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
  cast: [
    cast.text(
      'Mail to ', cast.read('input'), ' is ',
      cast.fork(
        cast.call('is:email', { text: cast.read('input') }),
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

const flow = { 'is:email': isEmail }
export default flow
```

```ts
// code/book/index.ts
import type { Book } from '@cluesurf/leaf'
import * as emailFlows from './email/make'
import emailFlow from './email/flow'
import { CodeLink } from '<link>/code'   // generated

export default {
  host: 'app',
  name: 'email',
  make: Object.values(emailFlows),
  flow: emailFlow,
  code: CodeLink,
} satisfies Book
```

```ts
// app entry
import { Base } from '@cluesurf/leaf'
import emailBook, { type Code } from './book'

const base = new Base<Code>()
base.load(emailBook)

base.cast('email:status', { input: 'hi@leaf.dev' })
// → 'Mail to hi@leaf.dev is valid'

base.call('is:email', { text: 'hi@leaf.dev' })
// → true (typed)
```

## React mode

```ts
import { createElement, Fragment } from 'react'
import { Base } from '@cluesurf/leaf'

const base = new Base<Code>()
base.load({ flow: { 'create:element': createElement } })
base.load({
  ...leafBook,
  view: { fragment: Fragment, callout: Callout },
})

base.cast('page:greeting', { user })
// → React vdom
```

`cast.view('section', { className: 'x' }, [...])` produces a
view node. The renderer looks up the component by name from the
loaded Book's `view:` map. Falls through to a string tag (raw
`'section'`) when no component is registered.

### Mounting in a React app

A typical React integration creates the `Base` once (at module
scope or in a context provider) and uses a small `<Leaf>`
component to render registered Folds.

```tsx
// app/leaf.tsx
import { createElement, Fragment, type ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { Base } from '@cluesurf/leaf'
import leafBook, { type Code } from '@cluesurf/leaf/book'
import appBook from './book'
import * as components from './components'

const BaseContext = createContext<Base<Code> | null>(null)

export function LeafProvider({ children }: { children: ReactNode }) {
  const base = useMemo(() => {
    const b = new Base<Code>()
    b.load({ flow: { 'create:element': createElement } })
    b.load(leafBook)
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

export function Leaf({
  case: foldCase,
  params,
}: {
  case: string
  params?: Record<string, unknown>
}) {
  const base = useContext(BaseContext)
  if (!base) throw new Error('<Leaf> must be inside <LeafProvider>')
  return base.cast(foldCase, params) as ReactNode
}
```

```tsx
// app/root.tsx
import { LeafProvider, Leaf } from './leaf'

export function App() {
  return (
    <LeafProvider>
      <main>
        <Leaf case="page:greeting" params={{ name: 'Lance' }} />
        <Leaf case="email:status" params={{ input: 'hi@leaf.dev' }} />
      </main>
    </LeafProvider>
  )
}
```

The `Base` instance is stable across renders (memoized in the
provider). Editor hot-reload swaps Folds via
`base.toss(oldFold); base.load(newFold)` and React re-renders
the affected `<Leaf>` consumers on the next tick.

## Idempotent editor flow

The editor pattern:

1. User edits a Fold's `cast:` array in the editor.
2. Editor builds an updated `Fold` object.
3. `base.toss(oldFold); base.load(newFold)`.
4. UI re-renders by calling `base.cast(case, params)`.

`load` and `toss` are idempotent. Calling `load` with the same
Fold twice is safe. Calling `toss` on an unloaded Fold is safe.

## Errors

Validation failures throw via `@cluesurf/kink` (an opt-in
dependency).

```ts
import '@cluesurf/leaf/kink'   // installs the kink factory
```

Without the import, parsers throw plain `Error` objects with
`form` + `link` properties carrying the same `path` / `note`
detail. Kink-shaped errors keep the failure structured for UI
surfaces and logs.

## Sandbox

Trees are JSON. The runtime evaluates JSON. There is no
`eval`, no `new Function`, no template-compile in the browser
or SSR. Everything is built-time codegen plus run-time closure
dispatch.

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
- `things` (not `values`) is the canonical name for the array
  arg in `is:any` / `is:all` / `is:one` and their `cast.and` /
  `cast.or` builders.
