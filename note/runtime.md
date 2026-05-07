# Runtime

How the engine evaluates a tree. Compilation, host, dispatch,
async batching, memoization, real-time partial recompilation.

## Pipeline overview

```
editable tree
     │
     ▼  compile
compiled tree   ────►  errors[]   (unknown flow / bad triple)
     │
     ▼  validate
compiled tree   ────►  errors[]   (args don't match `take`)
     │
     ▼  type-check
compiled tree   ────►  errors[]   (parent-arg type ≠ child `like`)
     │
     ▼  pre-resolve async
compiled tree   ────►  errors[]   (async lookups failed)
   (with async results inlined)
     │
     ▼  evaluate
   output value + render diff + final errors
```

Each stage produces a result and may produce errors. Errors
don't halt the pipeline. Every stage tries to make progress
on every node and accumulates problems for the editor.

## Stage 1. Compile

Walk the editable tree and rewrite each node into compiled
form.

For a `call` node:
- Look up `(name, base?, case?)` in the registry.
- If found:
  - Replace `name`/`base`/`case` with `code`.
  - Move user-data keys into `bind`.
  - Preserve `id`.
- If not found:
  - Leave the node in editable form.
  - Attach a compile error: `{ slug: 'unknown-flow', node_mark, ... }`.

For a `view` node: same shape, registry lookup against the
view registry.

For other forms (`path`, `fork`, `walk`, etc.): no change
beyond children.

The compile step is **memoized by `id` + content hash**. A
node whose triple and arg-content hash are unchanged reuses
its previous compiled form. Editing one leaf doesn't recompile
the whole tree.

## Stage 2. Validate args shape

For each compiled `call`, parse `bind` against the Flow's
`take` schema. The parser is generated from the form-DSL
schema at flow-registration time (Zod or equivalent), so this
is fast.

Failures produce `BindError`s with the offending node id and
arg path.

## Stage 3. Type-check composition

Walk parent-expects-child arg types using the `like`
annotations. The runtime resolves each child's effective
return type (literals: their literal type; calls: the Flow's
`like`; paths: dispatched on the host binding).

Mismatches surface as type errors. This is what catches
"wrong shape" bugs without running the tree:

```typescript
// is(equal: { this: <X>, that: <Y> })
// Both args' effective types must be compatible.
// is(equal: { this: 5, that: "five" })  ← error: number vs string
```

## Stage 4. Pre-resolve async

Walk the compiled tree collecting every node whose Flow is
registered with `async: true`. Group by Flow code (so the
runtime batches per flow).

For each batch:
- Resolve each call's args against the current host.
- Issue one batched fetch.
- Stash results in a side-channel keyed by node `id`.

The synchronous evaluator (Stage 5) reads stashed results
instead of making live async calls. The author's tree never
sees the async machinery directly.

Batched fetches give predictable performance: N calls to
`is-unique-in` collapse into one SQL query; N calls to
`find-record` collapse into one bulk SELECT.

## Stage 5. Evaluate

Walk the compiled tree synchronously, dispatching each node:

```
call → look up handler by code, run handler(bind) → value
read → resolve segments against host → value
view → render component, recurse into children → element
fork → eval test, eval the chosen arm → value
walk → dispatch on `case` (test / list / size / form), push
       iterator host per step, eval hook → list of values
literal → return the literal value
```

The walker pushes/pops host frames as it enters iteration
nodes (any `walk` variant) and let-bindings (`bind` calls).
Lookup goes from the innermost host outward.

### Memoization

Every `pure: true` flow's output is cached on
`(code, args fingerprint, host fingerprint)`. The fingerprint
hashes deeply but stops at iterator-bound names (since those
change per iteration). Re-evaluating a node with unchanged
args returns the cached output without invoking the handler.

Async flows are memoized on the resolved-args fingerprint
(which is computed once during pre-resolution, not per
evaluation).

`pure: false` flows (date/time, viewer-dependent, side-effecty)
are never memoized. Hosts that register such a flow should opt
out explicitly.

## Host

A host is a chain of name → value bindings. Lookups walk from
the innermost frame outward.

### Engine-bound names

Pushed before user evaluation starts:

| name | type | source |
|---|---|---|
| `value` | unknown | per-cell call site |
| `record` | map | record-level call site |
| `now` | string (ISO datetime) | engine clock |
| `today` | string (YYYY-MM-DD) | engine clock |
| `locale` | string (BCP 47) | host config |
| `stage` | string | host call to `bind` |
| `viewer` | string (uuid) | host config |
| `viewer_roles` | list<string> | host config |

### User-bound names

Added by:

- **Iterators**. Any `walk` variant (`test` / `list` / `size`
  / `form`) pushes `item` (or the named iterator) and `index`
  for the duration of the body.
- **Let-bindings**. The `bind(names: { foo: <expr> }, then:
  <body>)` flow pushes each name into host before evaluating
  `then`.

Every binding is value-typed; the type-checker enforces that
reads via `path` are compatible with the binding's declared
type.

## Real-time partial recompilation

The editor calls `calm.bindPatch(prev, patch)` instead of
re-running `calm.bind`. The runtime supports this via three
caches:

1. **Compile cache.** Keyed by node `id` + content hash. The
   compiled form is reused unless the triple or args content
   changed.
2. **Type-check cache.** Same key. Type-check results survive
   args changes that don't alter inferred types.
3. **Evaluation cache.** Keyed by compiled node `id` + args
   fingerprint + host fingerprint. Pure-flow outputs survive
   any change that doesn't reach into their args.

A patch:

```typescript
type TreePatch =
  | { form: 'set';     node_mark: string; arg: string; value: unknown }
  | { form: 'replace'; node_mark: string; new_node: MakeNode }
  | { form: 'insert';  parent_mark: string; arg: string; index: number; new_node: MakeNode }
  | { form: 'remove';  node_mark: string }
  | { form: 'move';    node_mark: string; new_parent_id: string; new_index: number }
```

The runtime:
- Applies the patch on the cached editable tree.
- Walks upward from `node_mark` marking ancestors dirty.
- Re-runs compile / validate / evaluate only on the dirty path.
- Returns a `BindResult` with the new output + the diff.

Render diff:

```typescript
type RenderDiff = {
  changed: string[]             // node ids whose output changed
  unchanged: string[]           // node ids whose output is reused
}
```

The editor keeps DOM mounts aligned to node `id`s and uses the
diff to know which subtrees need re-rendering. Anything in
`unchanged` keeps its DOM as-is.

## Cancellation

Async flows declared `cancelable: true` receive an
`AbortSignal` in their handler context. When the editor
patches a node whose async work is mid-flight, the runtime
aborts the previous signal and starts fresh.

Without cancellation the runtime still works. It just lets
old fetches complete and discards their results. Cancellation
is an optimization for slow networks.

## Recursion

Recursive constraints (e.g. validate a tree of nested records)
use the `bind` flow to define a named subtree, then reference
it from inside `walk`:

```typescript
flow.call('bind', {
  names: {
    check: <recursive subtree that calls flow.read('check') inside walk>,
  },
  then: flow.read('check'),
})
```

The runtime caps recursion depth (configurable; default ~256
levels). Beyond the cap, evaluation fails with a typed error.
This prevents stack overflow on malicious or buggy inputs.

## Errors during evaluation

Most errors surface during stages 1. 4 (compile, validate,
type-check, pre-resolve). Stage-5 errors are runtime
exceptions:

- Division by zero, integer overflow, malformed regex, etc.
- Async resolution returned an error after pre-resolution
  began.
- Recursion cap exceeded.

These are caught by the evaluator, attached to the responsible
node `mark`, and added to `BindResult.errors`. The rest of
the tree continues; the failed node's evaluated value is
`null`.

There is no `attempt` / try-catch node in calm. Calm is a
templating / rendering engine, not an effect runtime. Code
errors are surfaced as typed validation results, not caught
and recovered in-tree. Hosts that need recovery handle it at
the call boundary, not inside the authored Fold.

## Determinism

Two runs of `calm.bind(tree, host)` with the same `host` and
the same `tree` always produce the same `output` (modulo
async lookups whose backing data changed). This is essential
for caching, testing, and reproducibility of authored
documents.

Sources of nondeterminism the runtime explicitly bounds:

- **`now` / `today`**. Engine-bound, snapshot at bind start;
  same value across the whole bind.
- **Random**. No `random` flow exists in the base catalog.
- **Order of async resolution**. Handlers are called
  concurrently inside a batch but results are stored by node
  `id`, so order of completion doesn't affect output.

## Concurrency

A `Calm` instance is single-threaded inside its synchronous
evaluation. Multiple `bind` calls run sequentially. For
parallel rendering of independent documents, hosts spin up
multiple `Calm` instances (cheap; the registry is shared via a
read-only catalog).

The async pre-resolution stage IS concurrent inside its batch
. That's the whole point of batching. Concurrency stops at
the boundary; the synchronous evaluator never sees parallelism.

## Performance budget

For an editor running at 60fps with 16ms frames, the runtime
aims for:

- **Cold `calm.bind` of a 10,000-node document**: under 200ms.
- **Hot `calm.bindPatch` of a single-node edit**: under 5ms.
- **Memory** per cached tree: linear in node count, ~200 bytes
  per node.

These are targets, not guarantees. Profiling and tuning come
once the spec is stable enough to benchmark.
