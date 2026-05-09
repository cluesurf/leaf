/**
 * The `Base` runtime class.
 *
 * Construct with a `Code` type parameter (the bundled-type
 * aggregate of every authored Form / Flow / Fold / Hash / List
 * across every registered Book). `base.flow(...)` registrations
 * typecheck the (name, base, case) triple against the registry.
 *
 *   import { Base } from '@cluesurf/bead'
 *   import type Code from './libs'
 *
 *   const base = new Base<Code>({ createElement: React.createElement })
 *   base.load(emailBook)
 *
 *   base.cast('email:status', { input: 'hi@bead.dev' })
 *   base.call('is:email', { text: 'hi@bead.dev' })
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
import type { Book, Cast, Flow, Fold } from '@/form'
import type { Cast as FoldNode } from '@/fold/types'
import { evaluateText, makeScope } from '@/fold'
import { renderElement, type ElementBuilder } from '@/fold/element'

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
 * Per-Base render configuration. Supply `createElement` to
 * render to vdom; omit for text mode (the default).
 *
 * View components and fragment come from the Book's `view:`
 * field, registered via `base.load(book)`.
 */
export type BaseConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createElement?: ElementBuilder<any>
}

export class Base<R = Code> {
  private hook = new Map<string | number, Hook>()
  private fold = new Map<string, FoldNode>()
  private view = new Map<string, unknown>()
  private code: Record<string, number> = {}
  private config: BaseConfig

  constructor(config: BaseConfig = {}) {
    this.config = config
  }

  /**
   * Register a Flow Hook directly. Three shapes:
   *
   *   base.flow('always-true', () => true)
   *   base.flow('is', { case: 'string' }, ({ thing }) => ...)
   *   base.flow('is', { case: 'ipa:broad' }, ({ text }) => ...)
   */

  flow<
    N extends FlowName<R>,
    B extends FlowBaseValue<R, N>,
    C extends FlowCaseValue<R, N, B>,
  >(
    name: N,
    options: { base: B; case: C },
    Hook: FlowHook<R, N, B, C>,
  ): void

  flow<N extends FlowName<R>, B extends FlowBaseValue<R, N>>(
    name: N,
    options: { base: B; case?: undefined },
    Hook: FlowHook<R, N, B, undefined>,
  ): void

  flow<N extends BareFlowName<R>>(
    name: N,
    Hook: FlowHook<R, N, undefined, undefined>,
  ): void

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const opts = options ?? {}
    const caseValue =
      opts.base && opts.case
        ? `${opts.base}:${opts.case}`
        : (opts.base ?? opts.case)
    const key = buildKey(name, caseValue)
    this.hook.set(key, hook)
  }

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
  load(input: Book | Cast | (Book | Cast)[]): void {
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
  toss(input: Book | Cast | (Book | Cast)[]): void {
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
    const callTable = book.call ?? {}
    for (const cast of book.cast ?? []) {
      if (cast.form === 'flow') {
        const flow = cast
        const key = buildKey(flow.call, flow.case)
        const exportName = exportNameFor(flow)
        const handler = callTable[exportName]
        if (handler != null) {
          this.hook.set(key, handler)
          const id = this.code[String(key)]
          if (typeof id === 'number') this.hook.set(id, handler)
        }
      } else {
        this.loadCast(cast)
      }
    }
  }

  private loadCast(cast: Cast): void {
    if (cast.form === 'fold') {
      const tree =
        cast.tree.length === 1
          ? cast.tree[0]!
          : { form: 'text' as const, flow: cast.tree }
      this.fold.set(cast.case, tree)
    }
    // Form / Hash / List don't register runtime state — they're
    // codegen-time declarations. Registering them is a no-op so
    // callers can pass them uniformly.
  }

  private tossBook(book: Book): void {
    if (book.code) {
      for (const k in book.code) delete this.code[k]
    }
    if (book.view) {
      for (const k in book.view) this.view.delete(k)
    }
    for (const cast of book.cast ?? []) {
      if (cast.form === 'flow') {
        const key = buildKey(cast.call, cast.case)
        this.hook.delete(key)
      } else {
        this.tossCast(cast)
      }
    }
  }

  private tossCast(cast: Cast): void {
    if (cast.form === 'fold') this.fold.delete(cast.case)
    if (cast.form === 'flow') {
      const key = buildKey(cast.call, cast.case)
      this.hook.delete(key)
    }
  }

  /**
   * Invoke a registered Flow.
   *
   *   base.call('is:email', { text: 'hi@bead.dev' })
   *   base.call('is:ipa:broad', { text: 'foo' })
   */

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
   * Cast a registered Fold by name with `params` bound into
   * scope. Returns whatever the renderer produces (string in
   * text mode, vdom in element mode).
   *
   *   base.cast('email:status', { input: 'hi@bead.dev' })
   *
   * Trees come from `Fold` declarations registered via
   * `base.load(book)`. Never inline.
   */
  cast(
    name: string,
    params: Record<string, unknown> = {},
  ): unknown {
    const tree = this.fold.get(name)
    if (tree == null) {
      throw new Error(`base.cast: no Fold registered for '${name}'`)
    }
    return this.evaluate(tree, params)
  }

  private evaluate(
    tree: FoldNode,
    params: Record<string, unknown>,
  ): unknown {
    const scope = makeScope(params)
    const hookStore = this.hook
    const foldStore = this.fold
    const viewStore = this.view
    const config = this.config

    const callResolver = (node: {
      name?: string
      base?: string
      case?: string
      code?: number
    }) => {
      if (typeof node.code === 'number') {
        return hookStore.get(node.code)
      }
      if (typeof node.name !== 'string') return undefined
      const caseValue =
        node.base && node.case
          ? `${node.base}:${node.case}`
          : (node.base ?? node.case)
      const key = buildKey(node.name, caseValue)
      return hookStore.get(key)
    }

    if (config.createElement) {
      const component = Object.fromEntries(viewStore)
      return renderElement(tree, {
        scope,
        cache: undefined,
        dirty: undefined,
        call: callResolver,
        fold: name => foldStore.get(name),
        builder: config.createElement,
        fragment: viewStore.get(FRAGMENT_KEY),
        component,
      })
    }

    return evaluateText(tree, {
      scope,
      cache: undefined,
      dirty: undefined,
      call: callResolver,
      fold: name => foldStore.get(name),
    })
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

function isCast(value: unknown): value is Cast {
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

function exportNameFor(flow: Flow): string {
  const segs = [flow.call]
  if (flow.case) segs.push(...flow.case.split(':'))
  return segs
    .map((s, i) =>
      i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1),
    )
    .join('')
}
