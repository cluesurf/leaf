# Structure

How book works, top to bottom. The vocabulary, the primitives,
the AST, and the lifecycle. Read this after `goals.md`; read
it before the deeper specs.

## Vocabulary

Book has **three type/instance pairs**, plus an umbrella term
covering the type-level declarations:

| layer | type (declaration) | instance (occurrence) |
|---|---|---|
| **data** | `Form` | `Cast` |
| **function** | `Flow` | `Call` |
| **document** | `Template` | `Seed` |

- A **`Form`** declares a data shape.
- A **`Cast`** is a data record validated against a Form. (Like
  a "cast object" — a thing shaped to fit a mold.)
- A **`Flow`** declares a function — its name, args, return
  type.
- A **`Call`** is a node in the AST invoking a Flow.
- A **`Template`** declares a document shape (a layout of
  Calls and slots).
- A **`Seed`** is a concrete, nested structure of Calls
  filling a Template.

A **`Wave`** is the umbrella term: any type-level declaration
(a `Form` or a `Flow`) is a Wave. When the host registers
schemas with the runtime, it's registering Waves. The `Wave`
type is `Form | Flow`.

### Why these names

- **`Form`** — a mold for data. Inherited from Seed.
- **`Cast`** — what comes out of the mold. An object cast to
  the form's shape. Reads as "a Cast of `language_string`."
- **`Flow`** — a function defined by what flows in (`take`)
  and out (`like`). Also matches the existing `flow.*` builder
  DSL.
- **`Call`** — invoking a Flow. Literal English for "make a
  call to this function."
- **`Template`** — the document blueprint with slots.
- **`Seed`** — a nested structure. Seeds fill templates.
- **`Wave`** — the umbrella. Forms and Flows ride the same
  registration pipeline; a Wave is what you publish.
- **`Base`** — the runtime world. The environment where Casts
  live, where Calls evaluate, where Seeds render. A `Book`
  instance owns a Base; the Base owns the registered Waves,
  the host chain, the caches, the dispatch table. "Where
  everything runtimes."

```
Book   ⊃   Base   ⊃   { Waves (Forms + Flows), host, caches, dispatch }
                  ⊃   { Casts, Calls, Seeds flowing through evaluation }
```

Eight words total. The spec doesn't introduce more.

## Keyword grammar

Book reuses the Seed-language vocabulary for declaring
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
| `id` | stable per-node UUID | AST |

These words come from Seed and align with the data-modeling
discipline book inherits from it.

## Defining a `Form`

A `Form` declares the shape of data — fields, types, defaults,
constraints. Pure declaration, no execution.

```typescript
import type { Form } from '@cluesurf/book'

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
the results of Flows, the leaves of every Seed. The runtime
parses incoming JSON into Casts via the Form's auto-generated
parser (Zod or equivalent).

## Defining a `Flow`

A `Flow` declares a function — name, args, return type:

```typescript
import type { Flow } from '@cluesurf/book'

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
compiles to a flat `code` id like `is.ipa` or `make.lowercase`.

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

### Sub-cases (composite case names)

If a Flow has sub-variants distinguished by an extra
discriminator (like broad vs narrow IPA), encode it in the
case name itself:

```typescript
const is_ipa_broad:  Flow = { name: 'is', case: 'ipa.broad',  /* ... */ }
const is_ipa_narrow: Flow = { name: 'is', case: 'ipa.narrow', /* ... */ }
const is_ipa:        Flow = { name: 'is', case: 'ipa',        /* ... */ }
```

`ipa`, `ipa.broad`, `ipa.narrow` are three distinct cases. The
compiled code id follows the dotted path: `is.ipa.broad`. The
file layout matches: `code/flow/is/ipa/broad/`. No extra
reserved keyword needed.

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
| `form` | discriminant — `'call'`, `'read'`, `'view'`, `'fork'`, `'walk'`, `'loop'`, `'attempt'`, plus literals (`'text'`, `'integer'`, `'boolean'`, `'list'`, `'weave'`, ...) |
| `name` | for Calls and Views, the registered identifier |
| `case` | for Calls, the chosen Form-instance variant |
| `id` | stable per-node UUID |

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

## Templates and Seeds

A `Template` is a kind of Form whose Casts are call-tree
documents. A `Seed` is a Cast of a Template — a concrete
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

A Seed filling that template:

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
Seeds are the JSON the user authors — what gets stored, what
gets compiled, what gets evaluated.

`Template/Seed` is the third type/instance pair because users
author whole documents, not just individual Calls. The pair
gives the editor and the runtime a name for "the document
shape" vs "the document itself."

## How Calls compose

Args to a Call can themselves be Calls, paths, or literals.
Composition is type-checked: parent-arg expectations must
match child-Flow `like` declarations.

```typescript
import { flow } from '@cluesurf/book'

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
import { make } from '@cluesurf/book'

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
Forms                       Seed of Calls                Compile each Call
Flows                       (the Seed fills              Validate args via take
Flow handlers               a Template)                  Type-check via like
Templates                                                Pre-resolve async
                                                         Evaluate sync
                                                         Return Cast + diff
```

The host owns the catalog (Forms + Flows + handlers +
Templates). The user owns the Seed. The engine is the bridge.

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
book.flow('is', { case: 'string' }, ({ thing }) => typeof thing === 'string')
book.flow('is', { case: 'ipa' },    ({ text })  => everyCharIsIpa(text))
book.flow('is', { case: 'above' },  ({ this: a, that: b }) => a > b)
book.flow('is', { case: 'among' },  ({ thing, choices }) => choices.includes(thing))
book.flow('is', { case: 'all' },    ({ things }) => things.every(Boolean))
book.flow('get', { case: 'length' }, ({ text }) => text.length)
```

(Each `book.flow(...)` registers the Flow's schema + handler.)

### 3. User authors a Seed

```typescript
import { flow } from '@cluesurf/book'

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

The engine binds it as `record` in host, walks the Seed:

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
deck/book/code/
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
          schema.ts              # is.ipa.broad
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
| **document** | `Template` | `Seed` | `constraint_template` → a nested structure of Calls |

Three type/instance pairs, one runtime, one editor.

## Inheritance from Seed

Book's vocabulary is intentionally aligned with the Seed
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

Book in TypeScript / JSON says:

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

// Seed (the body of `login` would be its own subtree of calls,
// authored by the user inside the editor)
flow.call('login', {
  case: 'service',
  email:    flow.read('email'),
  password: flow.read('password'),
})
```

Same vocabulary (`form`, `link`, `like`, `take`, `call`,
`bind`), same discipline. Book is the JSON-tree counterpart to
Seed's `.tree` source. When Seed matures, the two will likely
share a compile target.

## What's next

- [`primitives.md`](./primitives.md) — deeper on Form and Flow.
- [`ast.md`](./ast.md) — every node form (`call`, `read`,
  `view`, `fork`, `walk`, `loop`, `attempt`, literals).
- [`book.md`](./book.md) — the `Book` class and its methods.
- [`runtime.md`](./runtime.md) — pipeline, host, dispatch,
  memoization.
- [`catalog.md`](./catalog.md) — the standard nine-verb seed
  catalog of Flows.
- [`editor.md`](./editor.md) — patches, render diffs, widgets.
