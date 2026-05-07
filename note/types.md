# TypeScript types

How book exposes the registered Flows as a fully-typed surface
to host code. Two strategies, one combined system: form-DSL
codegen for module-local types, plus a kysely-style bundled
registry for global lookup.

## Goal

A user opens a `Book` instance generic over a `FlowBase`
type, then registers Flow handlers — and TypeScript
typechecks every call against the base.

```typescript
import { Book } from '@cluesurf/book'
import type { FlowBase } from '@cluesurf/book/standard'

const book = new Book<FlowBase>()

book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
  Array.from(text).every(is_ipa_symbol),
)
```

TypeScript should:

- Recognize `'is'` as a valid Flow name in `FlowBase`.
- Recognize `'ipa'` as a valid base under `is`.
- Recognize `'broad'` as a valid case under `is.ipa`.
- Type `text` as `string` (from the Flow's `take.text.like`).
- Require the handler to return `boolean` (from the Flow's
  `like`).

All inferred from the `FlowBase` type passed at `Book`
instantiation. No hand-written overloads, no manual `.d.ts`
files, no separate type declarations.

## What runtime needs vs what editor needs

Two different surfaces, two different shapes of metadata:

| concern | runtime | editor |
|---|---|---|
| `FlowBase` type | yes (typechecks `book.flow(...)`) | yes (typechecks editor host code) |
| `FlowBaseCompiled` (int-keyed) | yes (dispatch table) | no |
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
`FlowBase` type, the compiled-handler array, and the code
map. A full authoring environment (browser editor) ships
schemas alongside.

This is why `book.form(...)` and `book.flow(...)` are
distinct calls. Runtime hosts that don't need the editor
surface call only `book.flow(...)` and skip Forms entirely.

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

Book inherits this pattern verbatim for both `Form` and `Flow`
schemas. Each Flow's `take` and `like` annotations compile to
TypeScript types, exported from the module that registers the
Flow.

```typescript
// code/flow/is/ipa/broad/schema.ts
export const is_ipa_broad: Flow = {
  name: 'is',
  case: 'ipa.broad',
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
with the standard catalog).

This works for module-level references — when a host imports
the standard catalog, types ride along.

## Strategy 2 — kysely-style bundled registry (two layers)

Module-scoped types alone are awkward for `book.flow(...)`,
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

Book applies the same idea, but in **two layers** that mirror
the editable / compiled AST split:

### Layer A — `FlowBase` (editable, string-keyed)

What authors and the editor see. Keyed by the human-readable
`(name, base?, case?)` triple flattened to a dotted string:

```typescript
interface FlowBase {
  'is.string':       { take: { thing: unknown };               like: boolean }
  'is.ipa':          { take: { text: string };                 like: boolean }
  'is.ipa.broad':    { take: { text: string };                 like: boolean }
  'is.ipa.narrow':   { take: { text: string };                 like: boolean }
  'is.equal':        { take: { this: unknown; that: unknown }; like: boolean }
  'is.among':        { take: { thing: unknown; choices: unknown[] }; like: boolean }
  'make.sum':        { take: { a: number; b: number };         like: number }
  'make.lowercase':  { take: { text: string };                 like: string }
  'get.length':      { take: { text: string };                 like: number }
  'get.count':       { take: { items: unknown[] };             like: number }
  'find.record':     { take: { reference: string };            like: { id: string; record: { id: string } } }
  // ... every registered Flow
}
```

Used by:
- `book.flow(...)` registration (TypeScript looks up the key
  to validate handler args / return type).
- The editor (looks up widget shape by triple).
- The schema editor / docs (introspection).

### Layer B — `FlowBaseCompiled` (runtime, integer-keyed)

What the runtime evaluator sees. Keyed by integer codes
assigned at registry-finalization time:

```typescript
interface FlowBaseCompiled {
  1:   { take: { thing: unknown };               like: boolean }   // is.string
  2:   { take: { text: string };                 like: boolean }   // is.ipa
  3:   { take: { text: string };                 like: boolean }   // is.ipa.broad
  4:   { take: { text: string };                 like: boolean }   // is.ipa.narrow
  5:   { take: { this: unknown; that: unknown }; like: boolean }   // is.equal
  6:   { take: { thing: unknown; choices: unknown[] }; like: boolean }  // is.among
  7:   { take: { a: number; b: number };         like: number }    // make.sum
  8:   { take: { text: string };                 like: string }    // make.lowercase
  9:   { take: { text: string };                 like: number }    // get.length
  10:  { take: { items: unknown[] };             like: number }    // get.count
  11:  { take: { reference: string };            like: { id: string; record: { id: string } } }  // find.record
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
  'is.string':       1
  'is.ipa':          2
  'is.ipa.broad':    3
  'is.ipa.narrow':   4
  'is.equal':        5
  // ...
}

type FlowCodeMapInverse = { [K in keyof FlowCodeMap as FlowCodeMap[K]]: K }
// → { 1: 'is.string'; 2: 'is.ipa'; ... }
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
authoring; integers are right for evaluating. Book has both
and the codegen keeps them in sync.

### Code stability across versions

Integer codes are **only stable within a registry build**.
When `@cluesurf/book` ships a new version with new Flows, the
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
declare module '@cluesurf/book' {
  interface FlowBase {
    'lookup.language': {
      take: { slug: string }
      like: { id: string; record: { id: string } }
    }
  }
}
```

The codegen step on the host's tsconfig picks up the
augmentation and assigns an integer code. The compiled-layer
type (`FlowBaseCompiled`) and code map (`FlowCodeMap`)
extend automatically because they're projections of
`FlowBase`.

## How `book.flow(...)` typechecks

The `Book` class is generic over the `FlowBase`:

```typescript
class Book<R = FlowBase> {
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

The result: when the host writes `book.flow('is', { case:
'ipa.broad' }, handler)`, TypeScript:

1. Resolves `'is'` against `FlowName<R>`. Valid.
2. Resolves `'ipa.broad'` against `FlowCase<R, 'is'>`. Valid.
3. Looks up `FlowBase['is.ipa.broad'].take` → `{ text:
   string }`.
4. Looks up `FlowBase['is.ipa.broad'].like` → `boolean`.
5. Types `handler` as `(args: { text: string }) => boolean`.

If the host typos `'ipa.brad'` instead of `'ipa.broad'`,
TypeScript catches it. If the handler returns `string` instead
of `boolean`, TypeScript catches it. If the handler reads an
arg called `txt` instead of `text`, TypeScript catches it.

## Extending the registry

Hosts add their own Flows, which need to extend the registry.
The pattern follows kysely's module-augmentation approach:

```typescript
// host code
import '@cluesurf/book'

declare module '@cluesurf/book' {
  interface FlowBase {
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

book.flow('lookup', { case: 'language' }, async ({ slug }) => {
  // ↑ slug is typed as string
  // ↓ return type checked against { id, record: { id } }
  return await fetchLanguageBySlug(slug)
})
```

The host's `declare module` block widens the global
`FlowBase` interface. Their `book.flow(...)` calls now
typecheck against the union of standard catalog + their
additions.

## Decks ship as `declare module` blocks

A deck published as an npm package exposes its Flows by
augmenting `FlowBase`. Importing the deck both registers
runtime handlers AND extends the type.

```typescript
// @cluesurf/book-linguistics/src/index.ts
declare module '@cluesurf/book' {
  interface FlowBase {
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
import { Book } from '@cluesurf/book'
import { linguisticsDeck } from '@cluesurf/book-linguistics'

const book = new Book()
book.deck(linguisticsDeck)

book.flow('is', { case: 'iast' }, ({ text }) => /* ... */)
//                       ↑
//          Recognized because @cluesurf/book-linguistics
//          already augmented FlowBase.
```

This is exactly how kysely-codegen works with `declare module`
augmentation.

## How the registry is generated

A codegen step in `@cluesurf/book` walks every `code/flow/<verb>/<case>/schema.ts`
file, reads its `take` and `like` annotations, and emits a
single `FlowBase` interface in a generated `.d.ts`:

```typescript
// generated/registry.d.ts
import '@cluesurf/book'

declare module '@cluesurf/book' {
  interface FlowBase {
    'is.string':       { take: { thing: unknown };  like: boolean }
    'is.integer':      { take: { thing: unknown };  like: boolean }
    'is.equal':        { take: { this: unknown; that: unknown };  like: boolean }
    // ... every Flow in the catalog
  }
}
```

The user's tsconfig picks this up automatically because
`@cluesurf/book` ships it as part of the package's published
type surface. No host action required.

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

`book.form(...)` registrations type-check the same way:

```typescript
book.form('language_string', schema)
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
deck/book/code/
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
    registry.d.ts              # the bundled FlowBase + FormRegistry
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

Book's `FlowBase` is the same idea for functions:

| concern | kysely | book |
|---|---|---|
| type source | `Database` interface | `FlowBase` + `FormRegistry` |
| key | table name | flat code id (`is.ipa.broad`) |
| value | row shape | `{ take, like }` |
| generation | `kysely-codegen` from SQL | book codegen from schema files |
| extension | `declare module` augmentation | same |
| ergonomics | `db.selectFrom('users')` typed | `book.flow('is', { case: ... })` typed |

The pattern is well-trodden; book just applies it to a
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
'find.record': {
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
'find.record': {
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
- A bundled `FlowBase` interface aggregates every Flow,
  kysely-style, keyed by flat code id.
- `book.flow(...)` and `book.form(...)` are generic over
  these registries, so handler args and return types infer
  automatically.
- Hosts and decks extend the registries via `declare module`
  augmentation. Importing a deck wires runtime + types in one
  step.
- The whole surface is regenerated by a codegen pass; no
  hand-written `.d.ts` files, no drift.
