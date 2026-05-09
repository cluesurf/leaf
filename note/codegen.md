# Codegen

How bead generates TypeScript types and runtime artifacts from authored
schemas. And how those concerns stay decoupled from where the generated
code lives.

## The decoupling principle

A `Form`, `Flow`, `Hash`, `List`, `Fold`, or `Find` declares **what it
is**. It does not declare **where it lives**.

```typescript
// good. No path info
export const ffmpeg_codec_data: Form = {
  form: 'form',
  cast: 'ffmpeg_codec_data',
  like: {
    label: { like: 'string' },
    type: { like: 'string', need: false },
    lossy: { like: 'boolean' },
  },
}

// bad. Schema knows its codegen target
export const ffmpeg_codec_data: Form = {
  form: 'form',
  cast: 'ffmpeg_codec_data',
  save: '~/code/form/object/ffmpeg', // ← coupling
  like: {
    /* ... */
  },
}
```

Schemas are pure declarations; output paths are the consumer's business.

This unlocks two things:

1. **Libraries ship schemas without leaking their preferred directory
   tree.** A linguistics Book can publish IPA / Pinyin / Wylie Forms
   without baking `'~/code/form/lang/...'` into them. Consumers decide
   where the generated code lands.
2. **Consumers can relocate freely.** Move forms between directories,
   rename folders, restructure the monorepo. None of it touches schema
   definitions. Only the codegen config changes.

## What stays on the schema

A `Form` carries:

```typescript
type Form = {
  form: 'form'
  cast: string
  like: LinkMesh
  head?: string[] // generic params
}
```

A `Flow` carries:

```typescript
type Flow = {
  form: 'flow'
  name: string
  base?: string
  case?: string
  take?: string | LinkMesh | string[] | LinkMesh[]
  make?: string | LinkMesh | string[] | LinkMesh[]
}
```

The schema's identity is its declared `(name, base?, case?)` triple (for
Flows) or its `cast` value (for Forms). The exported `const` name is a
convenient label; the runtime keys off the reserved props.

See [`schema.md`](./schema.md) for the full reserved-prop spec.

## What the consumer provides

A consumer host writes one codegen script. The pattern is flat: register
one or more Books with `make.load(...)`, then call `make.save()`.

```typescript
import { Make } from '@cluesurf/bead/make'
import linguistics from '@cluesurf/bead-linguistics'
import standard from '@cluesurf/bead'
import myApp from './my-app/source'

const make = new Make({ link: './libs' })

make.load(standard)
make.load(linguistics)
make.load(myApp)

await make.save()
```

Each `make.load(book)` call registers the entire Book — every Form,
Flow, Fold, Hash, and List the Book contains.

Bead assumes **globally unique entry names** across every registered
Book. Code keys do not carry a host/name prefix; the codegen pass errors
if two Books contribute entries with colliding identity tuples (see
"Duplicate detection" below).

### Customization is a Book-level concern

There is no per-entry override DSL on `Make`. If the host wants to
rename, drop, or replace specific entries from a published Book, the
host composes a new Book value before passing it to `make.load(...)`:

```typescript
import linguistics from '@cluesurf/bead-linguistics'

// Drop one flow:
const filtered: Book = {
  ...linguistics,
  base: linguistics.base!.filter(
    e => !(e.form === 'flow' && e.name === 'experimental'),
  ),
}

// Patch one flow:
const renamed: Book = {
  ...linguistics,
  base: linguistics.base!.map(e =>
    e.form === 'flow' && e.name === 'is_ipa'
      ? { ...e, name: 'check_if_ipa' }
      : e,
  ),
}

// Compose two books:
const merged: Book = {
  host: 'my-org',
  name: 'merged',
  base: [...(linguistics.base ?? []), ...(standard.base ?? [])],
}

make.load(filtered)
make.load(renamed)
make.load(merged)
```

A Book is plain data. Composition is plain object spread. That's the
override surface — there's no second DSL on top.

### Closure is automatic

A Form often references other Forms. `language` may have a field whose
like-type is the `language_string` Form. `language_string` may reference
`enum_value`. The transitive closure can run dozens of Forms deep.

Because Books bulk-include by default, the closure isn't a host concern:
every entry the Book publishes is in scope, so references inside the
Book always resolve. The host doesn't need to walk the dependency graph.

Cross-book references are still constrained. A Form in Book A that
references a Form in Book B requires Book B to be registered too
(`make.load(b)`). Cross-book references where Book B isn't registered
throw a codegen error during `make.save()`.

## Make class API

```typescript
class Make {
  constructor(take: MakeTake)

  books: Book[]

  book(book: Book): this {
    this.books.push(book)
    return this
  }

  // Compile, check the union, save outputs.
  save(): Promise<void>
}

type MakeTake = {
  link: string // root output folder
}
```

That's the entire surface. Two methods. The `book(...)` method returns
`this` for chaining when the host wants the registration calls on one
line:

```typescript
new Make({ link: './libs' })
  .book(standard)
  .book(linguistics)
  .book(myApp)
  .save()
```

`make.save()` does three things in order:

1. **Compile.** Walk each registered Book, expand each entry to its
   identity tuple (Forms: `(cast, call, case)`; Flows:
   `(name, base, case, take, make)`), assign numeric ids.
2. **Check.** Validate the union — see "Duplicate detection" below.
   Also: every Flow's `take` / `make` string references resolve to a
   declared Form, Form variants resolve, etc.
3. **Save.** Write the generated files into the directory named by
   `link`.

Errors at the check stage abort the save. The host's codegen script
throws; nothing is written.

### Duplicate detection

Bead assumes globally unique entry identity across every registered
Book. At `make.save()` time, codegen gathers every Form and Flow across
every Book and looks for collisions:

- **Forms** are identified by `(cast, call, case)`. Two Forms with the
  same triple are duplicates.
- **Flows** are identified by `(name, base, case, take, make)`. Two
  Flows with the same identity tuple are duplicates.

When duplicates are found, codegen gathers all collisions across the
registered Books and throws **one error listing them all**, so the host
can see every conflict in one pass instead of fixing one and re-running.
The error names each colliding entry's source Book (by the Book's
optional `host` + `name` metadata) and the colliding identity tuple.

To intentionally have two variants of "the same" verb, give them
different `case` (or different `base`). The triple disambiguates them
into separate entries.

## Output: one host bundle

The registered Books collapse into a single host bundle at `link`. Four
files. No per-book subfolders.

```
./libs/
  index.ts    # TS types + the bundled Code type
  form.ts     # Zod parsers
  base.ts     # runtime registry: handlers + validators + literal data
  flow.ts     # re-exports of handler functions
```

The `Code` type aggregates every entry under its namespaced colon-key.
Each registered Book's `host` + `name` is preserved on the entries it
contributes:

```typescript
// generated ./libs/index.ts
export type IsIpaBroadTake = { text: string }
export type IsIpaBroad = boolean

export type MakeSumTake = { a: number; b: number }
export type MakeSum = { value: number }

export type Language = {
  id: string
  iso_639_3: string
  // ...
}

export type SelectLanguageTake = { id: string }
export type SelectLanguage = Language

type Code = {
  // From @cluesurf/bead-linguistics
  'flow:is:ipa:broad': IsIpaBroad
  'list:ipa_symbols': string[]

  // From @cluesurf/bead
  'flow:make:sum': MakeSum

  // From cluesurf:my-app (the consuming host)
  'flow:select:language': SelectLanguage
  'fold:welcome_guide': WelcomeGuide
}

export default Code
```

## Call-site rewrite (typed → numeric)

Every typed
`base.call('is', { base: 'ipa', case: 'broad', text: 'foo' })` in host
source is rewritten by the codegen pass into the runtime's
numeric-dispatch form:

```typescript
// authored
base.call('is', { base: 'ipa', case: 'broad', text: 'foo' })
// generated
base.call(103, { text: 'foo' })
```

The integer id is the host bundle's local code id, assigned during
`make.save()`. The id table lives in `./libs/index.ts`:

```typescript
// generated
export const ID = {
  is_ipa: 102,
  is_ipa_broad: 103,
  is_ipa_narrow: 104,
  make_sum: 201,
  // ...
} as const
```

The runtime's flow and handler registries are keyed by these integers.
String-keyed dispatch happens nowhere at runtime; the typed `call`
overload exists only so authors can write type-safe call sites that the
codegen pass collapses into integer indexing.

The same rewrite applies to `base.flow(...)` registration calls in host
source — the codegen replaces the (name, base, case) triple with the
integer id at the registration call site too, so the runtime never
parses strings to register.

The codegen pass:

1. Walks the consumer's source.
2. Finds every `base.flow(...)` and `base.call(...)` whose first arg is
   a string literal and whose options carry literal `base` / `case`
   values.
3. Replaces the literal triple with the host bundle's integer id, and
   strips the `base` / `case` keys from the options object.

Call sites with non-literal triples keep the string-typed form and pay
the runtime classification cost.

## Output file shape

Each leaf folder in the output tree contains:

```
index.ts       # gen:   TypeScript types
form.ts        # gen:   Zod parsers, satisfies the index types
base.ts        # gen:   leaf catalog re-exports
```

(For Flows, hand-written handler files live in the source tree, not the
output tree. Codegen re-exports them through `flow.ts`.)

Files import from one another in a fixed order:

- `index.ts` exports type declarations only.
- `form.ts` imports types from `./index` and exports Zod parsers locked
  to those types via `satisfies z.ZodType<T>`.
- `base.ts` re-exports both, plus the handler.

### `index.ts` — TypeScript types

For a Form:

```typescript
// gen
export type LanguageString = {
  id: string
  text: string
  language__id: string
  cefr_level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}
```

For a Flow, the input and output types named off the
`(name, base, case)` triple:

```typescript
// gen
export type IsIpaBroadTake = { text: string }
export type IsIpaBroad = boolean
```

The pattern:

- **`<Verb><Base><Case>Take`** is the input value type.
- **`<Verb><Base><Case>`** is the output value type.

When `take` or `make` is absent on a Flow, the corresponding type is
`unknown`.

For a Form with cases (sum type):

```typescript
export type Result =
  | { case: 'okay'; value: string }
  | { case: 'error'; value: string }
```

For a Hash:

```typescript
export type FfmpegCodecs = Record<
  string,
  { label: string; lossy: boolean }
>
```

For a List:

```typescript
export type IpaSymbols = string[]
```

### `form.ts` — Zod parsers

Every type from `./index` gets a runtime parser, locked with
`satisfies`:

```typescript
// gen
import { z } from 'zod'
import type { LanguageString } from '.'

export const language_string_parser = z.object({
  id: z.string(),
  text: z.string().min(1, 'text is required'),
  language__id: z.string(),
  cefr_level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional(),
}) satisfies z.ZodType<LanguageString>
```

For a Flow's input parser:

```typescript
// gen
import { z } from 'zod'
import type { IsIpaBroadTake } from '.'

export const is_ipa_broad_take_parser = z.object({
  text: z.string(),
}) satisfies z.ZodType<IsIpaBroadTake>
```

`satisfies` keeps the parser's _inferred_ type (so chaining methods like
`.refine(...)` keep working) AND verifies it satisfies the static type.
The plain type-annotation form would widen the parser and erase the
chain-friendly narrow type.

### `base.ts` — leaf re-exports

The folder's bundled namespace pulls in everything in the leaf so
consumers get one import:

```typescript
// gen
export type * from '.'
export * from './form'
```

For a Flow leaf with a handler:

```typescript
// gen
export type * from '.'
export * from './form'
export { is_ipa_broad_handler } from './flow'
```

For Hash and List leaves, `base.ts` additionally re-exports the literal
runtime data from the source's `make.ts`:

```typescript
// gen
export type * from '.'
export * from './form'
export { ipa_symbols } from './make' // the runtime literal
```

## Why this design

### Schemas are values, not config

The schema declares a value of type `Form` (or `Flow`, etc.). Values
shouldn't know where they're stored on disk. That's a binding from name
to location, which lives elsewhere — same separation as **TypeScript
types vs filesystem layout**.

### Libraries become reusable

A library that exported `save: '~/code/form/object/...'` would force
every consumer to adopt that directory tree. Bead Books ship pure
values; consumers compose them however their codebase prefers.

### One source of truth for the name

The `(name, base?, case?)` triple (Flows) or `cast` value (Forms) IS the
schema's identity. Codegen, the bundled `Code` interface, the editor,
the runtime dispatcher — all key off the same triple. No path-vs-name
disagreements.

### Hot reload and IDE-friendliness

Schemas without paths move freely; the codegen config catches up on the
next build, and TypeScript import paths are the only thing the IDE
renames.

## Summary

- **Books are bulk-include by default.** `make.load(book)` registers
  everything the Book publishes.
- **Customization is Book-level.** Compose a new Book before
  registering. No per-entry DSL on `Make`.
- **Closure is automatic** within a Book. Cross-book refs require both
  Books registered.
- **`Make` has two methods**: `book` (register) and `save` (compile +
  check + write).
- **Outputs**: `index.ts` (types), `form.ts` (Zod parsers), `base.ts`
  (leaf re-exports), `flow.ts` (handler re-exports). Plus a unified
  `Code` type aggregating every entry under its colon-key.
- **Call-site rewrite**: codegen replaces every typed `base.call(...)`
  and `base.flow(...)` with the numeric-id form. The runtime never sees
  strings.
