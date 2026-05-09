/**
 * The `Base` runtime class.
 *
 * Construct with a `Code` type parameter (the bundled-type
 * aggregate of every authored Form / Flow / Fold / Hash / List
 * across every registered Book). Every `base.flow(...)`
 * registration typechecks the (name, base, case) triple
 * against the registry and infers the Hook's args / return
 * type.
 *
 *   import { Base } from '@cluesurf/calm'
 *   import type Code from './libs'   // generated
 *
 *   const base = new Base<Code>()
 *
 *   base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
 *     Array.from(text).every(is_ipa_symbol),
 *   )
 */

import type {
  BareFlowName,
  FlowBaseValue,
  FlowCaseValue,
  FlowHook,
  FlowLike,
  FlowName,
  FlowResolve,
  FlowTake,
} from './types'
import type { Book } from '@/form'
import type { Cast as FoldNode } from '@/fold/types'
import { evaluateText, makeScope } from '@/fold/render'
import type { Scope } from '@/fold/render'

export type {
  BareFlowName,
  FlowBaseValue,
  FlowCaseValue,
  FlowHook,
  FlowLike,
  FlowName,
  FlowOptions,
  FlowResolve,
  FlowTake,
} from './types'

/**
 * The default registry shape. Empty in the library; consumers
 * extend it via TypeScript declaration-merging on `interface`.
 *
 * Two ways to populate `Code`:
 *
 * 1) Pass a host-specific Code type as the `Base` class's
 *    generic parameter (pattern most hosts use):
 *
 *       import type Code from './libs'   // generated bundle
 *       const base = new Base<Code>()
 *
 * 2) Augment this interface globally from the consumer side
 *    via `declare module`. After this declaration, every
 *    `new Base()` (with no explicit generic) sees the merged
 *    members:
 *
 *       declare module '@cluesurf/calm' {
 *         interface Code {
 *           'flow:select:language': { take: SelectLanguageTake; make: SelectLanguage }
 *           'form:language':        { cast: Language }
 *         }
 *       }
 *
 * Mirrors kysely's `Database` extension pattern.
 *
 * Default entry-value shape: a Flow entry carries
 * `{ take, make }`; every other kind (Form / Fold / Hash /
 * List) carries `{ cast }`. The library's `Code` index
 * signature accepts both. Consumers narrow specific keys via
 * `declare module` augmentation — the augmented value must
 * remain assignable to this union, which any concrete
 * `{ take: T; make: M }` or `{ cast: T }` is.
 */
export type CodeForm =
  | { take: unknown; make: unknown }
  | { cast: unknown }

export type Code = Record<string, CodeForm>

// Hook table is heterogeneous — each entry has a specific
// (args, return) shape. Use `any` for input/return so the
// dispatch table accepts every concrete signature
// (contravariance on input, return widened by `any`). Callers
// narrow at the call site via the typed `flow` / `call`
// overloads above.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Hook = (args: any) => any

type HookName = string | number

function buildKey(
  name: string,
  base: string | undefined,
  caseValue: string | undefined,
): HookName {
  if (base == null) return `flow:${name}`
  if (caseValue == null) return `flow:${name}:${base}`
  return `flow:${name}:${base}:${caseValue}`
}

export class Base<R = Code> {
  private hook = new Map<HookName, Hook>()

  /**
   * Register a Flow Hook. Three shapes:
   *
   *   base.flow('always-true', () => true)
   *   base.flow('is', { base: 'string' }, ({ thing }) => ...)
   *   base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) => ...)
   */

  // (name, base, case)
  flow<
    N extends FlowName<R>,
    B extends FlowBaseValue<R, N>,
    C extends FlowCaseValue<R, N, B>,
  >(
    name: N,
    options: { base: B; case: C },
    Hook: FlowHook<R, N, B, C>,
  ): void

  // (name, base)
  flow<N extends FlowName<R>, B extends FlowBaseValue<R, N>>(
    name: N,
    options: { base: B; case?: undefined },
    Hook: FlowHook<R, N, B, undefined>,
  ): void

  // (name) — bare verb
  flow<N extends BareFlowName<R>>(
    name: N,
    Hook: FlowHook<R, N, undefined, undefined>,
  ): void

  flow(name: string, ...rest: any[]): void {
    let options: { base?: string; case?: string } | undefined
    let hook: Hook

    if (rest.length === 1 && typeof rest[0] === 'function') {
      hook = rest[0] as Hook
    } else if (rest.length >= 2) {
      options = rest[0]
      hook = rest[1] as Hook
    } else {
      throw new Error(`base.flow('${name}'): invalid arguments`)
    }

    const key = buildKey(name, options?.base, options?.case)
    this.hook.set(key, hook)
  }

  /**
   * Invoke a registered Flow.
   *
   * Mirrors `flow(...)` registration shape: pass the verb
   * as the first arg and an object combining `base` / `case`
   * discriminators with the take-side payload as the second.
   *
   *   base.call('is',   { base: 'ipa', case: 'broad', text: 'foo' })
   *   base.call('is',   { base: 'string', thing: 'hello' })
   *   base.call('make', { base: 'sum', a: 2, b: 3 })
   *   base.call('always_true', {})
   *
   * The runtime extracts `base` / `case` to build the
   * dispatch key, strips them, and passes the remaining
   * take payload to the handler.
   *
   * Codegen rewrites every typed string-form call site into
   * the numeric-id form below at build time for fast
   * dispatch.
   */

  // (name, base, case)
  call<
    N extends FlowName<R>,
    B extends FlowBaseValue<R, N>,
    C extends FlowCaseValue<R, N, B>,
  >(
    name: N,
    args: { base: B; case: C } & FlowTake<FlowResolve<R, N, B, C>>,
  ): FlowLike<FlowResolve<R, N, B, C>>

  // (name, base)
  call<N extends FlowName<R>, B extends FlowBaseValue<R, N>>(
    name: N,
    args: { base: B; case?: undefined } & FlowTake<
      FlowResolve<R, N, B, undefined>
    >,
  ): FlowLike<FlowResolve<R, N, B, undefined>>

  // (name) — bare verb
  call<N extends BareFlowName<R>>(
    name: N,
    args: FlowTake<FlowResolve<R, N, undefined, undefined>>,
  ): FlowLike<FlowResolve<R, N, undefined, undefined>>

  // Compiled form: numeric id + bind. Untyped — codegen target.
  call(id: number, bind: any): any

  call(nameOrId: string | number, args: any): any {
    if (typeof nameOrId === 'number') {
      const hook = this.hook.get(nameOrId)
      if (hook == null) {
        throw new Error(
          `base.call: no flow registered for code '${nameOrId}'`,
        )
      }
      return hook(args)
    }

    const { base: argBase, case: argCase, ...take } = args ?? {}
    const key = buildKey(nameOrId, argBase, argCase)
    const hook = this.hook.get(key)
    if (hook == null) {
      throw new Error(
        `base.call: no flow registered for code '${String(key)}'`,
      )
    }
    return hook(take)
  }

  /**
   * Bulk-register every Flow handler in a Book.
   *
   *   import standard from '@cluesurf/calm/book'
   *   const base = new Base<Code>()
   *   base.load(standard)
   *
   *   // Both forms now work and dispatch to the same handler:
   *   base.call('is', { base: 'string', thing: 'hello' })
   *   base.call(standard.code!['flow:is:string'], { thing: 'hello' })
   *
   * The `book.cast` array carries declarations with their
   * identity tuples. `book.call` is the name → handler map
   * keyed by each Flow's exported-constant name (e.g.
   * `is_ipa_broad`). When `book.code` is supplied (the
   * generated `CodeLink` integer-id table), handlers also
   * register under their integer ids — enables the compiled
   * call form `base.call(<id>, bind)`.
   */
  load(book: Book): void {
    const callTable = book.call ?? {}
    const codeTable = book.code

    for (const cast of book.cast ?? []) {
      if (cast.form !== 'flow') continue
      const flow = cast as {
        call: string
        base?: string
        case?: string
      }
      const key = buildKey(flow.call, flow.base, flow.case)

      // The export name is the segments joined by underscore
      // (e.g. `flow:is:ipa:broad` → `is_ipa_broad`).
      const exportName = String(key)
        .replace(/^flow:/, '')
        .split(':')
        .join('_')

      const hook = callTable[exportName]
      if (hook == null) continue
      this.hook.set(key, hook)

      // When a code table is supplied, mirror the handler
      // under its integer id so the compiled-call form
      // `base.call(<id>, bind)` resolves to the same handler.
      const id = codeTable?.[String(key)]
      if (typeof id === 'number') this.hook.set(id, hook)
    }
  }

  /**
   * Cast a make tree (a `make.*` AST) into a value, resolving
   * every `make.call(...)` node against this Base's registered
   * catalog handlers and reading paths from the optional
   * `scope`.
   *
   * Use cases:
   *   - Run constraint trees authored as data
   *   - Cast i18n / template tree expressions
   *   - Compose multi-step derivations using `make.call(...)`
   *     nodes that resolve through the catalog
   *
   *   const tree = make.call('format_capitalized', { text: 'hi' })
   *   const result = base.cast(tree)
   *   // → 'Hi'
   *
   * Pass `scope` (made via `make.scope({...})` or `makeScope`)
   * when the tree reads from variables via `make.path(...)`.
   */
  cast(tree: FoldNode, scope?: Scope): unknown {
    // The runtime's hook map is keyed by colon-namespace
    // (`flow:<name>:<base>:<case>`) AND by integer id from
    // CodeLink. The make renderer's BaseContext.call hook
    // gives us the full Call node, so we can build the right
    // lookup key from `(node.name, node.base, node.case)` or
    // short-circuit via `node.code` when present.
    const hookStore = this.hook
    return evaluateText(tree, {
      scope: scope ?? makeScope(),
      call: node => {
        if (typeof node.code === 'number') {
          return hookStore.get(node.code) as
            | ((input: any) => unknown)
            | undefined
        }
        if (typeof node.name !== 'string') return undefined
        const key = buildKey(node.name, node.base, node.case)
        return hookStore.get(key) as
          | ((input: any) => unknown)
          | undefined
      },
    })
  }

  /**
   * Evaluate a tree to a `BindResult` envelope, capturing the
   * tree (for later patching) alongside the produced output.
   *
   *   const result = base.bind(tree, scope)
   *   result.output   // the rendered value
   *   base.bindPatch(result, [{ op: 'replace', mark: '01h…', value: 'new' }])
   */
  bind(tree: FoldNode, scope?: Scope): BindResult {
    return {
      tree,
      output: this.cast(tree, scope),
      scope: scope ?? makeScope(),
    }
  }

  /**
   * Apply a list of mark-targeted patches to the tree from a
   * previous `bind` and re-evaluate.
   *
   *   const r0 = base.bind(initial)
   *   const r1 = base.bindPatch(r0, [
   *     { op: 'replace', mark: 'abc', value: 'updated' },
   *   ])
   *
   * Current implementation re-runs `cast` on the patched tree.
   * Memoized partial-recomputation (per `note/runtime.md`) is
   * planned future work — when it lands, this method's
   * signature stays the same and only the internals change.
   */
  bindPatch(prev: BindResult, patches: TreePatch[]): BindResult {
    const nextTree = patches.reduce(
      (tree, patch) => applyTreePatch(tree, patch),
      prev.tree,
    )
    return this.bind(nextTree, prev.scope)
  }

  /** Number of registered Flows (debugging). */
  get size(): number {
    return this.hook.size
  }

  /** Whether a (composite) flow code is registered. */
  test(code: string): boolean {
    return this.hook.has(code)
  }
}

// ---------------------------------------------------------------------------
// Bind / patch types
// ---------------------------------------------------------------------------

/**
 * Envelope produced by `base.bind(tree, scope?)`. Captures the
 * evaluated tree, its output, and the scope used so a later
 * `bindPatch` can re-evaluate against the same host bindings.
 */
export type BindResult = {
  tree: FoldNode
  output: unknown
  scope: Scope
}

/**
 * Patch operations addressed by `mark` (the per-Cast UUID v7).
 * The runtime walks the previous tree, finds the node carrying
 * the matching mark, and applies the op.
 */
export type TreePatch =
  | { op: 'replace'; mark: string; value: FoldNode }
  | { op: 'remove'; mark: string }
  | {
      op: 'insert'
      /** Mark of the parent node to insert into. */
      parent: string
      /**
       * Where in the parent the new node lives. For list-shaped
       * children (`list.list[]`, `template_string.flow[]`,
       * `view.nest[]`, `walk.list` items, etc.), this is the
       * field name; the value is appended to the list.
       */
      key: string
      value: FoldNode
    }

// ---------------------------------------------------------------------------
// Patch application
// ---------------------------------------------------------------------------

/**
 * Walk the tree, locate the node with the matching `mark`,
 * and apply the patch. Returns a new tree (does not mutate).
 *
 * This is the simple O(N) fallback. A future memoized version
 * keyed by mark → path is planned (per `note/runtime.md`).
 */
function applyTreePatch(tree: FoldNode, patch: TreePatch): FoldNode {
  const transform = (node: FoldNode): FoldNode | undefined => {
    if (node === null || node === undefined) return node
    if (typeof node !== 'object') return node
    if (node instanceof Date) return node

    // Object-with-form. Test mark match against this node first.
    const obj = node as { mark?: string; form?: string } & Record<string, unknown>

    if (patch.op === 'replace' && obj.mark === patch.mark) {
      return patch.value
    }
    if (patch.op === 'remove' && obj.mark === patch.mark) {
      return undefined
    }
    if (patch.op === 'insert' && obj.mark === patch.parent) {
      const child = obj[patch.key]
      const out = { ...obj }
      if (Array.isArray(child)) {
        out[patch.key] = [...child, patch.value]
      } else if (child === undefined) {
        out[patch.key] = [patch.value]
      } else {
        // Single-Cast slot — replace.
        out[patch.key] = patch.value
      }
      return out as FoldNode
    }

    // Recurse into structural children.
    return walkChildren(obj, transform) as FoldNode
  }

  const out = transform(tree)
  return out === undefined ? tree : out
}

/**
 * Visit every direct Cast child of `node` and rebuild the
 * parent if any child changed. Lists drop `undefined` results
 * (used for `remove`).
 */
function walkChildren(
  node: Record<string, unknown>,
  transform: (n: FoldNode) => FoldNode | undefined,
): unknown {
  let changed = false
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(node)) {
    if (Array.isArray(v)) {
      const mapped: FoldNode[] = []
      let arrChanged = false
      for (const item of v) {
        if (isCastLike(item)) {
          const next = transform(item as FoldNode)
          if (next === undefined) {
            arrChanged = true // dropped
            continue
          }
          if (next !== item) arrChanged = true
          mapped.push(next)
        } else {
          mapped.push(item)
        }
      }
      out[k] = arrChanged ? mapped : v
      if (arrChanged) changed = true
    } else if (isCastLike(v)) {
      const next = transform(v as FoldNode)
      if (next === undefined) {
        // remove a single-slot child by clearing the field
        out[k] = undefined
        changed = true
      } else {
        out[k] = next
        if (next !== v) changed = true
      }
    } else if (
      v != null &&
      typeof v === 'object' &&
      !(v instanceof Date) &&
      !Array.isArray(v)
    ) {
      // Plain object (e.g. wake-form `bind: {...}`, hash `base: {...}`).
      let inner = v as Record<string, unknown>
      let innerChanged = false
      const innerOut: Record<string, unknown> = {}
      for (const [ik, iv] of Object.entries(inner)) {
        if (isCastLike(iv)) {
          const nextI = transform(iv as FoldNode)
          if (nextI === undefined) {
            innerChanged = true
            continue
          }
          innerOut[ik] = nextI
          if (nextI !== iv) innerChanged = true
        } else {
          innerOut[ik] = iv
        }
      }
      out[k] = innerChanged ? innerOut : inner
      if (innerChanged) changed = true
    } else {
      out[k] = v
    }
  }
  return changed ? out : node
}

function isCastLike(v: unknown): v is FoldNode {
  if (v === null) return false
  const t = typeof v
  if (t === 'string' || t === 'number' || t === 'boolean') return false
  if (t !== 'object') return false
  if (v instanceof Date) return false
  if (Array.isArray(v)) return false
  return 'form' in (v as Record<string, unknown>)
}
