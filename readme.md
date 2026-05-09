<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<h3 align='center'>@cluesurf/bead</h3>
<p align='center'>
  Trees as JSON ⋈
</p>

<br/>
<br/>
<br/>

## What is bead

Bead is **not a templating mini-language**. It's a JSON system for
building app features where users author rich documents or rules
and you save their work as JSON.

The runtime renders that JSON to text or vdom (React, Preact, any
`createElement`-shaped factory). Trees are pure data, safe to ship
over the wire and store in your database, with strongly-typed runtime
dispatch via codegen and a sandbox so user-supplied logic can't
reach the host.

## Why you need this

| building | what bead gives you |
|---|---|
| Notion-class doc editor | one tree shape for blocks / inline / embeds / database views. Per-mark `bindPatch` updates only dirty subtrees |
| Multi-target rendering (HTML + React + email + AMP) | author once as JSON. Text and vdom renderers share the same tree |
| Localization | locale-aware `format(*)`, CLDR plurals, gender select, RTL |
| User- or AI-supplied logic, sandboxed | rules + formulas run against a host scope. No `eval`, no DOM, no network |

## Installation

```
pnpm add @cluesurf/bead
```

## Quick example

Hello world:

```ts
import { make, Base } from '@cluesurf/bead'

const greeting = make.text('Hello, ', make.read('name'), '!')

const base = new Base()
base.cast(greeting, { name: 'World' })
// → 'Hello, World!'
```

A bit richer. pluralization + iteration + join:

```ts
const summary = make.text(
  make.read('user'),
  ' has ',
  make.read('count'),
  ' ',
  make.pluralCases('count', { one: 'message', other: 'messages' }),
  '. Tags: ',
  make.join(', ', make.walk(make.read('tags'), make.read('item'))),
  '.',
)

base.cast(summary, {
  user: 'Lance',
  count: 3,
  tags: ['urgent', 'review'],
})
// → 'Lance has 3 messages. Tags: urgent, review.'
```

## Usage

End-to-end. A bead host has four files:

```
code/
  book/
    email/
      make.ts     # 1. authored declarations
      flow.ts     # 2. handler implementations
    index.ts      # 3. the Book (aggregates groups)
task/
  make.ts         # 4. codegen entry
```

**1. Authored declarations**. declare a `Form`, `Flow`, `Fold`,
`Hash`, or `List`. The `save:` field tells codegen which output
folder to emit into.

```ts
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

**2. Handler**. function per Flow, named exactly like the
declaration.

```ts
// code/book/email/flow.ts
export const is_email = ({ text }: { text: string }): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
```

**3. Aggregate the Book.**

```ts
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

**4. Run codegen.**

```ts
// task/make.ts
import { Make } from '@cluesurf/bead'
import standard from '../code/book'

await new Make({ link: './code/book' }).load(standard).save()
```

```bash
pnpm tsx task/make.ts
```

Codegen emits per-group `index.ts` (TS types), `form.ts` (Zod
parsers), and the bundled `code/book/code.ts` (`Code` aggregate +
`CodeLink` integer table).

**5. Run.**

```ts
// app.ts
import { Base } from '@cluesurf/bead'
import standard, { type Code } from './code/book'

const base = new Base<Code>()
base.load(standard)

base.call('is:email', { text: 'hi@bead.dev' })  // → true
```

The `<Code>` generic gives end-to-end type inference: every
`base.call(...)` is checked for verb / case existence and typed
args + return.

**6. Author trees + render.**

```ts
import { make } from '@cluesurf/bead'

const tree = make.fork(
  make.call('is:email', { text: make.read('input') }),
  'OK',
  'Invalid email',
)

base.cast(tree, { input: 'hi@bead.dev' })  // → 'OK'
```

For production hot paths, run `compile(tree, CodeLink)` once and
store the wake form (integer ids, args under `bind:`). `base.cast`
accepts both flavors transparently.

## Architecture

| name | shape | role |
|---|---|---|
| `Book` | type | a published bundle: `{ host?, name?, cast?, call?, code? }` |
| `Code` | type | generated registry: every entry's colon-key → its TS type |
| `Base` | class | runtime that loads books, dispatches calls, and casts trees |
| `Make` | class | codegen orchestrator that loads books and emits artifacts |

A `Book` carries three slots:

| slot | shape | role |
|---|---|---|
| `cast` | `Cast[]` | the declarations (Form / Flow / Fold / Hash / List) |
| `call` | `Record<string, Hook>` | runtime hook implementations |
| `code` | `Record<string, number>` | generated `CodeLink` integer-id table |

Two type primitives drive the schema layer:

| primitive | declares | identity |
|---|---|---|
| `Form` | a data shape | `(name, flow?, case?)` |
| `Flow` | a function | `(call, case?)` |

Plus utility shapes: `Hash`, `List`, `Fold`, `Find`.

## Standard catalog

Ten verbs ship by default. Hosts extend with their own domain flows.

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
| `validate` | object | error-collecting test wrapper | `{ test, message? }` |

Negation composes via `is(not: { thing })` rather than parallel
`is-not-X` flows. The verb set is fixed. cases are open.

`fork` and `bind` evaluate **lazily**. only the selected branch /
new scope frame walks. `find` defaults throw. hosts override with
their data layer.

## AST primitives

Native scalars (`string` / `number` / `boolean` / `Date` / `null`)
are first-class fold-tree leaves. no wrapping required. Tagged
structural nodes carry a `form:` discriminant:

```
text | list | hash | join | reference | read | call |
fork | switch | match | case | pick | walk |
find | fold | view
```

`walk` has three case-discriminated variants: `walk(list)` (for-each,
default `make.walk(list, hook)`), `walk(test)` (while-style,
`make.walkTest(test, hook)`), and `walk(size)` (counted range,
`make.walkSize(start, end, hook)`).

For separator-between-iterations, wrap a walk with `make.join`:

```ts
make.join(', ', make.walk(items, make.read('item')))
```

## Make ↔ Wake compile pass

Calls have two flavors. **Make form** (`name`, `case?`, flat args)
is what authors write. **Wake form** (`code: number`, `bind:
{…args}`) is what the runtime evaluates.

```ts
import { make, compile, decompile, buildDecodeTable } from '@cluesurf/bead'
import { CodeLink } from './code/book'

const authored = make.eq(make.read('status'), 'on')
// → { form: 'call', name: 'eq', a: {…}, b: 'on' }

const compiled = compile(authored, CodeLink)
// → { form: 'call', code: 1, bind: { a: {…}, b: 'on' } }

const back = decompile(compiled, buildDecodeTable(CodeLink))
// → original `authored` shape
```

Both flavors render identically. The runtime short-circuits via
`code` when present and falls back to `(call, case)` lookup
otherwise. The optional `mark?: string` (UUID v7 recommended) on
every Call survives both directions, so editor identity and
memoization keys stay stable across compile.

## React mode

```ts
import { createElement, Fragment } from 'react'

const base = new Base<Code>({ createElement, fragment: Fragment })
base.load(standard)

const tree = make.view('article', null, [
  make.view('h1', null, [make.read('title')]),
])

base.cast(tree, { title: 'Hello' })
// → ReactElement
```

`component:` in the config maps view names to React components.

## Editor patches

```ts
const r0 = base.bind(tree, { name: 'A' })
// r0.output = 'hello A'

const r1 = base.bindPatch(r0, [
  { op: 'replace', mark: 'M-name', value: 'world' },
])
// r1.output = 'hello world'
// r0.tree untouched (immutable result)
```

Patches address by `mark`. Memoization invalidates only the dirty
mark + its ancestor chain. unrelated subtrees reuse cached output.

## Spec

The complete reference lives at [`./note/spec.md`](./note/spec.md).
It supersedes the older docs in `./note/` and is the source of truth
for AST primitives, lookup keys, codegen artifacts, and runtime
contracts.

## License

MIT

## ClueSurf

Made by [ClueSurf](https://clue.surf), meditating on the universe ¤.
Follow the work on [YouTube](https://youtube.com/@cluesurf),
[X](https://x.com/cluesurf),
[Instagram](https://instagram.com/cluesurf),
[Substack](https://cluesurf.substack.com),
[Facebook](https://facebook.com/cluesurf), and
[LinkedIn](https://linkedin.com/company/cluesurf), and browse more of
our open-source work here on [GitHub](https://github.com/cluesurf).
