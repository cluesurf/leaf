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
 * This must be `interface` (not `type`) — only interfaces
 * support cross-module declaration merging in TypeScript.
 *
 * Mirrors kysely's `Database` extension pattern.
 */
export interface Code {
  // empty by default; augmented per-consumer
}

type Hook = (args: any) => any

type HookName = string | number

function buildKey(
  name: string,
  base: string | undefined,
  caseValue: string | undefined,
): HookName {
  if (base == null) return name
  if (caseValue == null) return `${name}_${base}`
  return `${name}_${base}_${caseValue}`
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
    let Hook: Hook

    if (rest.length === 1 && typeof rest[0] === 'function') {
      Hook = rest[0] as Hook
    } else if (rest.length >= 2) {
      options = rest[0]
      Hook = rest[1] as Hook
    } else {
      throw new Error(`base.flow('${name}'): invalid arguments`)
    }

    const key = buildKey(name, options?.base, options?.case)
    this.hook.set(key, Hook)
  }

  /**
   * Invoke a registered Flow by key. Returns the raw Hook
   * result. Args are not validated at this entry point —
   * compile-stage validation happens via `base.bind(...)`.
   */
  call<K extends FlowKey<R>>(
    code: K,
    bind: FlowTake<R[K]>,
  ): FlowLike<R[K]>
  call(code: string, bind: unknown): unknown
  call(code: string, bind: unknown): unknown {
    const Hook = this.hook.get(code)
    if (Hook == null) {
      throw new Error(
        `base.call: no flow registered for code '${code}'`,
      )
    }
    return Hook(bind)
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

type FlowKey<R> = string & keyof R
