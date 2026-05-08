# `@cluesurf/calm`. Design notes

This folder is the spec-in-progress for `calm`. Refine as we go.

## Reading order

1. [`goals.md`](./goals.md). The why. What `calm` is, what
   problems it solves, what it consolidates, the long-term
   vision (browser editor for end-users, MDX-but-JSON,
   sandboxed by construction).
2. [`architecture.md`](./architecture.md). The four core
   types/classes (`Book`, `Code`, `Base`, `Make`) and how
   they relate. Read this before any spec doc — older docs
   that conflict with it are stale.
3. [`schema.md`](./schema.md). The reserved props on every
   declaration: Forms, Flows, instances, Calls. The
   canonical vocabulary spec.
4. [`structure.md`](./structure.md). Wider vocabulary spine
   and high-level aggregation story.
5. [`primitives.md`](./primitives.md). Deeper on `Form` and
   `Flow`.
6. [`ast.md`](./ast.md). The JSON AST. Reserved keys, two
   flavors (editable + compiled), node kinds.
7. [`runtime.md`](./runtime.md). How the engine evaluates a
   tree. Pipeline, dispatch, async batching, real-time
   partial recompilation.
8. [`codegen.md`](./codegen.md). The `Make` class and the
   generated artifacts.
9. [`codegen-questions.md`](./codegen-questions.md). Open
   implementation gaps in the codegen spec.
10. [`types.md`](./types.md). The TypeScript surface.
    `Code` (the bundled type), generics, module augmentation.
11. [`catalog.md`](./catalog.md). The standard nine-verb
    seed catalog (`is`, `has`, `make`, `get`, `find`, `if`,
    `bind`, `walk`, `validate`).
12. [`find.md`](./find.md). Find / test query filter Forms +
    Flows.
13. [`editor.md`](./editor.md). The editor protocol.
    Patches, render diffs, what the engine emits, what the
    editor submits.
14. [`book.md`](./book.md). The `Book` *type* (the published
    bundle). NOT a class.

## Canonical naming

- **`Book`** — type. A published bundle of Forms / Flows /
  Folds / Hashes / Lists with `host` + `name`.
- **`Code`** — type. The generated registry mapping every
  entry's colon-key to its type.
- **`Base`** — class. The runtime that registers flow
  handlers AND dispatches calls.
- **`Make`** — class. The codegen orchestrator.

## Status

Pre-implementation. Specs are being written first; runtime,
seed catalog, and editor follow once the spec stabilizes.

## Refining

These are living docs. As decisions firm up, update the
relevant doc inline. Big decisions get their own headed
section. Small clarifications go inline. Move material
between docs freely as the boundaries clarify.
