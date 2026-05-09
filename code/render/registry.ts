import { isCast } from '@/tool'
/**
 * Operator lookup for the renderers.
 *
 * The flow library has no module-level mutable registry.
 * Operators (`call` handlers) are passed through the render
 * context's `hook` map — the same `HookHash` shape as
 * `Base.hook` at codegen time.
 *
 * Built-in operators live in `code/book/check/flow.ts` as named
 * exports; `DEFAULT_HOOK` below merges them and remaps the few
 * names that ship as kebab-case in flow trees (`is-null`, `in`)
 * but cannot be JS identifiers.
 *
 * Custom transformations register as call operators —
 *
 *   renderText(tree, {
 *     scope: makeScope(),
 *     hook: {
 *       reverse: ({ value }) =>
 *         String(value).split('').reverse().join(''),
 *     },
 *   })
 *
 * In the tree:
 *
 *   flow.call('reverse', { value: flow.reference('name') })
 *
 * Args are pre-evaluated by the walker — the hook receives
 * resolved values, never raw flow nodes.
 */

import type { Form } from '@/form'
import checkFlow from '@/book/check/flow'
import formatFlow from '@/book/format/flow'
import makeFlow from '@/book/make/flow'
import type { Cast } from '@/cast'
import type { Scope } from '@/scope'

/**
 * Operator / task hook table. Keyed by call name. Each entry
 * receives a pre-evaluated args object and an optional context;
 * returns whatever the call should resolve to.
 */
export type HookHash = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (input: any, context?: any) => unknown
>

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type BaseContext = {
  scope: Scope
  /**
   * Operator + task implementations. Keyed by name. Merges
   * over `DEFAULT_HOOK` at lookup time — supply only
   * additions / overrides.
   */
  hook?: HookHash
  /**
   * Optional override that resolves a Call node to its handler
   * based on the full `(name, base?, case?, code?)` identity.
   * When supplied, takes precedence over `hook[name]` lookup.
   *
   * The runtime `Base.cast` uses this to dispatch
   * `cast.call('format', { base: 'capitalized', text: 'hi' })`
   * through the catalog's colon-keyed registry (and to honor
   * `code:` integer ids when present).
   */
  call?: (node: {
    name?: string
    base?: string
    case?: string
    code?: number
  }) => CallHandler | undefined
  /**
   * Resolver for `find` AST nodes. Receives the FindPrimitive
   * (with `where` / `sort` / `limit` / `offset` / `kind` already
   * evaluated) and returns the row list (or aggregate value).
   * Typically batched and async on the host side; the walker
   * awaits the resolved value before passing it down.
   */
  find?: (query: {
    resource: string
    where?: unknown
    sort?: unknown[]
    limit?: number
    offset?: number
    kind?: string
  }) => unknown
  /**
   * Resolver for `fold` AST nodes. Looks up the named Fold and
   * returns its tree (renderer then walks the inner tree with a
   * scope frame populated from `bind`). Returns `undefined` if
   * the name is unknown — walker renders as `null` in that case.
   */
  fold?: (name: string) => Cast | undefined
  /**
   * Per-mark output cache. When present, the walker returns
   * cached values for marked nodes whose mark is NOT in
   * `dirty`. Used by `Base.bindPatch` for partial re-eval.
   */
  cache?: Map<string, unknown>
  /**
   * Set of marks whose cached entries are stale and must
   * re-evaluate. Built by walking up the parent-mark chain
   * from each patch target.
   */
  dirty?: Set<string>
}

// ---------------------------------------------------------------------------
// Calls
// ---------------------------------------------------------------------------

export type CallHandler = (
  args: Record<string, unknown>,
  context: BaseContext,
) => unknown

/**
 * Schema for a custom call operator. Optional. Pair with a
 * `hook` entry of the same name when codegen / validators /
 * editor inspectors need to read the args shape.
 */
export type CallEntry = {
  schema?: Form
  handler: CallHandler
}

export function getCall(
  context: BaseContext,
  name: string | undefined,
  caseValue?: string,
): CallHandler | undefined {
  if (name == null) return undefined
  // Build colon-scoped key when case is present. Look up the
  // composed key first, then fall back to bare `name` for legacy
  // single-segment operator calls.
  const composed = caseValue ? `${name}:${caseValue}` : undefined
  const fn =
    (composed
      ? (context.hook?.[composed] ?? DEFAULT_HOOK[composed])
      : undefined) ??
    context.hook?.[name] ??
    DEFAULT_HOOK[name]
  return fn as CallHandler | undefined
}

/**
 * Pull operator args off a `call` node, evaluating any nested
 * flow nodes via the supplied walker.
 *
 * Two call shapes per `note/ast.md`:
 *
 *  - **Make form** (authored): args sit flat at the top level
 *    alongside identity (`form`, `name`, `base?`, `case?`,
 *    `mark?`). Reserved keys are stripped; everything else is
 *    a take-side arg.
 *
 *  - **Wake form** (compiled): args sit nested under `bind`,
 *    with identity collapsed to `code` (integer id) plus
 *    optional `mark`. When `bind` is present, args are read
 *    from there directly.
 */
export function collectCallArgs(
  node: Record<string, unknown>,
  context: BaseContext,
  evaluateNode: (n: Cast, context: BaseContext) => unknown,
): Record<string, unknown> {
  // Wake form: args live under `bind`. Walk those values
  // through the evaluator so nested casts resolve.
  const bind = node.bind
  if (bind != null && typeof bind === 'object' && !Array.isArray(bind)) {
    const args: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(bind as Record<string, unknown>)) {
      args[k] = isCast(v) ? evaluateNode(v as Cast, context) : v
    }
    return args
  }

  // Make form: walk top-level fields, skip reserved.
  const args: Record<string, unknown> = {}
  for (const k of Object.keys(node)) {
    if (
      k === 'form' ||
      k === 'name' ||
      k === 'base' || // identity tuple — not a take arg
      k === 'case' || // identity tuple — not a take arg
      k === 'code' || // compiled integer id
      k === 'mark' || // schema version stamp
      k === 'bind' // already handled above (defensive)
    ) {
      continue
    }
    const v = node[k]
    args[k] = isCast(v) ? evaluateNode(v as Cast, context) : v
  }
  return args
}



// ---------------------------------------------------------------------------
// Default operator hook
// ---------------------------------------------------------------------------

/**
 * Default operator table. Merges the AST-only operators
 * (`code/book/check/flow.ts`) with the standard `format` and
 * `make` flow maps so the bare renderer (`evaluateText`,
 * `renderElement`) resolves AST builders like `cast.plural(...)`
 * and `make.now()` without a Book registered on Base.
 */

export const DEFAULT_HOOK: HookHash = {
  ...checkFlow,
  ...formatFlow,
  ...makeFlow,
}

export { deepEq, isCast } from '@/tool'
