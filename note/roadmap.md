# Roadmap

What's done, what's left, and what's still vague in the spec.

## Where we are now

- The form.js source has been migrated into `bead/code/`.
- Folder structure: `form/`, `fold/`, `make/` (codegen), `base/` (runtime), `book/` (standard catalog).
- `pnpm exec tsc --noEmit` is clean.
- All 196 tests pass.
- The notes folder has the full vocabulary spec across 12+ docs.
- The bulk of the AST-shape reconciliation with `note/ast.md` has landed.

## Code work — completed

### Phase 1. AST shape (`fold/`) ✅

- [x] `BranchPrimitive` → `ForkPrimitive`. `'branch'` → `'fork'`.
- [x] `AttemptPrimitive` removed entirely. Bead has no try/catch.
- [x] `LoopPrimitive` collapsed into `WalkPrimitive` variants. Single `'walk'` discriminant with `case: 'test' | 'list' | 'size'`. (Spec teases a 4th `'form'` variant for object-entries-style; not implemented.)
- [x] `PathPrimitive` → `ReadPrimitive`. `path: PathSeg[]` → `link: ReadLink[]`.
- [x] Literal types collapsed to **bare native scalars** (`string` / `number` / `boolean` / `Date` / `null`). No `*Primitive` wrappers for scalars. Tagged structural nodes stay: `list`, `hash`, `template_string`, `read`, `reference`, `call`, `fork`, `switch`, `match`, `case`, `pick`, `walk`, `view`.
- [x] `id` / `meta` / `version` reserved fields dropped from the reserved set.
- [x] `mark` carried through (UUID v7 recommended, optional).
- [ ] Add `Find` primitive type (query filter). Not yet implemented.
- [ ] Add `Fold` primitive type (document template variant). Currently the AST tree itself is implicit.

### Phase 2. Builder rename (`fold/build.ts`) ✅

The namespace is now `make` (not `flow`). Bead spec names:

- [x] `make.fork(...)` (was `make.branch`).
- [x] `make.read(...)` (was `make.path`). Internal field renamed too.
- [x] `make.walk(...)` for the list case; `make.walkTest(...)` for while-style; `make.walkSize(...)` for counted ranges.
- [x] `make.attempt(...)` dropped.
- [x] `make.loop(...)` dropped. Use `make.walkSize(...)`.
- [x] `make.templateString(...)` (was `make.weave`).
- [x] `make.hash(...)` added.
- [ ] Add `make.find(...)` for filter authoring.
- [ ] Add `make.fold(...)` for document trees (or reuse the tree-of-calls shape).

### Phase 3. CallMake / CallWake split ✅

- [x] Single `Call` type covers both flavors via `name` (make) vs `code` (wake).
- [x] `make.compile(tree, codeTable)` produces wake form: `(name, base, case)` resolved to `code`, args folded under `bind`.
- [x] `make.decompile(tree, decodeTable)` reverses.
- [x] `make.buildDecodeTable(codeTable)` derives the inverse.
- [x] `mark` survives both directions.

### Phase 4. The `Base` runtime class (`code/base/`) ✅ (renamed from `code/runtime/`)

- [x] `code/base/index.ts` exports `class Base<R extends Code>`.
- [x] `base.flow(...)`, `base.call(...)`, `base.cast(tree)`, `base.load(book)`.
- [x] Generic typecheck via the bundled `Code` interface.
- [x] Internal `Map<HookName, Hook>` keyed by colon-namespace string AND integer code (when `book.code` table is supplied).
- [ ] `base.bindPatch(...)` for partial recompilation (planned, not yet implemented).

### Phase 5. The `Make` codegen class (`code/make/`) ✅

- [x] `Make` class with `load(book)` / `save()`.
- [x] Per-leaf 3-file emit (`index.ts`, `form.ts`, `base.ts`).
- [x] Bundled `Code` type (kysely-style aggregate).
- [x] Numeric-id `CodeLink` table.

### Phase 6. The standard catalog (`code/book/`) ✅ (renamed from `code/base/`)

- [x] `code/book/<verb>/make.ts` declarations.
- [x] `code/book/<verb>/flow.ts` handlers.
- [ ] Full 100+ entries from `note/catalog.md` — currently has `is`, `make`, `get`, `has`, `format` (5 of 9 verbs). Missing: `validate`, `find`, `if`, `bind`, `walk` as catalog verbs.
- [x] Generated artifacts.

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

Notes mention `validate(...)` and constraint trees but don't have a dedicated `note/constraint.md`. The cluesurf monorepo's `note/platform/model/schema/` had the full grammar (8 families of predicates, `let` binding, async, locale, stage, suggestions, viewer authorization). That work isn't ported into bead yet.

- [ ] Decide whether constraint grammar lives in bead spec or stays at the monorepo level.
- [ ] If in bead: port `constraint-grammar.md`, `constraint-call-api.md`, `constraint-edge-cases.md`, `constraint-call-api-verbs.md` analogues.
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

`note/goals.md` says bead is language-agnostic at the spec level. No formal interop doc.

- [ ] Reference implementation contract (what every runtime must implement).
- [ ] Test suite that any runtime can run against to claim conformance.
- [ ] Capability flags (which features are optional vs required).

### Editor implementation

`note/editor.md` describes the protocol. The actual editor UI is out of scope for the bead package, but the protocol implementation is in scope.

- [ ] Patch validation and conflict detection.
- [ ] Editor primitives package (separate `@cluesurf/bead-editor`?).
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

- The integer-keyed compiled (wake) form is a **wire format**. Get it right before publishing or face migration pain. Currently `make.compile` / `make.decompile` are stable and round-trip; the integer ids come from the codegen `CodeLink` table per Book.
- The `make.*` builder namespace is now exported. Further renames are breaking changes; treat the current shape as the v1 surface.
