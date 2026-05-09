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

Bead is a JSON template language. You write trees of values, references,
conditionals, loops, and views; the runtime renders them to text or to
vdom elements (React, Preact, anything h-shaped).

It comes with a typed catalog. You declare your verbs and types as Forms
/ Flows, run codegen, and get strongly-typed runtime dispatch with
compiled integer ids for hot paths.

The same tree shape works as a localization template, a computed label,
a control-flow expression, or a small UI component. Trees are pure data,
safe to ship over the wire and store as JSON.

## Why you need this

| building | what bead gives you |
|---|---|
| **Template docs editor** (Notion-class) | one tree shape for blocks, inline marks, embeds, and database views; per-mark patches via `bindPatch` so the editor updates in O(dirty) not O(tree) |
| **Localization layer** | locale-aware `format(*)`, CLDR plural categories, gender select, RTL handling, runs through the same `make.render` |
| **Read-only content site** (blog, docs, wiki) | author once as JSON, render to HTML server-side and to React/Preact client-side from the same tree |
| **Form validation rules** | `validate` flow + `is(*)`/`has(*)` predicates compose into trees that round-trip to JSON for storage |
| **Constraint engine** for user-authored data | tree-form rules ship over the wire; the host's `Base` evaluates them sandboxed against a host scope |
| **Email / SMS templates** | text renderer spits strings; locale + scope thread through; no DOM dependency |
| **Computed columns / formulas** in a database | `make.call('formula', ...)` compiled to integer-dispatched ops; safe arithmetic / string / date catalog |
| **AI-generated documents** | LLM emits JSON conforming to your `Code` schema; Zod parsers from codegen reject malformed output before it reaches the renderer |
| **Config-driven UIs** | declare views + bindings as data; the runtime hydrates against any vdom |
| **Reusable doc fragments** (snippets, partials) | `Fold` declarations registered in the Book; reference by name with `make.fold(name, { …params })` and the runtime substitutes inline |
| **Editor with undo / time-travel** | every Cast carries an optional `mark` (UUID v7); patches address by mark; cached outputs survive across patch chains |
| **Wire-format-stable bytecode** | `compile(tree, codeTable)` rewrites string verbs to integer ids for fast dispatch; `decompile` reverses for editor inspection |

You don't need bead for trivial templating (template literals will do).
Reach for it when the **same tree** has to render in multiple targets,
ship over the wire, survive editor patches, and resolve verbs against a
typed catalog.

## Installation

```
pnpm add @cluesurf/bead
yarn add @cluesurf/bead
npm i @cluesurf/bead
```

## Example

Author a Book of Forms / Flows, generate the bundled `Code` type, then
dispatch flows through the typed runtime:

```ts
// code/base/is/make.ts — authored declarations
import type { Flow } from '@cluesurf/bead'

export const isIPABroad: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'ipa',
  case: 'broad',
  take: { text: { like: 'string' } },
  make: 'boolean',
}
```

```ts
// code/base/is/flow.ts — handler
export const isIPABroad = ({ text }: { text: string }): boolean =>
  /^[\p{L}\p{M}ˈˌːʼʰ]+$/u.test(text)
```

```ts
// app.ts — runtime
import { Base } from '@cluesurf/bead'
import standard, { type Code } from './code/book'

const base = new Base<Code>()
base.load(standard)

base.call('is', { base: 'ipa', case: 'broad', text: 'fəˈnɛtɪk' })
// → true
```

`pnpm make:base` runs the codegen — emits the `Code` type, integer-id
table, and per-verb Zod parsers from the registered Books.

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

Five verbs ship by default:

| verb     | purpose                                          |
| -------- | ------------------------------------------------ |
| `is`     | predicates (`is_string`, `isIPABroad`, …)        |
| `make`   | transformations (`make_sum`, `make_lowercase`)   |
| `get`    | accessors / aggregates (`get_length`, `get_sum`) |
| `has`    | possession predicates (`has_prefix`, `has_key`)  |
| `format` | locale-aware text/number/date formatting         |

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
