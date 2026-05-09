# TypeScript types

How calm exposes registered Flows as a fully-typed surface
to host code. The strategy: codegen aggregates every Form
and Flow across every registered Book into a single `Code`
type, and the runtime class `Base` is generic over it.

## Goal

A host opens a `Base` instance generic over a `Code` type,
then registers Flow handlers. TypeScript typechecks every
call.

```typescript
import { Base } from '@cluesurf/calm'
import type Code from './libs'   // generated

const base = new Base<Code>()

base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
  Array.from(text).every(is_ipa_symbol),
)
```

TypeScript should:

- Recognize `'is'` as a valid Flow name in `Code`.
- Recognize `'ipa'` as a valid base under `is`.
- Recognize `'broad'` as a valid case under `is.ipa`.
- Type `text` as `string` (from the Flow's `take`).
- Require the handler to return `boolean` (from the Flow's
  `make`).

All inferred from the `Code` type passed at `Base`
instantiation. No hand-written overloads, no manual `.d.ts`
files outside the generated bundle.

## The `Code` type

`Code` is the kysely `DB` equivalent. A single TypeScript
type listing every entry across every registered Book,
keyed by colon-namespaced path:

```typescript
type Code = {
  'flow:<name>:<base?>:<case?>': EntryType
  'form:<cast>:<call?>:<case?>': EntryType
  // ...one entry per Form / Flow / Fold / Hash / List
}
```

Calm assumes globally unique entry names across all registered
Books — no host/name prefix on Code keys. Codegen errors at
`make.save()` time if two Books contribute entries with
colliding identity tuples.

Concrete example:

```typescript
type Code = {
  'flow:is:ipa:broad': {
    take: { text: string }
    make: boolean
  }
  'form:language': {
    cast: {
      id:        string
      iso_639_3: string
    }
  }
  'flow:select:language': {
    take: { id: string }
    make: { id: string; iso_639_3: string }
  }
  // ...
}
```

Each entry's value carries the schema-relevant types:
`take` / `make` for Flows, `cast` for Forms, etc.

## Per-entry types in `index.ts`

The generated bundle's `index.ts` exposes each entry's types
as named TypeScript types alongside `Code`:

```typescript
// generated ./libs/index.ts

// Flow: is_ipa_broad → IsIpaBroad + IsIpaBroadTake
export type IsIpaBroadTake = { text: string }
export type IsIpaBroad     = boolean

// Form: language → Language
export type Language = {
  id:        string
  iso_639_3: string
}

// Flow: select_language → SelectLanguage + SelectLanguageTake
export type SelectLanguageTake = { id: string }
export type SelectLanguage     = Language

// Aggregate
type Code = {
  'flow:is:ipa:broad': { take: IsIpaBroadTake; make: IsIpaBroad }
  'form:language':     { cast: Language }
  'flow:select:language': {
    take: SelectLanguageTake
    make: SelectLanguage
  }
}

export default Code
```

Naming pattern:
- **Flows**: `<Verb><Base><Case>Take` (input) +
  `<Verb><Base><Case>` (output value type).
- **Forms**: `<Cast>` in PascalCase.

The output type uses the bare `<Verb><Base><Case>` name
because that's the type consumers reach for most often (API
response shapes, function return values, render props). The
input takes the `Take` suffix.

## How `base.flow(...)` typechecks

The runtime class `Base<T extends Code>` carries inference
helpers that walk `T`'s keys to enforce valid registration:

```typescript
class Base<T extends Code> {
  flow<
    Verb extends FlowName<T>,
    BaseValue extends FlowBaseValue<T, Verb>,
    CaseValue extends FlowCaseValue<T, Verb, BaseValue>,
  >(
    name: Verb,
    options: { base: BaseValue; case: CaseValue },
    handler: (take: FlowTake<T, Verb, BaseValue, CaseValue>) => FlowMake<T, Verb, BaseValue, CaseValue>,
  ): void

  // Bare form (no base, no case):
  flow<Verb extends BareFlowName<T>>(
    name: Verb,
    handler: (take: FlowTake<T, Verb, undefined, undefined>) => FlowMake<T, Verb, undefined, undefined>,
  ): void

  call<
    Verb extends FlowName<T>,
    BaseValue extends FlowBaseValue<T, Verb>,
    CaseValue extends FlowCaseValue<T, Verb, BaseValue>,
  >(
    name: Verb,
    args: { base: BaseValue; case: CaseValue } & FlowTake<T, Verb, BaseValue, CaseValue>,
  ): FlowMake<T, Verb, BaseValue, CaseValue>

  // Compiled-id call (codegen target, untyped):
  call(id: number, bind: any): any
}
```

The inference helpers (`FlowName`, `FlowBaseValue`,
`FlowCaseValue`, `FlowTake`, `FlowMake`, `BareFlowName`) are
template-literal-typed walks over `Code`'s keys. They
extract the verb-base-case structure from each colon-key.

The full inference helpers live in
`code/runtime/types.ts`. This doc covers the public-facing
type story; that file is the reference implementation.

## Multiple registered Books

A consumer registers multiple Books with `make.load(...)`.
Each Book's entries land in `Code` under the Book's own
`host:name` prefix:

```typescript
type Code = {
  // From @cluesurf/base
  'flow:is:string': { take: ...; make: boolean }
  'flow:make:sum':  { take: ...; make: number }

  // From @cluesurf/calm-linguistics
  'flow:is:ipa:broad':  { take: ...; make: boolean }
  'list:ipa_symbols':   string[]

  // From the consuming host's own bundle (cluesurf:my-app)
  'flow:select:language': { take: ...; make: ... }
  'fold:welcome_guide':   { cast: ... }
}
```

The host's own entries inherit the `host:name` from the
consumer's `MakeTake`. Upstream Books keep their own
`host:name`. Same-prefix collisions are caught at
`make.save()` check time.

## `declare module` augmentation (optional)

Hosts that want to extend the canonical `@cluesurf/calm`
exports (rather than passing a custom `Code` type as a
generic) can use TypeScript module augmentation:

```typescript
declare module '@cluesurf/calm' {
  interface Code {
    'my-org:my-app:flow:foo': { take: ...; make: ... }
  }
}
```

After the declaration, every `Base<Code>` (with no
explicit generic) sees the augmented entries. This matches
kysely's `Database` extension pattern.

## Form-side types

Forms emit one type each, named after the Form's `cast`
value in PascalCase. Hosts use them in three places:

```typescript
// 1. Storage row type:
const row: Language = await db.select(...)

// 2. Function return type via Code lookup:
type SelectLanguageMake = Code['flow:select:language']['make']
//   ↑ Language

// 3. Component props:
type LanguageProps = Language
function LanguageCard(props: LanguageProps) { /* ... */ }
```

One Form, three jobs, one type.

## What lives where

| location                            | what                                   |
|-------------------------------------|----------------------------------------|
| `code/<book-source>/make.ts`        | hand-written declarations              |
| `code/<book-source>/flow.ts`        | hand-written handlers (Flows only)     |
| `<output>/index.ts` (gen)           | per-entry types + the `Code` aggregate |
| `<output>/form.ts` (gen)            | Zod parsers for runtime validation     |
| `<output>/base.ts` (gen)            | runtime registry: handlers + parsers + literal data |
| `<output>/flow.ts` (gen)            | re-exports of handler functions        |

`<output>` is the directory named by `MakeTake.link`.

## Open question: Generic Flows (`head` parameters)

A Flow declared with `head: ['t']` accepts a type parameter.
How that parameter flows through `Code`'s type derivation
isn't fully specified yet. Current sketch: the entry type
exposes `head` as a generic on the synthesized type, and
callers must instantiate it. Worked example deferred until
generic Flows ship.

## Open question: Async Flow return types

A Flow declared `async: true` returns its `make` shape inside
a Promise at call time, but is registered with a synchronous
handler that the runtime batches and pre-resolves. The type
derivation hides the Promise from authoring code (the
handler returns `make` directly; the runtime wraps).
Confirming the typing edge cases is a TODO.
