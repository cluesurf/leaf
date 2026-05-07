# Codegen

How calm generates TypeScript types and runtime artifacts from
authored schemas — and how those concerns stay decoupled from
where the generated code lives.

## The decoupling principle

A `Form`, `Flow`, `Hash`, `List`, `Fold`, or `Find` declares
**what it is**. It does not declare **where it lives**.

```typescript
// good — no path info
export const ffmpeg_codec_data: Form = {
  form: 'form',
  link: {
    label: { like: 'string' },
    type:  { like: 'string', need: false },
    lossy: { like: 'boolean' },
    // ...
  },
}

// bad — schema knows its codegen target (form.js's old `save` field)
export const ffmpeg_codec_data: Form = {
  form: 'form',
  save: '~/code/form/object/ffmpeg',   // ← coupling
  link: { /* ... */ },
}
```

The `save` field that form.js used is **gone in calm**.
Schemas are pure declarations; output paths are the consumer's
business.

This unlocks two big things:

1. **Libraries ship schemas without leaking their preferred
   directory tree.** A linguistics library can publish IPA /
   Pinyin / Wylie Forms without baking `'~/code/form/lang/...'`
   into them. Consumers decide where the generated code lands.

2. **Consumers can relocate freely.** Move forms between
   directories, rename folders, restructure the monorepo —
   none of it touches schema definitions. Only the codegen
   config changes.

## What stays on the schema

A `Form` carries:

```typescript
type Form = {
  form: 'form'
  link?: FormLinkMesh           // fields
  case?: Record<string, FormCase>  // variants
  head?: string[]               // generic params
  // NO save / path / file fields
}
```

A `Flow`:

```typescript
type Flow = {
  name: string
  base?: string
  case?: string
  like?: string
  take?: FormLinkMesh
  // NO save / path / file fields
}
```

The schema's identity is its **exported `const` name**, not a
path string. The compiler aggregates by name (the constant's
identifier in the source module), not by save location.

## What the consumer provides

A consumer (host or downstream library) writes a single
codegen config that resolves names to output paths:

```typescript
import { makeBase } from '@cluesurf/calm/make'
import * as Library from '@some-library/calm'
import * as MyApp   from './my-app/calm'

await makeBase({
  // Sources — every authored constant the consumer wants in
  // the bundle. Calm walks each module's exports and groups
  // them by primitive type.
  waves: {
    ...Library,
    ...MyApp,
  },

  // Output wiring — see below for the three layered strategies.
  output: { /* ... */ },
})
```

The codegen does the form.js-style `tree.form` / `tree.take` /
`tree.base` emit, plus calm's bundled outputs (`Base.d.ts`,
`BaseCompiled.d.ts`, `CodeMap.d.ts`). Where each output file
is written is decided by `output:`.

## Three layered output strategies

Layered from simplest to most flexible. A consumer typically
mixes them.

### 1 — Layout convention (zero config)

The simplest case: tell the codegen one base directory and a
layout style. Calm derives every output path from name and
primitive type.

```typescript
output: {
  base: './my-app/code/calm',
  layout: 'kind',     // 'kind' | 'flat' | 'mirror' | 'name'
}
```

Layouts:

- **`'kind'`** — group by primitive type:
  ```
  ./my-app/code/calm/
    form/<name>.ts
    flow/<name>.ts
    hash/<name>.ts
    list/<name>.ts
    fold/<name>.ts
    find/<name>.ts
  ```
- **`'flat'`** — every constant in one folder:
  ```
  ./my-app/code/calm/
    <name>.ts
  ```
- **`'mirror'`** — mirror the source module's import path:
  ```
  ./my-app/code/calm/
    <relative-path-from-source>.ts
  ```
- **`'name'`** — use underscore segments of the constant's name as
  folders:
  ```
  ./my-app/code/calm/
    is/ipa/broad.ts          # is_ipa_broad
    make/sum.ts              # make_sum
    ffmpeg/codec/data.ts     # ffmpeg_codec_data
  ```

90% of consumers pick one layout and never write per-name
overrides.

### 2 — Per-name overrides (targeted)

For the constants that don't fit the chosen layout — common
when integrating a library whose names don't align with the
consumer's structure.

```typescript
output: {
  base: './my-app/code/calm',
  layout: 'kind',
  override: {
    ffmpeg_codec_data: './my-app/code/legacy/ffmpeg/codec.ts',
    is_ipa:            './my-app/code/linguistics/ipa/check.ts',
  },
}
```

The override map takes precedence over the layout. Names not
in the map fall through to the layout default.

### 3 — Resolver function (programmatic)

Full control: a function that takes (name, kind, source-info)
and returns the output path.

```typescript
output: {
  resolve: ({ name, kind, sourceModule }) => {
    if (sourceModule.startsWith('@some-library/')) {
      return `./my-app/code/vendor/${name}.ts`
    }
    if (kind === 'flow' && name.startsWith('is_')) {
      const [, base, ...rest] = name.split('_')
      return `./my-app/code/check/${base}/${rest.join('-')}.ts`
    }
    return `./my-app/code/calm/${kind}/${name}.ts`
  },
}
```

Reach for this when:
- Multiple source libraries need different output trees.
- The naming convention varies by category and a flat layout
  doesn't fit.
- The consumer wants to slot generated code into an existing
  pre-calm directory structure.

The resolver receives:

```typescript
type ResolverInput = {
  name: string                  // the constant's exported name
  kind: 'form' | 'flow' | 'hash' | 'list' | 'fold' | 'find'
  sourceModule: string          // the package or relative path it came from
  emit: 'type' | 'parser' | 'base'  // which artifact (mirrors form.js's tree.form / .take / .base)
}
```

### Mixing the layers

A consumer can use a layout default, override specific names,
and fall back to a resolver:

```typescript
output: {
  base: './my-app/code/calm',
  layout: 'kind',
  override: {
    welcome_guide: './my-app/code/docs/welcome.ts',
  },
  resolve: ({ name, kind, sourceModule }) => {
    if (sourceModule.startsWith('@some-vendor/')) {
      return `./my-app/code/vendor/${kind}/${name}.ts`
    }
    return null  // null falls through to layout + override
  },
}
```

Resolution order: `override` → `resolve` (if returns string)
→ `layout`.

## What libraries ship

A library publishing calm schemas exports them as plain
`const`s without any path info:

```typescript
// @some-vendor/calm-linguistics/code/index.ts

export const ipa_form: Form = { /* ... */ }
export const pinyin_form: Form = { /* ... */ }

export const is_ipa: Flow = { /* ... */ }
export const is_ipa_broad: Flow = { /* ... */ }
export const is_ipa_narrow: Flow = { /* ... */ }
// ...

// Optional: the library may also ship base implementations.
export const is_ipa_handler = ({ text }) =>
  Array.from(text).every(is_ipa_symbol)

export const is_ipa_broad_handler = ({ text }) =>
  text.startsWith('/') && /* ... */

// Handlers are wired to flows by name convention:
//   <flow_name>_handler  →  the implementation for `flow_name`
```

The library's `package.json`:

```json
{
  "name": "@some-vendor/calm-linguistics",
  "main": "./host/code/index.js",
  "exports": {
    ".": "./host/code/index.js"
  }
}
```

No codegen config is shipped. The library exports schemas +
optional handlers; the consumer decides where the codegen
output lives.

### Handler wiring

The library convention: for every Flow named `<name>`, an
optional handler is exported as `<name>_handler`. The codegen
detects the suffix and registers the handler against the flow
at runtime.

Consumers that want to override a library handler simply
re-export their own:

```typescript
// my-app/calm/index.ts
export * from '@some-vendor/calm-linguistics'

// override the handler:
export const is_ipa_handler = ({ text }) => myCustomImpl(text)
```

The `export *` brings in the library's flow + handler. The
explicit `export const is_ipa_handler` shadows it. Standard
JavaScript module mechanics; calm doesn't add anything.

## Worked example

### Library

```typescript
// @cluesurf/calm-linguistics/code/index.ts

export const ipa_form: Form = {
  form: 'form',
  link: { text: { like: 'string' } },
}

export const is_ipa: Flow = {
  name: 'is',
  base: 'ipa',
  like: 'boolean',
  take: { text: { like: 'string' } },
}

export const is_ipa_handler = ({ text }: { text: string }): boolean =>
  Array.from(text).every(is_ipa_symbol)
```

### Consumer

```typescript
// my-app/codegen.ts
import { makeBase } from '@cluesurf/calm/make'
import * as Linguistics from '@cluesurf/calm-linguistics'
import * as MyApp from './my-app/calm-source'

await makeBase({
  waves: {
    ...Linguistics,
    ...MyApp,
  },
  output: {
    base: './my-app/code/calm',
    layout: 'kind',
    override: {
      welcome_guide: './my-app/site/docs/welcome.ts',
    },
  },
})
```

### Generated output

```
./my-app/code/calm/
  form/
    ipa_form.ts                # type from @cluesurf/calm-linguistics.ipa_form
    language_string.ts         # type from MyApp.language_string
  flow/
    is_ipa.ts                  # type + parser from is_ipa
  hash/
    ffmpeg_codecs.ts
  list/
    ipa_symbols.ts
  fold/
    paradigm_template.ts

./my-app/site/docs/
  welcome.ts                   # the override

./my-app/code/calm/
  Base.d.ts                    # the kysely-style aggregate
  BaseCompiled.d.ts            # int-keyed runtime registry
  CodeMap.d.ts                 # string ↔ int map
```

The consumer's runtime then loads the bundle:

```typescript
// my-app/runtime.ts
import { Calm } from '@cluesurf/calm'
import type { Base } from './code/calm'

import * as wave from './code/calm'
import * as src from './my-app/calm-source'
import * as ling from '@cluesurf/calm-linguistics'

const calm = new Calm<Base>()

// Register every Wave (Form / Flow / Hash / List / Fold / Find)
// with its handler.
calm.deck({
  name: 'my-app',
  fork: '0.1.0',
  waves: { ...wave, ...src, ...ling },
})
```

## Output file shape

Every generated `*.form.ts` file pairs a **TypeScript type**
with a **Zod parser** locked to that type via `satisfies
z.ZodType<...>`. The two stay in sync because TypeScript
verifies the parser produces a value compatible with the
declared type:

```typescript
// generated/form/language_string.ts
import { z } from 'zod'

export type LanguageString = {
  id:           string
  text:         string
  language__id: string
  cefr_level?:  'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}

export const language_string_parser = z.object({
  id:           z.string(),
  text:         z.string().min(1, 'text is required'),
  language__id: z.string(),
  cefr_level:   z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional(),
}) satisfies z.ZodType<LanguageString>
```

The `satisfies z.ZodType<LanguageString>` clause is the
glue. Drift between the type and the parser becomes a
TypeScript compile error — impossible to ship a parser whose
output doesn't match its declared type.

### Per-Form output

```typescript
// generated/form/<name>.ts
import { z } from 'zod'

export type <NameInPascal> = { /* fields */ }

export const <name>_parser = z.object({ /* validators */ })
  satisfies z.ZodType<<NameInPascal>>
```

### Per-Form-with-cases output

```typescript
// generated/form/<name>.ts
import { z } from 'zod'

export type <Name> =
  | { case: 'a'; /* a's fields */ }
  | { case: 'b'; /* b's fields */ }

export const <name>_parser = z.discriminatedUnion('case', [
  z.object({ case: z.literal('a'), /* ... */ }),
  z.object({ case: z.literal('b'), /* ... */ }),
]) satisfies z.ZodType<<Name>>
```

### Per-Flow output (input / output split)

```typescript
// generated/flow/<name>.ts
import { z } from 'zod'

export type <Name>Input = { /* take fields */ }

export type <Name>Output = /* the `like` type */

export const <name>_input_parser = z.object({ /* ... */ })
  satisfies z.ZodType<<Name>Input>

// the handler signature flows from the schema:
export type <Name>Handler = (args: <Name>Input) => <Name>Output
```

### Per-Hash / Per-List output

```typescript
// generated/hash/<name>.ts
import { z } from 'zod'

export type <Name> = Record<string, <ValueType>>

export const <name>_parser = z.record(z.string(), <valueParser>)
  satisfies z.ZodType<<Name>>
```

```typescript
// generated/list/<name>.ts
import { z } from 'zod'

export type <Name> = <ItemType>[]

export const <name>_parser = z.array(<itemParser>)
  satisfies z.ZodType<<Name>>
```

### Per-Fold / Per-Find output

Folds and Finds are just typed Casts; their generated file is
the same paired pattern. Their `like`-derived type is the
shape of the `Cast` (a tree of Calls or a query shape), and
the parser walks the AST to validate it.

### Why `satisfies` instead of explicit annotation

```typescript
// BAD — type annotation, parser is the source of truth
export const language_string_parser: z.ZodType<LanguageString> = z.object({ /* ... */ })
//                                  ^ widens the parser; loses inference
```

```typescript
// GOOD — `satisfies`, type narrows but isn't the declared shape
export const language_string_parser = z.object({ /* ... */ })
  satisfies z.ZodType<LanguageString>
//          ^ verifies compatibility without widening
```

`satisfies` keeps the parser's *inferred* type (so chaining
methods like `.refine(...)` keep working) AND verifies it
satisfies the static type. The type annotation form would
widen the parser to `z.ZodType<LanguageString>` and erase
the chain-friendly narrow type.

### Bundled `Base` references the per-export types

The aggregate `Base` interface (in
`generated/Base.d.ts`) imports each per-export type from its
generated file rather than redeclaring it:

```typescript
// generated/Base.d.ts
import type { LanguageString }   from './form/language_string'
import type { IsIpaInput, IsIpaOutput } from './flow/is_ipa'
// ...

declare module '@cluesurf/calm' {
  interface Base {
    language_string: LanguageString
    'is_ipa': { take: IsIpaInput; like: IsIpaOutput }
    // ...
  }
}
```

One source of truth per type. The bundle is just an index.

## Migration from form.js's `save` field

Existing form.js schemas with `save` paths translate
mechanically:

1. **Remove** the `save:` line from each schema.
2. **Build** the codegen config once, with a `resolve`
   function that mimics the old `save` paths during the
   transition:
   ```typescript
   resolve: ({ name }) => {
     // map each old save path to its new resolved location
     const SAVE_MAP: Record<string, string> = {
       ffmpeg_codec_data: './code/form/object/ffmpeg/codec_data.ts',
       // ...
     }
     return SAVE_MAP[name] ?? null
   }
   ```
3. **Run codegen**, verify output paths match.
4. **Replace** the SAVE_MAP with a layout (`'name'` is usually
   close to the old behavior since save paths typically
   followed the constant name).

Tooling: a `calm migrate-save` script reads the existing
`save` fields, generates the SAVE_MAP, then strips the
`save:` lines. Single one-shot operation per package.

## Why this design

### Schemas are values, not config

The schema declares a value of type `Form` (or `Flow`, etc.).
Values shouldn't know where they're stored on disk — that's a
binding from name to location, which lives elsewhere.

This is the same separation as **TypeScript types vs
filesystem layout**. A `type Foo = { ... }` doesn't declare
where its source file lives; the import path does. Calm
follows the same convention for its first-class types
(Form / Flow / etc.).

### Libraries become reusable

With `save:` baked in, a library that exported
`save: '~/code/form/object/...'` would force every consumer to
adopt that directory tree. Calm libraries ship pure values;
consumers compose them however their codebase prefers.

### One source of truth for the name

The exported `const some_name` IS the schema's identity.
Codegen, the bundled `Base` interface, the editor, the
runtime dispatcher — all key off the same name. No path-vs-
name disagreements.

### Hot reload and IDE-friendliness

Schemas with embedded paths broke when files moved (the path
hint became stale). Schemas without paths move freely; the
codegen config catches up on the next build, and TypeScript
import paths are the only thing the IDE renames.

## Edge cases

### Multiple targets

A consumer that wants generated artifacts in multiple
locations (e.g., one for the runtime, one for an embedded
playground) runs `makeBase` multiple times with different
`output:` blocks. Same `waves`, different output paths.

### Per-emit fan-out

The three artifact streams (`type`, `parser`, `base`) can land
in different places via the resolver:

```typescript
resolve: ({ name, kind, emit }) => {
  if (emit === 'parser') return `./my-app/code/parsers/${name}.ts`
  if (emit === 'type')   return `./my-app/code/types/${name}.ts`
  return `./my-app/code/calm/${kind}/${name}.ts`
}
```

This separates Zod parsers (runtime data) from TypeScript
types (compile-time only) for build pipelines that want them
in distinct directories.

### Bundled-output paths

The aggregate outputs (`Base.d.ts`, `BaseCompiled.d.ts`,
`CodeMap.d.ts`) have their own config field:

```typescript
output: {
  base: './my-app/code/calm',
  layout: 'kind',
  bundle: {
    base:         './my-app/code/calm/Base.d.ts',
    baseCompiled: './my-app/code/calm/BaseCompiled.d.ts',
    codeMap:      './my-app/code/calm/CodeMap.d.ts',
  },
}
```

Defaults are sensible (`{base}/Base.d.ts` etc.); override only
when the runtime needs them somewhere specific.

### Multi-package monorepo

In a workspace where multiple packages each call `makeBase`,
each package gets its own `Base` interface bundle. The host
that combines them sees the union via `declare module`
augmentation (see [`types.md`](./types.md)).

Each package has full control over its own output tree
without interfering with siblings.

### Library handler defaults

Libraries that ship reference handlers expose them as
`<flow_name>_handler` exports. Consumers can:
- Use the default (re-export `*`).
- Override per-flow (re-export `*`, then export your own).
- Skip the library handlers entirely (write your own
  `<flow_name>_handler` exports without the `export *`).

The default-with-override pattern matches how React / Vue /
etc. allow theme defaults to be selectively overridden.

## Project layout

The canonical calm package layout:

```
calm/code/
  form/                      # the schema DSL (absorbed from form-DSL)
    type.ts
    build.ts
    parse.ts
  flow/                      # the AST builder DSL (`flow.*`)
    type.ts
    build.ts
  base/                      # the registered Flows + handlers + Forms
    is/
      ipa/
        broad/
          make.ts            # the Flow / Form definition (declaration)
          flow.ts            # the implementation (handler)
        narrow/
          make.ts
          flow.ts
        make.ts              # bare `is(ipa)` (no sub-case)
        flow.ts
      equal/
        make.ts
        flow.ts
      ...
    make/
      ...
```

`code/base/` holds **everything authored**: every Flow, Form,
Hash, List, Fold, Find — organized as `<verb>/<base>/<case>/`.

Each leaf folder holds at most two hand-written files:

| file | what |
|---|---|
| `make.ts` | the declaration — `Form` / `Flow` / `Hash` / `List` / `Fold` / `Find` definition |
| `flow.ts` | the implementation — handler function for a Flow (omitted for non-Flow leaves) |

Same naming everywhere: `make.ts` is "make this thing"
(declaration), `flow.ts` is "the handler / what flows."

## Per-folder generated files

Codegen emits **three files alongside** every `make.ts`:

| file | what |
|---|---|
| `index.ts` | TypeScript types — paired type declarations the host imports |
| `form.ts` | Zod parsers — `z.object({...}) satisfies z.ZodType<T>` from `./index` |
| `base.ts` | hashes and lists exported as runtime values; per-folder catalog re-exports |

Layout after codegen:

```
code/base/is/ipa/broad/
  make.ts                    # hand: the declaration
  flow.ts                    # hand: the handler
  index.ts                   # gen: TS types (IsIpaBroadInput, IsIpaBroadOutput)
  form.ts                    # gen: Zod parsers, satisfies the index types
  base.ts                    # gen: runtime catalog re-exports for this leaf
```

`make.ts` and `flow.ts` are gitignored only when explicitly
generated; normally the human writes them. `index.ts`,
`form.ts`, `base.ts` are always gitignored — pure codegen.

## How the three generated files relate

```
        make.ts (hand)             flow.ts (hand)
            │                          │
            │ codegen reads            │ codegen reads
            ▼                          ▼
        index.ts (gen)             (handler is wrapped
        ─────────                    by registry binding,
        export type T = …           not regenerated)
            │
            │ form.ts imports type
            ▼
        form.ts (gen)
        ─────────
        export const t_parser =
          z.object({...})
          satisfies z.ZodType<T>
            │
            │ base.ts re-exports
            ▼
        base.ts (gen)
        ─────────
        export * from './index'
        export * from './form'
        export const t_handler = … // re-export of flow.ts handler
```

Reading order for a host:

1. `import type { IsIpaBroadInput } from '...base/is/ipa/broad'` —
   pulls from `index.ts`.
2. `import { is_ipa_broad_parser } from '...base/is/ipa/broad/form'` —
   pulls Zod parser.
3. `import { is_ipa_broad_handler } from '...base/is/ipa/broad/flow'` —
   pulls handler.
4. `import * from '...base/is/ipa/broad/base'` — pulls everything as a
   namespace.

The folder's `base.ts` is the union; `index.ts` / `form.ts` /
`flow.ts` are individual sub-pieces.

## The package-level `base.ts`

The top of the source tree (`code/base/base.ts`, generated)
rolls up every leaf's `base.ts` into the bundled namespace,
plus emits the `Base` aggregate type:

```typescript
// code/base/base.ts (generated)
import type IsIpaBroad      from './is/ipa/broad/index'
import type IsIpa           from './is/ipa/index'
import type IsEqual         from './is/equal/index'
// ... every leaf

type Base = {
  is_ipa_broad: { take: IsIpaBroad['Input']; like: IsIpaBroad['Output'] }
  is_ipa:       { take: IsIpa['Input'];      like: IsIpa['Output'] }
  is_equal:     { take: IsEqual['Input'];    like: IsEqual['Output'] }
  // ... every authored constant
}

export default Base

// Plus runtime exports:
export { is_ipa_broad_parser } from './is/ipa/broad/form'
export { is_ipa_broad_handler } from './is/ipa/broad/flow'
// ... etc
```

The host's runtime imports this:

```typescript
import { Calm } from '@cluesurf/calm'
import type Base from '@cluesurf/calm/base'

const calm = new Calm<Base>()
calm.deck(/* the bundled namespace from base.ts */)
```

## Calm package internals

```
@cluesurf/calm/code/
  form/                       # schema DSL primitives
    type.ts                   # Form, Flow, Hash, List, Fold, Find type defs
    build.ts                  # builder helpers
    parse.ts                  # runtime parsers
  flow/                       # AST builder DSL (`flow.*`)
    type.ts                   # AST node types (Call, Read, View, Fork, Walk, BaseText, ...)
    build.ts                  # flow.call(), flow.read(), flow.list(), ...
  make/                       # the codegen entry
    index.ts                  # makeBase() and friends
  runtime/                    # the Calm class, dispatcher, evaluator
    index.ts                  # the Calm class
    evaluator.ts              # the wake-form walker
    compiler.ts               # make → wake transformation
    cache.ts                  # memoization for incremental recompilation
  base/                       # the standard catalog (the seed Flows)
    is/
    has/
    make/
    get/
    find/
    if/
    bind/
    walk/
    validate/
```

## Library layout

```
@cluesurf/calm-linguistics/
  code/
    form/                     # this library's source DSL (rare; usually re-exported)
    base/                     # this library's authored constants
      is/
        ipa/                  # is.ipa, is.ipa.broad, is.ipa.narrow
        pinyin/
        wylie-tibetan/
        iast/
      ...
    base.ts                   # (generated) the bundled Base for this library
```

The library's `package.json` `main` points at the generated
`base.ts`. Consumers import:

```typescript
import type Base from '@cluesurf/calm-linguistics/base'
import * as ling from '@cluesurf/calm-linguistics/base'
```

## Consumer host layout

```
my-app/
  code/
    base/                     # the host's authored constants
      lookup/
        language/
          make.ts             # the host's lookup.language Flow
          flow.ts             # async handler with DB access
      ...
    base.ts                   # (generated) the host's bundled Base
  codegen.ts                  # ONE script that calls makeBase
  src/
    runtime.ts                # imports + composes Bases, instantiates Calm
```

The split is rigid: **declarations in `code/base/<...>/make.ts`,
handlers in `code/base/<...>/flow.ts`, generated artifacts
alongside (`index.ts`, `form.ts`, `base.ts`)**.

## Summary

- **Schemas don't carry paths.** No `save:` field. Identity is
  the exported `const` name.
- **Codegen config is separate.** `makeBase({ waves, output })`
  takes the schemas and decides where artifacts land.
- **Three layered output strategies** — layout convention,
  per-name overrides, resolver function — composable.
- **Libraries are pure values.** Schemas + optional handlers;
  consumers wire the output.
- **Handlers wire by name convention** — `<flow_name>_handler`.
  Override via re-export.
- **The bundled `Base` aggregate** is part of the codegen
  output, generated once per consumer build.
