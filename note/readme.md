# `@cluesurf/book` — design notes

This folder is the spec-in-progress for `book`. Refine as we go.

## Reading order

1. [`goals.md`](./goals.md) — the why. What `book` is, what
   problems it solves, what it consolidates, the two primitives
   it exposes, the long-term vision (browser editor for
   end-users, MDX-but-JSON, sandboxed by construction).
2. [`structure.md`](./structure.md) — the canonical vocabulary
   spine. Form / Cast, Flow / Call, Template / Seed, plus
   Wave (umbrella) and Base (runtime world).
3. [`primitives.md`](./primitives.md) — `Form` (data model
   schemas) and `Flow` (function schemas). The two type
   primitives plus their instance pairs.
4. [`ast.md`](./ast.md) — the JSON AST. Reserved keys
   (`form`, `name`, `base`, `case`, `mark`), two flavors
   (editable + compiled), node kinds, examples.
5. [`book.md`](./book.md) — the `Book` class. Generic over
   `FlowBase`. Methods (`form`, `flow`, `call`, `card`,
   `cardTemplate`, `deck`, `bind`), lifecycle.
6. [`runtime.md`](./runtime.md) — how the engine evaluates a
   tree. Compilation, host, dispatch, async batching,
   real-time partial recompilation.
7. [`types.md`](./types.md) — the TypeScript type surface.
   `FlowBase` (string-keyed editable registry) +
   `FlowBaseCompiled` (integer-keyed runtime registry) +
   `FlowCodeMap`. Module-augmentation pattern (kysely-style).
8. [`catalog.md`](./catalog.md) — the standard nine-verb seed
   catalog (`is`, `has`, `make`, `get`, `find`, `if`, `bind`,
   `walk`, `validate`).
9. [`find.md`](./find.md) — find / test query filter Forms +
   Flows. How the existing query-system spec consolidates
   into book.
10. [`editor.md`](./editor.md) — the editor protocol. Patches,
    render diffs, what the engine emits, what the editor
    submits.

## Status

Pre-implementation. Specs are being written first; runtime,
seed catalog, and editor follow once the spec stabilizes.

## Refining

These are living docs. As decisions firm up, update the
relevant doc inline. Big decisions get their own headed
section. Small clarifications go inline. Move material between
docs freely as the boundaries clarify.
