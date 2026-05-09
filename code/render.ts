/**
 * Cast → render closure compiler.
 *
 * Each Cast node compiles once into a `(scope, ctx) => value`
 * closure. `base.load(book)` walks every registered Fold and
 * stores its closure pair (text + element). `base.cast(...)`
 * then runs a single closure invocation — no per-call walker
 * setup, no `switch (node.form)` at render time.
 *
 * Two modes:
 *
 *  - `'text'`    — returns native JS values (strings, numbers,
 *                  objects, arrays, dates).
 *  - `'element'` — returns vdom children (elements, strings,
 *                  fragment-wrapped arrays).
 *
 * Both modes share one dispatcher. Mode-aware node kinds
 * (`text`, `list`, `case`, `walk`, `join`, `view`) branch on
 * mode internally. Value-position arguments (predicates, path
 * indexes, call args) always compile in `'text'` mode regardless
 * of caller mode — the value is consumed by the surrounding
 * operator, not rendered as a child.
 */

import type {
  Call,
  Cast,
  FoldPrimitive,
  ForkPrimitive,
  HashPrimitive,
  JoinPrimitive,
  ListPrimitive,
  MatchPrimitive,
  PickPrimitive,
  ReadLink,
  ReadPrimitive,
  Reference,
  SwitchPrimitive,
  TextPrimitive,
  ViewPrimitive,
  WalkPrimitive,
} from '@/cast'
import type { Fold } from '@/form'
import { type Scope, makeScope } from '@/scope'
import { deepEq, isCast } from '@/tool'

import checkFlow from '@/book/check/flow'
import formatFlow from '@/book/format/flow'
import makeFlow from '@/book/make/flow'

// =============================================================================
// Public types
// =============================================================================

export type Mode = 'text' | 'element'

export type ElementBuilder<T = unknown> = (
  type: unknown,
  props: Record<string, unknown> | null,
  ...children: unknown[]
) => T

/**
 * Shared per-render plumbing. `Base.cast` (and the legacy
 * `renderText` / `renderElement` wrappers) build one and pass
 * it to the compiled closure.
 */
export type BaseRenderContext = {
  /** Look up an operator handler by Call identity tuple. */
  resolveCall?: (node: {
    name?: string
    base?: string
    case?: string
    code?: number
  }) => CallHandler | undefined
  /**
   * Inline operator map. Consulted after `resolveCall` and
   * before `DEFAULT_HOOK`. Lets callers register one-off
   * handlers without wrapping a resolver function.
   */
  hook?: HookHash
  /** Look up a registered Fold's closure (used by `cast.fold`). */
  resolveFold?: (name: string, mode: Mode) => Render | undefined
  /** Element-mode vdom factory (e.g. `React.createElement`). */
  castView?: ElementBuilder
  /** Element-mode fragment value (e.g. `React.Fragment`). */
  fragment?: unknown
  /** Element-mode component lookup table (Book.view contents). */
  component?: Record<string, unknown>
  /** Optional output cache for `mark:`-tagged nodes. */
  cache?: Map<string, unknown>
  /** Marks whose cache entries are stale. */
  dirty?: Set<string>
}

/** What operator handlers receive on their second arg. */
export type HandlerContext = BaseRenderContext & { scope: Scope }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallHandler = (args: any, ctx?: HandlerContext) => unknown

export type HookHash = Record<string, CallHandler>

/** A compiled Cast: invoked with the live scope + ctx. */
export type Render = (scope: Scope, ctx: BaseRenderContext) => unknown

/** A compiled Fold. base.cast(name, params) invokes this. */
export type FoldRender = (
  params: Record<string, unknown>,
  ctx: BaseRenderContext,
) => unknown

/** One Fold compiled in both modes. */
export type CompiledFold = {
  text: Render
  element: Render
  /** Convenience entry for `base.cast`: builds scope + picks mode. */
  cast: FoldRender
}

// =============================================================================
// Compile entry points
// =============================================================================

export function compileFold(fold: Fold): CompiledFold {
  // Multi-child Folds wrap as an implicit `text` so siblings
  // concatenate, matching the source authoring convention.
  const tree: Cast =
    fold.cast.length === 1
      ? fold.cast[0]!
      : { form: 'text', flow: fold.cast }
  const text = compile(tree, 'text')
  const element = compile(tree, 'element')
  return {
    text,
    element,
    cast: (params, ctx) => {
      const scope = makeScope(params)
      return ctx.castView ? element(scope, ctx) : text(scope, ctx)
    },
  }
}

export function compile(node: Cast, mode: Mode): Render {
  const inner = compileBody(node, mode)
  const mark = readMark(node)
  if (!mark) return inner
  return (scope, ctx) => {
    if (ctx.cache && ctx.cache.has(mark) && !ctx.dirty?.has(mark)) {
      return ctx.cache.get(mark)
    }
    const value = inner(scope, ctx)
    if (ctx.cache) ctx.cache.set(mark, value)
    return value
  }
}

function readMark(node: Cast): string | undefined {
  if (node === null || node === undefined) return undefined
  if (typeof node !== 'object') return undefined
  if (node instanceof Date) return undefined
  return (node as { mark?: string }).mark
}

// =============================================================================
// Per-form dispatch
// =============================================================================

function compileBody(node: Cast, mode: Mode): Render {
  if (node === null || node === undefined) return CONST_NULL
  switch (typeof node) {
    case 'string':
      return constOf(node)
    case 'number':
      return mode === 'element' ? constOf(String(node)) : constOf(node)
    case 'boolean':
      return mode === 'element' ? constOf(String(node)) : constOf(node)
  }
  if (node instanceof Date) {
    return mode === 'element' ? constOf(node.toISOString()) : constOf(node)
  }

  switch (node.form) {
    case 'list':
      return compileListNode(node, mode)
    case 'text':
      return compileTextNode(node, mode)
    case 'hash':
      return compileHashNode(node)
    case 'reference':
      return compileReferenceNode(node, mode)
    case 'read':
      return compileReadNode(node, mode)
    case 'call':
      return compileCallNode(node, mode)
    case 'fork':
      return compileForkNode(node, mode)
    case 'switch':
      return compileSwitchNode(node, mode)
    case 'match':
      return compileMatchNode(node, mode)
    case 'pick':
      return compilePickNode(node, mode)
    case 'walk':
      return compileWalkNode(node, mode)
    case 'join':
      return compileJoinNode(node, mode)
    case 'fold':
      return compileFoldRefNode(node, mode)
    case 'view':
      return compileViewNode(node, mode)
  }

  throw new Error(
    `cast.compile: unknown form '${
      (node as Cast & { form: string }).form
    }'`,
  )
}

const CONST_NULL: Render = () => null

function constOf(v: unknown): Render {
  return () => v
}

// =============================================================================
// Containers
// =============================================================================

function compileListNode(node: ListPrimitive, mode: Mode): Render {
  const items = node.list.map(c => compile(c, mode))
  if (mode === 'element') {
    return (s, c) => wrapFragment(c, items.map((r, i) => keyed(r(s, c), i)))
  }
  return (s, c) => items.map(r => r(s, c))
}

function compileTextNode(node: TextPrimitive, mode: Mode): Render {
  const items = node.flow.map(c => compile(c, mode))
  if (mode === 'element') {
    return (s, c) => wrapFragment(c, items.map((r, i) => keyed(r(s, c), i)))
  }
  return (s, c) => items.map(r => toText(r(s, c))).join('')
}

function compileHashNode(node: HashPrimitive): Render {
  // Hash entries always resolve as plain values, never as
  // children — text mode in both render modes.
  const entries = Object.entries(node.base).map(
    ([k, v]) => [k, compile(v, 'text')] as const,
  )
  return (s, c) => {
    const out: Record<string, unknown> = {}
    for (const [k, r] of entries) out[k] = r(s, c)
    return out
  }
}

// =============================================================================
// Reads
// =============================================================================

function compileReferenceNode(node: Reference, mode: Mode): Render {
  const name = node.name
  if (mode === 'element') return (s) => toElementChild(s.get(name))
  return (s) => s.get(name)
}

function compileReadNode(node: ReadPrimitive, mode: Mode): Render {
  if (node.link.length === 0) return CONST_NULL
  const head = node.link[0]!
  if (head.form !== 'variable') {
    throw new Error(
      `cast.read: first segment must be a variable, got ${head.form}`,
    )
  }
  const headName = head.name
  const headSafe = head.safe === true
  const steps = node.link.slice(1).map(seg => compileSegment(seg))
  const reader: Render = (s, c) => {
    let current: unknown = s.get(headName)
    if (headSafe && current == null) return null
    for (const step of steps) {
      if (current == null) return null
      const safe = step.safe
      current = step.run(current, s, c)
      if (safe && current == null) return null
    }
    return current
  }
  if (mode === 'element') return (s, c) => toElementChild(reader(s, c))
  return reader
}

type CompiledSegment = {
  safe: boolean
  run: (current: unknown, s: Scope, c: BaseRenderContext) => unknown
}

function compileSegment(seg: ReadLink): CompiledSegment {
  const safe = (seg as { safe?: boolean }).safe === true
  switch (seg.form) {
    case 'variable':
      throw new Error('cast.read: variable segment only valid at head')
    case 'field': {
      const name = seg.name
      return {
        safe,
        run: current => (current as Record<string, unknown>)[name],
      }
    }
    case 'index': {
      const expr =
        typeof seg.value === 'number' ? null : compile(seg.value, 'text')
      const literal = typeof seg.value === 'number' ? seg.value : 0
      return {
        safe,
        run: (current, s, c) => {
          const i = expr ? Number(expr(s, c)) : literal
          if (Array.isArray(current)) {
            const j = i < 0 ? current.length + i : i
            return current[j]
          }
          return (current as Record<string, unknown>)[String(i)]
        },
      }
    }
    case 'slice': {
      const startExpr =
        seg.start == null || typeof seg.start === 'number'
          ? null
          : compile(seg.start, 'text')
      const endExpr =
        seg.end == null || typeof seg.end === 'number'
          ? null
          : compile(seg.end, 'text')
      return {
        safe,
        run: (current, s, c) => {
          if (!Array.isArray(current)) return current
          const lo =
            seg.start == null
              ? 0
              : startExpr
                ? Number(startExpr(s, c))
                : (seg.start as number)
          const hi =
            seg.end == null
              ? current.length
              : endExpr
                ? Number(endExpr(s, c))
                : (seg.end as number)
          return current.slice(lo, hi)
        },
      }
    }
  }
}

// =============================================================================
// Calls (eager + lazy)
// =============================================================================

function compileCallNode(node: Call, mode: Mode): Render {
  // Lazy verbs evaluate args per-branch / per-frame.
  if (node.name === 'if') return compileLazyIf(node, mode)
  if (node.name === 'bind') return compileLazyBind(node, mode)

  const ident = identityOf(node)
  const argEntries = compileArgEntries(node)
  const inner: Render = (s, c) => {
    const handler = resolveCall(ident, c)
    if (!handler) throw unknownOperator(ident)
    const args: Record<string, unknown> = {}
    for (const [k, get] of argEntries) args[k] = get(s, c)
    return handler(args, { ...c, scope: s })
  }
  if (mode === 'element') return (s, c) => toElementChild(inner(s, c))
  return inner
}

function compileLazyIf(node: Call, mode: Mode): Render {
  const test = compileArg(node.test)
  const then = compileArg(node.then)
  const otherwise = node.else === undefined ? null : compileArg(node.else)
  const inner: Render = (s, c) =>
    test(s, c) ? then(s, c) : otherwise == null ? null : (otherwise(s, c) ?? null)
  if (mode === 'element') return (s, c) => toElementChild(inner(s, c))
  return inner
}

function compileLazyBind(node: Call, mode: Mode): Render {
  const names = node.names
  const then = compileArg(node.then)
  if (names == null || typeof names !== 'object' || Array.isArray(names)) {
    return mode === 'element' ? (s, c) => toElementChild(then(s, c)) : then
  }
  const entries = Object.entries(names as Record<string, unknown>).map(
    ([k, v]) => [k, compileArg(v)] as const,
  )
  const inner: Render = (s, c) => {
    const frame: Record<string, unknown> = {}
    for (const [k, get] of entries) frame[k] = get(s, c)
    return then(s.push(frame), c)
  }
  if (mode === 'element') return (s, c) => toElementChild(inner(s, c))
  return inner
}

const RESERVED_CALL_KEYS = new Set([
  'form',
  'name',
  'base',
  'case',
  'code',
  'mark',
  'bind',
])

function compileArgEntries(node: Call): Array<readonly [string, Render]> {
  // Wake form: args nested under `bind`. Make form: args at top
  // level alongside identity. Reserved keys are stripped from
  // the make-form path.
  const bind = (node as Record<string, unknown>).bind
  const source =
    bind != null && typeof bind === 'object' && !Array.isArray(bind)
      ? (bind as Record<string, unknown>)
      : (node as Record<string, unknown>)
  const isBindForm = source !== node
  return Object.keys(source)
    .filter(k => isBindForm || !RESERVED_CALL_KEYS.has(k))
    .map(k => [k, compileArg(source[k])] as const)
}

/**
 * Compile a Call argument slot. Cast nodes walk; native scalars
 * pre-bake. Always text-mode — args feed operator handlers, not
 * the vdom child stream.
 */
function compileArg(value: unknown): Render {
  if (value === null || value === undefined) return constOf(value)
  if (typeof value !== 'object') return constOf(value)
  if (value instanceof Date) return constOf(value)
  if ('form' in (value as Record<string, unknown>)) {
    return compile(value as Cast, 'text')
  }
  return constOf(value)
}

function identityOf(node: Call) {
  return {
    name: node.name,
    base: node.base,
    case: node.case,
    code: node.code,
  }
}

function unknownOperator(ident: { name?: string; code?: number }): Error {
  return new Error(
    `cast.call: unknown operator '${ident.name ?? ident.code}'`,
  )
}

// =============================================================================
// Control flow
// =============================================================================

function compileForkNode(node: ForkPrimitive, mode: Mode): Render {
  const test = compile(node.test, 'text')
  const then = compile(node.then, mode)
  const fall = node.fall === undefined ? null : compile(node.fall, mode)
  return (s, c) =>
    test(s, c) ? then(s, c) : fall ? fall(s, c) : null
}

function compileSwitchNode(node: SwitchPrimitive, mode: Mode): Render {
  const value = compile(node.value, 'text')
  const arms = node.cases.map(arm => ({
    when: compile(arm.when, 'text'),
    then: compile(arm.then, mode),
  }))
  const fall = node.fall === undefined ? null : compile(node.fall, mode)
  return (s, c) => {
    const v = value(s, c)
    for (const arm of arms) {
      if (deepEq(arm.when(s, c), v)) return arm.then(s, c)
    }
    return fall ? fall(s, c) : null
  }
}

function compileMatchNode(node: MatchPrimitive, mode: Mode): Render {
  const branches = node.branches.map(b => ({
    test: compile(b.test, 'text'),
    then: compile(b.then, mode),
  }))
  const fall = node.fall === undefined ? null : compile(node.fall, mode)
  return (s, c) => {
    for (const b of branches) {
      if (b.test(s, c)) return b.then(s, c)
    }
    return fall ? fall(s, c) : null
  }
}

function compilePickNode(node: PickPrimitive, mode: Mode): Render {
  const values = compile(node.values, 'text')
  const inner: Render = (s, c) => {
    const list = values(s, c)
    if (Array.isArray(list)) {
      for (const v of list) if (v != null) return v
    }
    return null
  }
  if (mode === 'element') return (s, c) => toElementChild(inner(s, c))
  return inner
}

// =============================================================================
// Iteration
// =============================================================================

type WalkIter = (s: Scope, c: BaseRenderContext) => unknown[]

function compileWalkNode(node: WalkPrimitive, mode: Mode): Render {
  const iter = compileWalkIter(node, mode)
  if (mode === 'element') {
    return (s, c) => wrapFragment(c, iter(s, c).map((v, i) => keyed(v, i)))
  }
  return (s, c) => iter(s, c).map(toText).join('')
}

function compileWalkIter(node: WalkPrimitive, mode: Mode): WalkIter {
  const hook = compile(node.hook, mode)
  switch (node.case) {
    case 'list': {
      const list = compile(node.list, 'text')
      const itemName = node.item ?? 'item'
      const indexName = node.index ?? 'index'
      return (s, c) => {
        const arr = list(s, c)
        if (!Array.isArray(arr)) return []
        const out: unknown[] = []
        for (let i = 0; i < arr.length; i++) {
          out.push(
            hook(s.push({ [itemName]: arr[i], [indexName]: i }), c),
          )
        }
        return out
      }
    }
    case 'test': {
      const test = compile(node.test, 'text')
      const cap = 10_000
      return (s, c) => {
        const out: unknown[] = []
        for (let i = 0; i < cap; i++) {
          if (!test(s, c)) break
          out.push(hook(s, c))
        }
        return out
      }
    }
    case 'size': {
      const base = compile(node.base, 'text')
      const head = compile(node.head, 'text')
      const move = node.move ?? 1
      const itemName = node.item ?? 'head'
      const indexName = node.index ?? 'index'
      return (s, c) => {
        const lo = Number(base(s, c))
        const hi = Number(head(s, c))
        if (!Number.isFinite(lo) || !Number.isFinite(hi) || move === 0) {
          return []
        }
        const out: unknown[] = []
        let step = 0
        for (let i = lo; move > 0 ? i < hi : i > hi; i += move) {
          out.push(hook(s.push({ [itemName]: i, [indexName]: step }), c))
          step++
        }
        return out
      }
    }
  }
}

// =============================================================================
// Join (text-side: separator-collapsed; walk children flatten)
// =============================================================================

type JoinPiece =
  | { kind: 'walk'; iter: WalkIter }
  | { kind: 'item'; render: Render }

function compileJoinNode(node: JoinPrimitive, mode: Mode): Render {
  const sep = node.text
  const pieces: JoinPiece[] = node.list.map(item =>
    isWalkNode(item)
      ? { kind: 'walk', iter: compileWalkIter(item, mode) }
      : { kind: 'item', render: compile(item, mode) },
  )

  if (mode === 'element') {
    return (s, c) => {
      const out: unknown[] = []
      for (const piece of pieces) {
        const values =
          piece.kind === 'walk' ? piece.iter(s, c) : [piece.render(s, c)]
        for (const v of values) {
          if (out.length > 0 && sep) out.push(sep)
          out.push(v)
        }
      }
      return wrapFragment(c, out.map((v, i) => keyed(v, i)))
    }
  }

  return (s, c) => {
    const out: string[] = []
    for (const piece of pieces) {
      if (piece.kind === 'walk') {
        for (const v of piece.iter(s, c)) out.push(toText(v))
      } else {
        out.push(toText(piece.render(s, c)))
      }
    }
    return out.join(sep)
  }
}

function isWalkNode(node: Cast): node is WalkPrimitive {
  return (
    node !== null &&
    typeof node === 'object' &&
    !(node instanceof Date) &&
    (node as Cast & { form?: string }).form === 'walk'
  )
}

// =============================================================================
// Fold reference (template embed)
// =============================================================================

function compileFoldRefNode(node: FoldPrimitive, mode: Mode): Render {
  const name = node.name
  const bindEntries = node.bind
    ? Object.entries(node.bind).map(
        ([k, v]) => [k, compile(v as Cast, 'text')] as const,
      )
    : null
  return (s, c) => {
    const inner = c.resolveFold?.(name, mode)
    if (!inner) return null
    if (!bindEntries) return inner(s, c)
    const frame: Record<string, unknown> = {}
    for (const [k, r] of bindEntries) frame[k] = r(s, c)
    return inner(s.push(frame), c)
  }
}

// =============================================================================
// View (element mode renders vdom; text mode emits a placeholder)
// =============================================================================

const VIEW_RESERVED = new Set(['form', 'name', 'mark', 'nest'])

function compileViewNode(node: ViewPrimitive, mode: Mode): Render {
  if (mode === 'text') return constOf(`[view:${node.name}]`)

  const name = node.name
  const propEntries = Object.keys(node)
    .filter(k => !VIEW_RESERVED.has(k))
    .map(k => {
      const v = (node as Record<string, unknown>)[k]
      return [k, isCast(v) ? compile(v as Cast, 'text') : null, v] as const
    })
  const nest = (node.nest ?? []).map(n => compile(n, 'element'))

  return (s, c) => {
    if (!c.castView) return `[view:${name}]`
    const tag = c.component?.[name] ?? name
    const props: Record<string, unknown> = {}
    for (const [k, render, raw] of propEntries) {
      props[k] = render ? render(s, c) : raw
    }
    const children = nest.map((r, i) => keyed(r(s, c), i))
    return c.castView(tag, props, ...children)
  }
}

// =============================================================================
// Element-mode helpers (fragment wrapping + key threading + child coercion)
// =============================================================================

function wrapFragment(
  ctx: BaseRenderContext,
  children: unknown[],
): unknown {
  if (children.length === 1) return children[0]
  if (ctx.fragment !== undefined && ctx.castView) {
    return ctx.castView(ctx.fragment, null, ...children)
  }
  return children
}

function keyed(child: unknown, key: number): unknown {
  if (
    child !== null &&
    typeof child === 'object' &&
    'type' in (child as Record<string, unknown>) &&
    !(
      'key' in (child as Record<string, unknown>) &&
      (child as { key: unknown }).key != null
    )
  ) {
    return { ...(child as Record<string, unknown>), key: String(key) }
  }
  return child
}

function toElementChild(value: unknown): unknown {
  if (value == null) return null
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  return value
}

// =============================================================================
// Operator resolution + default hook
// =============================================================================

function resolveCall(
  ident: { name?: string; base?: string; case?: string; code?: number },
  ctx: BaseRenderContext,
): CallHandler | undefined {
  const fromCtx = ctx.resolveCall?.(ident)
  if (fromCtx != null) return fromCtx
  if (ident.name == null) return undefined
  const composed = ident.case ? `${ident.name}:${ident.case}` : undefined
  return (
    (composed ? ctx.hook?.[composed] : undefined) ??
    ctx.hook?.[ident.name] ??
    (composed ? DEFAULT_HOOK[composed] : undefined) ??
    DEFAULT_HOOK[ident.name]
  )
}

export const DEFAULT_HOOK: HookHash = {
  ...checkFlow,
  ...formatFlow,
  ...makeFlow,
}

function toText(v: unknown): string {
  return v == null ? '' : String(v)
}

