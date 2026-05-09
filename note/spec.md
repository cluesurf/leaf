# Bead Spec

The complete reference. Replaces every other doc in `note/`.

## What

Bead is a **JSON system for app features** where users author rich
documents or rules and you save their work as JSON. The runtime
renders that JSON to text or vdom, with strongly-typed runtime
dispatch via codegen and a sandbox so user-supplied logic can't reach
the host.

Not a templating mini-language. Trees are pure data. Same JSON →
many render targets, survive editor patches, pass through the wire,
typecheck against your catalog.

## When to reach for it

| building | bead gives you |
|---|---|
| Notion-class doc editor | one tree shape for blocks / inline / embeds / database views. Per-mark `bindPatch` updates only dirty subtrees |
| Multi-target rendering (HTML + React + email + AMP) | author once as JSON. Text and vdom renderers share the same tree |
| Localization | locale-aware `format(*)`, CLDR plurals, gender select, RTL |
| User- or AI-supplied logic, sandboxed | rules + formulas run against a host scope. No `eval`, no DOM, no network |
| Reusable fragments (snippets, partials) | `Fold` declarations registered in the Book |
| Wire-format-stable bytecode | `compile(tree, codeTable)` rewrites verbs to integer ids |

## The four pieces

| name | shape | role |
|---|---|---|
| `Book` | type | a published bundle: `{ host?, name?, cast?, call?, code? }` |
| `Code` | type | generated registry: every entry's colon-key → its TS type |
| `Base` | class | runtime that loads books, dispatches calls, and casts trees |
| `Make` | class | codegen orchestrator that loads books and emits artifacts |

## Cast. the JSON tree

`Cast` is the umbrella for every node bead processes. Two kinds:

- **Native leaves**. bare `string | number | boolean | Date | null`.
- **Tagged nodes**. JSON objects with a `form:` discriminant.

```ts
type Cast = string | number | boolean | Date | null | Structural

type Structural =
  | TextPrimitive | ListPrimitive | HashPrimitive | JoinPrimitive
  | Reference | ReadPrimitive
  | Call
  | ForkPrimitive | SwitchPrimitive | MatchPrimitive | CasePrimitive | PickPrimitive
  | WalkPrimitive
  | FindPrimitive | FoldPrimitive
  | ViewPrimitive
```

### Reserved keys

Tagged nodes can carry these reserved keys (in addition to `form:`):

| key | role |
|---|---|
| `form` | discriminant. what kind of Cast this is |
| `name` | identifier (verb for `call`, component for `view`, fold name for `fold`) |
| `case` | colon-scoped case path (call's `(verb, case)` identity tail) |
| `mark` | per-Cast UUID (editor identity, memoization key) |
| `code` | compiled integer id (wake form) |
| `bind` | compiled args bag (wake form) |

Everything else on a tagged node is **snake_case user data**: flow
args, view props, list items, path segments. Reserved keys cannot
collide with user data because they are reserved at registration
time.

## AST primitives

### `text`. string concatenation

```ts
type TextPrimitive = { form: 'text'; flow: Cast[] }

make.text('Hello, ', make.read('name'), '!')
// → { form: 'text', flow: ['Hello, ', { form: 'reference', name: 'name' }, '!'] }
```

The text renderer concatenates rendered children. The element
renderer wraps them in a fragment.

### `list`. homogeneous array

```ts
type ListPrimitive = { form: 'list'; list: Cast[] }

make.list(['a', 'b', 'c'])
// → { form: 'list', list: ['a', 'b', 'c'] }
```

Tagged (rather than bare arrays) so it doesn't collide with
view-`nest` children or arbitrary array-shaped props.

### `hash`. record literal

```ts
type HashPrimitive = { form: 'hash'; base: Record<string, Cast> }

make.hash({ name: 'Lance', count: 3 })
```

### `reference` and `read`. host scope reads

```ts
type Reference = { form: 'reference'; name: string }
type ReadPrimitive = { form: 'read'; link: ReadLink[] }
type ReadLink = VariableSeg | FieldSeg | IndexSeg | SliceSeg

make.reference('count')        // { form: 'reference', name: 'count' }
make.read('user', 'name')      // user.name
make.read('items', make.idx(0)) // items[0]
```

`safe: true` on a segment makes it null-tolerant.

### `call`. flow invocation

Two flavors:

```ts
// Make form (authored, stored at rest)
{ form: 'call', name: 'is', case: 'ipa:broad', text: 'fəˈnɛtɪk', mark?: '01h…' }

// Wake form (compiled, runtime-ready)
{ form: 'call', code: 1, mark?: '01h…', bind: { text: 'fəˈnɛtɪk' } }
```

Builder accepts a colon-scoped path:

```ts
make.call('is:ipa:broad', { text: 'fəˈnɛtɪk' })
make.eq(make.read('status'), 'on')              // shorthand for make.call('eq', { a, b })
```

### `fork`. conditional

```ts
type ForkPrimitive = { form: 'fork'; test: Cast; then: Cast; fall?: Cast }

make.fork(make.eq(make.read('status'), 'on'), 'live', 'offline')
```

Lazy: only the selected branch is evaluated. Walker special-cases
`make.call('fork', ...)` too. both branches don't run.

### `switch`, `match`, `case`, `pick`

```ts
make.switch(value, [{ when, then }], fall?)        // value-keyed dispatch
make.match([{ test, then }], fall?)                 // try-each-test
make.case(test, [armValue, armTest, armDefault])    // subject + arms
make.pick(...candidates)                            // first non-null
```

Higher-order helpers:

```ts
make.pluralCases('count', { one: 'message', other: 'messages' })
make.selectCases('gender', { male: 'Mr.', female: 'Ms.', other: '' })
```

### `walk`. iteration (3 variants)

One form, three case-discriminated variants:

```ts
type WalkPrimitive =
  | { form: 'walk', case: 'list', list, hook, item?, index? }
  | { form: 'walk', case: 'test', test, hook }
  | { form: 'walk', case: 'size', base, head, move?, hook, item?, index? }
```

Builders:

```ts
make.walk(items, body, { item?, index? })           // for-each over a list
make.walkTest(test, body)                            // while-style; capped at 10k iter
make.walkSize(base, head, body, { move?, item? })   // counted range
```

For separator-between-iterations, wrap with `make.join`.

### `join`. list with separator

```ts
type JoinPrimitive = { form: 'join'; list: Cast[]; text: string }

make.join(', ', 'a', 'b', 'c')
// → 'a, b, c'

make.join(', ', make.walk(items, body))
// walk's iterations flatten into the join's list automatically
```

### `find`. query expression

```ts
type FindPrimitive = {
  form: 'find'
  resource: string
  where?: Cast
  sort?: Cast[]
  limit?: number
  offset?: number
  kind?: 'count' | 'sum' | 'mean' | 'first' | …
}

make.find('article', { where: make.eq(make.read('status'), 'published'), limit: 5 })
```

Resolved by a host-supplied data layer. register through
`base.flow('find', { case: 'list' }, async ({ resource, where, … }) => ...)`.

### `fold`. embedded template

```ts
type FoldPrimitive = { form: 'fold'; name: string; bind?: Record<string, Cast> }

make.fold('greeting', { name: 'Lance' })
```

Resolves through Folds registered on the Book.

### `view`. component element

```ts
type ViewPrimitive = {
  form: 'view'
  name: string             // component slug
  case?: string            // optional variant
  nest?: Cast[]            // child casts
  [prop: string]: unknown  // typed props (flat)
}

make.view('callout', { variant: 'note' }, ['No images yet.'])
```

The element renderer dispatches by `name` against `BaseConfig.component`.
The text renderer emits `[view:<name>]` placeholders.

## Top-level declarations

`Cast` (in the schema sense) is the umbrella for declarations that
go in a Book: `Form | Flow | Fold | Hash | List`.

### Form. data shape

```ts
type Form = {
  form: 'form'
  name: string                      // resource name
  flow?: string                     // verb this Form is input/output for
  case?: string                     // variant within (name, flow)
  like: LinkMesh | LinkMesh[]       // field map
  head?: string[]                   // generic type parameters
  save?: string                     // codegen output sub-directory
}
```

### Flow. function declaration

```ts
type Flow = {
  form: 'flow'
  call: string                      // verb (`'is'`, `'make'`, …)
  case?: string                     // colon-scoped case path
  take?: string | LinkMesh | (string | LinkMesh)[]
  make?: string | LinkMesh | (string | LinkMesh)[]
  save?: string
}
```

`case` is a colon-joined path. Together with `call`, forms the
dispatch identity. `'is:ipa:broad'` → key `'flow:is:ipa:broad'`.

### Fold. renderable template

```ts
type Fold = {
  form: 'fold'
  name: string                      // colon-scoped lookup name
  take?: string | LinkMesh          // expected params shape
  tree: FoldNode[]
  save?: string
}
```

### Hash. dynamic-key record

```ts
type Hash = { form: 'hash'; name: string; like: Link; load?, save? }
```

### List. homogeneous list

```ts
type List = { form: 'list'; name: string; like: Link; load?, save? }
```

## Book

```ts
type Book = {
  host?: string
  name?: string
  cast?: Cast[]                                          // declarations
  call?: Record<string, (input, context?) => unknown>    // hook table
  code?: Record<string, number>                          // generated CodeLink
}
```

The standard catalog ships as a Book at `code/book/index.ts`.

## Base. runtime

```ts
new Base<Code>(config?: BaseConfig)
```

```ts
type BaseConfig = {
  createElement?: ElementBuilder<unknown>     // React mode trigger
  fragment?: unknown
  component?: Record<string, unknown>
}
```

Without `createElement`, Base is in **text mode** (`base.cast` returns
strings). With it, **element mode** (returns vdom).

### Methods

| method | purpose |
|---|---|
| `base.load(book)` | bulk-register flows + folds + integer-id table |
| `base.flow(call, opts?, hook)` | register one flow handler |
| `base.call(path, args)` | invoke a flow by colon-keyed path |
| `base.cast(tree, params?)` | render a tree with params as scope |
| `base.bind(tree, params?)` | render + capture for later patching |
| `base.bindPatch(prev, patches)` | apply patches to prev.tree, re-render |
| `base.size` / `base.test(code)` | introspection |

`base.call('is:ipa:broad', { text: 'foo' })`. the leading segment
is the verb. the rest is the case path.

`base.cast(tree, { name: 'World' })`. params auto-wrap into the
scope. No need for `makeScope`.

## BindResult. captured evaluation

```ts
type BindResult = {
  tree: FoldNode
  output: unknown
  scope: Scope
  cache: Map<string, unknown>           // mark → cached output
  parents: Map<string, string>          // mark → nearest marked ancestor
}
```

Produced by `base.bind(tree, params?)`. Fed to `base.bindPatch` for
memoized re-evaluation.

## TreePatch

```ts
type TreePatch =
  | { op: 'replace', mark: string, value: Cast }
  | { op: 'remove', mark: string }
  | { op: 'insert', parent: string, key: string, value: Cast }
```

Patches address nodes by `mark`. Memoized re-evaluation invalidates
only the dirty path's ancestors. pure-side subtrees keep their cache.

## Make. codegen

```ts
const make = new Make({ link: './code/book' })
make.load(standardBook)
await make.save()
```

Reads every registered Book and emits per-`save:` directory:

| file | content |
|---|---|
| `<save>/index.ts` | TS type aliases (per-Form / per-Flow take + make) |
| `<save>/form.ts` | Zod parsers (`<TypeName>Form`, `satisfies z.ZodType<<TypeName>>`) |
| `<save>/base.ts` | runtime data (Hash / List literals, Fold trees) |
| `<base>/code.ts` | bundled `Code` aggregate + integer-id `CodeLink` table |

The `Code` aggregate is the kysely-DB equivalent. colon-keyed
entries (`'flow:is:ipa:broad'`) typed for end-to-end inference
through `new Base<Code>()`.

## Compile pass. make ↔ wake

`compile(tree, codeTable)` rewrites `call` nodes from the make form
(authored, identity in `name + case`) to the wake form (runtime-ready,
identity in `code: number`, args under `bind`).

```ts
const authored = make.eq(make.read('status'), 'on')
// → { form: 'call', name: 'eq', a: {…}, b: 'on' }

const wake = compile(authored, CodeLink)
// → { form: 'call', code: 1, bind: { a: {…}, b: 'on' } }

const back = decompile(wake, buildDecodeTable(CodeLink))
// → original `authored` shape
```

Both flavors render through `base.cast` transparently. `mark` (UUID
v7) survives both directions for editor identity.

`buildDecodeTable(codeTable)` derives the inverse table.

## Standard catalog

Ten verbs ship by default. Extend with your own Book.

| verb | returns | purpose | examples |
|---|---|---|---|
| `is` | boolean | predicates | `is:string`, `is:email`, `is:ipa:broad` |
| `has` | boolean | possession predicates | `has:prefix`, `has:key`, `has:pattern` |
| `make` | varies | transformations | `make:sum`, `make:lowercase` |
| `get` | varies | accessors / aggregates | `get:length`, `get:sum`, `get:first` |
| `format` | string | locale-aware text / number / date | `format:number`, `format:capitalized` |
| `find` | varies | async lookups | `find:record`, `find:list`, `find:count` |
| `fork` | varies | value selector (lazy) | `{ test, then, else? }` |
| `bind` | varies | let-binding (lazy) | `{ names, then }` |
| `walk` | varies | array transforms | `walk:map`, `walk:filter`, `walk:chunk` |
| `validate` | object | error-collecting test wrapper | `{ test, message?, slug? }` |

Convention: `is(not: { thing })` instead of parallel `is-not-X`
predicates. Verb set is fixed at ten. cases are open.

`fork` and `bind` are evaluated **lazily** by the walker. only the
selected branch / new scope frame walks. `find` defaults throw . 
hosts override with their own data layer.

## Lookup keys

The dispatch key for a Flow is `flow:<call>:<case>`:

| Flow | colon key | API path |
|---|---|---|
| `{ call: 'is' }` | `flow:is` | `'is'` |
| `{ call: 'is', case: 'string' }` | `flow:is:string` | `'is:string'` |
| `{ call: 'is', case: 'ipa:broad' }` | `flow:is:ipa:broad` | `'is:ipa:broad'` |

The case field can itself contain colons. the runtime treats the
whole tail as one opaque segment after the leading verb.

## Authoring layout

```
code/
  book/
    <verb>/
      make.ts        # authored declarations (Form / Flow / Fold / Hash / List)
      flow.ts        # handler implementations
      index.ts       # generated TS types (do not edit)
      form.ts        # generated Zod parsers (do not edit)
      base.ts        # generated runtime data (do not edit)
    code.ts          # generated Code aggregate + CodeLink (do not edit)
    index.ts         # the Book — aggregates per-verb + re-exports CodeLink
task/
  make.ts            # codegen entry point (calls Make.save)
```

The `save:` field on each declaration tells codegen which output
folder to emit into. Convention is to mirror the verb directory
(`save: 'is'` → `code/book/is/`).

## End-to-end example

```ts
// 1. Authored declaration
// code/book/email/make.ts
import type { Flow } from '@cluesurf/bead'

export const is_email: Flow = {
  form: 'flow',
  save: 'email',
  call: 'is',
  case: 'email',
  take: { text: { like: 'string' } },
  make: 'boolean',
}
```

```ts
// 2. Handler
// code/book/email/flow.ts
export const is_email = ({ text }: { text: string }): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
```

```ts
// 3. Book
// code/book/index.ts
import type { Book } from '@cluesurf/bead'
import * as email_flows from './email/make'
import * as email_hooks from './email/flow'
import { CodeLink } from './code'

export default {
  host: 'app',
  cast: Object.values(email_flows),
  call: email_hooks,
  code: CodeLink,
} satisfies Book

export type { Code } from './code'
```

```ts
// 4. Codegen
// task/make.ts
import { Make } from '@cluesurf/bead'
import standard from '../code/book'

await new Make({ link: './code/book' }).load(standard).save()
```

```bash
pnpm tsx task/make.ts
```

```ts
// 5. Runtime
// app.ts
import { Base } from '@cluesurf/bead'
import standard, { type Code } from './code/book'

const base = new Base<Code>()
base.load(standard)

base.call('is:email', { text: 'hi@bead.dev' })  // → true
```

```ts
// 6. Authored trees
import { make } from '@cluesurf/bead'

const validateEmail = make.fork(
  make.call('is:email', { text: make.read('input') }),
  'OK',
  'Invalid email',
)

base.cast(validateEmail, { input: 'hi@bead.dev' })  // → 'OK'
```

## React mode

```ts
import { createElement, Fragment } from 'react'

const base = new Base<Code>({ createElement, fragment: Fragment })
base.load(standard)

const tree = make.view('article', null, [
  make.view('h1', null, [make.read('title')]),
  make.walk(make.read('items'),
    make.view('li', null, [make.read('item')])
  ),
])

base.cast(tree, { title: 'Hello', items: ['a', 'b'] })
// → ReactElement (h1 + ul)
```

`component:` in the config maps view names to React components.

## Editor patches (mark identity)

```ts
const r0 = base.bind(tree, { name: 'A' })
// r0.output = 'hello A'

const r1 = base.bindPatch(r0, [
  { op: 'replace', mark: 'M-name', value: 'world' },
])
// r1.output = 'hello world'
// r0.tree untouched (immutable result)
```

Every patch identifies its target by `mark` (UUID v7 recommended).
Memoization invalidates only the dirty mark + its ancestor chain. 
unrelated subtrees reuse their cached output.

## Renderer host bindings

These names are pre-bound in scope (engine-provided):

| name | type | meaning |
|---|---|---|
| `value` | unknown | per-cell evaluation value |
| `record` | object | record-level evaluation value |
| `now` | string | ISO 8601 UTC timestamp at evaluation start |
| `today` | string | YYYY-MM-DD UTC date |
| `locale` | string | BCP 47 locale |
| `viewer` | string | optional viewer record id |
| `viewer_roles` | string[] | optional viewer roles |

User-bound variables come from `walk` iterators (any of the three
cases) and from explicit `bind` calls.

## Builder reference

`make.*`. pure JSON construction. No runtime, no scope.

| group | builders |
|---|---|
| native pass-through | `integer, naturalNumber, number, boolean, date` |
| structural | `text, list, hash, join, find, fold` |
| reads | `reference, read, path` (alias of read), `variable, field, idx, slice` |
| calls | `call, eq, ne, gt, gte, lt, lte, in, negate, and, or, isNull, isEmpty, count, sum, mean, min, max, plural, length, formatNumber, currency, percent, formatDate, formatTime, relative` |
| control flow | `fork, switch, match, case, value, test, otherwise, pick, walk, walkTest, walkSize` |
| views | `view` |
| higher-order | `pluralCases, selectCases` |
| compile pass | `promote` (auto-wrap) |

Standalone exports (rendering happens through `base.cast`, not these):

| export | purpose |
|---|---|
| `Base, Make, BaseConfig, BindResult, TreePatch` | runtime + codegen + envelope types |
| `compile, decompile, buildDecodeTable, CodeTable, DecodeTable` | wake-form pipeline |
| `Cast, Form, Flow, Fold, Hash, List, Book, Code, Link, LinkMesh` | schema types |
| `*Primitive` types | one per AST form |
| `RESERVED_CAST_KEYS` | runtime introspection |

## Identity (`mark`)

Every editable Cast can carry an optional `mark` (UUID v7 recommended):

- The editor tracks a Cast across edits.
- The compile cache invalidates by mark.
- The runtime memoizes by mark.
- The element renderer uses mark as a vdom key when present.

`mark` survives `compile` and `decompile`. Patches always target by
mark.

## Round-trip guarantees

- `make.compile(tree, codeTable)` then `make.decompile(wake, decodeTable)` returns a structurally equal tree.
- `JSON.stringify(tree)` then `JSON.parse(...)` is sound (trees are pure data).
- `base.bind(tree)` then `base.bindPatch(prev, [])` returns the same `output`.
- `mark` survives every round-trip.

## What bead is NOT

- A general-purpose programming language. The catalog verbs are the
  ceiling. if you need raw arbitrary computation, evaluate JS at
  the host boundary and pass results in via `params`.
- A markup parser. Bead is the JSON shape. conversion from
  Markdown / HTML / etc. happens upstream.
- A query engine. `find` is a typed dispatch contract. the host
  implements the actual data layer.
- An authentication layer. Permissions / authorization are host
  concerns. bead doesn't read auth state.
- A reactive system. Patches are explicit (`base.bindPatch`). no
  observers or signals.

## File layout reference

| path | role |
|---|---|
| `code/form/` | type definitions (`Cast`, `Form`, `Flow`, `Book`, …) |
| `code/fold/` | AST types + `make.*` builders + compile pass |
| `code/fold/render/` | text + element renderers (internal. go through `base.cast`) |
| `code/base/` | `Base` runtime class, `BindResult`, `TreePatch` |
| `code/book/` | the standard catalog (10 verbs, declarations + handlers) |
| `code/make/` | codegen pipeline (`Make` class + per-stream emit) |
| `code/index.ts` | public entry point |
| `note/` | this spec + roadmap + examples |
