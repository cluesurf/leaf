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
// task/save.ts — codegen
import { Make } from '@cluesurf/calm/make'
import standard from './code/base'

await new Make({ link: 'code/base' }).book(standard).save()
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

Plus utility shapes: `Hash` (record with dynamic keys), `List`
(homogeneous list), `Fold` (tree-shaped Form for documents), `Find`
(query filter).

## Codegen

```
authored                    generated
────────                    ─────────
code/base/<verb>/make.ts    code/base/<verb>/index.ts   (TS types)
code/base/<verb>/flow.ts    code/base/<verb>/form.ts    (Zod parsers)
                            code/base/<verb>/base.ts    (literal data)
                            code/base/code.ts           (Code aggregate
                                                         + CodeLink ids)
```

`pnpm make:base` runs `task/save.ts` → invokes `Make.save()` → walks
every registered Book → writes the four output streams.

Each generated entry comes paired:

```ts
export type IsIpaBroadTake = { text: string }
export type IsIpaBroad     = boolean

export const IsIpaBroadTakeForm = z.object({
  text: z.string(),
}) satisfies z.ZodType<IsIpaBroadTake>
export const IsIpaBroadForm = z.boolean()
  satisfies z.ZodType<IsIpaBroad>
```

The bundled `code/base/code.ts` aggregates every entry under its
colon-key:

```ts
import type { IsIpaBroad, IsIpaBroadTake } from './is'
// ...

export type Code = {
  'flow:is:ipa:broad': { take: IsIpaBroadTake; make: IsIpaBroad }
  // ...
}

export const CodeLink = {
  'flow:is:ipa:broad': 18,
  // ...
} as const
```

## Runtime

`Base<Code>` is generic over the bundled type. Every `base.flow(...)`
registration and `base.call(...)` dispatch typechecks against `Code`:

```ts
const base = new Base<Code>()

// Register one handler at a time
base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
  /^[\p{L}\p{M}]+$/u.test(text),
)

// Or bind a whole Book in one call
base.bind(standard, hooks, CodeLink)

// Typed dispatch — full inference on `text` and the return type
base.call('is', { base: 'ipa', case: 'broad', text: 'fəˈnɛtɪk' })

// Compiled-form dispatch through CodeLink integer ids
base.call(CodeLink['flow:is:ipa:broad'], { text: 'fəˈnɛtɪk' })
```

## Standard catalog

Five verbs ship by default:

| verb     | purpose                                          |
| -------- | ------------------------------------------------ |
| `is`     | predicates (`is_string`, `is_ipa_broad`, …)      |
| `make`   | transformations (`make_sum`, `make_lowercase`)   |
| `get`    | accessors / aggregates (`get_length`, `get_sum`) |
| `has`    | possession predicates (`has_prefix`, `has_key`)  |
| `format` | locale-aware text/number/date formatting         |

71 flows total, each with TS types + Zod parsers + handler
implementations.

## Project structure

```
calm/code/
  form/                   # schema DSL — Form / Flow / Link / LinkMesh
  fold/                   # render-tree DSL (flow.* builders + renderers)
  make/                   # the Make codegen class
  runtime/                # the Base runtime class
  base/                   # the standard catalog
    is/         { make.ts, flow.ts, index.ts, form.ts }
    make/       { make.ts, flow.ts, index.ts, form.ts }
    get/        { make.ts, flow.ts, index.ts, form.ts }
    has/        { make.ts, flow.ts, index.ts, form.ts }
    format/     { make.ts, flow.ts, index.ts, form.ts }
    code.ts                # bundled Code type + CodeLink table
    index.ts               # the standard Book + hooks
```

`code/fold/` powers authored render trees — `flow.*` builders produce
JSON ASTs that `renderText` turns into strings and `renderElement` turns
into vdom elements (React, Preact, any `createElement`-compatible
factory).

## Spec

Full design notes live in [`./note/`](./note/):

- [`goals.md`](./note/goals.md) — the why
- [`architecture.md`](./note/architecture.md) — the four core pieces
- [`schema.md`](./note/schema.md) — reserved props on every declaration
- [`structure.md`](./note/structure.md) — vocabulary spine
- [`primitives.md`](./note/primitives.md) — Form and Flow in depth
- [`ast.md`](./note/ast.md) — every node form
- [`runtime.md`](./note/runtime.md) — engine pipeline
- [`codegen.md`](./note/codegen.md) — Make class + outputs
- [`types.md`](./note/types.md) — TypeScript surface
- [`catalog.md`](./note/catalog.md) — standard catalog
- [`find.md`](./note/find.md) — query filters
- [`editor.md`](./note/editor.md) — editor protocol
- [`book.md`](./note/book.md) — the Book _type_

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
