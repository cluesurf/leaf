# Goals

The why and what of `@cluesurf/calm`. This is a **goals** doc,
not a design doc — it articulates the destination so design
choices later can be evaluated against it.

## What `calm` is, in one sentence

A JSON-only mini-language and runtime for **untrusted users to
author rich, executable documents**, sandboxed by construction:
the only things they can do are call functions the host
explicitly registered.

## What `calm` is, expanded

The goal is a **complete runtime environment for sandboxed,
simple code** — the kind of code that real applications need
to give end-users:

- **Templating** — fill text, conditionals, loops, plurals,
  date / number formatting, locale-aware copy.
- **DOM rendering** — declarative component trees with typed
  props, slots, and child arrays. Renders to React, HTML,
  PDF, EPUB — wherever the host plugs in a renderer.
- **Constraint defining** — validation rules over data,
  composable, with structured errors and editor feedback.
- **HTTP request making** — async lookups, batched
  field-resolution, cancelable on edit.
- **Filter / query authoring** — list-endpoint queries
  expressed as tree-of-Calls, evaluated against the host's
  data layer.
- **Document authoring** — guides, lessons, manuscripts,
  reports, blog posts that compose all of the above.

All of it through the same primitives, the same registry, the
same editor, the same runtime. **One mini-language; many
shapes of use.**

What calm deliberately is NOT:

- Not a general-purpose programming language.
- Not a JavaScript replacement.
- Not a code-loader.
- Not a sandbox built atop V8 / Wasm — the format itself is
  the sandbox.

The "complete environment" is everything an end-user needs to
build rich content inside a host app, with zero host-code
exposure.

## What `calm` consolidates

`calm` unifies three concepts that have lived as separate
systems and packages until now:

1. **Schema DSL** — the `Form` / `Hash` / `List` / `Mesh`
   builder language that describes data shapes. Currently lives
   in a sibling package; **eventually copied into calm** so
   the schema language and the runtime ship as one. Base becomes
   the home for the DSL, not just a consumer.

2. **Query filter trees** — the find / test constraint trees
   used to express list-endpoint filters (keyword equality,
   string wildcards, integer ranges, nested object filters,
   etc.). Refactored as flow calls so a filter is just a tree
   of calls evaluated by the same engine.

3. **Validation constraints** — the verb-based constraint
   system for per-cell and cross-cell validation rules.
   Refactored on top of the same flow-call machinery, so the
   constraint catalog and the filter catalog and the document
   catalog all share one runtime.

Three systems collapse into one, around two primitives.

## The two base primitives

Everything in calm reduces to one of two things:

### `Form` — data model schemas

Describes the **shape of data**. A `Form` declares "this kind
of thing has these fields, with these types, with these
constraints." Examples: a `language_string` form, a
`feature_definition` form, a `query_request` form. The schema
DSL underneath every flow signature, every record validation,
every editor-rendered input.

`Form` is the **noun side** of the spec.

### `Flow` — function schemas

Describes the **shape of a function**. A `Flow` declares "this
verb, applied to this base, optionally narrowed by this case,
takes these args and returns this type." Examples:
`is(equal: { this, that }) → boolean`, `make(lowercase: {
text }) → string`, `find(record: { reference }) → record`.

`Flow` is the **verb side** of the spec.

A document is a tree of Flow calls operating over Form-shaped
data. The runtime is the engine that walks the tree,
dispatching each Flow call to a registered handler.

That's the entire spec at the conceptual level. Two primitives,
one tree, one runtime.

### Type vs instance

Each primitive has a **type** side (the schema, declared once)
and an **instance** side (a specific occurrence, used many
times):

| primitive | type (declaration) | instance (occurrence) |
|---|---|---|
| data model | **`Form`** | **`Cast`** |
| function | **`Flow`** | **`Call`** |

- A `Form` declares a data shape ("a `language_string` has
  these fields"). Its instances are `Cast` objects — the
  actual data records, validated against the form.
- A `Flow` declares a function signature ("`is(equal)` takes
  `this` and `that`, returns boolean"). Its instances are
  `Call` nodes in the AST — `{ form: 'call', name: 'is',
  base: 'equal', this: ..., that: ... }`.

This is why `base` is the AST keyword for "which instance of a
Form" and `call` (the `form` value) is the AST keyword for
"which instance of a Flow." The four-part shape (`form`,
`name`, `base`, `case`) reads naturally:

- `form: 'call'` — this node is an instance of a Flow
- `name: 'is'` — picking the `is` Flow
- `base: 'equal'` — picking the `equal` variant (which
  corresponds to the `equal` Form-instance the Flow accepts)
- `case: 'broad'` — narrowing the variant further

The four reserved keys are not arbitrary; they reflect the
type-instance structure of the two primitives. Once you see
that, the AST becomes self-explanatory.

## The big picture

```
Author (untrusted)              Host (trusted)
┌────────────────────┐          ┌────────────────────┐
│ writes a JSON tree │  ──────► │ runs that tree     │
│ in a browser editor│          │ via calm runtime   │
└────────────────────┘          └────────────────────┘
                                         │
                                         ▼
                                ┌────────────────────┐
                                │ registered flows   │
                                │ (the only things   │
                                │ the tree can do)   │
                                └────────────────────┘
```

Host installs `@cluesurf/calm`, registers the flows they want
their users to be able to call, and exposes an editor. Users
compose documents from those flows. Nothing they write can
escape into Node, the browser, the session, the network — only
what the host allowed via registered flows.

## Why it exists (problems being solved)

### MDX gives users too much

MDX is a wonderful authoring format, but a `.mdx` file can run
arbitrary React/JS. That's fine when authors are trusted (the
docs team, the engineers), unsafe when they aren't (paying
customers, end users). Embedding MDX-style authoring in a SaaS
product means either trusting every author or sandboxing
JavaScript — neither is great.

`calm` solves this by being **JSON-only**. There is no string
of code anywhere. There is no `eval`. There is no path from
author input to host execution other than dispatching to a
registered flow. The sandbox is the format, not a layer added
on top.

### Customers want to build complex documents

Lessons, guides, lab notebooks, conlang spec sheets, paradigm
tables, blog posts that pull live data — all of these are
"documents that compute." Today every product re-invents the
shape: a custom block editor, a custom JSON config, a
proprietary template language. Each one re-solves storage,
parsing, validation, rendering, editing, and security.

`calm` is meant to be **the standard shape** for that document.
One JSON AST. One runtime spec. One schema language for flows.
Different products plug in different flow catalogs.

### "Just give me a template engine" doesn't scale

Mustache / Handlebars / Liquid handle simple templates well and
fall apart on anything dynamic. Once you need conditionals,
loops, computed fields, async data, validations, custom
components — you outgrow the template engine and add
JavaScript, which means losing the sandbox.

`calm` is the missing middle: **expressive enough to handle
real documents, restrictive enough to stay safe**. The author
gets `if`, `walk`, `bind`, polymorphic dispatch, async data
fetching, and component embedding — all expressed as JSON,
all dispatching through the host's registered flow catalog.

### Validation needs the same engine

Constraints (data validation rules) are also JSON trees of
function calls. Building a separate engine for validation is
duplication. `calm` is the **one runtime** that evaluates both
documents and validations — same AST, same registry, same
editor.

## Design constraints

### Must be JSON-only

Every node in the tree is a JSON object. No code strings, no
embedded JavaScript, no template literals. Every operation is
a registered flow call.

### Must be language-agnostic at the spec level

The spec — the AST shape, the dispatch rules, the standard flow
catalog — is independent of implementation language. Anyone can
write a Rust or Python or Swift runtime that consumes the same
trees. `@cluesurf/calm` is the **reference TypeScript runtime**,
not the only valid one.

### Must be small enough to internalize

The whole AST has four reserved keys (`form`, `name`, `base`,
`case`) plus snake_case user data. Nine verbs in the standard
catalog. Six methods on the `Base` class. A new developer
should be able to read the spec in an afternoon and have the
mental model. Nothing more, nothing less.

### Must be expressive enough for production documents

Conditionals, iteration, let-bindings, polymorphic dispatch,
recursion (via let), async data fetching, error
collection, internationalization, and component embedding all
have first-class support in the base catalog. If a real
document needs it, the engine has it.

### Must be schema-driven

Every flow has a schema written in `@cluesurf/form`'s DSL.
TypeScript types, Zod parsers, JSON Schema, editor widgets, and
documentation are all derived from the same schema. Drift is
not possible because there is one source.

### Must be browseable

The standard catalog uses a flat directory shape:
`code/<verb>/<base>/<case>/`. The file tree IS the API. New
flows are new folders. Adding a variant is one new `case`.

### Must have a clean editable / compiled split

The **editable AST** is what users write — human-friendly,
diff-friendly, easy to render in the editor.

The **compiled AST** is what the runtime evaluates — flat ids
instead of `name + base + case` triples, args bound and ready
to insert.

Both share the same shape; the compile step is mechanical.

## The four-part AST shape

Every node has at most these four reserved keys:

- **`form`** — discriminant. `'call'`, `'read'`, `'view'`,
  plus a few others. Tells the engine what kind of node this
  is.
- **`name`** — the function name (when `form='call'`) or
  element name (when `form='view'`).
- **`base`** — optional. The resource / shape being acted on.
  In `{ name: 'is', base: 'equal', this: ..., that: ... }`,
  the base is `equal`.
- **`case`** — optional. The variant being operated on,
  parallel to `base` (not parsed from any dotted form). In
  `{ name: 'is', base: 'ipa', case: 'broad', text: ... }`,
  the case is `broad`.

Everything else is **snake_case user data**, free of those
reserved keys. Author-defined args sit at the top level
alongside `form`/`name`/`base`/`case`; they cannot collide with
reserved keys because the keys are reserved.

## The two forms

### Editable form

What users author and what's stored at rest:

```json
{
  "form": "call",
  "name": "is",
  "base": "ipa",
  "case": "broad",
  "text": "fəˈnɛtɪk"
}
```

Reads cleanly, diffs well, is human-friendly. The editor's job
is to render this and let the user manipulate it.

### Compiled form

What the runtime evaluates:

```json
{
  "form": "call",
  "code": 3,
  "bind": {
    "text": "fəˈnɛtɪk"
  }
}
```

`code` is the resolved function id (the flattened triple).
`bind` is the args ready to pass to the registered handler.
Readable enough to debug, fast enough to interpret.

The compile step is a tree walk that:
- Looks up the `(name, base?, case?)` triple in the registry
- Replaces it with the resolved `code`
- Moves args into `bind`
- Validates everything against the flow's schema

Compilation can fail (unknown flow, args don't match schema),
in which case the compile step returns a typed error tree
instead of a compiled tree.

## The Flow type

Every registered function in the catalog is a `Flow`:

```typescript
type Flow = {
  name: string         // the verb (e.g., 'is')
  base?: string        // the noun (e.g., 'ipa')
  case?: string        // the variant (e.g., 'broad')
  like?: string        // return-type signature, TypeScript-like
  take?: FormLinkMesh  // input args schema, in @cluesurf/form's DSL
}
```

`like` is rich enough to express union and complex return
types — `'string | null'`, `'list<record>'`, `'boolean'`. The
runtime uses it to type-check call composition. The editor uses
it to know what subtree shapes can plug where.

`take` is the input schema in form-DSL, so codegen produces
TypeScript types and Zod parsers without the host writing them.

A flow with no implementation is a **specification stub** —
the spec tells you what it should do; some host needs to
register the actual function. This lets the base catalog
ship as schemas-only, with reference implementations layered
on top.

## The `Base` class

The host's API surface:

```typescript
class Calm {
  flows: Flow[]

  // Register a flow implementation (overloaded).
  flow(name: string, options: FlowOptions, handler: Handler): void
  flow(name: string, handler: Handler): void

  // Invoke a registered flow by code id.
  call(code: string, bind: Record<string, unknown>): unknown

  // Load a deck (a package — bundle of flows).
  deck(deck: Deck): void

  // Load a card (a module — small grouping of flows).
  card(card: Card): void

  // Compile + execute an editable tree.
  bind(tree: MakeNode): unknown
}
```

The naming is deliberately simple, drawn from the playing-card
metaphor:

- **`flow`** — a single function. Smallest unit.
- **`card`** — a single file (also a module at its level). One
  source file's worth of related flows.
- **`deck`** — a module / package. A published collection of
  cards. `@cluesurf/calm-linguistics` would be a deck.
- **`bind`** — bring a tree to life. Compile + run.
- **`call`** — invoke one flow directly, when you have its code
  id and don't need the whole compile cycle.

`flow ⊂ card ⊂ deck` is the nesting. A deck is many cards; a
card is many flows.

A host typically does:
1. `new Calm()`.
2. `calm.deck(...)` for any standard packages they want.
3. `calm.flow(...)` for any custom flows specific to their app.
4. `calm.bind(treeFromUser)` whenever a user-authored document
   needs to render.

## Goal: standardized seed catalog

`@cluesurf/calm` ships with a standard flow catalog covering
nine verbs:

- `is` — boolean predicates
- `has` — boolean possession
- `make` — transformations (string ops, arithmetic, normalize)
- `get` — accessors and aggregates (length, count, sum, keys)
- `find` — async lookups (record fetch, enum members)
- `if` — conditional
- `bind` — let-bindings
- `walk` — non-boolean iteration (map / filter / reduce)
- `validate` — error-collecting wrapper

Each verb has many bases (typed sub-shapes), and each base may
have cases (sub-variants — broad/narrow IPA, lower/upper case,
etc.). The full catalog covers ~115 named calls.

The seed catalog ships with both **specifications** (schemas +
return-type annotations) and **reference TypeScript
implementations**, so a fresh install runs out of the box.
Other-language runtimes implement the same specs to match.

Hosts add their own flows for app-specific behavior: domain
lookups, custom widgets, live queries, paradigm rendering.

## Goal: long-term browser editor

The eventual product is a **browser-based document editor** for
end-users — not engineers. They build documents visually:

- Drag in components (cards, grids, paragraphs, tables).
- Bind fields to data via dropdowns, not code.
- Wire up conditionals via UI affordances.
- See live preview rendered through the host's registered
  flow catalog.
- Save as a JSON tree that any compatible runtime can render.

The output is a `calm` document. The same document renders in
the host's app, a sibling product, an export-to-PDF flow, an
RSS-style snippet — anywhere a `calm` runtime exists.

## Goal: portable across products

The same document tree should render in:
- The originating host's app (via that host's `Base`).
- Other apps that registered overlapping flows.
- Static export pipelines (HTML, PDF, EPUB).
- Headless rendering (server-side).

Portability comes from the spec, not the runtime. Any runtime
implementing the spec can render any tree whose flows the
runtime registered. Documents move; runtimes stay.

## Goal: composable, not accumulating

Predicates, transforms, and combinators **compose**. There is
no `is-not-equal` flow; you write `is-not(is-equal(...))`. There
is no `is-non-negative`; you write `is-not(is-negative(...))`.

The catalog stays small because the algebra is rich.

## Goal: human-friendly names everywhere

- Verbs are single English words: `is`, `make`, `get`.
- Bases are nouns: `ipa`, `slug`, `email`, `record`.
- Case values are adjectives or sub-nouns: `broad`, `narrow`, `lower`.
- Argument names are the **type they expect**: `text` for
  strings, `number` for numbers, `items` for collections.

A constraint reads almost like English without translation.

## Goal: function-registry dispatch pattern

`calm` follows a verb-first function-registry pattern:

- Verb-first directory shape: `code/<verb>/<base>/<case>/`.
- Single object input per call.
- Dispatch on the `(name, base, case)` triple.
- Schema-driven codegen — TypeScript types, Zod parsers, JSON
  Schema, editor widgets all derived from one source.

| design point | calm |
|---|---|
| directory shape | `code/<verb>/<base>/<case>/` |
| call shape | `is(ipa: { text, case: 'broad' })` |
| input | single object |
| output | value (sync) or Promise (async) |
| dispatch | `(name, base, case)` triple → registered handler |
| schema | form-DSL `make.ts` per flow |
| codegen surfaces | engine / editor / validator / docs |

## Non-goals

These are out of host on purpose. They keep the engine small
and safe.

### Not a general-purpose programming language

`calm` is for documents. It has the dynamism documents need —
conditionals, loops, computed fields, polymorphic dispatch —
and stops there. It is not Turing-complete by design (recursion
via `bind` has a depth cap), and it has no I/O outside what the
host explicitly registers.

### Not a runtime that loads code

The runtime never loads strings of source. It never `eval`s.
It never imports anything dynamically. The set of executable
flows is fixed at the moment the host calls `calm.deck(...)` /
`calm.flow(...)`.

### Not a host for arbitrary user side effects

A user-authored tree CANNOT:
- Read or write files.
- Make HTTP requests.
- Touch the user session, cookies, or auth.
- Mutate global state.
- Schedule timers or workers.

Every privileged operation goes through a host-registered flow,
which the host implemented and audited.

### Not bound to TypeScript or the browser

The spec is language-agnostic. `@cluesurf/calm` is one runtime;
others can exist. The spec is the contract; the runtime is an
implementation.

### Not a replacement for build-time codegen

`calm` is for runtime, user-authored content. Schemas, types,
and pre-published content still go through the existing build-
time codegen pipelines (form-DSL, `pnpm make:form`). `calm`
plugs in alongside them, not in their place.

## Goal: real-time validation

The editor never lets a user type something that's broken
without telling them, immediately. Every edit revalidates the
affected node — every keystroke if needed — and surfaces
problems inline.

### What gets validated, in order of cheapness

1. **Args shape.** The arg object passed to a flow is checked
   against the flow's `take` schema. Missing required fields,
   extra fields, wrong primitive types — all caught here.
   Cheap (one Zod parse per node) and runs on every edit.

2. **Arg subtree types.** When an arg is itself a node, the
   node's declared return type (its `like`) must match the
   parent's expected arg type. `make(sum: { numbers: <X> })`
   requires `<X>` to evaluate to `list<number>`. The type
   checker walks the tree comparing parent expectations to
   child `like` annotations.

3. **Compile resolution.** The `(name, base, case)` triple must
   resolve to a registered flow. Unknown verbs, unknown bases,
   unknown cases — caught at compile, not runtime.

4. **Constraint evaluation.** Once shape/types are clean, any
   `validate(...)` calls run their tests. Failures attach to
   the responsible node with `slug` + `message` + `args`.

5. **Cross-record / async checks** (if the editor opted in).
   Uniqueness against the DB, referenced-record fetches, enum
   membership against live catalogs. Debounced; runs at idle,
   not per-keystroke.

Each tier is more expensive than the last. The runtime decides
how aggressively to run each tier based on the editor's
configured cadence.

### What "real-time" means here

- **Per-keystroke**: tier 1 (args shape).
- **Per-edit-pause** (~100ms idle): tier 2 + 3 (subtree types,
  compile resolution).
- **On request / publish-time** (~1s idle or explicit save):
  tiers 4 + 5 (constraints, async).

Editors choose the cadence; the runtime supports any of them.
The defaults are calibrated for "feels instant on a 10,000-node
document."

### What surfaces to the editor

Every validation result is a typed error structure attached to
a node `id`:

- `ok: boolean`
- `errors: { slug?, message?, call, args, path }[]`
- `warnings: similar shape`
- `severity: 'error' | 'warning' | 'info' | 'hint'`

The editor renders these as squiggles, gutter icons, sidebar
entries, or badges — its choice. The runtime's job is to emit
the structured result; the editor's job is to display it.

### What it implies for the spec

Validation isn't a layer on top of the runtime — it IS the
runtime, run at multiple precision tiers. The same engine that
evaluates a tree at render-time also validates it at edit-time.
The flow registry, the arg schemas, the type checker, the
compile resolver, the constraint evaluator — one stack, used
twice.

That keeps drift impossible: an edit that the editor accepts is
guaranteed to compile, because the editor and the compiler are
the same code path.

## Goal: first-class TypeScript type export

Calm is not just a runtime. It's also a **type generator**.

Every flow's `take` schema and `like` return-type annotation
compile to TypeScript types. Every `Form` schema compiles to
TypeScript types. Hosts get strict, IDE-aware types for free —
no hand-written `.d.ts` files, no parallel type definitions
that drift.

### What gets exported

For each registered flow `(name, base, case)`:

```typescript
// Auto-generated from flow schema
type IsIpaBroadInput = {
  text: string
}

type IsIpaBroadOutput = boolean

declare function isIpaBroad(args: IsIpaBroadInput): IsIpaBroadOutput
```

For each registered Form:

```typescript
// Auto-generated from Form schema
type LanguageString = {
  id: string
  text: string
  language__id: string
  cefr_level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  // ...
}
```

For each compiled tree node, the resolved flow's signature is
in host so the editor's autocomplete works against real types,
not stringly-typed argument names.

### Three flavors of consumer

- **Host code** writes regular TypeScript. `import { Base }
  from '@cluesurf/calm'` and use it; types flow through.

- **Editor UI** consumes the same types via a JSON Schema
  representation generated alongside, so it can render typed
  inputs without bundling TypeScript.

- **Other-language runtimes** consume the JSON Schema, since
  TypeScript types don't translate but JSON Schema does.

All three are projections of the same source: the `take` /
`like` declarations on each flow, plus the field declarations
on each `Form`.

### Why this matters

A typed runtime is the difference between "I think this works"
and "the compiler proved this works." For a sandboxed mini-
language being authored by end users, the typed surface is
also a security property: arguments that don't match the flow's
input type can't even be authored, much less executed.

This is why `form` is being absorbed into `calm` rather than
left as a sibling package: the type generator and the runtime
share so many concerns (schema parsing, type inference, codegen
output) that splitting them is constant friction. Bundle them
together and the boundary becomes one decision rather than
two.

## Goal: real-time partial recompilation

The browser editor is interactive. The user types a character,
drags a widget, drops a value into a slot — the document
re-renders. The runtime must be **incremental**: only the
subtree that changed gets recompiled and re-evaluated.
Re-running the whole tree on every keystroke is unacceptable.

### What "incremental" means here

- **Per-node identity.** Every node carries a stable `id`
  (UUID v7 or similar) so the engine can correlate a node
  across edits. Two trees with the same `id` at the same path
  are the same node, even if their content changed.
- **Compile cache keyed by `id` + content hash.** A node whose
  `(name, base, case)` and args content hash are unchanged
  reuses its previous compiled form. No work.
- **Evaluation memo keyed by compiled `id` + host hash.** A
  compiled node whose surrounding host hasn't changed reuses
  its previous evaluation. Pure functions don't re-run.
- **Dirty propagation walks upward**, not from the root. A
  changed leaf invalidates only its ancestors' results, never
  its siblings. A 10,000-node document with one changed cell
  re-evaluates O(log N) nodes, not N.
- **Async results survive edits.** Async lookups (DB queries,
  enum fetches) cache by their resolved arg fingerprint. Edits
  that don't change the args don't refire the query.

### What the editor sees

A typical edit cycle:

1. User types one character into a text field bound to a node's
   arg.
2. Editor dispatches a `patch` to the engine: `(node-id, arg
   path, new value)`.
3. Engine applies the patch in-place, walks upward marking
   ancestors dirty.
4. Engine re-validates only the changed node's args against
   its flow schema (cheap — Zod parser of one object).
5. Engine re-evaluates only the dirty path: changed node →
   parent → grandparent → ... → root. Anything off the dirty
   path keeps its memoized value.
6. Engine emits a render diff: which result subtrees changed
   and need re-render.
7. Editor renders only the diffed subtrees.

This is the same shape as React's reconciliation, applied to
the AST instead of the DOM.

### What the runtime must support

- **Stable node ids** at the editable AST level. Every node
  authored gets a `id` field assigned on creation; edits
  preserve it.
- **Pure-by-default flows.** Flows without explicit side-effect
  flags are memoizable — given the same args, same result.
  Async flows declare themselves via the registry so the
  cache layer knows to keyed by resolved-arg fingerprint
  instead of identity.
- **Patch-shaped edits.** The engine accepts patches
  (path-targeted JSON updates) instead of whole-tree replacements,
  so dirty propagation can start from the patch site.
- **Render-diff output.** The engine returns "what's new"
  rather than "the whole rendered output" each time.

### What the editor can rely on

- **Edits are cheap.** Typing a character must re-evaluate at
  most O(depth) nodes.
- **Nothing flickers.** Memoized subtrees keep their previous
  rendered output until the engine emits a new one for them.
  No tear-down / re-mount churn.
- **Progress is visible.** Async work that's mid-flight from a
  previous edit can be aborted (via standard cancellation
  signals) when the edit invalidates it.
- **Errors are scoped.** A constraint failure in one node
  doesn't take down the rest of the render — it's a localized
  red squiggle, the rest keeps rendering.

### What it implies for the spec

Real-time partial recompilation isn't a layer added on top —
it shapes the spec:

- Every editable node has `id` as a reserved structural field.
- Flows declare purity / async / cancelability up front.
- The engine's public API is patch-oriented, not
  full-tree-oriented.
- Compiled trees are diff-friendly (the `code` + `bind` shape
  hashes cleanly per node).

Get this right at the spec level, the editor experience is
smooth at any document size. Get it wrong, and the editor will
always feel laggy no matter how clever the runtime is.

## Stage / roadmap

| stage | host |
|---|---|
| **0 — spec** | This doc + AST + Flow + Base class definitions written down. |
| **1 — runtime** | `@cluesurf/calm` reference TypeScript runtime: editable→compiled compiler, registry, `bind` evaluator. |
| **2 — seed catalog** | Standard flow catalog from constraint-call-api-verbs ported in, schemas + reference impls. |
| **3 — editor primitives** | A small UI kit that renders an editable AST — chip rows, input widgets per base/case, validation feedback. |
| **4 — host integrations** | First production use: `mesh/site/word.surf` registers domain flows, ships a guide builder using calm. |
| **5 — multi-runtime** | Spec frozen enough for a second-language runtime (likely Rust or WASM) to parse and evaluate the same trees. |
| **6 — public API** | External hosts can build on top. Public docs site, plugin authoring guide. |

## Lineage and connections

### Inspiration: Fold

Calm inherits a lot of its modeling vocabulary and design
intuition from **Seed**, the reactive programming and data
modeling language at <https://github.com/cluesurf/seed>. Seed
is the long-term work: a full language with a runtime,
reactivity, and a rich type system. It still has a long way to
go.

Calm is the **near-term, more focused** sibling:

- Seed: a general-purpose reactive programming language.
- Calm: a **rendering / templating language** with the same
  data-modeling discipline, scoped tight enough to ship and to
  hand to end-users.

Where Seed is the ambitious foundation, Calm is the practical
runtime that lands now and keeps a clean migration path to
Seed-shaped concepts later. The deck/card/flow vocabulary, the
type-instance discipline (Form/Cast, Flow/Call), the form-DSL
roots — all from Seed's design tradition.

Eventually some of calm's runtime concerns may absorb into
Seed when Seed is ready. For now, calm stands on its own as a
focused, JSON-only rendering engine.

### Sibling packages

- **`@cluesurf/form`** — the schema DSL used in every flow's
  `take` field. Currently a separate package; **planned to be
  copied into calm** so the schema language and the runtime
  ship as one.
- **`@cluesurf/flow`** — a sibling function registry for file
  conversion (`flow convert image -I png -O jpg`). Same
  verb-first dispatch pattern, different domain. `calm` shares
  the design discipline.

## Anti-goals to remember

- **Don't add features without ratchet.** Every new node form
  is a new thing every runtime must implement. Prefer composing
  from existing primitives.
- **Don't smuggle logic through schemas.** Flows declare their
  shape; they don't run code at compile time. The runtime is
  the only thing that runs.
- **Don't expose unsafe primitives in the seed catalog.** No
  `eval`, no `read-file`, no `fetch` without an explicit
  host-supplied implementation. The default catalog stays pure.
- **Don't break the editable / compiled split.** Editable
  format is what users write; compiled format is what the
  engine runs. Mixing them invites versioning chaos.
- **Don't accept positional args.** Every flow takes one args
  object. Always.
