<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<h3 align='center'>@cluesurf/bead</h3>
<p align='center'>
  A Template Language ⋈
</p>

<br/>
<br/>
<br/>

## What is bead

Bead is **not a pretty templating mini-language**. It's a simplified,
easy-to-grok **JSON system** for building app features where end users
author rich documents or rules and you save their work to your database
as JSON. The runtime renders that JSON to text or vdom (React, Preact,
anything h-shaped), and you extend it with your own components, hooks,
and catalog flows.

The pitch: trees are pure data, safe to ship over the wire and store as
JSON, with strongly-typed runtime dispatch via codegen and a sandbox so
user-supplied logic can't reach the host runtime.

## Why you need this

| building                                                | what bead gives you                                                                                                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Notion-class doc editor**                             | one tree shape for blocks / inline / embeds / database views; per-mark `bindPatch` updates only dirty subtrees                                                                 |
| **Multi-target rendering** (HTML + React + email + AMP) | author once as JSON; text and vdom renderers share the same tree                                                                                                               |
| **Localization**                                        | locale-aware `format(*)`, CLDR plurals, gender select, RTL — same render path                                                                                                  |
| **User- or AI-supplied logic, sandboxed**               | tree-form rules + formulas run against a host-controlled scope. No `eval`, no DOM, no network. Zod parsers (from codegen) reject malformed input before it reaches the runtime |

You don't need bead for trivial templating. Reach for it when the same
tree has to render in multiple targets, ship over the wire, survive
editor patches, sandbox user-supplied logic, and resolve verbs against a
typed catalog you control.

## Installation

```
pnpm add @cluesurf/bead
yarn add @cluesurf/bead
npm i @cluesurf/bead
```

## Quick Example

Hello world:

```ts
import { make, makeScope, renderText } from '@cluesurf/bead'

const greeting = make.templateString('Hello, ', make.read('name'), '!')

renderText(greeting, { scope: makeScope({ name: 'World' }) })
// → 'Hello, World!'
```

A bit richer — pluralization + iteration + join:

```ts
const summary = make.templateString(
  make.read('user'),
  ' has ',
  make.read('count'),
  ' ',
  make.pluralCases('count', { one: 'message', other: 'messages' }),
  '. Tags: ',
  make.join(', ', make.walk(make.read('tags'), make.read('item'))),
  '.',
)

renderText(summary, {
  scope: makeScope({
    user: 'Lance',
    count: 3,
    tags: ['urgent', 'review'],
  }),
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

**1. Authored declarations** — declare a `Form`, `Flow`, `Fold`, `Hash`,
or `List`. The `save:` field tells codegen which output folder to emit
into.

```ts
// code/book/email/make.ts
import type { Flow } from '@cluesurf/bead'

export const is_email: Flow = {
  form: 'flow',
  save: 'email',
  call: 'is',
  base: 'email',
  take: { text: { like: 'string' } },
  make: 'boolean',
}
```

**2. Handler** — function per Flow, named exactly like the declaration.
Args + return type derive from `take` / `make`.

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
import { CodeLink } from './code' // generated in step 4

export default {
  host: 'app',
  cast: Object.values(email_flows),
  call: email_hooks,
  code: CodeLink,
} satisfies Book

export type { Code } from './code'
```

**4. Run codegen** — emits per-group `index.ts` (TS types), `form.ts`
(Zod parsers), and the bundled `code/book/code.ts` (`Code` aggregate

- `CodeLink` integer table).

```ts
// task/make.ts
import { Make } from '@cluesurf/bead'
import standard from '../code/book'

await new Make({ link: './code/book' }).load(standard).save()
```

```bash
pnpm tsx task/make.ts
```

**5. Run** — load the Book into a `Base` runtime and call:

```ts
// app.ts
import { Base } from '@cluesurf/bead'
import standard, { type Code } from './code/book'

const base = new Base<Code>()
base.load(standard)

base.call('is', { base: 'email', text: 'hi@bead.dev' }) // → true
```

The `<Code>` generic gives TS end-to-end inference: every
`base.call(...)` is checked for verb / base / case existence and typed
args + return.

**6. Author trees + render** — author trees from your editor (or build
them with `make.*`); store as JSON; render via `base.cast` or
`renderText`:

```ts
import { make } from '@cluesurf/bead'

const tree = make.fork(
  make.call('is', { base: 'email', text: make.read('input') }),
  'OK',
  'Invalid email',
)

base.cast(tree, makeScope({ input: 'hi@bead.dev' })) // → 'OK'
```

For production hot paths, run `compile(tree, CodeLink)` once and store
the wake form (integer ids, args under `bind:`) — `base.cast` accepts
both flavors transparently.

## Architecture

| name   | shape | role                                                            |
| ------ | ----- | --------------------------------------------------------------- |
| `Book` | type  | a published bundle: `{ host?, name?, cast?, call?, code? }`     |
| `Code` | type  | generated registry: every entry's colon-key → its TS type       |
| `Base` | class | runtime; loads books, registers flow handlers, dispatches calls |
| `Make` | class | codegen orchestrator; loads books, emits artifacts              |

A `Book` carries three slots:

| slot   | shape                    | role                                  |
| ------ | ------------------------ | ------------------------------------- |
| `cast` | `Cast[]`                 | the declarations (Form / Flow / …)    |
| `call` | `Record<string, Hook>`   | runtime hook implementations          |
| `code` | `Record<string, number>` | generated `CodeLink` integer-id table |

`make.load(book)` registers a Book with the codegen orchestrator.
`base.load(book)` wires every Flow's hook into the runtime in one call
(plus integer-id mirrors when `book.code` is present).

Two type primitives drive the schema layer:

| primitive | declares     | identity tuple         |
| --------- | ------------ | ---------------------- |
| `Form`    | a data shape | `(cast, call?, case?)` |
| `Flow`    | a function   | `(call, base?, case?)` |

Plus utility shapes: `Hash`, `List`, `Fold`, `Find`.

## Standard catalog

Ten verbs ship by default. They cover the bulk of what user-authored
trees need; hosts extend with their own domain flows.

| verb       | returns | purpose                                                 | examples                                |
| ---------- | ------- | ------------------------------------------------------- | --------------------------------------- |
| `is`       | boolean | predicates (the bulk of the catalog)                    | `is_string`, `is_email`, `is_ipa_broad` |
| `has`      | boolean | possession predicates (a list / map "has X")            | `has_prefix`, `has_key`, `has_pattern`  |
| `make`     | varies  | transformations (string ops, arithmetic, normalize)     | `make_sum`, `make_lowercase`            |
| `get`      | varies  | accessors and aggregates                                | `get_length`, `get_sum`, `get_first`    |
| `format`   | string  | locale-aware text / number / date / currency            | `format_number`, `format_relative`      |
| `find`     | varies  | async lookups (record fetch, list, count, enum members) | `find_record`, `find_list`              |
| `if`       | varies  | value selector (`{ test, then, else? }`)                | one form                                |
| `bind`     | varies  | let-binding (`{ names, then }`)                         | one form                                |
| `walk`     | varies  | array transforms (map / filter / reduce / chunk)        | `walk_map`, `walk_filter`, `walk_chunk` |
| `validate` | object  | error-collecting wrapper around any test                | one form                                |

Negation composes via `is(not: { thing: <X> })` rather than parallel
`is-not-X` flows. The verb set is fixed at ten; bases and cases are
open. Add new bases / cases by registering Flow declarations in your own
Book — codegen wires them into the typed `Code` registry automatically.

`if` / `bind` are evaluated **lazily** by the AST walker (only the
selected branch / new scope frame walks) so they behave like real
control-flow primitives, not eager-arg function calls. `find` handlers
default to throwing — hosts override with their own data layer.

## Fold trees — the render DSL

`code/fold/` adds an authored render-tree DSL. The `make.*` builders
produce JSON ASTs; `make.renderText` turns them into strings,
`renderElement` turns them into vdom elements (React, Preact, any
`createElement`-compatible factory).

```ts
import { make } from '@cluesurf/bead'

const tree = make.templateString(
  'You have ',
  make.read('count'),
  ' ',
  make.pluralCases('count', { one: 'message', other: 'messages' }),
)

make.render(tree, { scope: make.scope({ count: 3 }) })
// → 'You have 3 messages'
```

Native scalars (`string` / `number` / `boolean` / `Date`) are
first-class fold-tree leaves — no wrapping required. Tagged structural
nodes carry a `form:` discriminant: `template_string`, `list`, `hash`,
`read`, `reference`, `fork`, `switch`, `match`, `case`, `pick`, `walk`,
`view`, `call`.

`walk` has three case-discriminated variants: `walk(list)` (for-each
over a collection — the default `make.walk(list, hook)`), `walk(test)`
(while-style — `make.walkTest(test, hook)`), and `walk(size)` (counted
range — `make.walkSize(start, end, hook)`).

## Make ↔ Wake compile pass

Calls have two flavors. **Make form** (`name`, `base?`, `case?`, flat
args) is what authors write and what's stored at rest. **Wake form**
(`code: number`, `bind: {…args}`) is what the runtime evaluates.

```ts
import { make } from '@cluesurf/bead'
import { CodeLink } from './code/book'

const authored = make.eq(make.read('status'), 'on')
// → { form: 'call', name: 'eq', a: {…}, b: 'on' }

const compiled = make.compile(authored, CodeLink)
// → { form: 'call', code: 1, bind: { a: {…}, b: 'on' } }

const back = make.decompile(compiled, make.buildDecodeTable(CodeLink))
// → original `authored` shape
```

Both flavors render identically. The runtime short-circuits via `code`
when present and falls back to `(name, base, case)` lookup otherwise.
The optional `mark?: string` (UUID v7 recommended) on every Call
survives both directions, so editor identity and memoization keys stay
stable across compile.

## Spec

Full design notes live in [`./note/`](./note/):

- [`goals.md`](./note/goals.md) — the why
- [`architecture.md`](./note/architecture.md) — the four core pieces
- [`schema.md`](./note/schema.md) — reserved props on every declaration
- [`primitives.md`](./note/primitives.md) — Form and Flow in depth
- [`runtime.md`](./note/runtime.md) — engine pipeline
- [`codegen.md`](./note/codegen.md) — Make class + outputs
- [`catalog.md`](./note/catalog.md) — standard catalog
- [`editor.md`](./note/editor.md) — editor protocol

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
