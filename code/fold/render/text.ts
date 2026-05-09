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
} from '../types'
import { evaluatePath } from './path'
import {
  collectCallArgs,
  deepEq,
  getCall,
  type BaseContext,
  type CallHandler,
} from './registry'
import { type Scope } from './scope'

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
export function evaluateText(node: Cast, context: TextContext): unknown {
  // ----- native leaves -----
  if (node === null || node === undefined) return null
  if (typeof node === 'string') return node
  if (typeof node === 'number') return node
  if (typeof node === 'boolean') return node
  if (node instanceof Date) return node

  switch (node.form) {
    case 'list':
      return node.list.map(n => evaluateText(n, context))
    case 'template_string':
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
      return node.fall === undefined ? null : evaluateText(node.fall, context)
    }
    case 'switch': {
      const v = evaluateText(node.value, context)
      for (const arm of node.cases) {
        if (deepEq(evaluateText(arm.when, context), v)) {
          return evaluateText(arm.then, context)
        }
      }
      return node.fall === undefined ? null : evaluateText(node.fall, context)
    }
    case 'match': {
      for (const branch of node.branches) {
        if (evaluateText(branch.test, context)) {
          return evaluateText(branch.then, context)
        }
      }
      return node.fall === undefined ? null : evaluateText(node.fall, context)
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
    case 'walk': {
      const out: string[] = []
      switch (node.case) {
        case 'list': {
          const list = evaluateText(node.list, context) as
            | unknown[]
            | null
            | undefined
          if (!Array.isArray(list)) return ''
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
          return out.join('')
        }
        case 'test': {
          // While-style loop. Cap iterations to prevent
          // accidental infinite loops in authored content.
          const cap = 10_000
          for (let i = 0; i < cap; i += 1) {
            const t = evaluateText(node.test, context)
            if (!t) break
            out.push(renderText(node.hook, context))
          }
          return out.join('')
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
            return ''
          }
          const itemName = node.item ?? 'head'
          const indexName = node.index ?? 'index'
          let step = 0
          for (
            let i = base;
            move > 0 ? i < head : i > head;
            i += move
          ) {
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
          return out.join('')
        }
      }
      return ''
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

function evaluateCase(node: CasePrimitive, context: TextContext): unknown {
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
      return deepEq((arm as CaseValueArm).value, subject)
    case 'case-test':
      return Boolean(evaluateCallWithSubject(arm.test, subject, context))
    case 'case-default':
      return true
  }
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
  return getCall(context, node.name)
}

function evaluateCall(node: Call, context: TextContext): unknown {
  const handler = resolveCall(node, context)
  if (!handler) {
    throw new Error(`make.call: unknown operator '${node.name}'`)
  }
  const args = collectCallArgs(node, context, evaluateText)
  return handler(args, context)
}

function evaluateCallWithSubject(
  node: Call,
  subject: unknown,
  context: TextContext,
): unknown {
  const handler = resolveCall(node, context)
  if (!handler) {
    throw new Error(`make.call: unknown operator '${node.name}'`)
  }
  const args = collectCallArgs(node, context, evaluateText)
  if (args.subject === undefined) args.subject = subject
  return handler(args, context)
}

// Re-export the Scope type for convenience.
export type { Scope }
