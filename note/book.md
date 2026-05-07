# `Book` — the host class

The runtime instance. A host creates one (generic over a
`FlowBase` type that aggregates the registered Flows),
registers flows (directly or via decks), and binds documents.

```typescript
import { Book } from '@cluesurf/book'
import type { FlowBase } from '@cluesurf/book/standard'

const book = new Book<FlowBase>()

book.deck(standardCatalog)
book.flow('lookup-language', { base: 'language' }, async ({ slug }) => { /* ... */ })

const result = book.bind(treeFromUser, { stage: 'draft' })
```

The `FlowBase` generic is the registry-of-flows type
described in [`types.md`](./types.md). It typechecks every
`book.flow(...)` registration: name + base + case must
resolve to a key in the base, and the handler's args /
return must match the registered shape.

## Class shape

```typescript
class Book<R = FlowBase> {
  forms: Map<string, Form>           // editor-only; runtime ignores
  flows: Map<string, Flow>           // keyed by code id (`is.ipa.broad`)
  handlers: Map<number, Handler>     // keyed by integer code (compiled dispatch)

  // Register a Form (data model schema). Editor surface only.
  form(form: Form): void

  // Register a Flow with its handler. Typechecked against R.
  flow<
    Name extends FlowName<R>,
    Base extends FlowBaseFor<R, Name>,
    Case extends FlowCaseFor<R, Name, Base>,
  >(
    name: Name,
    options: { base?: Base; case?: Case } & FlowOptions,
    handler: FlowHandler<R, Name, Base, Case>,
  ): void

  flow<Name extends BareFlowName<R>>(
    name: Name,
    handler: FlowHandler<R, Name, undefined, undefined>,
  ): void

  // Invoke a registered flow by code id (string OR integer).
  call(code: string | number, bind: Record<string, unknown>): unknown

  // Register a card (one file's worth of related flows).
  card(card: Card): void

  // Register a deck (a published package — many cards).
  deck(deck: Deck): void

  // Compile + execute an editable tree.
  bind(tree: EditableNode, host?: HostInput): BindResult
}
```

The `R` generic defaults to `FlowBase` (the standard
catalog's bundled type). Hosts wanting the standard catalog
only can write `new Book()`. Hosts adding custom Flows
extend `FlowBase` via `declare module` augmentation (see
[`types.md`](./types.md)) and still use the default
generic. Hosts wanting a fully custom Flow set pass their
own type: `new Book<MyFlowBase>()`.

`flow ⊂ card ⊂ deck` is the nesting. Hosts register at
whichever level fits.

## `book.form(form)`

Register a data model schema. Forms become referenceable by
`save` path; Flows reference forms in their `take` and `like`
fields.

```typescript
book.form({
  form: 'form',
  save: '@/code/form/language',
  link: {
    id: { like: 'string' },
    text: { like: 'string' },
    language__id: { like: 'string' },
  },
})
```

Forms are validated at registration: unknown referenced forms,
type cycles, etc. surface immediately.

## `book.flow(...)`

Register a Flow with its implementation. Two signatures:

```typescript
// Full options form.
book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
  Array.from(text).every(is_ipa_symbol),
)

// Bare verb (no base / case).
book.flow('always-true', () => true)
```

The options object accepts:

```typescript
type FlowOptions = {
  base?: string                 // the resource / shape being acted on
  case?: string                 // a sub-variant of the base
  like?: string                 // return type
  take?: FormLinkMesh           // input args schema (record of FormLink fields)
  async?: boolean               // batched async (default false)
  pure?: boolean                // memoizable (default true)
  cancelable?: boolean          // supports AbortSignal (default false)
}
```

If `take` is provided, the runtime parses every arg against it
on call. If absent, args pass through unchecked (rare;
strongly discouraged).

If `async: true`, the flow is collected by the pre-resolution
pass and batched — the synchronous evaluator never sees the
unresolved call.

If `pure: true` (default), the flow's output is memoized on
`(code, args fingerprint)` for incremental recompilation.

## `book.call(code, bind)`

Direct invocation — bypass compile, run a registered flow by
its code id.

```typescript
const result = book.call('is.ipa.broad', { text: 'fəˈnɛtɪk' })
```

Useful for hosts that store compiled trees and want to trigger
a single node, or for tests that want to run one flow in
isolation. The args are still validated against `take`.

## `book.card(card)`

A `card` is one file's worth of related Flows. Calling
`book.card(...)` registers every flow in the card.

```typescript
type Card = {
  name: string                  // 'is/ipa', 'make/cased', ...
  forms?: Form[]
  flows?: Flow[]
  seeds?: Seed[]
}
```

The card structure mirrors the file layout: `is/ipa/card.ts`
exports a `Card` whose flows all live under the `is.ipa.*`
code namespace.

### Card templates (module patterns)

A **`CardTemplate`** is a meta-schema constraining what a Card
is *allowed* to contain — analogous to how MDX-with-restrictions
or a content-CMS schema limits what authors can put on a page.

```typescript
type CardTemplate = {
  name: string                  // 'guide-page', 'lesson-card', ...
  allow_forms?: string[]        // form names this card may declare
  allow_flows?: {               // flow names + cases this card may register
    name: string
    case?: string
  }[]
  require_seeds?: SeedSlot[]    // seeds the card MUST publish
  allow_seeds?: SeedSlot[]      // seeds the card MAY publish (in addition to required)
  forbid?: {                    // explicit deny list
    forms?: string[]
    flows?: { name: string; case?: string }[]
  }
}

type SeedSlot = {
  name: string                  // 'body', 'sidebar', 'header', ...
  template: string              // the Template name the seed must conform to
  need?: boolean                // required (default true)
}
```

A card declares which template it conforms to:

```typescript
const guideCard: Card = {
  name: 'guide/intro',
  template: 'guide-page',       // ← matches a registered CardTemplate
  forms: [/* ... */],
  flows: [/* ... */],
  seeds: [/* ... */],
}
```

The runtime validates the card against its template at
registration time. Cards that violate the template (extra
forms, disallowed flows, missing required seeds) are rejected
with typed errors.

This is what makes book safe for **third-party contributions**.
A host publishes a `CardTemplate` saying "lesson cards may
have a body, an exercise list, and a vocab map — nothing
else." End-users (or third-party authors) can publish lesson
cards conforming to that template, and the host knows exactly
what surface area they expose.

The pattern matches how MDX integrations restrict allowed
components: define the allowed set up front, reject anything
else. Card templates make the same restriction declarative,
introspectable, and editable.

### Built-in card templates

The standard catalog ships a few baseline templates hosts can
use as-is or extend:

- `card-template/document` — generic prose document.
- `card-template/form-record` — a form definition + sample
  casts.
- `card-template/flow-bundle` — a related set of flows under
  one verb (e.g., all `is.iso.*` cases on one card).
- `card-template/lesson` — a teaching unit with body, examples,
  exercises, vocab.

Hosts publish their own templates via `book.cardTemplate(...)`.

## `book.cardTemplate(template)`

Register a CardTemplate. Subsequent `book.card(...)` calls
whose `template:` matches are validated against it.

```typescript
book.cardTemplate({
  name: 'lesson',
  allow_forms: ['vocab_entry'],
  allow_flows: [{ name: 'is' }, { name: 'has' }, { name: 'get' }],
  require_seeds: [
    { name: 'body',     template: 'document' },
    { name: 'exercises', template: 'list-of-questions' },
  ],
  allow_seeds: [
    { name: 'vocab',   template: 'vocab-map', need: false },
    { name: 'glossary', template: 'glossary',  need: false },
  ],
})
```

Cards that don't declare a template are unconstrained
(default). Hosts that want strict authoring publish templates
and require all cards to conform.

## `book.deck(deck)`

A `deck` is a module / package — a published collection of
cards. `book.deck(...)` walks the deck's cards and registers
all of them.

```typescript
type Deck = {
  name: string                  // package name
  fork: string                  // semver
  cards: Card[]
  forms?: Form[]                // deck-level forms shared across cards
}
```

The standard catalog ships as a deck called `book/standard` (or
similar). Hosts call `book.deck(standardCatalog)` to load it.

Other published decks layer on top — `@cluesurf/book-linguistics`
adds linguistic-specific forms and flows; a hypothetical
`@some-host/book-flows` adds host-specific flows. Multiple
decks coexist as long as their code ids don't collide.

## `book.bind(tree, host?)`

The main lifecycle. Compile + execute an editable tree.

```typescript
const result = book.bind(treeFromUser, {
  value: cellValue,           // optional — for per-cell evaluation
  record: recordSnapshot,     // optional — for record-level evaluation
  stage: 'draft',             // 'draft' | 'commit' | 'export'
  locale: 'en',
  viewer: 'usr_001',
  viewer_roles: ['admin'],
})
```

Returns:

```typescript
type BindResult = {
  ok: boolean
  output?: unknown              // the evaluated tree's result
  errors: BindError[]           // compile + validation errors
  warnings: BindError[]
  trace?: ExecutionTrace        // optional debug trace
}

type BindError = {
  stage: 'compile' | 'validate' | 'execute'
  node_mark: string
  slug?: string
  message?: string
  call?: string
  args?: Record<string, unknown>
  path: (string | number)[]     // pointer into the tree
}
```

### Lifecycle steps

1. **Compile.** Walk editable → compiled. Resolve every
   `(name, base?, case?)` to a registered code id. Move args
   into `bind`. If a triple is unknown, emit a compile error
   for that node; continue to collect more (no early return).
2. **Validate args shape.** For each compiled node, parse its
   `bind` against the Flow's `take` schema. Emit per-node
   validation errors.
3. **Type-check composition.** Walk parent-expects-child arg
   types using the `like` annotations. Emit type errors.
4. **Pre-resolve async.** Collect every `async: true` call,
   batch their lookups, rewrite results back into the tree.
5. **Evaluate.** Walk the tree synchronously, dispatching each
   call to its handler. Memoize per node `id` + args
   fingerprint when the flow is pure.
6. **Return.** `BindResult` with the final value, errors, and
   warnings.

Compile errors don't prevent later steps — the runtime carries
on with what it can, so the editor can show every problem at
once.

### Patch-shaped binding

Hosts implementing the editor want to bind incrementally, not
re-bind the whole tree on every keystroke. The patch entry
point:

```typescript
book.bindPatch(prevResult: BindResult, patch: TreePatch): BindResult
```

`prevResult` is the output of a previous `book.bind` call.
`patch` is a path-targeted update. The runtime:
- Applies the patch in-place on the cached compiled tree.
- Marks the affected node and its ancestors dirty.
- Re-runs compile + validate + evaluate only on the dirty path.
- Reuses memoized outputs everywhere else.
- Emits a render diff as part of the new `BindResult`.

The full `bind` is the cold start; `bindPatch` is the hot
path used during authoring.

## Multiple `Book` instances

Hosts can run multiple `Book` instances in the same process —
e.g., one for the document editor, one for the validation
pipeline. Instances are independent; flows registered on one
don't leak to the other.

This is also how a host can sandbox different user populations
with different flow catalogs: an admin Book has admin-only
flows; a public Book has the safe subset.

## Lifecycle order for a host

```typescript
// 1. Create the runtime.
const book = new Book()

// 2. Register the standard catalog.
book.deck(standardCatalog)

// 3. Register host-specific decks.
book.deck(linguisticsCatalog)

// 4. Register host-specific cards / flows.
book.card(myCustomCard)
book.flow('lookup-language', { async: true, /* ... */ }, async (args) => /* ... */)

// 5. Use it.
const result = book.bind(treeFromUser, { stage: 'commit' })

// 6. For the editor: incremental edits.
const updated = book.bindPatch(result, patch)
```

Steps 1–4 happen once at startup. Steps 5–6 run constantly
while the user authors documents.
