# Roadmap

What's done, what's left, and what's still vague in the spec.

## Where we are now

- The form.js source has been migrated into `calm/code/`.
- Folder structure aligns with the calm layout (`form/`, `fold/`, `make/`).
- `pnpm exec tsc --noEmit` is clean.
- All 96 tests pass.
- The notes folder has the full vocabulary spec across 12 docs.

But: the migrated code still speaks the **form.js dialect** (old type names, old AST shape). The note docs describe the **calm dialect**. Closing that gap is the bulk of what's left.

## Code work remaining

### Phase 1. AST shape rewrite (`fold/`)

The current `fold/types.ts` uses form.js node names. Calm spec names need to land:

- [ ] `BranchNode` rename to `ForkNode`. Drop `'branch'` literal, use `'fork'`.
- [ ] `AttemptNode` removed entirely. Calm has no try/catch.
- [ ] `LoopNode` collapsed into `WalkNode` variants. Single `'walk'` discriminant with `case: 'test' | 'list' | 'size' | 'form'`.
- [ ] `PathNode` rename to `ReadNode`. `path: PathSeg[]` field renames to `link: ReadLink[]`.
- [ ] Literal node types prefixed `Base*`. `TextNode` becomes `BaseText`, `IntegerNode` becomes `BaseInteger`, etc.
- [ ] `id` field removed. Replace with `mark` (semver string).
- [ ] `meta` field removed entirely.
- [ ] Add `Find` primitive type (query filter). Doesn't exist in form.js.
- [ ] Add `Fold` primitive type (document template Form variant). Currently the AST tree itself is implicit.

### Phase 2. Builder rename (`fold/build.ts`)

Current `flow.*` builders reflect form.js shape. Calm spec names:

- [ ] `flow.branch(...)` rename to `flow.fork(...)`.
- [ ] `flow.path(...)` rename to `flow.read(...)`. Field rename internally.
- [ ] `flow.walk(...)` becomes 4 variants. Add `flow.walk.test`, `flow.walk.list`, `flow.walk.size`, `flow.walk.form`.
- [ ] Drop `flow.attempt(...)`.
- [ ] Drop `flow.loop(...)`. Use `flow.walk.size(...)` instead.
- [ ] Add `flow.find(...)` for filter authoring.
- [ ] Add `flow.fold(...)` for document trees (or reuse the tree-of-calls shape).

### Phase 3. CallMake / CallWake split

Spec says editable form is `CallMake<T>` with args at top level via `& T`, compiled form is `CallWake<T>` with `bind: T` and `code: number`. Currently form.js has one `CallNode` shape with flat args.

- [ ] Split `CallNode` into `CallMake<T> | CallWake<T>` union.
- [ ] Compile step assigns integer codes (mapping `(name, base, case)` to int).
- [ ] Wake form replaces `name`/`base`/`case` with `code: number` and moves args under `bind: T`.
- [ ] Inverse decompile.

### Phase 4. The `Base` runtime class (`code/runtime/`)

The class doesn't exist yet. Spec is in `note/runtime.md`,
`note/architecture.md`, and `note/book.md`.

- [ ] `code/runtime/index.ts` exports `class Base<T extends Code>`.
- [ ] `base.flow(...)`, `base.call(...)`, `base.bind(...)`, `base.bindPatch(...)`.
- [ ] Generic typecheck via the bundled `Code` interface.
- [ ] Internal registries: `flows`, `handlers` keyed by integer code.

### Phase 5. The `Make` codegen class (`code/make/`)

Currently `code/make/index.ts` exports a `make()` function. Spec describes a `Make` class with `book` / `save` methods.

- [ ] Wrap existing make logic in a `Make` class.
- [ ] `make.book(book)` registers a Book by its `host:name` key.
- [ ] `make.save()` walks every registered Book and emits per-leaf `index.ts` / `form.ts` / `base.ts`.
- [ ] Per-leaf 3-file emit pattern instead of form.js's flat `*.form.ts` / `*.take.ts` / `*.base.ts`.
- [ ] Emit bundled `Code` type (kysely-style aggregate).
- [ ] Emit numeric-id table for compile-time call-site rewriting.

### Phase 6. The standard catalog (`code/base/`)

The folder doesn't exist. Spec describes the nine-verb seed catalog (`is`, `has`, `make`, `get`, `find`, `if`, `bind`, `walk`, `validate`).

- [ ] `code/base/<logical-group>/make.ts` files exporting batches of related declarations.
- [ ] `code/base/<logical-group>/flow.ts` files exporting handlers for the Flows in the sibling `make.ts`.
- [ ] All 100+ entries from `note/catalog.md`.
- [ ] Generated `index.ts` / `form.ts` / `base.ts` for the bundle.

### Phase 7. Runtime evaluator pipeline

Spec defines a 5-stage pipeline: compile → validate args → type-check composition → pre-resolve async → evaluate. The current `fold/render/` is form.js's renderer — close but not aligned.

- [ ] Extract the compile step (make → wake) as a separate pass.
- [ ] Validate-args stage uses generated Zod parsers.
- [ ] Type-check stage walks parent-arg vs child-`like` annotations.
- [ ] Pre-resolve async stage batches calls flagged `async: true`.
- [ ] Evaluator dispatches per `(code, bind)` against integer-keyed handler array.
- [ ] Memoization keyed by `(code, args fingerprint, host fingerprint)`.

### Phase 8. Editor protocol

Spec is in `note/editor.md`. Types not yet in code.

- [ ] `TreePatch` union type (`set` / `replace` / `insert` / `remove` / `move`).
- [ ] `BindResult` shape (errors / warnings / output / diff).
- [ ] `RenderDiff` (changed / unchanged node marks).
- [ ] `bindPatch(prev, patch, opts?)` on the `Base` class.
- [ ] Tier-based validation (args / types / resolve / constraints / async).

## Spec gaps

Areas the notes are vague or silent on. Should be filled before the corresponding phase ships.

### Constraint grammar

Notes mention `validate(...)` and constraint trees but don't have a dedicated `note/constraint.md`. The cluesurf monorepo's `note/platform/model/schema/` had the full grammar (8 families of predicates, `let` binding, async, locale, stage, suggestions, viewer authorization). That work isn't ported into calm yet.

- [ ] Decide whether constraint grammar lives in calm spec or stays at the monorepo level.
- [ ] If in calm: port `constraint-grammar.md`, `constraint-call-api.md`, `constraint-edge-cases.md`, `constraint-call-api-verbs.md` analogues.
- [ ] If at monorepo level: link out from `note/catalog.md`'s `validate` entry.

### HTTP / network calls

`note/goals.md` lists "HTTP request making" as a goal but no concrete spec for how flows declare network calls or how the runtime sandboxes them.

- [ ] Define the `find.*` family's HTTP shape (auth, cancellation, retries).
- [ ] Specify how an authored Find translates to a network round-trip vs an in-memory filter.
- [ ] Cancellation semantics during real-time recompilation.

### DOM rendering / View runtime

`note/goals.md` and `note/ast.md` mention `view` nodes. The renderer interface (host plugs in React / HTML / etc.) isn't fully specified.

- [ ] Renderer interface: what does the host pass to `Book`?
- [ ] How does a `view` node resolve to a registered component?
- [ ] Component versioning (form.js's `version` field on view nodes).
- [ ] SSR vs client-render differences.

### Wake-form wire serialization

Spec says compiled trees are stored. No canonical JSON shape described.

- [ ] Wake-form serialization format (key ordering, integer encoding, etc.).
- [ ] Cross-runtime compatibility (e.g., a Rust runtime reading a TS-emitted wake form).
- [ ] Stability guarantees across `Make` versions.

### Mark / version migration

Spec uses `mark` for per-call schema-version stamps but doesn't describe what happens when a flow's schema bumps version.

- [ ] Migration strategy: auto-rewrite old wake forms? Refuse? Adapter shims?
- [ ] How `mark` interacts with the integer code map (do codes shift on version bump?).
- [ ] Schema-evolution guidelines for flow authors.

### Recursion + let-binding

`note/runtime.md` mentions recursion via `bind` (let). The `bind` flow isn't specified as a node form. Form.js doesn't have it.

- [ ] Add `bind` flow to `note/catalog.md` with full signature.
- [ ] Spec the recursion depth cap.
- [ ] Worked example of recursive `Find` / `Fold` in tests.

### Multi-runtime interop

`note/goals.md` says calm is language-agnostic at the spec level. No formal interop doc.

- [ ] Reference implementation contract (what every runtime must implement).
- [ ] Test suite that any runtime can run against to claim conformance.
- [ ] Capability flags (which features are optional vs required).

### Editor implementation

`note/editor.md` describes the protocol. The actual editor UI is out of scope for the calm package, but the protocol implementation is in scope.

- [ ] Patch validation and conflict detection.
- [ ] Editor primitives package (separate `@cluesurf/calm-editor`?).
- [ ] Render-diff emission.

### Find vs Fold distinction

`note/find.md` covers Find. `note/structure.md` covers Fold. The relationship between them (both are tree-of-Calls but Find is filtering and Fold is documents) could use a clarifying section.

- [ ] One-page comparison.
- [ ] When to author each.

## Suggested ordering

Roughly dependency-ordered. Each phase unblocks the next.

1. **Phase 1 + 2** (AST + builder rename). Mostly mechanical; sets the vocabulary.
2. **Phase 3** (CallMake/CallWake split). Foundation for compile + wake-form storage.
3. **Phase 4** (Base runtime class). Wraps form.js's evaluator into the spec'd class shape.
4. **Phase 5** (Make codegen class). Wraps form.js's makeTree.
5. **Phase 6** (Standard catalog). Build out at least one verb (e.g., `is`) end-to-end as the template.
6. **Phase 7** (Runtime pipeline). Extract the 5 stages cleanly.
7. **Phase 8** (Editor protocol). Wire `bindPatch` into the runtime.

Spec gaps: close them as the corresponding phase needs them. Constraint grammar is the biggest one and probably blocks Phase 6.

## Risks

- The form.js renderer is mature and tested. Replacing it wholesale risks regressions. Prefer **incremental migration**: rename + adapt rather than rewrite.
- The `flow.*` builder name is exported as a stable API. Renaming methods (`branch` → `fork` etc.) is a breaking change. Either ship as `@cluesurf/calm v1` from day one with the new names, or maintain shim aliases through a transition period.
- The integer-keyed compiled form is a **wire format**. Get it right before publishing or face migration pain.

## Quick-win starter tasks

If picking up the migration cold, these are good first commits:

- [ ] Rename `BranchNode` to `ForkNode` and `'branch'` to `'fork'` across `fold/`.
- [ ] Rename `flow.branch(...)` to `flow.fork(...)`. Provide a deprecated alias.
- [ ] Rename `PathNode` to `ReadNode`, `path: PathSeg[]` to `link: ReadLink[]`.
- [ ] Drop `AttemptNode` and `flow.attempt(...)`.
- [ ] Replace `id` with `mark` on every node form.
- [ ] Drop `meta` from every node form.
- [ ] Rename test fixtures to match.

These are mostly perl substitutions plus test updates. Get the green-test gate moving before the deeper structural work.
