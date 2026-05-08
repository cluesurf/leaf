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
   * `book` carries the declarations (with their identity
   * tuples). `hooks` is a name → handler map keyed by each
   * Flow's exported-constant name (e.g. `is_ipa_broad`,
   * `make_sum`). Optionally pass `link` (the generated
   * `CodeLink` integer-id table) to also register handlers
   * under their integer ids — enables the compiled-call form
   * `base.call(<id>, bind)`.
   *
   *   import standard, { hooks, CodeLink } from '@cluesurf/calm/base'
   *   const base = new Base<Code>()
   *   base.bind(standard, hooks, CodeLink)
   *
   *   // Both forms now work and dispatch to the same handler:
   *   base.call('is', { base: 'string', thing: 'hello' })
   *   base.call(CodeLink['flow:is:string'], { thing: 'hello' })
   */
  bind(
    book: Book,
    hooks: Record<string, Hook>,
    link?: Record<string, number>,
  ): void {
    for (const cast of book.base ?? []) {
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

      const hook = hooks[exportName]
      if (hook == null) continue
      this.hook.set(key, hook)

      // When a CodeLink table is supplied, mirror the handler
      // under its integer id so the compiled-call form
      // `base.call(<id>, bind)` resolves to the same handler.
      const id = link?.[String(key)]
      if (typeof id === 'number') this.hook.set(id, hook)
    }
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
