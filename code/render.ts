/**
 * Text renderer.
 *
 * Walks a flow tree and produces a string. Used for
 * localization templates, computed labels, status strings,
 * any place a flow tree should resolve to text.
 *
 * Views render as `[view:<name>]` placeholders here — render
 * a flow tree that contains views with the React renderer
 * instead.
 */

import type {
  Call,
  CaseArm,
  CasePrimitive,
  CaseValueArm,
  Cast,
  WalkPrimitive,
} from '@/cast'
import { evaluatePath } from '@/render-path'
import {
  collectCallArgs,
  deepEq,
  getCall,
  type BaseContext,
  type CallHandler,
} from '@/render-context'
import { type Scope } from '@/scope'

export type TextContext = BaseContext

/**
 * Render a flow node to a string.
 */
export function renderText(node: Cast, context: TextContext): string {
  const value = evaluateText(node, context)
  return value == null ? '' : String(value)
}

/**
 * Evaluate a flow node to a JS value (for the text-side
 * walker). Most consumers want `renderText` instead.
 */
export function evaluateText(
  node: Cast,
  context: TextContext,
): unknown {
  // ----- native leaves -----
  if (node === null || node === undefined) return null
  if (typeof node === 'string') return node
  if (typeof node === 'number') return node
  if (typeof node === 'boolean') return node
  if (node instanceof Date) return node

  // ----- per-mark memoization (used by `base.bindPatch`) -----
  const mark = (node as { mark?: string }).mark
  if (
    mark &&
    context.cache &&
    context.cache.has(mark) &&
    !context.dirty?.has(mark)
  ) {
    return context.cache.get(mark)
  }

  const value = evaluateForm(node, context)
  if (mark && context.cache) context.cache.set(mark, value)
  return value
}

function evaluateForm(node: Cast, context: TextContext): unknown {
  if (node === null || node === undefined) return null
  if (typeof node === 'string') return node
  if (typeof node === 'number') return node
  if (typeof node === 'boolean') return node
  if (node instanceof Date) return node

  switch (node.form) {
    case 'list':
      return node.list.map(n => evaluateText(n, context))
    case 'text':
      return node.flow.map(n => renderText(n, context)).join('')
    case 'hash': {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(node.base)) {
        out[k] = evaluateText(v, context)
      }
      return out
    }

    // ----- reads -----
    case 'reference':
      return context.scope.get(node.name)
    case 'read':
      return evaluatePath(node, context, evaluateText)

    // ----- calls -----
    case 'call':
      return evaluateCall(node, context)

    // ----- control flow -----
    case 'fork': {
      const t = evaluateText(node.test, context)
      if (t) return evaluateText(node.then, context)
      return node.fall === undefined
        ? null
        : evaluateText(node.fall, context)
    }
    case 'switch': {
      const v = evaluateText(node.value, context)
      for (const arm of node.cases) {
        if (deepEq(evaluateText(arm.when, context), v)) {
          return evaluateText(arm.then, context)
        }
      }
      return node.fall === undefined
        ? null
        : evaluateText(node.fall, context)
    }
    case 'match': {
      for (const branch of node.branches) {
        if (evaluateText(branch.test, context)) {
          return evaluateText(branch.then, context)
        }
      }
      return node.fall === undefined
        ? null
        : evaluateText(node.fall, context)
    }
    case 'case':
      return evaluateCase(node, context)
    case 'pick': {
      const values = evaluateText(node.values, context)
      if (Array.isArray(values)) {
        for (const v of values) {
          if (v != null) return v
        }
      }
      return null
    }
    case 'walk':
      return walkItemsText(node, context).join('')

    case 'join': {
      const out: string[] = []
      for (const item of node.list) {
        // Walks flatten: each iteration becomes a separate join entry.
        if (
          item !== null &&
          typeof item === 'object' &&
          !(item instanceof Date) &&
          (item as { form?: string }).form === 'walk'
        ) {
          for (const piece of walkItemsText(
            item as WalkPrimitive,
            context,
          )) {
            out.push(piece)
          }
        } else {
          out.push(renderText(item, context))
        }
      }
      return out.join(node.text)
    }
    // ----- find -----
    case 'find': {
      if (!context.find) return null
      return context.find({
        resource: node.resource,
        where:
          node.where !== undefined
            ? evaluateText(node.where, context)
            : undefined,
        sort: node.sort?.map(s => evaluateText(s, context)),
        limit: node.limit,
        offset: node.offset,
        kind: node.kind,
      })
    }

    // ----- fold (template embed) -----
    case 'fold': {
      const inner = context.fold?.(node.name)
      if (inner == null) return null
      const frame: Record<string, unknown> = {}
      if (node.bind) {
        for (const [k, v] of Object.entries(node.bind)) {
          frame[k] = evaluateText(v, context)
        }
      }
      const childContext: TextContext = {
        ...context,
        scope: context.scope.push(frame),
      }
      return evaluateText(inner, childContext)
    }

    // ----- views (placeholder in text mode) -----
    case 'view':
      return `[view:${node.name}]`
  }

  throw new Error(
    `flow.renderText: unknown form '${
      (node as Cast & { form: string }).form
    }'`,
  )
}

// ---------------------------------------------------------------------------
// Case
// ---------------------------------------------------------------------------

function evaluateCase(
  node: CasePrimitive,
  context: TextContext,
): unknown {
  const subject = evaluateText(node.test, context)
  for (const arm of node.case) {
    if (matchArm(arm, subject, context)) {
      return arm.flow.map(n => renderText(n, context)).join('')
    }
  }
  return ''
}

function matchArm(
  arm: CaseArm,
  subject: unknown,
  context: TextContext,
): boolean {
  switch (arm.form) {
    case 'case-value':
      return deepEq(arm.value, subject)
    case 'case-test':
      return Boolean(
        evaluateCallWithSubject(arm.test, subject, context),
      )
    case 'case-default':
      return true
  }
}

// ---------------------------------------------------------------------------
// Walk → array of rendered iterations (used by both walk and
// join arms). Returns one string per iteration; the caller
// concatenates with the appropriate separator.
// ---------------------------------------------------------------------------

function walkItemsText(
  node: WalkPrimitive,
  context: TextContext,
): string[] {
  const out: string[] = []
  switch (node.case) {
    case 'list': {
      const list = evaluateText(node.list, context) as
        | unknown[]
        | null
        | undefined
      if (!Array.isArray(list)) return out
      const itemName = node.item ?? 'item'
      const indexName = node.index ?? 'index'
      for (let i = 0; i < list.length; i += 1) {
        const frame: Record<string, unknown> = {}
        frame[itemName] = list[i]
        frame[indexName] = i
        const inner: TextContext = {
          ...context,
          scope: context.scope.push(frame),
        }
        out.push(renderText(node.hook, inner))
      }
      return out
    }
    case 'test': {
      const cap = 10_000
      for (let i = 0; i < cap; i += 1) {
        const t = evaluateText(node.test, context)
        if (!t) break
        out.push(renderText(node.hook, context))
      }
      return out
    }
    case 'size': {
      const base = Number(evaluateText(node.base, context))
      const head = Number(evaluateText(node.head, context))
      const move = node.move ?? 1
      if (
        !Number.isFinite(base) ||
        !Number.isFinite(head) ||
        move === 0
      ) {
        return out
      }
      const itemName = node.item ?? 'head'
      const indexName = node.index ?? 'index'
      let step = 0
      for (let i = base; move > 0 ? i < head : i > head; i += move) {
        const frame: Record<string, unknown> = {}
        frame[itemName] = i
        frame[indexName] = step
        const inner: TextContext = {
          ...context,
          scope: context.scope.push(frame),
        }
        out.push(renderText(node.hook, inner))
        step += 1
      }
      return out
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Calls
// ---------------------------------------------------------------------------

function resolveCall(
  node: Call,
  context: TextContext,
): CallHandler | undefined {
  // Prefer the runtime-supplied `call` resolver when present —
  // it knows the catalog's (name, base, case) identity tuple
  // and the integer `code` shortcut. Fall back to the legacy
  // hook[name] lookup for make-internal operators.
  const fromContext = context.call?.(node)
  if (fromContext != null) return fromContext
  return getCall(context, node.name, node.case)
}

function evaluateCall(node: Call, context: TextContext): unknown {
  // Lazy verbs — args evaluate per-branch / per-frame, not eagerly.
  // Only fires for make-form Calls (with `name`); wake-form (`code`)
  // dispatches through the regular handler path.
  if (typeof node.name === 'string') {
    if (node.name === 'if') return evaluateIfLazy(node, context)
    if (node.name === 'bind') return evaluateBindLazy(node, context)
  }

  const handler = resolveCall(node, context)
  if (!handler) {
    throw new Error(`cast.call: unknown operator '${node.name}'`)
  }
  const args = collectCallArgs(node, context, evaluateText)
  return handler(args, context)
}

/**
 * Lazy `if`. Evaluate `test` first; only the selected branch
 * (`then` or `else`) gets evaluated. Avoids the catalog flow's
 * eager-arg trap where both branches would always run.
 */
function evaluateIfLazy(node: Call, context: TextContext): unknown {
  const test = evalArg(node.test, context)
  if (test) return evalArg(node.then, context)
  return evalArg(node.else, context) ?? null
}

/**
 * Lazy `bind`. Each `names` value evaluates against the OUTER
 * scope; the resolved values are pushed as a single frame and
 * `then` evaluates under the inner scope. This lets callers
 * stage temporary bindings within an expression.
 */
function evaluateBindLazy(node: Call, context: TextContext): unknown {
  const names = node.names
  if (
    names == null ||
    typeof names !== 'object' ||
    Array.isArray(names)
  ) {
    return evalArg(node.then, context)
  }
  const frame: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(
    names as Record<string, unknown>,
  )) {
    frame[k] = evalArg(v, context)
  }
  const inner: TextContext = {
    ...context,
    scope: context.scope.push(frame),
  }
  return evalArg(node.then, inner)
}

/** Evaluate one Call arg slot — Cast nodes walk; native values pass. */
function evalArg(value: unknown, context: TextContext): unknown {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value
  if (value instanceof Date) return value
  if ('form' in (value as Record<string, unknown>)) {
    return evaluateText(value as Cast, context)
  }
  return value
}

function evaluateCallWithSubject(
  node: Call,
  subject: unknown,
  context: TextContext,
): unknown {
  const handler = resolveCall(node, context)
  if (!handler) {
    throw new Error(`cast.call: unknown operator '${node.name}'`)
  }
  const args = collectCallArgs(node, context, evaluateText)
  if (args.subject === undefined) args.subject = subject
  return handler(args, context)
}

// Re-export the Scope type for convenience.
export type { Scope }
