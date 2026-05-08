/**
 * The `Book` runtime class.
 *
 * Construct with a `Base` type parameter (the bundled-type
 * aggregate of every authored Form / Flow / Hash / List / Fold
 * / Find). Every `book.flow(...)` registration typechecks the
 * (name, base, case) triple against the registry and infers
 * the handler's args / return type.
 *
 *   import { Book } from '@cluesurf/calm'
 *   import type { Base } from '@cluesurf/calm/base'
 *
 *   const book = new Book<Base>()
 *
 *   book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
 *     Array.from(text).every(is_ipa_symbol),
 *   )
 */

import type {
  BareFlowName,
  FlowBaseValue,
  FlowCaseValue,
  FlowHandler,
  FlowLike,
  FlowName,
  FlowResolve,
  FlowTake,
} from './types'

/**
 * The default registry shape. Hosts override by passing their
 * own `Base` type as the generic parameter, or by augmenting
 * `'@cluesurf/calm/base'` via `declare module`.
 */
export interface Base {
  // empty by default; augmented by host-emitted base.ts
}

type Handler = (args: any) => any

type RegistrationKey = string

function buildKey(
  name: string,
  base: string | undefined,
  caseValue: string | undefined,
): RegistrationKey {
  if (base == null) return name
  if (caseValue == null) return `${name}_${base}`
  return `${name}_${base}_${caseValue}`
}

export class Book<R = Base> {
  private handlers = new Map<RegistrationKey, Handler>()

  /**
   * Register a Flow handler. Three shapes:
   *
   *   book.flow('always-true', () => true)
   *   book.flow('is', { base: 'string' }, ({ thing }) => ...)
   *   book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) => ...)
   */

  // (name, base, case)
  flow<
    N extends FlowName<R>,
    B extends FlowBaseValue<R, N>,
    C extends FlowCaseValue<R, N, B>,
  >(
    name: N,
    options: { base: B; case: C },
    handler: FlowHandler<R, N, B, C>,
  ): void

  // (name, base)
  flow<N extends FlowName<R>, B extends FlowBaseValue<R, N>>(
    name: N,
    options: { base: B; case?: undefined },
    handler: FlowHandler<R, N, B, undefined>,
  ): void

  // (name) — bare verb
  flow<N extends BareFlowName<R>>(
    name: N,
    handler: FlowHandler<R, N, undefined, undefined>,
  ): void

  flow(name: string, ...rest: any[]): void {
    let options: { base?: string; case?: string } | undefined
    let handler: Handler

    if (rest.length === 1 && typeof rest[0] === 'function') {
      handler = rest[0] as Handler
    } else if (rest.length >= 2) {
      options = rest[0]
      handler = rest[1] as Handler
    } else {
      throw new Error(`book.flow('${name}'): invalid arguments`)
    }

    const key = buildKey(name, options?.base, options?.case)
    this.handlers.set(key, handler)
  }

  /**
   * Invoke a registered Flow by key. Returns the raw handler
   * result. Args are not validated at this entry point —
   * compile-stage validation happens via `book.bind(...)`.
   */
  call<K extends FlowKey<R>>(
    code: K,
    bind: FlowTake<R[K]>,
  ): FlowLike<R[K]>
  call(code: string, bind: unknown): unknown
  call(code: string, bind: unknown): unknown {
    const handler = this.handlers.get(code)
    if (handler == null) {
      throw new Error(`book.call: no flow registered for code '${code}'`)
    }
    return handler(bind)
  }

  /** Number of registered Flows (debugging). */
  get size(): number {
    return this.handlers.size
  }

  /** Whether a (composite) flow code is registered. */
  has(code: string): boolean {
    return this.handlers.has(code)
  }
}

type FlowKey<R> = string & keyof R
