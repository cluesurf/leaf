# Structure

How bead works, top to bottom. The vocabulary, the primitives,
the AST, and the lifecycle. Read this after `goals.md`; read
it before the deeper specs.

## Vocabulary

Bead has **two type/instance pairs** at the schema level,
plus four core architectural pieces (two types, two classes)
that frame the system end-to-end.

### Schema layer

| layer | type (declaration) | instance (occurrence) |
|---|---|---|
| **data** | `Form` | a record (instance with `form: <cast>`) |
| **function** | `Flow` | `Call` |

- A **`Form`** declares a data shape. A **`Fold`** is a Form
  whose instances are tree-shaped — a document template made
  of Calls and slots.
- A **`Flow`** declares a function: its name, optional base
  resource, optional case variant, optional take (input), and
  optional make (output).
- A **`Call`** is a node in the AST invoking a Flow.

A **`Cast`** is the umbrella type for any JSON object bead
processes — whether a Form declaration, a Flow declaration,
a Call AST node, a record instance, or a Fold. Every value
in the system is a Cast of some kind, distinguished by its
`form:` discriminant. When a doc says "a Cast," it means
"a JSON object handled by the runtime."

See [`schema.md`](./schema.md) for the reserved props on
each.

### Architectural pieces

The system has four core pieces. Two are types, two are
classes. See [`architecture.md`](./architecture.md) for the
full mapping.

| name   | shape | role                                                  |
|--------|-------|-------------------------------------------------------|
| `Book` | type  | a published bundle (forms + flows + folds + hashes + lists) |
| `Code` | type  | generated registry: every entry's colon-key → its type |
| `Base` | class | runtime: registers flow handlers AND dispatches calls |
| `Make` | class | codegen orchestrator: reads Books, emits the bundle   |

- **`Book`** is what an upstream library ships. Plain data.
  Has optional `host` + `name` metadata plus a single `base`
  array of mixed declarations (Forms / Flows / Folds /
  Hashes / Lists).
- **`Code`** is what `Make` emits — the giant TypeScript
  type. Kysely's `DB` equivalent.
- **`Base`** is the runtime class the host instantiates as
  `new Base<Code>()`. Where flow handlers register and where
  calls dispatch.
- **`Make`** is the build-time class that walks registered
  Books and produces the bundle.

### Why these names

- **`Form`**. A mold for data. Inherited from Seed.
- **`Flow`**. A function defined by what flows in (`take`)
  and out (`make`).
- **`Call`**. Invoking a Flow. Literal English for "make a
  call to this function."
- **`Fold`**. A Form whose instances are tree-shaped.
  Document templates and authored documents both live as
  Folds.
- **`Book`**. A published bundle. The Book TYPE is what an
  upstream library ships; consumers register Books with
  `Make`.
- **`Code`**. The generated giant type — what the bundle's
  *code* describes. Each colon-key in `Code` maps to the
  type of one entry across all registered Books.
- **`Base`**. The runtime class. Generic over `Code`. Owns
  the registered handlers, the host chain, the caches, the
  dispatch table.
- **`Make`**. The codegen orchestrator. Reads Books, emits
  artifacts, validates the union.

```
new Base<Code>()
         ↑
    every authored Form / Flow / Hash / List / Fold across
    every registered Book, aggregated into one type
    at compile time

Base ⊃ { handlers, host, caches, dispatch table }
     ⊃ { records, Calls, Folds flowing through evaluation }
```

Nine vocabulary words at the schema layer (Form, Fold, Hash,
List, Flow, Call, Find), four architectural pieces (Book,
Code, Base, Make). The spec doesn't introduce more.

## Keyword grammar

Bead reuses the Seed-language vocabulary for declaring
schemas. Each keyword has one job:

| keyword | role | used in |
|---|---|---|
| `form` | kind discriminant (declarations + AST nodes) | Form / Flow / AST |
| `link` | a Form's field map (single shape or array of variants) | Form |
| `like` | type signature on a `Link` field; variant tag on union members | Link, union members |
| `case` | a Flow / Form variant, or (in AST) the chosen variant | Form, Flow, AST |
| `head` | a generic type parameter | Form / Flow |
| `take` | a Flow's input shape; on a `Link`, the field's allowed enum values | Flow / Link |
| `make` | a Flow's output shape | Flow |
| `need` | required-ness flag | Link |
| `base` | on a Flow: the resource acted on; on a `Link`: default value when missing; on a `Book`: the array of declarations | Flow / Link / Book |
| `cast` | the resource a Form shapes | Form |
| `call` | the action context on a Form (when scoped to a verb) | Form |
| `test` | a Call subtree that returns boolean (constraint on a Link) | Link |
| `bind` | a union member's field map; on a compiled Call, the args envelope | union members / Call (compiled) |
| `name` | the verb on a Flow / Call | Flow / Call |
| `code` | compiled flat numeric id | instances (compiled) |
| `mark` | per-instance schema-version stamp (semver) | instances (compiled) |

These words come from Seed and align with the data-modeling
discipline bead inherits from it.

## What you export

Every authored module exports `const` declarations typed as one
of the six primitive shapes bead understands:

```typescript
import type { Form, Flow, Hash, List, Fold, Find } from '@cluesurf/bead'

export const language_string: Form = { /* ... */ }   // data-shape declaration
export const is_ipa:          Flow = { /* ... */ }   // function declaration
export const ipa_symbols:     List = { /* ... */ }   // homogeneous list of literal items
export const cefr_levels:     Hash = { /* ... */ }   // record-with-dynamic-keys
export const guide_template:  Fold = { /* ... */ }   // a Tree of Calls (a document)
export const recent_strings:  Find = { /* ... */ }   // a query filter
```

Each export type has a clear role:

| type | declares | example |
|---|---|---|
| `Form` | a data shape (fields, validators) | `language_string`, `bear`, `error` |
| `Flow` | a function (verb + base + case + handler signature) | `is(ipa)`, `make(sum)`, `find(record)` |
| `Hash` | a record with dynamic keys, all values one shape | `ffmpeg_codecs` (slug → codec data) |
| `List` | a homogeneous list of literal items | `ipa_symbols`, `iso_language_codes` |
| `Fold` | a Tree of Calls (a document template) | `welcome_guide`, `paradigm_template` |
| `Find` | a query filter (find / test constraint tree) | `recent_strings`, `unverified_phonemes` |

`Fold` is what's currently called a `flow` tree in
`@cluesurf/form`'s `make/flow` builders. The JSON node tree
that the runtime evaluates. Renamed to `Fold` in bead.

`Find` is the find / test query-filter shape consolidated from
the existing query-system spec. See [`find.md`](./find.md).

A `Fold` is built with the `make.*` builder DSL:

```typescript
import { make } from '@cluesurf/bead'

export const default_filter: Find = make.call('find', {
  base: 'list',
  resource: 'language_string',
  where: { /* ... a Cast of `find` ... */ },
})
```

(The builder namespace is `flow` for backward continuity with
`@cluesurf/form`. The result type is `Fold` (or `Find` when
the tree is a query filter). The `Flow` type is the function
declaration. Several concepts using flow/Flow/Fold/Find names
. Ergonomically close, distinct in role.)

### Aggregation into one module

Exports live wherever they make sense in the source tree. 
spread across files, folders, decks, cards. **At compile time,
bead aggregates every reachable export into a single flattened
module** that the runtime loads. The aggregation mechanism is
plain `export * from './some/path'` re-exports; bead doesn't
introduce a new module-resolution layer.

```
code/form/language.ts          export const language_string: Form
code/form/ipa.ts               export const ipa_form:        Form
code/flow/is/ipa/schema.ts     export const is_ipa:          Flow
code/flow/is/ipa/handler.ts    export const is_ipa_handler:  Handler
code/flow/make/sum/schema.ts   export const make_sum:        Flow
code/fold/welcome.ts           export const welcome_guide:   Fold
code/list/ipa-symbols.ts       export const ipa_symbols:     List
code/hash/codecs.ts            export const ffmpeg_codecs:   Hash
```

Each folder rolls up via an index file:

```typescript
// code/form/index.ts
export * from './language'
export * from './ipa'

// code/flow/is/ipa/index.ts
export * from './schema'
export * from './handler'

// code/flow/is/index.ts
export * from './ipa'
export * from './broad'
// ...

// code/flow/index.ts
export * from './is'
export * from './has'
export * from './make'
// ...

// code/index.ts (the deck's entry)
export * from './form'
export * from './flow'
export * from './seed'
export * from './list'
export * from './hash'
```

The deck's `package.json` points its `main` at the compiled
top-level `code/index.ts`. The host imports the deck and gets
one flattened namespace of every authored constant:

```typescript
import * as base from '@cluesurf/bead/base'

// base.language_string, standard.is_ipa, standard.welcome_guide, ...

const base = new Base()
base.deck(base)   // ingests every Form / Flow / Hash / List / Fold
```

`base.deck(...)` walks the imported namespace, dispatches each
export to its registry slot based on its primitive type
(`Form`, `Flow`, `Hash`, `List`, `Fold`), and indexes by the
constant's name.

Names are **globally unique within the bundle** so the
aggregation step can dedupe and the runtime can dispatch by
name without per-module qualification. This mirrors
`@cluesurf/form`'s codegen behavior: each `const some_name`
declaration becomes a globally-addressable entry in the
generated catalog.

Authoring style:

- One thing per file when the export is substantial (a Form
  with many fields, a Flow with a complex handler).
- Multiple small exports per file when they're tightly related
  (all `is.iso.*` cases on one card).
- Index files are pure `export * from './...'`. No logic.
- The `code/index.ts` at the deck root is the only file the
  host's `package.json` `main` points to.

## Defining a `Form`

A `Form` declares the shape of data. Fields, types, defaults,
constraints. Pure declaration, no execution.

```typescript
import type { Form } from '@cluesurf/bead'

const language_string: Form = {
  form: 'form',
  save: '@/code/form/language',
  link: {
    id:           { like: 'string' },
    text:         { like: 'string' },
    language__id: { like: 'string' },
    cefr_level:   {
      like: 'string',
      need: false,
      take: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
  },
}
```

Reading the keywords:

- `form: 'form'`. Discriminant; this object is a Form.
- `cast`. The resource the Form shapes.
- `link`. The field map. Each entry is one field.
- `like`. The field's type.
- `need: false`. Optional (default `true`).
- `take: [...]`. Enum members for a string field.
- `base`. Default value when missing.

### Form variants (sum types)

A Form expresses variants by passing an array to `link`.
Each member uses `like` (variant tag) + `bind` (field map):

```typescript
const result: Form = {
  form: 'form',
  cast: 'result',
  link: [
    { like: 'okay',  bind: { value: { like: 'string' } } },
    { like: 'error', bind: { value: { like: 'string' } } },
  ],
}
```

Same shape as Seed's `form result` with `case okay` / `case
error`.

### Generic Forms (`head`)

Type parameters are declared with `head`:

```typescript
const box: Form = {
  form: 'form',
  cast: 'box',
  head: ['t'],
  link: { value: { like: 't' } },
}
```

## Instances of a `Form` are `Cast`s

A `Cast` is a concrete record validated against a Form:

```json
{
  "id": "ls_001",
  "text": "phonetic",
  "language__id": "lang_en",
  "cefr_level": "B1"
}
```

That's a Cast of `language_string`. Every field present, every
type matching, every enum member valid.

Casts flow through the runtime. They're the args to Flows,
the results of Flows, the leaves of every Fold. The runtime
parses incoming JSON into Casts via the Form's auto-generated
parser (Zod or equivalent).

## Defining a `Flow`

A `Flow` declares a function. Name, args, return type:

```typescript
import type { Flow } from '@cluesurf/bead'

const is_ipa: Flow = {
  name: 'is',
  case: 'ipa',
  like: 'boolean',
  take: {
    text: { like: 'string' },
  },
}

const make_lowercase: Flow = {
  name: 'make',
  case: 'lowercase',
  like: 'string',
  take: {
    text: { like: 'string' },
  },
}

const get_length: Flow = {
  name: 'get',
  case: 'length',
  like: 'integer',
  take: {
    text: { like: 'string' },
  },
}
```

Reading the keywords:

- `name`. The verb (`is`, `make`, `get`, `find`, `if`, …).
- `case`. Which variant. Picks the Cast (Form-instance shape)
  the Flow operates on.
- `like`. The return type, in TypeScript-like notation:
  `'boolean'`, `'string'`, `'list<record>'`, `'A | B'`.
- `take`. The input args, written as a `link`-shaped record
  (same DSL as Form fields).

`(name, case)` is the Flow's identity. The combination
compiles to a flat `code` id matching the constant's name (`is_ipa`, `make_lowercase`).

### Flow with generics

Same `head` as Form:

```typescript
const get_at: Flow = {
  name: 'get',
  case: 'at',
  head: ['t'],
  like: 't',
  take: {
    items:    { like: 'list<t>' },
    position: { like: 'integer' },
  },
}
```

### `base` and `case` are independent

Picking a Flow uses three optional fields: `name` (the verb),
`base` (the resource / shape being operated on), and `case`
(the variant). They are **separate top-level fields**. 
nothing is parsed from a single dotted string.

```typescript
const is_ipa_broad:  Flow = { name: 'is', base: 'ipa', case: 'broad',  /* ... */ }
const is_ipa_narrow: Flow = { name: 'is', base: 'ipa', case: 'narrow', /* ... */ }
const is_ipa:        Flow = { name: 'is', base: 'ipa',                 /* ... */ }
```

The constant's exported name (`is_ipa_broad`, `is_ipa_narrow`,
`is_ipa`) becomes the bundled-`Base` registry key. The runtime
triple `(name, base, case)` is what the schema declares; the
key is just an identifier.


## Instances of a `Flow` are `Call`s

A `Call` is a node in the AST invoking a Flow:

```json
{
  "form": "call",
  "name": "is",
  "case": "ipa",
  "id": "01h…",
  "text": "fəˈnɛtɪk"
}
```

Reading the reserved keys top to bottom:

- `form: 'call'`. This AST node is a Call.
- `name: 'is'`. Picks the `is` Flow.
- `case: 'ipa'`. Narrows to the `is.ipa` Flow.
- `id: '01h…'`. Stable per-node UUID.

Everything else (`text`) is args. They match the Flow's `take`
schema field for field. snake_case, no collision with reserved
keys.

## Reserved AST keys

Every editable AST node uses at most these reserved keys:

| key | role |
|---|---|
| `form` | discriminant. `'call'`, `'read'`, `'view'`, `'fork'`, `'walk'`, plus literals (`'text'`, `'integer'`, `'boolean'`, `'list'`, `'weave'`, ...) |
| `name` | for Calls and Views, the registered identifier |
| `case` | for Calls, the chosen Form-instance variant; for `walk`, the iteration kind (`test` / `list` / `size` / `form`) |
| `mark` | per-call schema-version stamp (semver) |

The compiled form replaces `name` + `case` with a single
`code`, and moves args under `bind`:

```json
{
  "form": "call",
  "code": "is.ipa",
  "id": "01h…",
  "bind": { "text": "fəˈnɛtɪk" }
}
```

Compiled reserved keys: `form`, `code`, `id`, `bind`.

User args fill the remaining top-level keys (editable form) or
the inside of `bind` (compiled form). They are guaranteed not
to collide with reserved keys: a Flow whose `take` declares
`form` / `name` / `case` / `id` / `code` / `bind` as an arg is
rejected at registration time.

## How `Form`s and `Flow`s connect

The connection is the `case` field on a `Flow`:

```
Form: ipa_form
  ↓ instance
Cast: { text: 'fəˈnɛtɪk' }

Flow: is(ipa)        ← `case: 'ipa'` references the `ipa` Form
  ↓ instance
Call: { form: 'call', name: 'is', case: 'ipa', text: '...' }
                       ← invokes the Flow with args of the Form's shape
```

When a Flow declares `case: 'ipa'`, it's saying "I operate on
data shaped like the `ipa` Form." A Call invoking that Flow
must supply args matching the Form's `link` fields. The
runtime checks this at compile time using the form-DSL parser.

When a Flow has no `case`, it's a generic verb. Most Flows DO
have a `case` because typed-by-shape dispatch is the whole
point.

## Folds

A `Fold` is a kind of Form whose Casts are call-tree
documents. A `Fold` is a Cast of a Template. A concrete
nested structure of Calls.

```typescript
const constraint_template: Template = {
  form: 'form',
  save: '@/code/template/constraint',
  link: {
    root: { like: 'call' },        // the root Call of the constraint
  },
}
```

A Fold filling that template:

```json
{
  "root": {
    "form": "call",
    "name": "is",
    "case": "all",
    "id": "01h…",
    "things": { "form": "list", "list": [/* ... */] }
  }
}
```

Templates exist so the editor knows what slots a document
exposes (a guide has a title, a body, optional sidebars, etc.).
Folds are the JSON the user authors. What gets stored, what
gets compiled, what gets evaluated.

`Fold` is the third type/instance pair because users
author whole documents, not just individual Calls. The pair
gives the editor and the runtime a name for "the document
shape" vs "the document itself."

## How Calls compose

Args to a Call can themselves be Calls, paths, or literals.
Composition is type-checked: parent-arg expectations must
match child-Flow `like` declarations.

```typescript
import { flow } from '@cluesurf/bead'

make.call('is', {
  case: 'all',
  things: make.list([
    make.call('is', {
      case: 'string',
      thing: make.read('value'),
    }),
    make.call('is', {
      case: 'among',
      thing: make.read('value'),
      choices: make.list(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    }),
  ]),
})
```

Reads as: "is-all of [is-string(value), is-among(value, [...])]"
. I.e., the value is both a string AND in the CEFR list.

## Construction with `make` and `bind`

Casts are constructed via `make` + `bind`, mirroring Seed:

```typescript
import { make } from '@cluesurf/bead'

const case_instance = make('language_string', {
  bind: {
    id:           'ls_001',
    text:         'phonetic',
    language__id: 'lang_en',
    cefr_level:   'B1',
  },
})
```

`make` names the Form; `bind` provides the field values. The
runtime returns a validated Cast (or a typed error if any
field doesn't satisfy the Form).

For variants:

```typescript
make('result', {
  case: 'okay',
  bind: { value: 'success' },
})

make('result', {
  case: 'error',
  bind: { value: 'something went wrong' },
})
```

This is the same `case` keyword used in the AST. Picking
which variant of the Form is being instantiated.

## How they all fit

```
Host registers              User authors                Engine runs
─────────────────           ────────────────             ─────────────
Forms                       Fold of Calls                Compile each Call
Flows                       (the Fold fills              Validate args via take
Flow handlers               a Template)                  Type-check via like
Templates                                                Pre-resolve async
                                                         Evaluate sync
                                                         Return Cast + diff
```

The host owns the catalog (Forms + Flows + handlers +
Templates). The user owns the Fold. The engine is the bridge.

## Worked example end-to-end

A constraint that says "this language_string's text must be
non-empty IPA, and its CEFR level must be in the standard
list."

### 1. Forms (host registers)

```typescript
const language_string: Form = {
  form: 'form',
  save: '@/code/form/language',
  link: {
    id:         { like: 'string' },
    text:       { like: 'string' },
    cefr_level: {
      like: 'string',
      need: false,
      take: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
  },
}
```

### 2. Flows (host registers)

```typescript
base.flow('is', { case: 'string' }, ({ thing }) => typeof thing === 'string')
base.flow('is', { case: 'ipa' },    ({ text })  => everyCharIsIpa(text))
base.flow('is', { case: 'above' },  ({ this: a, that: b }) => a > b)
base.flow('is', { case: 'among' },  ({ thing, choices }) => choices.includes(thing))
base.flow('is', { case: 'all' },    ({ things }) => things.every(Boolean))
base.flow('get', { case: 'length' }, ({ text }) => text.length)
```

(Each `base.flow(...)` registers the Flow's schema + handler.)

### 3. User authors a Fold

```typescript
import { flow } from '@cluesurf/bead'

const constraint = make.call('is', {
  case: 'all',
  things: make.list([
    make.call('is', { case: 'string', thing: make.read('record', 'text') }),
    make.call('is', { case: 'ipa',    text:  make.read('record', 'text') }),
    make.call('is', {
      case: 'above',
      this: make.call('get', { case: 'length', text: make.read('record', 'text') }),
      that: 0,
    }),
    make.call('is', {
      case: 'among',
      thing: make.read('record', 'cefr_level'),
      choices: make.list(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    }),
  ]),
})
```

### 4. Engine evaluates

Given a Cast of `language_string`:

```json
{ "id": "ls_001", "text": "fəˈnɛtɪk", "cefr_level": "B1" }
```

The engine binds it as `record` in host, walks the Fold:

- `is(string, thing: 'fəˈnɛtɪk')` → true
- `is(ipa, text: 'fəˈnɛtɪk')` → true
- `get(length, text: 'fəˈnɛtɪk')` → 8, then `is(above, this: 8, that: 0)` → true
- `is(among, thing: 'B1', choices: [A1..C2])` → true
- `is(all, things: [true, true, true, true])` → true

Output: `true`. The Cast passes the constraint.

If any sub-Call returned false, `is(all)` returns false. Any
`validate(...)` wrapper around a sub-call collects an error
attached to the offending node `id`.

## Where the code lives

Source files are grouped **by logical domain**, not by
verb-base-case leaf. A single file can export many Forms,
Flows, and Folds that belong together; the Book that
collects them is what the runtime sees.

```
deck/bead/code/
  form/                          # the schema DSL (Form-related machinery)
    type.ts                      # Form / link / like / head types
    build.ts                     # form / link / case builders
    parse.ts                     # validation parsers

  fold/                          # the AST builder DSL (`make.*`)
    types.ts                     # Call / Read / View / literal types
    build.ts                     # make.call / make.read / make.list etc.
    compile.ts                   # make ↔ wake compile pass

  base/                          # authored declarations + handlers
    language/
      make.ts                    # exports Form `language` + Flows `select_language`, `update_language`, ...
      flow.ts                    # handlers for the Flows above
    script/
      make.ts
      flow.ts
    phoneme/
      make.ts
      flow.ts
    is/
      make.ts                    # exports many `is_*` Flows together
      flow.ts                    # one file's worth of `is_*` handlers
    ...
```

The grouping is whatever makes sense for the domain. A
language-oriented Book might group by resource (`language/`,
`script/`, `phoneme/`). A logic-oriented Book might group by
verb (`is/`, `make/`, `get/`). Different Books can use
different conventions.

What stays consistent:
- A `make.ts` file exports the **declarations** (Forms,
  Flows, Folds, Hashes, Lists).
- A `flow.ts` file exports the **handlers** (functions with
  the same name as the Flows in `make.ts` they implement).
- The Book bundles everything together regardless of file
  layout.

There is no per-leaf-folder requirement. One file can carry
dozens of related Forms and Flows. The `(name, base?, case?)`
triple uniquely identifies each Flow at the schema level;
the file system isn't part of identity.

## Mapping summary

| pair | type | instance | example |
|---|---|---|---|
| **data** | `Form` | `Cast` | `language_string` → `{ id, text, ... }` |
| **function** | `Flow` | `Call` | `is(ipa)` → `{ form: 'call', name: 'is', case: 'ipa', text: '...' }` |
| **document** | `Fold` | `Fold` | `constraint_template` → a nested structure of Calls |

Three type/instance pairs, one runtime, one editor.

## Inheritance from Seed

Bead's vocabulary is intentionally aligned with the Seed
language. Where Seed says:

```tree
form user
  link email, like text

  flow login
    take email
    take password
    call service/login
      bind email, read email
      bind password, read password
```

Bead in TypeScript / JSON says:

```typescript
// Form
const user: Form = {
  form: 'form',
  save: '@/code/form/user',
  link: {
    email: { like: 'string' },
  },
}

// Flow
const login: Flow = {
  name: 'login',
  case: 'service',
  take: {
    email:    { like: 'string' },
    password: { like: 'string' },
  },
}

// Fold (the body of `login` would be its own subtree of calls,
// authored by the user inside the editor)
make.call('login', {
  case: 'service',
  email:    make.read('email'),
  password: make.read('password'),
})
```

Same vocabulary (`form`, `link`, `like`, `take`, `call`,
`bind`), same discipline. Bead is the JSON-tree counterpart to
Seed's `.tree` source. When Seed matures, the two will likely
share a compile target.

## What's next

- [`primitives.md`](./primitives.md). Deeper on Form and Flow.
- [`ast.md`](./ast.md). Every node form (`call`, `read`,
    `view`, `fork`, `walk`, literals).
- [`book.md`](./book.md). The `Base` class and its methods.
- [`runtime.md`](./runtime.md). Pipeline, host, dispatch,
  memoization.
- [`catalog.md`](./catalog.md). The standard nine-verb seed
  catalog of Flows.
- [`editor.md`](./editor.md). Patches, render diffs, widgets.
