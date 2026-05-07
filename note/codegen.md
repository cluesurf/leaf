# Codegen

How calm generates TypeScript types and runtime artifacts from
authored schemas. And how those concerns stay decoupled from
where the generated code lives.

## The decoupling principle

A `Form`, `Flow`, `Hash`, `List`, `Fold`, or `Find` declares
**what it is**. It does not declare **where it lives**.

```typescript
// good. No path info
export const ffmpeg_codec_data: Form = {
  form: 'form',
  link: {
    label: { like: 'string' },
    type:  { like: 'string', need: false },
    lossy: { like: 'boolean' },
    // ...
  },
}

// bad. Schema knows its codegen target (form.js's old `save` field)
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
   directories, rename folders, restructure the monorepo. 
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

A consumer (host or downstream library) writes one codegen
script. The pattern is imperative. Instantiate a `Make`,
link source modules to their target output paths, then save:

```typescript
import Make from '@cluesurf/calm/make'

import * as ipa       from './somewhere/ipa/make'
import * as language  from './somewhere/language/make'
import * as is_string from './somewhere/is/string/make'
// ... import every authored `make.ts` source module

const make = new Make()

make.link('./somewhere/ipa', ipa)
make.link('./somewhere/language', language)
make.link('./somewhere/is/string', is_string)
// ... many more

make.save()                          // emits all the generated files
```

Each `make.link(path, module)` call registers one source
namespace at a chosen output path. The `Make` instance
collects every link, then `make.save()` walks them and emits
the per-folder `index.ts` / `form.ts` / `base.ts` artifacts.

Sources are imported once at the top of the codegen script.
The compiler scans every export typed as `Form`, `Flow`,
`Hash`, `List`, `Fold`, or `Find` and dispatches it to the
right emit slot.

After codegen, the host's runtime imports the generated
artifacts and wires them up to the `Calm` instance:

```typescript
import { Calm } from '@cluesurf/calm'
import type Base from './somewhere/base'        // generated bundled type

import * as ipa       from './somewhere/ipa/base'        // generated catalog
import * as language  from './somewhere/language/base'
// ...

const calm = new Calm<Base>()
calm.deck({ ...ipa, ...language /* ... */ })

calm.flow('is', { base: 'string' }, ({ link }) => /* ... */)
//                        ↑
//   typechecked against Base['is_string']
```

The author's flow-registration call (`calm.flow(...)`) is
typed by the generated `Base` interface. Names, bases, cases,
arg shapes, and return types all resolve through it. No
hand-written annotations needed.

## Make class API

```typescript
class Make {
  link(path: string, source: SourceModule): void
  unlink(path: string): void
  save(): Promise<void>
}

type SourceModule = Record<string, Form | Flow | Hash | List | Fold | Find>
```

`make.link(path, source)` registers a source module at the
given output path. Calling `link` again with the same path
replaces the previous binding.

`make.save()` walks every linked path, runs codegen for each,
and writes the generated `index.ts` / `form.ts` / `base.ts`
files alongside the source `make.ts`.

Default behavior: codegen output lands **alongside** the
source. `make.link('./somewhere/ipa', ipa)` writes
`./somewhere/ipa/index.ts`, `./somewhere/ipa/form.ts`,
`./somewhere/ipa/base.ts`.

For more control over output placement (separate output tree,
per-name overrides, resolver function), pass options to the
constructor. See "Three layered output strategies" below.

## Three layered output strategies

The default. Output written alongside each linked source
path. Covers most cases. For consumers who want generated
artifacts in a different tree, the `Make` constructor takes
options. Layered from simplest to most flexible.

### 1. Layout convention (zero config)

The simplest case: tell the codegen one base directory and a
layout style. Calm derives every output path from name and
primitive type.

```typescript
const make = new Make({
  output: {
    base: './my-app/code/calm',
    layout: 'kind',     // 'kind' | 'flat' | 'mirror' | 'name'
  },
})
```

Layouts:

- **`'kind'`**. Group by primitive type:
  ```
  ./my-app/code/calm/
    form/<name>.ts
    flow/<name>.ts
    hash/<name>.ts
    list/<name>.ts
    fold/<name>.ts
    find/<name>.ts
  ```
- **`'flat'`**. Every constant in one folder:
  ```
  ./my-app/code/calm/
    <name>.ts
  ```
- **`'mirror'`**. Mirror the source module's import path:
  ```
  ./my-app/code/calm/
    <relative-path-from-source>.ts
  ```
- **`'name'`**. Use underscore segments of the constant's name as
  folders:
  ```
  ./my-app/code/calm/
    is/ipa/broad.ts          # is_ipa_broad
    make/sum.ts              # make_sum
    ffmpeg/codec/data.ts     # ffmpeg_codec_data
  ```

90% of consumers pick one layout and never write per-name
overrides.

### 2. Per-name overrides (targeted)

For the constants that don't fit the chosen layout. Common
when integrating a library whose names don't align with the
consumer's structure.

```typescript
const make = new Make({
  output: {
    base: './my-app/code/calm',
    layout: 'kind',
    override: {
      ffmpeg_codec_data: './my-app/code/legacy/ffmpeg/codec.ts',
      is_ipa:            './my-app/code/linguistics/ipa/check.ts',
    },
  },
})
```

The override map takes precedence over the layout. Names not
in the map fall through to the layout default.

### 3. Resolver function (programmatic)

Full control: a function that takes (name, kind, source-info)
and returns the output path.

```typescript
const make = new Make({
  output: {
    resolve: ({ name, kind, linkPath }) => {
      if (linkPath.startsWith('vendor/')) {
        return `./my-app/code/vendor/${name}.ts`
      }
      if (kind === 'flow' && name.startsWith('is_')) {
        const [, base, ...rest] = name.split('_')
        return `./my-app/code/check/${base}/${rest.join('-')}.ts`
      }
      return `./my-app/code/calm/${kind}/${name}.ts`
    },
  },
})
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
const make = new Make({
  output: {
    base: './my-app/code/calm',
    layout: 'kind',
    override: {
      welcome_guide: './my-app/code/docs/welcome.ts',
    },
    resolve: ({ name, kind, linkPath }) => {
      if (linkPath.startsWith('vendor/')) {
        return `./my-app/code/vendor/${kind}/${name}.ts`
      }
      return null  // null falls through to layout + override
    },
  },
})
```

Resolution order: `override` → `resolve` (if returns string)
→ `layout` → default (write alongside the linked source).

The resolver receives:

```typescript
type ResolverInput = {
  name: string                  // the constant's exported name
  kind: 'form' | 'flow' | 'hash' | 'list' | 'fold' | 'find'
  linkPath: string              // the path passed to make.link()
  emit: 'index' | 'form' | 'base'   // which artifact
}
```

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
import Make from '@cluesurf/calm/make'

import * as ipa            from './my-app/code/base/is/ipa/make'
import * as language_string from './my-app/code/base/form/language_string/make'
import * as is_ipa         from './my-app/code/base/is/ipa/make'
// ... import every authored make.ts in this app

const make = new Make({
  output: {
    base: './my-app/code/calm',
    layout: 'kind',
    override: {
      welcome_guide: './my-app/site/docs/welcome.ts',
    },
  },
})

make.link('./my-app/code/base/is/ipa', ipa)
make.link('./my-app/code/base/form/language_string', language_string)
// ... many more

await make.save()
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

Each leaf folder under `code/base/<verb>/<base>/<case>/`
contains:

```
make.ts        # hand:  the declaration
flow.ts        # hand:  the handler (Flows only)
index.ts       # gen:   TypeScript types
form.ts        # gen:   Zod parsers, satisfies the index types
base.ts        # gen:   leaf catalog re-exports
```

The three generated files (`index.ts`, `form.ts`, `base.ts`)
have stable shapes per primitive kind, described below. They
import from one another in a fixed order:

- `index.ts` exports type declarations only.
- `form.ts` imports types from `./index` and exports Zod
  parsers locked to those types via `satisfies z.ZodType<T>`.
- `base.ts` re-exports both, plus the handler from `./flow`.

### `index.ts`. TypeScript types

For a Form, paired Cast type:

```typescript
// code/base/form/language_string/index.ts (gen)

export type LanguageString = {
  id:           string
  text:         string
  language__id: string
  cefr_level?:  'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
}
```

For a Flow, paired Input + Output:

```typescript
// code/base/is/ipa/broad/index.ts (gen)

export type IsIpaBroadInput = { text: string }
export type IsIpaBroadOutput = boolean
export type IsIpaBroadHandler = (args: IsIpaBroadInput) => IsIpaBroadOutput
```

For a Form with cases (sum type):

```typescript
// code/base/form/result/index.ts (gen)

export type Result =
  | { case: 'okay';  value: string }
  | { case: 'error'; value: string }
```

For a Hash:

```typescript
// code/base/hash/ffmpeg_codecs/index.ts (gen)

export type FfmpegCodecs = Record<string, { label: string; lossy: boolean }>
```

For a List:

```typescript
// code/base/list/ipa_symbols/index.ts (gen)

export type IpaSymbols = string[]
```

### `form.ts`. Zod parsers

Always `import type` from `./index` and lock with `satisfies`:

```typescript
// code/base/form/language_string/form.ts (gen)
import { z } from 'zod'
import type { LanguageString } from './index'

export const language_string_parser = z.object({
  id:           z.string(),
  text:         z.string().min(1, 'text is required'),
  language__id: z.string(),
  cefr_level:   z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional(),
}) satisfies z.ZodType<LanguageString>
```

For a Flow (input parser):

```typescript
// code/base/is/ipa/broad/form.ts (gen)
import { z } from 'zod'
import type { IsIpaBroadInput } from './index'

export const is_ipa_broad_input_parser = z.object({
  text: z.string(),
}) satisfies z.ZodType<IsIpaBroadInput>
```

For a Form-with-cases (discriminated union):

```typescript
// code/base/form/result/form.ts (gen)
import { z } from 'zod'
import type { Result } from './index'

export const result_parser = z.discriminatedUnion('case', [
  z.object({ case: z.literal('okay'),  value: z.string() }),
  z.object({ case: z.literal('error'), value: z.string() }),
]) satisfies z.ZodType<Result>
```

For a Hash:

```typescript
// code/base/hash/ffmpeg_codecs/form.ts (gen)
import { z } from 'zod'
import type { FfmpegCodecs } from './index'

export const ffmpeg_codecs_parser = z.record(
  z.string(),
  z.object({ label: z.string(), lossy: z.boolean() }),
) satisfies z.ZodType<FfmpegCodecs>
```

For a List:

```typescript
// code/base/list/ipa_symbols/form.ts (gen)
import { z } from 'zod'
import type { IpaSymbols } from './index'

export const ipa_symbols_parser = z.array(z.string())
  satisfies z.ZodType<IpaSymbols>
```

### `base.ts`. Leaf catalog re-exports

The folder's bundled namespace. Pulls in everything in the
leaf so consumers get one import:

```typescript
// code/base/is/ipa/broad/base.ts (gen)
export type * from './index'
export * from './form'
export { is_ipa_broad_handler } from './flow'

// re-exports for the bundle aggregator:
import type { IsIpaBroadInput, IsIpaBroadOutput } from './index'
export type IsIpaBroadEntry = {
  take: IsIpaBroadInput
  like: IsIpaBroadOutput
}
```

For Hashes and Lists, `base.ts` additionally **exports the
runtime data** (the literal values, since Hashes and Lists
are data, not just types):

```typescript
// code/base/hash/ffmpeg_codecs/base.ts (gen)
export type * from './index'
export * from './form'
export { ffmpeg_codecs } from './make'   // the runtime data exported from make.ts
```

```typescript
// code/base/list/ipa_symbols/base.ts (gen)
export type * from './index'
export * from './form'
export { ipa_symbols } from './make'     // the runtime data exported from make.ts
```

### Per-Fold / Per-Find output

Folds and Finds are just typed Casts; same three-file pattern.
Their `like`-derived type is the shape of the `Cast` (a tree of
Calls or a query shape), and the parser walks the AST to
validate it.

### Why `satisfies` instead of explicit annotation

```typescript
// BAD. Type annotation, parser is the source of truth
export const language_string_parser: z.ZodType<LanguageString> = z.object({ /* ... */ })
//                                  ^ widens the parser; loses inference
```

```typescript
// GOOD. `satisfies`, type narrows but isn't the declared shape
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
Values shouldn't know where they're stored on disk. That's a
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
runtime dispatcher. All key off the same name. No path-vs-
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
playground) constructs multiple `Make` instances with different
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

In a workspace where multiple packages each run their own `Make`,
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
Hash, List, Fold, Find. Organized as `<verb>/<base>/<case>/`.

Each leaf folder holds at most two hand-written files:

| file | what |
|---|---|
| `make.ts` | the declaration. `Form` / `Flow` / `Hash` / `List` / `Fold` / `Find` definition |
| `flow.ts` | the implementation. Handler function for a Flow (omitted for non-Flow leaves) |

Same naming everywhere: `make.ts` is "make this thing"
(declaration), `flow.ts` is "the handler / what flows."

## Per-folder generated files

Codegen emits **three files alongside** every `make.ts`:

| file | what |
|---|---|
| `index.ts` | TypeScript types. Paired type declarations the host imports |
| `form.ts` | Zod parsers. `z.object({...}) satisfies z.ZodType<T>` from `./index` |
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
`form.ts`, `base.ts` are always gitignored. Pure codegen.

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

1. `import type { IsIpaBroadInput } from '...base/is/ipa/broad'`. 
   pulls from `index.ts`.
2. `import { is_ipa_broad_parser } from '...base/is/ipa/broad/form'`. 
   pulls Zod parser.
3. `import { is_ipa_broad_handler } from '...base/is/ipa/broad/flow'`. 
   pulls handler.
4. `import * from '...base/is/ipa/broad/base'`. Pulls everything as a
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
    index.ts                  # the `Make` class and its codegen
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
  codegen.ts                  # ONE script that calls `make.save()`
  src/
    runtime.ts                # imports + composes Bases, instantiates Calm
```

The split is rigid: **declarations in `code/base/<...>/make.ts`,
handlers in `code/base/<...>/flow.ts`, generated artifacts
alongside (`index.ts`, `form.ts`, `base.ts`)**.

## Summary

- **Schemas don't carry paths.** No `save:` field. Identity is
  the exported `const` name.
- **Codegen config is separate.** `new Make({ output })` then `make.link(...)` then `make.save()`
  takes the schemas and decides where artifacts land.
- **Three layered output strategies**. Layout convention,
  per-name overrides, resolver function. Composable.
- **Libraries are pure values.** Schemas + optional handlers;
  consumers wire the output.
- **Handlers wire by name convention**. `<flow_name>_handler`.
  Override via re-export.
- **The bundled `Base` aggregate** is part of the codegen
  output, generated once per consumer build.
