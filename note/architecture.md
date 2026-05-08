# Architecture

The four core types/classes calm exposes, and how they relate.

## The four pieces

| name   | shape | role                                                        |
| ------ | ----- | ----------------------------------------------------------- |
| `Book` | type  | a published bundle (forms + flows + folds + hashes + lists) |
| `Code` | type  | generated registry: every entry's colon-key → its type      |
| `Base` | class | runtime: registers flow handlers AND dispatches calls       |
| `Make` | class | codegen orchestrator: reads base, emits the bundle          |

Two of them are runtime classes (`Base`, `Make`). Two are pure types
(`Book`, `Code`). Each one has exactly one job; the names are short on
purpose.

## `Book` (type)

A `Book` is a published bundle of schemas and data. Forms, Flows, Folds,
Hashes, Lists, plus a `host` + `name` pair that identifies where the
bundle came from.

```typescript
type Book = {
  host?: string // optional metadata
  name?: string // optional metadata
  base?: (Form | Flow | Fold | Hash | List)[]
}
```

`base` is a single mixed array of every declaration the Book ships.
Codegen dispatches each entry by its `form:` discriminant (`'form'` /
`'flow'` / `'fold'` / `'hash'` / `'list'`). The order of entries doesn't
matter; identity is in the reserved props.

`host` + `name` are optional informational labels. They do NOT
participate in colon-key generation. Calm assumes **globally unique
entry names** across all registered base; codegen errors if two base
contribute entries with colliding identity tuples (see "Duplicate
detection" below).

```typescript
const cluesurfBase: Book = {
  host: 'cluesurf',
  name: 'base',
  base: [
    /* every Form / Flow / Fold / Hash / List, in any order */
  ],
}
```

base are plain data. Composing two base, patching one Book's flows in
another, filtering entries — all of those are just object operations on
the Book value before it reaches `Make`.

## `Code` (type)

`Code` is the generated giant type. Every entry across every registered
Book gets one key in this union. Kysely's `DB` equivalent.

```typescript
type Code = {
  'flow:<name>:<base?>:<case?>': Type
  'form:<cast>:<call?>:<case?>': Type
  // ...one entry per Form / Flow / Fold / Hash / List
}
```

The codegen pass walks every registered Book, expands each entry to its
colon-key, and writes the unified `Code` type into the bundle's
`index.ts`. The runtime class is generic over a specific `Code` type;
type inference flows from there.

`Code` is the only type-level object that touches every entry in the
host's bundle. Everything else (Forms, Flows, handlers, calls) is
per-entry.

### Duplicate detection

Calm assumes globally unique entry identity across every registered
Book. At `make.save()` time, codegen checks for collisions:

- **Forms** are identified by the tuple `(cast, call, case)`. Two Forms
  across any registered base with the same triple are duplicates —
  codegen gathers all collisions and throws one error listing them.
- **Flows** are identified by the tuple
  `(name, base, case, take, make)`. Two Flows with the same identity
  tuple are duplicates.

If you want two variants of "the same" verb to coexist, give them
different `case` values (or different `base` values). The triple
disambiguates them.

## `Base` (class)

`Base` is the **runtime**. One class handles both registering flow
handler implementations AND dispatching calls at execution time.

```typescript
class Base<T extends Code> {
  // Register a handler against a flow's compiled id (number)
  // or its colon-key (string).
  flow(
    idOrKey: number | string,
    input: Input,
    handler: () => Output,
  ): void

  // Invoke a registered flow.
  call<Input>(idOrKey: number | string, input: Input): Call<T, Input>
}
```

Generic over `T extends Code` — the host's specific bundled type. Type
inference on `flow(...)` and `call(...)` resolves the `Input` and
`Output` types from `T` based on the id-or-key. The host writes:

```typescript
import type Code from './libs'   // generated
import { Base }  from '@cluesurf/calm'

const base = new Base<Code>()

base.flow('select', { base: 'language' },                 input => /* ... */)
base.flow('select', { base: 'language', case: 'ancient' }, input => /* ... */)

const result = base.call('select', { base: 'language', id: 'lang_en' })
```

The Flow's verb is the first argument; an options object carries `base`
and optional `case`; the handler comes last. Calling mirrors the same
shape — verb + base/case + the take-side payload merged into one object.

One class for both phases. Registration and dispatch share the same
lookup table — no handoff between separate registration and execution
objects. Calls dispatched before all handlers register throw at runtime.

The compiled-call rewrite still applies: codegen replaces string-literal
call sites with their numeric ids during `make.save()`, so the typical
hot-path `base.call(...)` runs against an integer index, not a string.

## `Make` (class)

`Make` is the **codegen orchestrator**. Reads registered base from the
consumer's codegen script, walks their contents, emits the four-file
bundle (`index.ts`, `form.ts`, `base.ts`, `flow.ts`).

```typescript
class Make {
  constructor(take: MakeTake)

  private base: Book[]

  book(book: Book): this {
    this.base.push(book)
    return this
  }

  // Compile and check everything, then save to outputs.
  save(): Promise<void>
}

type MakeTake = {
  link: string // root output folder
}
```

The constructor takes a `MakeTake` — just `link` for the output folder.
No host/name — the consuming host doesn't need an identity prefix
because Code keys don't carry one.

`make.book(book)` registers a Book. That's the entire registration
surface — no builder, no chained pickers, no per-entry overrides at the
`Make` layer. Customization happens at the Book level (compose, patch,
filter the Book value before passing it in).

`make.save()` does three things in order:

1. Compile each registered Book's entries to their flat per-leaf
   representation.
2. Check the union for cross-Book reference correctness, colon-key
   collisions, missing input/output Form pairs, etc.
3. Save the generated files into the configured output directory.

`Make` doesn't run handlers and doesn't dispatch calls. It's purely a
build-time step.

A typical lifecycle:

```
new Make() + several .book(...) calls   ← register base
make.save()                              ← codegen, build time
   ↓
Code  +  generated bundle                ← types + runtime artifacts
   ↓
new Base<Code>() + .flow(...) calls      ← register handlers
   ↓
base.call(...)                           ← every runtime invocation
```

## How calls flow through the system

End-to-end, a single user-triggered call:

1. **Author time**: a developer writes a flow handler against
   `Base<Code>`. The `Code` type guarantees the handler's shape matches
   the declared Flow.
2. **Build time**: `Make` reads every registered Book, walks their
   entries, emits the bundle. The `Code` type is now frozen; numeric ids
   are assigned per entry.
3. **Codegen rewrite**: every authored
   `base.call('verb', { base: 'noun', ...args })` in source gets
   rewritten to `base.call(numericId, { ...args })`.
4. **Runtime**: `base.call(numericId, args)` looks up the handler
   `base.flow(...)` registered for that id, dispatches. The return value
   is typed against `Code[key].make` (the output side of the matching
   Form pair, see [`schema.md`](./schema.md)).

The compiled-call path never sees the colon-key. Strings exist for
authoring + debug; integers exist for dispatch.
