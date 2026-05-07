# TypeScript types

How calm exposes the registered Flows as a fully-typed surface
to host code. Two strategies, one combined system: form-DSL
codegen for module-local types, plus a kysely-style bundled
registry for global lookup.

## Goal

A user opens a `Calm` instance generic over a `Base`
type, then registers Flow handlers — and TypeScript
typechecks every call against the base.

```typescript
import { Calm } from '@cluesurf/calm'
import type { Base } from '@cluesurf/calm/base'

const calm = new Calm<Base>()

calm.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
  Array.from(text).every(is_ipa_symbol),
)
```

TypeScript should:

- Recognize `'is'` as a valid Flow name in `Base`.
- Recognize `'ipa'` as a valid base under `is`.
- Recognize `'broad'` as a valid case under `is.ipa`.
- Type `text` as `string` (from the Flow's `take.text.like`).
- Require the handler to return `boolean` (from the Flow's
  `like`).

All inferred from the `Base` type passed at `Base`
instantiation. No hand-written overloads, no manual `.d.ts`
files, no separate type declarations.

## What runtime needs vs what editor needs

Two different surfaces, two different shapes of metadata:

| concern | runtime | editor |
|---|---|---|
| `Base` type | yes (typechecks `calm.flow(...)`) | yes (typechecks editor host code) |
| `BaseCompiled` (int-keyed) | yes (dispatch table) | no |
| `FlowCodeMap` (string → int) | yes (compile step) | yes (compile step) |
| Form schemas (`take` shapes as data) | no | yes (render input widgets, validate args, draw the editor UI) |
| Flow handlers | yes | no (or stubbed for preview) |

**The runtime only needs types + handlers + the code map.**
It dispatches `(name, base, case)` triples through the code
map to handler indices and runs them with arg objects. It
never inspects Form schemas at runtime.

**The editor needs the schemas as data** because that's how
it knows what input widget to render per flow (a slug field
gets a slug input, a list field gets a chip group, etc.). The
schemas live in `code/form/` source files; the editor loads
them as JSON.

A pure-runtime build (e.g., a server-side template renderer)
can ship without any Form schemas at all — just the
`Base` type, the compiled-handler array, and the code
map. A full authoring environment (browser editor) ships
schemas alongside.

This is why `calm.form(...)` and `calm.flow(...)` are
distinct calls. Runtime hosts that don't need the editor
surface call only `calm.flow(...)` and skip Forms entirely.

## Strategy 1 — module-scoped types (form-DSL pattern)

`@cluesurf/form` already generates TypeScript types from schema
declarations: every `Form` produces a type with the same name,
exported from the module that owns the schema. The convention:

- A schema named `language_string` in
  `code/form/language.ts` produces a type called
  `LanguageString` (or `language_string`, snake_case
  preserved) exported from the same module.
- Cross-module references are by import path. `Form A` referencing
  `Form B` in its `link` field generates `import { B } from
  '...'` in `A`'s generated type.

Calm inherits this pattern verbatim for both `Form` and `Flow`
schemas. Each Flow's `take` and `like` annotations compile to
TypeScript types, exported from the module that registers the
Flow.

```typescript
// code/flow/is/ipa/broad/schema.ts
export const is_ipa_broad: Flow = {
  name: 'is',
  base: 'ipa', case: 'broad',
  like: 'boolean',
  take: { text: { like: 'string' } },
}

// generated alongside, by the form-DSL codegen:
export type IsIpaBroadInput = { text: string }
export type IsIpaBroadOutput = boolean
```

Names are **globally unique within the package** (so codegen
doesn't need to disambiguate at import time) but **scoped per
module** (so a deck publishing its own Flows doesn't collide
with the base catalog).

This works for module-level references — when a host imports
the base catalog, types ride along.

## Strategy 2 — kysely-style bundled registry (two layers)

Module-scoped types alone are awkward for `calm.flow(...)`,
because that call has no compile-time knowledge of which
specific Flow it's registering. Kysely solves the same problem
for SQL with a single `Database` interface that aggregates
every table:

```typescript
interface Database {
  users: { id: string; name: string }
  posts: { id: string; user_id: string; title: string }
}

const db = new Kysely<Database>({ /* ... */ })
db.selectFrom('users').select('name')
//             ↑           ↑
//   string from Database   string from Database['users']
```

Calm applies the same idea, but in **two layers** that mirror
the editable / compiled AST split:

### Layer A — `Base` (editable, string-keyed)

What authors and the editor see. Keyed by the human-readable
`(name, base?, case?)` constant's exported underscore name (e.g. `is_ipa_broad`):

```typescript
interface Base {
  'is_string':       { take: { thing: unknown };               like: boolean }
  'is_ipa':          { take: { text: string };                 like: boolean }
  'is_ipa_broad':    { take: { text: string };                 like: boolean }
  'is_ipa_narrow':   { take: { text: string };                 like: boolean }
  'is_equal':        { take: { this: unknown; that: unknown }; like: boolean }
  'is_among':        { take: { thing: unknown; choices: unknown[] }; like: boolean }
  'make_sum':        { take: { a: number; b: number };         like: number }
  'make_lowercase':  { take: { text: string };                 like: string }
  'get_length':      { take: { text: string };                 like: number }
  'get_count':       { take: { items: unknown[] };             like: number }
  'find_record':     { take: { reference: string };            like: { id: string; record: { id: string } } }
  // ... every registered Flow
}
```

Used by:
- `calm.flow(...)` registration (TypeScript looks up the key
  to validate handler args / return type).
- The editor (looks up widget shape by triple).
- The schema editor / docs (introspection).

### Layer B — `BaseCompiled` (runtime, integer-keyed)

What the runtime evaluator sees. Keyed by integer codes
assigned at registry-finalization time:

```typescript
interface BaseCompiled {
  1:   { take: { thing: unknown };               like: boolean }   // is_string
  2:   { take: { text: string };                 like: boolean }   // is_ipa
  3:   { take: { text: string };                 like: boolean }   // is_ipa_broad
  4:   { take: { text: string };                 like: boolean }   // is_ipa_narrow
  5:   { take: { this: unknown; that: unknown }; like: boolean }   // is_equal
  6:   { take: { thing: unknown; choices: unknown[] }; like: boolean }  // is_among
  7:   { take: { a: number; b: number };         like: number }    // make_sum
  8:   { take: { text: string };                 like: string }    // make_lowercase
  9:   { take: { text: string };                 like: number }    // get_length
  10:  { take: { items: unknown[] };             like: number }    // get_count
  11:  { take: { reference: string };            like: { id: string; record: { id: string } } }  // find_record
  // ... every registered Flow, keyed by its assigned integer code
}
```

Used by:
- The runtime dispatcher (integer key into a flat handler
  array — fastest possible lookup).
- Compiled tree storage (compiled Calls carry `code: <integer>`,
  not `code: '<string>'`).
- Wire transport when a runtime ships a precompiled tree to
  another runtime.

### The mapping

A code-table accompanies the registries, mapping between the
two:

```typescript
// generated alongside the registries
interface FlowCodeMap {
  'is_string':       1
  'is_ipa':          2
  'is_ipa_broad':    3
  'is_ipa_narrow':   4
  'is_equal':        5
  // ...
}

type FlowCodeMapInverse = { [K in keyof FlowCodeMap as FlowCodeMap[K]]: K }
// → { 1: 'is_string'; 2: 'is_ipa'; ... }
```

The compile step uses `FlowCodeMap` to translate
`{ form: 'call', name: 'is', base: 'ipa', case: 'broad', ... }`
into `{ form: 'call', code: 3, ... }`. The decompile step uses
`FlowCodeMapInverse` for the reverse.

Compiled trees stored on disk are integer-keyed: smaller, faster
to hash, faster to look up. Editable trees stored on disk are
string-keyed: human-readable, diff-friendly, version-tolerant.

### Why two registries

| concern | string layer | integer layer |
|---|---|---|
| readable | yes | no |
| versionable across deploys | yes | no — codes can shift |
| diff-friendly | yes | no |
| dispatch speed | hash lookup | array index |
| storage size | larger (~30 bytes/key) | smaller (~4 bytes/key) |
| hash quality | good (long unique strings) | trivial (integer = key) |
| editor surface | yes | no |
| runtime surface | secondary | primary |

The two layers solve disjoint problems. Strings are right for
authoring; integers are right for evaluating. Base has both
and the codegen keeps them in sync.

### Code stability across versions

Integer codes are **only stable within a registry build**.
When `@cluesurf/calm` ships a new version with new Flows, the
codegen may re-number. Compiled trees from an older build
must be re-compiled (decompile → recompile) when loaded under
a newer build.

The decompile/recompile step is fast (one tree walk) and
mechanical (uses the inverse map). Hosts that store compiled
trees should also store the registry-build hash alongside; on
load mismatch, decompile-then-recompile.

### Both registries augment via `declare module`

Hosts and decks extend both registries simultaneously:

```typescript
declare module '@cluesurf/calm' {
  interface Base {
    'lookup.language': {
      take: { slug: string }
      like: { id: string; record: { id: string } }
    }
  }
}
```

The codegen step on the host's tsconfig picks up the
augmentation and assigns an integer code. The compiled-layer
type (`BaseCompiled`) and code map (`FlowCodeMap`)
extend automatically because they're projections of
`Base`.

### Combining multiple calm packages

Each calm package publishes its own `Base` schema (its
contribution to the bundled type). Hosts that combine
multiple packages get the union — but **collisions on the
same key are possible**, just like kysely with multiple
table-defining modules.

```typescript
import * as base       from '@cluesurf/calm/base'
import * as ling       from '@cluesurf/calm-linguistics/base'
import * as customBase from './my-app/base'

// All three augment Base. If 'is.iso' is defined in both
// `base` and `ling`, the later registration wins (last-write
// semantics) and TypeScript shows the merged type.
```

When two packages need to coexist without overriding each
other, the consumer renames at import time:

```typescript
// my-app/base.ts
import { is_iso as standard_is_iso } from '@cluesurf/calm/base'
import { is_iso as ling_is_iso }     from '@cluesurf/calm-linguistics/base'

export { standard_is_iso, ling_is_iso }

declare module '@cluesurf/calm' {
  interface Base {
    'standard.is.iso': /* ... */
    'ling.is.iso':     /* ... */
  }
}
```

Calm doesn't auto-namespace per-package; the consumer chooses
whether to accept the override or rename. This mirrors how
TypeScript module augmentation behaves generally — name
collisions are explicit, not magic.

The convention for a host expecting collisions: prefix
authored constants with the deck name (`@my-app/base.is.iso`)
so the bundled key stays unique without manual rename.

## How `calm.flow(...)` typechecks

The `Base` class is generic over the `Base`:

```typescript
class Calm<R = Base> {
  flow<
    Name extends FlowName<R>,
    Case extends FlowCase<R, Name>,
  >(
    name: Name,
    options: { case: Case },
    handler: FlowHandler<R, Name, Case>,
  ): void

  flow<
    Name extends BareFlowName<R>,
  >(
    name: Name,
    handler: FlowHandler<R, Name, undefined>,
  ): void
}

type FlowName<R> = {
  [K in keyof R]: K extends `${infer N}.${string}` ? N : K
}[keyof R]

type FlowCase<R, Name extends string> = {
  [K in keyof R]: K extends `${Name}.${infer C}` ? C : never
}[keyof R]

type FlowHandler<R, Name extends string, Case extends string | undefined> =
  Case extends string
    ? `${Name}.${Case}` extends keyof R
      ? (args: R[`${Name}.${Case}`]['take']) => R[`${Name}.${Case}`]['like']
      : never
    : Name extends keyof R
      ? (args: R[Name]['take']) => R[Name]['like']
      : never
```

The result: when the host writes `calm.flow('is', { case:
case: 'broad' }, handler)`, TypeScript:

1. Resolves `'is'` against `FlowName<R>`. Valid.
2. Resolves `base: 'ipa'` and `case: 'broad'` against the registered Flow. Valid.
3. Looks up `Base['is_ipa_broad'].take` → `{ text:
   string }`.
4. Looks up `Base['is_ipa_broad'].like` → `boolean`.
5. Types `handler` as `(args: { text: string }) => boolean`.

If the host typos `case: 'brad'` instead of `case: 'broad'`,
TypeScript catches it. If the handler returns `string` instead
of `boolean`, TypeScript catches it. If the handler reads an
arg called `txt` instead of `text`, TypeScript catches it.

## Extending the registry

Hosts add their own Flows, which need to extend the registry.
The pattern follows kysely's module-augmentation approach:

```typescript
// host code
import '@cluesurf/calm'

declare module '@cluesurf/calm' {
  interface Base {
    'lookup.language': {
      take: { slug: string }
      like: { id: string; record: { id: string } }
    }
    'lookup.font': {
      take: { family: string; weight: number }
      like: { id: string; record: { id: string } }
    }
  }
}

calm.flow('lookup', { case: 'language' }, async ({ slug }) => {
  // ↑ slug is typed as string
  // ↓ return type checked against { id, record: { id } }
  return await fetchLanguageBySlug(slug)
})
```

The host's `declare module` block widens the global
`Base` interface. Their `calm.flow(...)` calls now
typecheck against the union of standard catalog + their
additions.

## Decks ship as `declare module` blocks

A deck published as an npm package exposes its Flows by
augmenting `Base`. Importing the deck both registers
runtime handlers AND extends the type.

```typescript
// @cluesurf/calm-linguistics/src/index.ts
declare module '@cluesurf/calm' {
  interface Base {
    'is.iast':           { take: { text: string }; like: boolean }
    'is.wylie-tibetan':  { take: { text: string }; like: boolean }
    'is.pinyin':         { take: { text: string }; like: boolean }
    // ...
  }
}

export const linguisticsDeck: Deck = { /* ... */ }
```

Host code:

```typescript
import { Calm } from '@cluesurf/calm'
import { linguisticsDeck } from '@cluesurf/calm-linguistics'

const calm = new Calm()
calm.deck(linguisticsDeck)

calm.flow('is', { case: 'iast' }, ({ text }) => /* ... */)
//                       ↑
//          Recognized because @cluesurf/calm-linguistics
//          already augmented Base.
```

This is exactly how kysely-codegen works with `declare module`
augmentation.

## How `Base` is generated (codegen pipeline)

The compiler does **exactly what `@cluesurf/form`'s
`makeTree` already does** (see
`deck/form.js/test/index.ts` for the canonical pattern), plus
one extra emit: a single `Base` interface aggregating every
authored constant.

### Pipeline

```
authored exports                         generated outputs
────────────────                         ─────────────────
code/form/*.ts        →   makeTree   →   *.form.ts      (TS types per Form)
code/flow/**/*.ts                        *.take.ts      (Zod parsers per Flow input)
code/list/*.ts                           *.base.ts      (normalized constants)
code/hash/*.ts                                          (mirrors form.js makeTree)
code/fold/*.ts        ───────────────►   Base.d.ts      (NEW — single bundled type)
                                         BaseCompiled.d.ts (NEW — int-keyed dispatch)
                                         CodeMap.d.ts     (NEW — string→int)
```

The first three outputs (`*.form.ts`, `*.take.ts`,
`*.base.ts`) match form.js verbatim. They produce per-export
TypeScript types and per-export Zod parsers, written next to
the schemas they came from.

The next three outputs are calm-specific. They aggregate
every authored constant into single bundled type surfaces
that the runtime class is generic over.

### What `Base` looks like

The aggregate is a flat type keyed by the authored constant's
name. Every Form's Cast type, every Flow's signature, every
Hash, every List, every Fold — one type, default-exported
from the generated `base.ts`:

```typescript
// generated/base.ts
import type { LanguageString }     from './form/language_string'
import type { IpaForm }            from './form/ipa_form'
import type { Bear }               from './form/bear'
import type { CalmError }          from './form/error'
import type { IsStringInput,
              IsStringOutput }     from './flow/is_string'
import type { IsIpaInput,
              IsIpaOutput }        from './flow/is_ipa'
import type { IsIpaBroadInput,
              IsIpaBroadOutput }   from './flow/is_ipa_broad'
import type { IsEqualInput,
              IsEqualOutput }      from './flow/is_equal'
import type { MakeSumInput,
              MakeSumOutput }      from './flow/make_sum'
import type { FindRecordInput,
              FindRecordOutput }   from './flow/find_record'
import type { FfmpegCodecs }       from './hash/ffmpeg_codecs'
import type { IpaSymbols }         from './list/ipa_symbols'
import type { IsoLanguageCodes }   from './list/iso_language_codes'
import type { WelcomeGuide }       from './fold/welcome_guide'
import type { DefaultFilter }      from './find/default_filter'

type Base = {
  // Forms (each entry is the Form's Cast shape)
  language_string: LanguageString
  ipa_form:        IpaForm
  bear:            Bear
  error:           CalmError

  // Flows (each entry is the Flow's signature)
  'is_string':     { take: IsStringInput;     like: IsStringOutput }
  'is_ipa':        { take: IsIpaInput;        like: IsIpaOutput }
  'is_ipa_broad':  { take: IsIpaBroadInput;   like: IsIpaBroadOutput }
  'is_equal':      { take: IsEqualInput;      like: IsEqualOutput }
  'make_sum':      { take: MakeSumInput;      like: MakeSumOutput }
  'find_record':   { take: FindRecordInput;   like: FindRecordOutput }

  // Hashes
  ffmpeg_codecs:      FfmpegCodecs

  // Lists
  ipa_symbols:        IpaSymbols
  iso_language_codes: IsoLanguageCodes

  // Folds (each entry is the Fold's structural shape)
  welcome_guide:      WelcomeGuide

  // Finds (each entry is the Find's filter shape)
  default_filter:     DefaultFilter
}

export default Base
```

The file is a **flat type** with one entry per authored
constant, default-exported under the package's `/base` path.
Consumers import it directly:

```typescript
import type Base from '@cluesurf/calm/base'

const calm = new Calm<Base>()
```

This is the literal kysely pattern — `Database` with a row
shape per table — applied to every primitive shape calm
understands. The file is generated; never hand-edited.

### Combining multiple packages — type union

Each calm package emits its own `base.ts`. Consumers combine
multiple packages by intersecting:

```typescript
import type StandardBase    from '@cluesurf/calm/base'
import type LinguisticsBase from '@cluesurf/calm-linguistics/base'
import type MyAppBase       from './my-app/base'

type Base = StandardBase & LinguisticsBase & MyAppBase

const calm = new Calm<Base>()
```

The `&` intersection unions the keys from every source
package. If two packages declare the same key, TypeScript's
intersection rules apply (the merged type must satisfy both
sides — usually fine for compatible shapes; an error if they
disagree).

For a host whose collisions are intentional (e.g., overriding
a library's flow with a custom one), rename at the import
boundary:

```typescript
import type StandardBase    from '@cluesurf/calm/base'
import type { Base as ExtraBase } from '@some-library/base'

type Base = Omit<StandardBase, 'is.iso'> & ExtraBase

const calm = new Calm<Base>()
```

The intersection-and-rename pattern keeps every key
reachable while letting the consumer decide who wins.

### Alternative: `declare module` augmentation

For host code that wants the bundled `Base` to be globally
known (so `import type { Base } from '@cluesurf/calm/base'`
returns the merged type without per-file intersection), the
codegen optionally emits a `.d.ts` augmentation:

```typescript
// generated/base.augment.d.ts
declare module '@cluesurf/calm/base' {
  interface Base {
    'lookup.language': {
      take: { slug: string }
      like: { id: string; record: { id: string } }
    }
  }
}
```

Augmentation widens the published `Base` interface in-place,
kysely-style. The default-export form (above) is the
recommended primary pattern; augmentation is an opt-in
shortcut for projects that don't want consumers to write
explicit unions.

### Where it gets used

```typescript
import { Calm } from '@cluesurf/calm'
import type { Base } from '@cluesurf/calm/base'

const calm = new Calm<Base>()

// Now everything is typechecked through Base:

calm.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) => /* ... */)
//        ↑                                       ↑
//   resolved via Base['is_ipa_broad'].take      typed as string

calm.bind(welcomeSeed)
//        ↑
//   typed as Base['welcome_guide']

const cast: Base['language_string'] = { /* ... */ }
//          ↑
//   the Form's Cast shape, available without per-form imports
```

`Calm` is generic over `Base`. Every method that touches a
named entity (`flow`, `form`, `bind`, `call`) infers its
types from the bundled `Base`.

### Per-export imports still work

The host can also import individual types alongside the
bundled `Base`:

```typescript
import type { LanguageString, IsIpaBroadInput } from '@cluesurf/calm/base'
```

These are the same per-export `*.form.ts` files that form.js
already emits — module-scoped, globally unique within the
package. Use them directly when you want one type without
indexing into `Base`.

### Compile invocation

The compiler entry mirrors form.js's `makeTree`:

```typescript
import * as MESH from './form'
import * as FLOW from './flow'
import * as TASK from './task'
import * as SEED from './seed'
import { makeBase } from '@cluesurf/calm/make'

const tree = await makeBase({
  name: NAME,
  mesh: { ...MESH, ...FLOW, ...SEED },   // type sources
  link: { ...MESH, ...FLOW, ...SEED },   // schema cross-refs
  hook: TASK,                            // handler implementations
  cast: CAST,
  testLink: '~/test/test',
  codeLink: '.',
})

// writes:
//   tree.form  → *.form.ts
//   tree.take  → *.take.ts
//   tree.base  → *.base.ts
//   tree.bundled → Base.d.ts (the aggregate)
//   tree.compiled → BaseCompiled.d.ts (int-keyed)
//   tree.codemap → CodeMap.d.ts (string → int)
```

Same `tree.form` / `tree.take` / `tree.base` outputs as
form.js. Adds three bundled outputs that don't exist in
form.js: `bundled` (the `Base` aggregate), `compiled` (the
runtime int-keyed table), and `codemap` (the bidirectional
string ↔ int map).

### Why one bundled `Base`

Without the aggregate, every host file using calm would have
to import the specific per-export types it touches:

```typescript
// without Base
import type { LanguageString } from '@cluesurf/calm/base/form/language_string'
import type { IsIpaBroadInput } from '@cluesurf/calm/base/flow/is/ipa/broad'
import type { MakeSumInput } from '@cluesurf/calm/base/flow/make/sum'
// ... a dozen more
```

With the aggregate, one import covers the whole surface:

```typescript
// with Base
import type { Base } from '@cluesurf/calm/base'
// → Base['language_string'], Base['is_ipa_broad'], Base['make_sum'], ...
```

Plus the runtime-class generic (`new Calm<Base>()`) needs the
aggregate type as one parameter, not N. Kysely solved exactly
this for SQL; calm solves it the same way for the function-
and-data registry.

## Form types follow the same pattern

Forms get the same treatment via a `FormRegistry` interface:

```typescript
interface FormRegistry {
  language_string: {
    id:           string
    text:         string
    language__id: string
    cefr_level?:  'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  }
  ipa_form: {
    text: string
  }
  // ...
}
```

`calm.form(...)` registrations type-check the same way:

```typescript
calm.form('language_string', schema)
// schema's link fields validated against FormRegistry['language_string']
```

And anywhere a Cast is expected:

```typescript
function processString(cast: FormRegistry['language_string']) {
  // cast.text is string, cast.cefr_level is 'A1' | ... | 'C2' | undefined
}
```

## What lives where

```
deck/calm/code/
  form/                        # form-DSL machinery
    type.ts
    build.ts
    parse.ts
    codegen.ts                 # walks schemas, emits .d.ts
  flow/
    <verb>/<case>/
      schema.ts                # the Flow declaration
      handler.ts               # the implementation
      types.gen.ts             # auto-generated input/output types
  generated/
    registry.d.ts              # the bundled Base + FormRegistry
    forms/<form>.gen.ts        # one generated file per Form
    flows/<verb>/<case>.gen.ts # one generated file per Flow
```

Module-local generated types live next to the schemas they
came from. The bundled registry lives in `generated/`. The
codegen step rebuilds both on schema changes.

## Why this matches kysely

Kysely's `Database` interface is the single source of truth for
SQL types. Adding a table = augmenting `Database` = the rest of
the kysely surface knows about it. No per-table type
declarations to wire up; one interface, indexed by name.

Base's `Base` is the same idea for functions:

| concern | kysely | calm |
|---|---|---|
| type source | `Database` interface | `Base` + `FormRegistry` |
| key | table name | flat code id (`is_ipa_broad`) |
| value | row shape | `{ take, like }` |
| generation | `kysely-codegen` from SQL | calm codegen from schema files |
| extension | `declare module` augmentation | same |
| ergonomics | `db.selectFrom('users')` typed | `calm.flow('is', { case: ... })` typed |

The pattern is well-trodden; calm just applies it to a
different domain.

## Open questions

### Generic Flows (`head` parameters)

When a Flow has type parameters (`get.at` returns `t` where
`items: list<t>`), the registry entry needs to carry the
parametrization:

```typescript
'get.at': {
  take: <T>(args: { items: T[]; position: number }) => T
}
```

Encoding generic Flows in the registry is solvable with
TypeScript's higher-kinded patterns (HKTs via interfaces with
`apply` slots), but it adds complexity. Decision deferred until
the seed catalog has enough generic Flows to motivate the cost.

### Async Flow return types

Async Flows return `Promise<like>` at runtime. The registry's
`like` should reflect this:

```typescript
'find_record': {
  take: { reference: string }
  like: Promise<{ id: string; record: { id: string } }>
  async: true
}
```

Or wrap automatically:

```typescript
type Output<R, K extends keyof R> =
  R[K] extends { async: true }
    ? Promise<R[K]['like']>
    : R[K]['like']
```

The wrapper keeps the registry entry's `like` describing the
resolved type and lets the type-system add `Promise<...>`
where needed.

### Error types

A handler that fails should produce a typed error, not throw a
plain `Error`. The registry could carry a `kink` field
declaring the error union:

```typescript
'find_record': {
  take: { reference: string }
  like: { id: string; record: { id: string } }
  kink: 'not-found' | 'unauthorized'
}
```

Plumbing this into the engine's error-collection path is
straightforward; deferred until the runtime stabilizes.

## Summary

- Form-DSL codegen produces module-local TS types
  (globally unique within the package, module-scoped).
- A bundled `Base` interface aggregates every Flow,
  kysely-style, keyed by flat code id.
- `calm.flow(...)` and `calm.form(...)` are generic over
  these registries, so handler args and return types infer
  automatically.
- Hosts and decks extend the registries via `declare module`
  augmentation. Importing a deck wires runtime + types in one
  step.
- The whole surface is regenerated by a codegen pass; no
  hand-written `.d.ts` files, no drift.
