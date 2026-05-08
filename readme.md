<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<h3 align='center'>@cluesurf/calm</h3>
<p align='center'>
  A Template Composer ⋈
</p>

<br/>
<br/>
<br/>

## Installation

```
pnpm add @cluesurf/calm
yarn add @cluesurf/calm
npm i @cluesurf/calm
```

## Example

Author a Book of Forms / Flows, generate the bundled `Code` type, then
dispatch flows through the typed runtime:

```ts
// code/base/is/make.ts — authored declarations
import type { Flow } from '@cluesurf/calm'

export const is_ipa_broad: Flow = {
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
export const is_ipa_broad = ({ text }: { text: string }): boolean =>
  /^[\p{L}\p{M}ˈˌːʼʰ]+$/u.test(text)
```

```ts
// app.ts — runtime
import { Base } from '@cluesurf/calm'
import standard, { hooks, CodeLink, type Code } from './code/base'

const base = new Base<Code>()
base.bind(standard, hooks, CodeLink)

base.call('is', { base: 'ipa', case: 'broad', text: 'fəˈnɛtɪk' })
// → true
```

`pnpm make:base` runs the codegen — emits the `Code` type, integer-id
table, and per-verb Zod parsers from the registered Books.

## Architecture

| name   | shape | role                                                          |
| ------ | ----- | ------------------------------------------------------------- |
| `Book` | type  | a published bundle of declarations (`host`, `name`, `base[]`) |
| `Code` | type  | generated registry: every entry's colon-key → its TS type     |
| `Base` | class | runtime; registers flow handlers AND dispatches calls         |
| `Make` | class | codegen orchestrator; reads Books, emits artifacts            |

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
| `is`     | predicates (`is_string`, `is_ipa_broad`, …)      |
| `make`   | transformations (`make_sum`, `make_lowercase`)   |
| `get`    | accessors / aggregates (`get_length`, `get_sum`) |
| `has`    | possession predicates (`has_prefix`, `has_key`)  |
| `format` | locale-aware text/number/date formatting         |

`code/fold/` adds an authored render-tree DSL — `flow.*` builders
produce JSON ASTs that `renderText` turns into strings and
`renderElement` turns into vdom elements (React, Preact, any
`createElement`-compatible factory).

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
