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

  /** Number of registered Flows (debugging). */
  get size(): number {
    return this.hook.size
  }

  /** Whether a (composite) flow code is registered. */
  test(code: string): boolean {
    return this.hook.has(code)
  }
}
