# Structure

How calm works, top to bottom. The vocabulary, the primitives,
the AST, and the lifecycle. Read this after `goals.md`; read
it before the deeper specs.

## Vocabulary

Calm has **two type/instance pairs**, plus an umbrella term
covering the type-level declarations and the runtime class.

| layer | type (declaration) | instance (occurrence) |
|---|---|---|
| **data** | `Form` | `Cast` |
| **function** | `Flow` | `Call` |

- A **`Form`** declares a data shape. A **`Fold`** is a special
  kind of Form whose Casts are tree-shaped — a document
  template made of Calls and slots.
- A **`Cast`** is an instance of any Form (Form, Hash, List, or
  Fold). A simple Cast is a flat record. A Fold's Cast is a
  nested structure of Calls filling the Fold.
- A **`Flow`** declares a function — its name, args, return
  type.
- A **`Call`** is a node in the AST invoking a Flow.

Casts are the universal instance shape — any data flowing
through the runtime is a Cast of some Form. A document
authored in the editor is just a Cast of a Fold (which is
just a particular kind of Form). One instance vocabulary
covers everything.

A **`Wave`** is the umbrella term: any type-level declaration
(a `Form` or a `Flow`) is a Wave. When the host registers
schemas with the runtime, it's registering Waves. The `Wave`
type is `Form | Flow`.

A **`Base`** is the bundled type — kysely's `DB` equivalent.
The compiler aggregates every authored constant (every Form,
Flow, Hash, List, Fold) across the codebase into a single
`Base` interface, keyed by name. The runtime class is generic
over it.

A **`Calm`** is the runtime class itself — the environment
where Casts live, where Calls evaluate, where Folds render.
The host instantiates one as `new Calm<Base>()`, registers
Waves on it, and binds Trees through it. The Calm owns the
scope chain, the caches, the dispatch table — "where
everything runtimes."

### Why these names

- **`Form`** — a mold for data. Inherited from Seed.
- **`Cast`** — what comes out of the mold. An object cast to
  the form's shape. Reads as "a Cast of `language_string`."
- **`Flow`** — a function defined by what flows in (`take`)
  and out (`like`). Also matches the existing `flow.*` builder
  DSL.
- **`Call`** — invoking a Flow. Literal English for "make a
  call to this function."
- **`Fold`** — a Form whose Casts are tree-shaped. Document
  templates and authored documents both live as Folds.
- **`Wave`** — the umbrella. Forms and Flows ride the same
  registration pipeline; a Wave is what you publish.
- **`Base`** — the bundled-type aggregate. Every authored
  constant in the codebase, smashed into one interface, like
  kysely's `DB`.
- **`Calm`** — the runtime class. Generic over `Base`. Owns
  the registered Waves, the host chain, the caches, the
  dispatch table.

```
new Calm<Base>()
         ↑
    every authored Form / Flow / Hash / List / Fold,
    aggregated into one type at compile time

Calm   ⊃   { Waves (Forms + Flows), host, caches, dispatch }
       ⊃   { Casts, Calls, Folds flowing through evaluation }
```

Nine words total. The spec doesn't introduce more.

## Keyword grammar

Calm reuses the Seed-language vocabulary for declaring
schemas. Each keyword has one job:

| keyword | role | used in |
|---|---|---|
| `form` | declare a data shape (top-level discriminant on AST nodes too) | Form / AST |
| `link` | a field of a Form (and the type alias for input args) | Form, Flow.take |
| `like` | type annotation (this thing IS this type) | Form fields, Flow `like`, Flow `take` |
| `case` | a variant / sub-type, OR (in AST) the chosen variant | Form, Flow, AST |
| `head` | a generic type parameter | Form / Flow |
| `take` | an input parameter to a Flow | Flow |
| `need` | required-ness flag, or trait bound on `head` | Form / Flow |
| `fall` | default value when missing | Form / Flow |
| `test` | a Call subtree that returns boolean (constraint on a field) | Form |
| `make` | construct an instance | Cast |
| `bind` | set a field on a Cast being constructed (or compiled-args slot on a Call) | Cast / Call |
| `name` | identifier for a Call (the Flow's name) or View (component name) | AST |
| `code` | (compiled) flattened registry id | AST (compiled) |
| `mark` | per-call schema-version stamp (semver) | AST |

These words come from Seed and align with the data-modeling
discipline calm inherits from it.

## What you export

Every authored module exports `const` declarations typed as one
of the six primitive shapes calm understands:

```typescript
import type { Form, Flow, Hash, List, Fold, Find } from '@cluesurf/calm'

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
`@cluesurf/form`'s `make/flow` builders — the JSON node tree
that the runtime evaluates. Renamed to `Fold` in calm.

`Find` is the find / test query-filter shape consolidated from
the existing query-system spec — see [`find.md`](./find.md).

A `Fold` is built with the `flow.*` builder DSL:

```typescript
import { flow } from '@cluesurf/calm'

export const default_filter: Find = flow.call('find', {
  base: 'list',
  resource: 'language_string',
  where: { /* ... a Cast of `find` ... */ },
})
```

(The builder namespace is `flow` for backward continuity with
`@cluesurf/form`. The result type is `Fold` (or `Find` when
the tree is a query filter). The `Flow` type is the function
declaration. Several concepts using flow/Flow/Fold/Find names
— ergonomically close, distinct in role.)

### Aggregation into one module

Exports live wherever they make sense in the source tree —
spread across files, folders, decks, cards. **At compile time,
calm aggregates every reachable export into a single flattened
module** that the runtime loads. The aggregation mechanism is
plain `export * from './some/path'` re-exports; calm doesn't
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
import * as base from '@cluesurf/calm/base'

// base.language_string, standard.is_ipa, standard.welcome_guide, ...

const calm = new Calm()
calm.deck(base)   // ingests every Form / Flow / Hash / List / Fold
```

`calm.deck(...)` walks the imported namespace, dispatches each
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
- Index files are pure `export * from './...'` — no logic.
- The `code/index.ts` at the deck root is the only file the
  host's `package.json` `main` points to.

## Defining a `Form`

A `Form` declares the shape of data — fields, types, defaults,
constraints. Pure declaration, no execution.

```typescript
import type { Form } from '@cluesurf/calm'

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
      case: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
  },
}
```

Reading the keywords:

- `form: 'form'` — discriminant; this object is a Form.
- `save` — module / namespace path.
- `link` — the field map. Each entry is one field.
- `like` — that field's type.
- `need: false` — optional (default `true`).
- `case: [...]` — enum members for a string field.

### Form variants (sum types)

A Form can have multiple `case`s. Each case is a sub-type:

```typescript
const result: Form = {
  form: 'form',
  save: '@/code/form/result',
  case: {
    okay: {
      link: { value: { like: 'string' } },
    },
    error: {
      link: { value: { like: 'string' } },
    },
  },
}
```

Same shape as Seed's `form result` with `case okay` / `case error`.

### Generic Forms (`head`)

Type parameters are declared with `head`:

```typescript
const box: Form = {
  form: 'form',
  save: '@/code/form/box',
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

Casts flow through the runtime — they're the args to Flows,
the results of Flows, the leaves of every Fold. The runtime
parses incoming JSON into Casts via the Form's auto-generated
parser (Zod or equivalent).

## Defining a `Flow`

A `Flow` declares a function — name, args, return type:

```typescript
import type { Flow } from '@cluesurf/calm'

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

- `name` — the verb (`is`, `make`, `get`, `find`, `if`, …).
- `case` — which variant. Picks the Cast (Form-instance shape)
  the Flow operates on.
- `like` — the return type, in TypeScript-like notation:
  `'boolean'`, `'string'`, `'list<record>'`, `'A | B'`.
- `take` — the input args, written as a `link`-shaped record
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
(the variant). They are **separate top-level fields** —
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

- `form: 'call'` — this AST node is a Call.
- `name: 'is'` — picks the `is` Flow.
- `case: 'ipa'` — narrows to the `is.ipa` Flow.
- `id: '01h…'` — stable per-node UUID.

Everything else (`text`) is args. They match the Flow's `take`
schema field for field. snake_case, no collision with reserved
keys.

## Reserved AST keys

Every editable AST node uses at most these reserved keys:

| key | role |
|---|---|
| `form` | discriminant — `'call'`, `'read'`, `'view'`, `'fork'`, `'walk'`, plus literals (`'text'`, `'integer'`, `'boolean'`, `'list'`, `'weave'`, ...) |
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
documents. A `Fold` is a Cast of a Template — a concrete
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
Folds are the JSON the user authors — what gets stored, what
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
import { flow } from '@cluesurf/calm'

flow.call('is', {
  case: 'all',
  things: flow.list([
    flow.call('is', {
      case: 'string',
      thing: flow.read('value'),
    }),
    flow.call('is', {
      case: 'among',
      thing: flow.read('value'),
      choices: flow.list(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
    }),
  ]),
})
```

Reads as: "is-all of [is-string(value), is-among(value, [...])]"
— i.e., the value is both a string AND in the CEFR list.

## Construction with `make` and `bind`

Casts are constructed via `make` + `bind`, mirroring Seed:

```typescript
import { make } from '@cluesurf/calm'

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

This is the same `case` keyword used in the AST — picking
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
      case: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    },
  },
}
```

### 2. Flows (host registers)

```typescript
calm.flow('is', { case: 'string' }, ({ thing }) => typeof thing === 'string')
calm.flow('is', { case: 'ipa' },    ({ text })  => everyCharIsIpa(text))
calm.flow('is', { case: 'above' },  ({ this: a, that: b }) => a > b)
calm.flow('is', { case: 'among' },  ({ thing, choices }) => choices.includes(thing))
calm.flow('is', { case: 'all' },    ({ things }) => things.every(Boolean))
calm.flow('get', { case: 'length' }, ({ text }) => text.length)
```

(Each `calm.flow(...)` registers the Flow's schema + handler.)

### 3. User authors a Fold

```typescript
import { flow } from '@cluesurf/calm'

const constraint = flow.call('is', {
  case: 'all',
  things: flow.list([
    flow.call('is', { case: 'string', thing: flow.read('record', 'text') }),
    flow.call('is', { case: 'ipa',    text:  flow.read('record', 'text') }),
    flow.call('is', {
      case: 'above',
      this: flow.call('get', { case: 'length', text: flow.read('record', 'text') }),
      that: 0,
    }),
    flow.call('is', {
      case: 'among',
      thing: flow.read('record', 'cefr_level'),
      choices: flow.list(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
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

```
deck/calm/code/
  form/                          # the schema DSL (Form-related code)
    type.ts                      # Form / link / like / case / head types
    build.ts                     # form() / link() / case() builders
    parse.ts                     # validation parsers

  flow/                          # the AST builder DSL (`flow.*`)
    type.ts                      # Call / path / view / literal types
    build.ts                     # flow.call / flow.read / flow.list etc.

  flow/                          # registered Flow implementations
    is/
      string/    schema.ts handler.ts
      integer/
      equal/
      above/
      below/
      ipa/
        schema.ts                # bare is.ipa
        handler.ts
        broad/
          schema.ts              # is_ipa_broad (the bare is_ipa case='broad')
          handler.ts
        narrow/
          schema.ts
          handler.ts
      among/
      all/
      every/
      ...
    has/
    make/
    get/
    find/
    if/
    bind/
    walk/
    validate/
```

`code/form/` holds the schema language. `code/flow/` holds AST
builders. `code/flow/` holds Flow declarations + handlers,
organized by `<verb>/<case>/`.

## Mapping summary

| pair | type | instance | example |
|---|---|---|---|
| **data** | `Form` | `Cast` | `language_string` → `{ id, text, ... }` |
| **function** | `Flow` | `Call` | `is(ipa)` → `{ form: 'call', name: 'is', case: 'ipa', text: '...' }` |
| **document** | `Fold` | `Fold` | `constraint_template` → a nested structure of Calls |

Three type/instance pairs, one runtime, one editor.

## Inheritance from Seed

Calm's vocabulary is intentionally aligned with the Seed
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

Calm in TypeScript / JSON says:

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
flow.call('login', {
  case: 'service',
  email:    flow.read('email'),
  password: flow.read('password'),
})
```

Same vocabulary (`form`, `link`, `like`, `take`, `call`,
`bind`), same discipline. Calm is the JSON-tree counterpart to
Seed's `.tree` source. When Seed matures, the two will likely
share a compile target.

## What's next

- [`primitives.md`](./primitives.md) — deeper on Form and Flow.
- [`ast.md`](./ast.md) — every node form (`call`, `read`,
    `view`, `fork`, `walk`, literals).
- [`calm.md`](./calm.md) — the `Calm` class and its methods.
- [`runtime.md`](./runtime.md) — pipeline, host, dispatch,
  memoization.
- [`catalog.md`](./catalog.md) — the standard nine-verb seed
  catalog of Flows.
- [`editor.md`](./editor.md) — patches, render diffs, widgets.
