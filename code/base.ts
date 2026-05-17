/**
 * The `Base` runtime class.
 *
 * Construct with a `Code` type parameter (the bundled-type
 * aggregate of every authored Form / Flow / Fold / Hash / List
 * across every registered Book). `base.flow(...)` registrations
 * typecheck the (name, base, case) triple against the registry.
 *
 *   import { Base } from '@cluesurf/leaf'
 *   import type Code from './libs'
 *
 *   const base = new Base<Code>({ castView: React.createElement })
 *   base.load(emailBook)
 *
 *   base.cast('email:status', { input: 'hi@leaf.dev' })
 *   base.call('is:email', { text: 'hi@leaf.dev' })
 */

import type {
  BareFlowName,
  FlowAt,
  FlowBaseValue,
  FlowCaseValue,
  FlowHook,
  FlowLike,
  FlowName,
  FlowPath,
  FlowResolve,
  FlowTake,
  FoldCase,
  FormCast,
  FormName,
} from '@/form'
import type { Book, Make, Fold, Mold } from '@/form'
import {
  compile,
  compileFold,
  compileForm,
  compileHash,
  compileList,
  type CompiledFold,
  type ElementBuilder,
  type Parser,
  type Render,
} from '@/bind'
import type { Cast as FoldNode } from '@/cast'
import { makeScope } from '@/scope'

export type {
  BareFlowName,
  FlowAt,
  FlowBaseValue,
  FlowCaseValue,
  FlowHook,
  FlowLike,
  FlowName,
  FlowOptions,
  FlowPath,
  FlowResolve,
  FlowTake,
  FoldCase,
  FormCast,
  FormName,
} from '@/form'

/**
 * Default Code-registry shape. Empty in the library; consumers
 * extend via TS declaration-merging or by passing a host-specific
 * Code as the `Base` class's generic parameter.
 *
 *   import type Code from './libs'
 *   const base = new Base<Code>()
 */
export type CodeForm =
  | { take: unknown; make: unknown }
  | { cast: unknown }

export type Code = Record<string, CodeForm>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Hook = (args: any) => any

function buildKey(call: string, caseValue?: string): string {
  return caseValue ? `flow:${call}:${caseValue}` : `flow:${call}`
}

/**
 * Reserved key in `book.view` that the renderer picks up as the
 * fragment for sibling wrapping.
 */
const FRAGMENT_KEY = 'fragment'

/**
 * Reserved Flow path the runtime looks up to enter element
 * (vdom) mode. Hosts register the platform-specific factory:
 *
 *   base.load({ flow: { 'create:element': React.createElement } })
 *
 * Without this Flow registered, `base.cast(...)` returns text.
 */
const CREATE_ELEMENT_KEY = 'flow:create:element'

export class Base<R = Code> {
  private hook = new Map<string | number, Hook>()
  private fold = new Map<string, CompiledFold>()
  private view = new Map<string, unknown>()
  private code: Record<string, number> = {}
  /**
   * Compiled parsers keyed by schema name. Populated at
   * `load(book)` time — each Form / Hash / List in `book.make`
   * gets a closure built once and reused per `mold(name, cast)`
   * call.
   */
  private form = new Map<string, Parser>()

  constructor() {}

  /**
   * Polymorphic load. Accepts a `Book`, a single `Cast`
   * (Flow / Fold / Form / Hash / List), or an array of either.
   * Idempotent: calling twice with the same input overwrites
   * existing registrations, so editor hot-reload always reflects
   * the latest state.
   *
   *   base.load(emailBook)
   *   base.load(emailFlow)
   *   base.load(emailFold)
   */
  load(input: Book | Make | (Book | Make)[]): void {
    if (Array.isArray(input)) {
      for (const item of input) this.load(item)
      return
    }
    if (isCast(input)) {
      this.loadCast(input)
      return
    }
    this.loadBook(input)
  }

  /**
   * Inverse of `load`. Removes registrations belonging to a
   * Book, single Cast, or list of either. Idempotent.
   */
  toss(input: Book | Make | (Book | Make)[]): void {
    if (Array.isArray(input)) {
      for (const item of input) this.toss(item)
      return
    }
    if (isCast(input)) {
      this.tossCast(input)
      return
    }
    this.tossBook(input)
  }

  private loadBook(book: Book): void {
    if (book.code) {
      for (const k in book.code) this.code[k] = book.code[k]!
    }
    if (book.view) {
      for (const k in book.view) this.view.set(k, book.view[k])
    }
    const flowTable = book.flow ?? {}

    // Build the set of declared Flow paths from book.make so we
    // can warn on book.flow keys that don't correspond to any
    // declaration (typo guard).
    const declared = new Set<string>()
    for (const cast of book.make ?? []) {
      if (cast.form === 'flow') {
        declared.add(
          cast.case ? `${cast.call}:${cast.case}` : cast.call,
        )
      }
    }

    for (const path in flowTable) {
      const handler = flowTable[path]!
      const key = `flow:${path}`
      if (declared.size > 0 && !declared.has(path)) {
        console.warn(
          `base.load: book.flow['${path}'] does not match any declared Flow in book.make`,
        )
      }
      // Existing handler for this path is treated as a collision.
      if (this.hook.has(key)) {
        console.warn(
          `base.load: '${path}' overwriting an existing handler`,
        )
      }
      this.hook.set(key, handler)
      const id = this.code[key]
      if (typeof id === 'number') this.hook.set(id, handler)
    }
    for (const cast of book.make ?? []) {
      if (cast.form !== 'flow') this.loadCast(cast)
    }
  }

  private compileTake = {
    resolve: (name: string) => this.form.get(name),
    runMold: (cast: unknown, mold: Mold | Mold[]) =>
      this.applyMold(cast, mold),
  }

  /**
   * Internal Mold pipeline runner. Threads `self` through Norm
   * hooks; asserts each Test hook (throws with `miss` on
   * failure). Used by the walker for Link / Form / Flow
   * `mold:` declarations. Not part of the public API — consumers
   * use `base.mold(name, cast)` which routes through compiled
   * parsers.
   */
  private applyMold(value: unknown, mold: Mold | Mold[]): unknown {
    const list = Array.isArray(mold) ? mold : [mold]
    let current = value
    for (const m of list) {
      const hooks = Array.isArray(m.hook) ? m.hook : [m.hook]
      if (m.form === 'norm') {
        for (const h of hooks) {
          current = this.evaluateMoldHook(h, current)
        }
      } else {
        // Accept both the new `'rule'` form and the legacy
        // `'test'` form. The latter is deprecated; the deprecation
        // window closes in 0.10.
        const legacyForm =
          (m as { form: string }).form === 'test'
        if (legacyForm && process.env.NODE_ENV !== 'production') {
          console.warn(
            "base.mold: Mold variant `form: 'test'` is deprecated. Use `form: 'rule'` with a `name:` field. Compat shim removed in 0.10.",
          )
        }
        for (const h of hooks) {
          const ok = this.evaluateMoldHook(h, current)
          if (!ok) {
            throw new Error(m.miss ?? 'base.mold: rule failed')
          }
        }
      }
    }
    return current
  }

  private loadCast(cast: Make): void {
    if (cast.form === 'form') {
      this.form.set(cast.name, compileForm(cast, this.compileTake))
      return
    }
    if (cast.form === 'hash') {
      this.form.set(cast.name, compileHash(cast, this.compileTake))
      return
    }
    if (cast.form === 'list') {
      this.form.set(cast.name, compileList(cast, this.compileTake))
      return
    }
    if (cast.form === 'fold') {
      this.fold.set(cast.case, compileFold(cast))
      return
    }
    if (cast.form === 'seed') {
      // Seeds in v1 are anonymous page-data instances; they live in
      // the host's page table, not in Base. Accept silently so
      // callers can pass any Make through `load(...)` uniformly.
      return
    }
    // Other Makes (flow declarations) don't register runtime state
    // here — flow handlers come in via `book.flow`. Loading the
    // declaration alone is a no-op.
  }

  private tossBook(book: Book): void {
    if (book.code) {
      for (const k in book.code) delete this.code[k]
    }
    if (book.view) {
      for (const k in book.view) this.view.delete(k)
    }
    if (book.flow) {
      for (const path in book.flow) {
        const key = `flow:${path}`
        this.hook.delete(key)
        const id = this.code[key]
        if (typeof id === 'number') this.hook.delete(id)
      }
    }
    for (const cast of book.make ?? []) {
      if (cast.form !== 'flow') this.tossCast(cast)
    }
  }

  private tossCast(cast: Make): void {
    if (cast.form === 'fold') this.fold.delete(cast.case)
    if (cast.form === 'flow') {
      const key = buildKey(cast.call, cast.case)
      this.hook.delete(key)
    }
    if (
      cast.form === 'form' ||
      cast.form === 'hash' ||
      cast.form === 'list'
    ) {
      this.form.delete(cast.name)
    }
  }

  /**
   * Invoke a registered Flow.
   *
   *   base.call('is:email', { text: 'hi@leaf.dev' })
   *   base.call('is:ipa:broad', { text: 'foo' })
   */

  // Colon-scoped path: 'is:email', 'format:capitalized', etc.
  call<P extends FlowPath<R>>(
    path: P,
    args: FlowTake<FlowAt<R, P>>,
  ): FlowLike<FlowAt<R, P>>

  // Legacy (name, base, case) split:
  call<
    N extends FlowName<R>,
    B extends FlowBaseValue<R, N>,
    C extends FlowCaseValue<R, N, B>,
  >(
    name: N,
    args: { base: B; case: C } & FlowTake<FlowResolve<R, N, B, C>>,
  ): FlowLike<FlowResolve<R, N, B, C>>

  call<N extends FlowName<R>, B extends FlowBaseValue<R, N>>(
    name: N,
    args: { base: B; case?: undefined } & FlowTake<
      FlowResolve<R, N, B, undefined>
    >,
  ): FlowLike<FlowResolve<R, N, B, undefined>>

  call<N extends BareFlowName<R>>(
    name: N,
    args: FlowTake<FlowResolve<R, N, undefined, undefined>>,
  ): FlowLike<FlowResolve<R, N, undefined, undefined>>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call(id: number, bind: any): any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call(pathOrId: string | number, args: any): any {
    const key =
      typeof pathOrId === 'number' ? pathOrId : `flow:${pathOrId}`
    const hook = this.hook.get(key)
    if (hook == null) {
      throw new Error(
        `base.call: no flow registered for code '${String(key)}'`,
      )
    }
    return hook(args ?? {})
  }

  /**
   * Cast a registered Fold by `case` with `params` bound into
   * scope. Returns whatever the renderer produces (string in
   * text mode, vdom in element mode).
   *
   *   base.cast('email:status', { input: 'hi@leaf.dev' })
   *
   * Trees come from `Fold` declarations registered via
   * `base.load(book)`. Never inline.
   *
   * The `case` argument typechecks against every `'fold:*'` key
   * in the `<Code>` registry. Unknown names are still accepted
   * at runtime (and throw if no Fold has been loaded under that
   * name) so dynamically-registered Folds still work.
   */
  cast<C extends FoldCase<R>>(
    name: C,
    params?: Record<string, unknown>,
  ): unknown
  cast(name: string, params?: Record<string, unknown>): unknown
  cast(name: string, params: Record<string, unknown> = {}): unknown {
    const compiled = this.fold.get(name)
    if (compiled == null) {
      throw new Error(`base.cast: no Fold registered for '${name}'`)
    }
    return compiled.cast(params, this.renderContext())
  }

  private renderContext() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const castView = this.hook.get(CREATE_ELEMENT_KEY) as
      | ElementBuilder<any>
      | undefined
    return {
      resolveCall: this.callResolver,
      resolveFold: (name: string, mode: 'text' | 'element') =>
        this.fold.get(name)?.[mode],
      castView,
      fragment: this.view.get(FRAGMENT_KEY),
      component: castView ? Object.fromEntries(this.view) : undefined,
    }
  }

  // Pre-bound for capture in closures.
  private callResolver = (node: {
    name?: string
    base?: string
    case?: string
    code?: number
  }): ((args: unknown) => unknown) | undefined => {
    if (typeof node.code === 'number') {
      return this.hook.get(node.code) as
        | ((args: unknown) => unknown)
        | undefined
    }
    if (typeof node.name !== 'string') return undefined
    const caseValue =
      node.base && node.case
        ? `${node.base}:${node.case}`
        : (node.base ?? node.case)
    const key = buildKey(node.name, caseValue)
    return this.hook.get(key) as
      | ((args: unknown) => unknown)
      | undefined
  }

  /**
   * Validate + normalize `cast` against a registered schema.
   *
   *   base.mold('language', input)
   *
   * Looks up the closure compiled at `base.load(book)` time and
   * applies it. Throws on validation failure. Per-Link `mold:`
   * declarations on the schema run inline (Norms thread their
   * output forward, Tests assert).
   *
   * The return type resolves through `<Code>` —
   * `base.mold('language', x)` returns the `Language` type.
   */
  mold<N extends FormName<R>>(name: N, cast: unknown): FormCast<R, N>
  mold(name: string, cast: unknown): unknown
  mold(name: string, cast: unknown): unknown {
    const parser = this.form.get(name)
    if (!parser) {
      throw new Error(`base.mold: no schema registered for '${name}'`)
    }
    return parser(cast, name)
  }

  /**
   * Cache of compiled Mold-hook trees, keyed by tree identity.
   * Hook trees are typically reused across thousands of mold
   * applications (one per validated row), so compiling once and
   * reusing the closure is a meaningful win on bulk imports.
   * Scalar trees skip the cache (compile is a no-op for them).
   */
  private moldHookCache = new WeakMap<object, Render>()

  private evaluateMoldHook(tree: FoldNode, self: unknown): unknown {
    const render = this.compileMoldHook(tree)
    return render(makeScope({ self }), this.renderContext())
  }

  private compileMoldHook(tree: FoldNode): Render {
    if (tree === null || typeof tree !== 'object' || tree instanceof Date) {
      return compile(tree, 'text')
    }
    const cached = this.moldHookCache.get(tree)
    if (cached) return cached
    const render = compile(tree, 'text')
    this.moldHookCache.set(tree, render)
    return render
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

function isCast(value: unknown): value is Make {
  if (value == null || typeof value !== 'object') return false
  const form = (value as { form?: unknown }).form
  return (
    form === 'flow' ||
    form === 'fold' ||
    form === 'form' ||
    form === 'hash' ||
    form === 'list'
  )
}
