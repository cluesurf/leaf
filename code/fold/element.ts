/**
 * Element renderer — vdom-agnostic.
 *
 * Walks a flow tree and produces element nodes for whichever
 * vdom you pass in (React, Preact, h-script, anything with the
 * `(type, props, ...children) => element` shape).
 *
 *   import { renderElement } from '@cluesurf/bead/make/render/element'
 *   import { createElement, Fragment } from 'react'
 *
 *   renderElement(tree, {
 *     scope: flow.scope(),
 *     builder: createElement,
 *     fragment: Fragment,
 *     component: { callout: Callout },
 *   })
 *
 * For Preact:
 *
 *   import { h, Fragment } from 'preact'
 *   renderElement(tree, { scope, builder: h, fragment: Fragment, ... })
 *
 * The renderer:
 *
 *  - calls `context.builder(type, props, ...children)` for `view`
 *    nodes (and for the implicit fragment wrappers around
 *    `weave`, `list`, `walk`, `loop`, `case`)
 *  - reads view components from `context.component[name]`
 *  - falls back to the bare view name as the element type when
 *    no component is registered (e.g. `'div'`)
 *  - threads `key` in via props for list children
 *
 * Calls and computed values resolve through the same `hook`
 * registry the text renderer uses.
 */

import type {
  Call,
  CaseArm,
  CasePrimitive,
  CaseValueArm,
  Cast,
  ViewPrimitive,
  WalkPrimitive,
} from './types'
import { evaluatePath } from './path'
import {
  collectCallArgs,
  deepEq,
  getCall,
  isCast,
  type BaseContext,
} from './registry'
import type { Scope } from './scope'

export type ElementBuilder<T> = (
  type: unknown,
  props: Record<string, unknown> | null,
  ...children: unknown[]
) => T

/**
 * Per-render context for an element-producing renderer.
 *
 *  - `builder` is the vdom factory (`React.createElement`,
 *    `h`, etc.). Required.
 *  - `fragment` is the value the builder accepts as a fragment
 *    marker. Optional; if absent, the renderer flattens
 *    fragment slots into arrays, which most vdom libraries
 *    accept directly as a child.
 *  - `component` maps `view` node names to whatever the
 *    builder accepts as a `type` (a component reference,
 *    usually).
 */
export type ElementContext<T = unknown, C = unknown> = BaseContext & {
  builder: ElementBuilder<T>
  fragment?: unknown
  component?: Record<string, C>
}

// ---------------------------------------------------------------------------
// Public entry
// ---------------------------------------------------------------------------

export function renderElement<T = unknown, C = unknown>(
  node: Cast,
  context: ElementContext<T, C>,
): T | string | null {
  return walkElement(node, context) as T | string | null
}

// ---------------------------------------------------------------------------
// Walker
// ---------------------------------------------------------------------------

function walkElement(node: Cast, context: ElementContext): unknown {
  // ----- native leaves -----
  if (node === null || node === undefined) return null
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (typeof node === 'boolean') return String(node)
  if (node instanceof Date) return node.toISOString()

  switch (node.form) {
    case 'list':
      return wrapFragment(
        context,
        node.list.map((n, i) => keyed(walkElement(n, context), i)),
      )
    case 'text':
      return wrapFragment(
        context,
        node.flow.map((n, i) => keyed(walkElement(n, context), i)),
      )
    case 'hash': {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(node.base)) {
        out[k] = walkValue(v, context)
      }
      return out
    }

    // ----- reads -----
    case 'reference':
      return toElementChild(context.scope.get(node.name))
    case 'read':
      return toElementChild(
        evaluatePath(
          node,
          context,
          walkValue as (n: Cast, c: BaseContext) => unknown,
        ),
      )

    // ----- calls -----
    case 'call':
      return toElementChild(evaluateCall(node, context))

    // ----- control flow -----
    case 'fork': {
      const t = walkValue(node.test, context)
      if (t) return walkElement(node.then, context)
      return node.fall === undefined ? null : walkElement(node.fall, context)
    }
    case 'switch': {
      const v = walkValue(node.value, context)
      for (const arm of node.cases) {
        if (deepEq(walkValue(arm.when, context), v)) {
          return walkElement(arm.then, context)
        }
      }
      return node.fall === undefined ? null : walkElement(node.fall, context)
    }
    case 'match': {
      for (const branch of node.branches) {
        if (walkValue(branch.test, context)) {
          return walkElement(branch.then, context)
        }
      }
      return node.fall === undefined ? null : walkElement(node.fall, context)
    }
    case 'case':
      return walkCase(node, context)
    case 'pick': {
      const values = walkValue(node.values, context)
      if (Array.isArray(values)) {
        for (const v of values) {
          if (v != null) return toElementChild(v)
        }
      }
      return null
    }
    case 'walk':
      return wrapFragment(
        context,
        walkItemsElement(node, context).map((v, i) => keyed(v, i)),
      )

    case 'join': {
      const out: unknown[] = []
      const sep = node.text
      for (const item of node.list) {
        const pieces = isWalkCast(item)
          ? walkItemsElement(item, context)
          : [walkElement(item, context)]
        for (const piece of pieces) {
          if (out.length > 0 && sep) out.push(sep)
          out.push(piece)
        }
      }
      return wrapFragment(
        context,
        out.map((v, i) => keyed(v, i)),
      )
    }
    // ----- find -----
    case 'find': {
      if (!context.find) return null
      const rows = context.find({
        resource: node.resource,
        where: node.where !== undefined
          ? walkValue(node.where, context)
          : undefined,
        sort: node.sort?.map(s => walkValue(s, context)),
        limit: node.limit,
        offset: node.offset,
        kind: node.kind,
      })
      return toElementChild(rows)
    }

    // ----- fold (template embed) -----
    case 'fold': {
      const inner = context.fold?.(node.name)
      if (inner == null) return null
      const frame: Record<string, unknown> = {}
      if (node.bind) {
        for (const [k, v] of Object.entries(node.bind)) {
          frame[k] = walkValue(v, context)
        }
      }
      const childContext: ElementContext = {
        ...context,
        scope: context.scope.push(frame),
      }
      return walkElement(inner, childContext)
    }

    // ----- views -----
    case 'view':
      return walkView(node, context)
  }

  throw new Error(
    `flow.renderElement: unknown form '${
      (node as Cast & { form: string }).form
    }'`,
  )
}

// ---------------------------------------------------------------------------
// Value walker — used inside paths, predicates, branch tests
// ---------------------------------------------------------------------------

function walkValue(node: Cast, context: ElementContext): unknown {
  // ----- native leaves -----
  if (node === null || node === undefined) return null
  if (typeof node === 'string') return node
  if (typeof node === 'number') return node
  if (typeof node === 'boolean') return node
  if (node instanceof Date) return node

  switch (node.form) {
    case 'list':
      return node.list.map(n => walkValue(n, context))
    case 'text':
      return node.flow.map(n => walkValue(n, context)).join('')
    case 'hash': {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(node.base)) {
        out[k] = walkValue(v, context)
      }
      return out
    }
    case 'reference':
      return context.scope.get(node.name)
    case 'read':
      return evaluatePath(
        node,
        context,
        walkValue as (n: Cast, c: BaseContext) => unknown,
      )
    case 'call':
      return evaluateCall(node, context)
    default:
      // For control-flow / views in a value position, fall back
      // to the element walker.
      return walkElement(node, context)
  }
}

// ---------------------------------------------------------------------------
// Walk → array of rendered iterations (used by both walk and
// join arms). One element per iteration; the caller wraps in a
// fragment.
// ---------------------------------------------------------------------------

function isWalkCast(v: unknown): v is WalkPrimitive {
  return (
    v !== null &&
    typeof v === 'object' &&
    !(v instanceof Date) &&
    (v as { form?: string }).form === 'walk'
  )
}

function walkItemsElement(
  node: WalkPrimitive,
  context: ElementContext,
): unknown[] {
  const out: unknown[] = []
  switch (node.case) {
    case 'list': {
      const list = walkValue(node.list, context) as
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
        const inner: ElementContext = {
          ...context,
          scope: context.scope.push(frame),
        }
        out.push(walkElement(node.hook, inner))
      }
      return out
    }
    case 'test': {
      const cap = 10_000
      for (let i = 0; i < cap; i += 1) {
        const t = walkValue(node.test, context)
        if (!t) break
        out.push(walkElement(node.hook, context))
      }
      return out
    }
    case 'size': {
      const base = Number(walkValue(node.base, context))
      const head = Number(walkValue(node.head, context))
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
      for (
        let i = base;
        move > 0 ? i < head : i > head;
        i += move
      ) {
        const frame: Record<string, unknown> = {}
        frame[itemName] = i
        frame[indexName] = step
        const inner: ElementContext = {
          ...context,
          scope: context.scope.push(frame),
        }
        out.push(walkElement(node.hook, inner))
        step += 1
      }
      return out
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// View dispatch
// ---------------------------------------------------------------------------

function walkView(node: ViewPrimitive, context: ElementContext): unknown {
  const type = context.component?.[node.name] ?? node.name

  // Resolve flat props.
  const props: Record<string, unknown> = {}
  for (const k of Object.keys(node)) {
    if (
      k === 'form' ||
      k === 'name' ||
      k === 'mark' ||
      k === 'nest'
    ) {
      continue
    }
    const v = (node as Record<string, unknown>)[k]
    props[k] = isCast(v) ? walkValue(v, context) : v
  }

  // Resolve nest children.
  const children = (node.nest ?? []).map((n, i) =>
    keyed(walkElement(n, context), i),
  )

  return context.builder(type, props, ...children)
}

// ---------------------------------------------------------------------------
// Case
// ---------------------------------------------------------------------------

function walkCase(node: CasePrimitive, context: ElementContext): unknown {
  const subject = walkValue(node.test, context)
  for (const arm of node.case) {
    if (matchArm(arm, subject, context)) {
      return wrapFragment(
        context,
        arm.flow.map((n, i) => keyed(walkElement(n, context), i)),
      )
    }
  }
  return null
}

function matchArm(
  arm: CaseArm,
  subject: unknown,
  context: ElementContext,
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
// Call helpers
// ---------------------------------------------------------------------------

function evaluateCall(node: Call, context: ElementContext): unknown {
  if (typeof node.name === 'string') {
    if (node.name === 'if') return evaluateIfLazyEl(node, context)
    if (node.name === 'bind') return evaluateBindLazyEl(node, context)
  }

  const handler = getCall(context, node.name)
  if (!handler) {
    throw new Error(`flow.call: unknown operator '${node.name}'`)
  }
  const args = collectCallArgs(
    node,
    context,
    walkValue as (n: Cast, c: BaseContext) => unknown,
  )
  return handler(args, context)
}

function evaluateIfLazyEl(node: Call, context: ElementContext): unknown {
  const test = evalArgEl(node.test, context)
  if (test) return evalArgEl(node.then, context)
  return evalArgEl(node.else, context) ?? null
}

function evaluateBindLazyEl(node: Call, context: ElementContext): unknown {
  const names = node.names
  if (names == null || typeof names !== 'object' || Array.isArray(names)) {
    return evalArgEl(node.then, context)
  }
  const frame: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(names as Record<string, unknown>)) {
    frame[k] = evalArgEl(v, context)
  }
  const inner: ElementContext = {
    ...context,
    scope: context.scope.push(frame),
  }
  return evalArgEl(node.then, inner)
}

function evalArgEl(value: unknown, context: ElementContext): unknown {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value
  if (value instanceof Date) return value
  if ('form' in (value as Record<string, unknown>)) {
    return walkElement(value as Cast, context)
  }
  return value
}

function evaluateCallWithSubject(
  node: Call,
  subject: unknown,
  context: ElementContext,
): unknown {
  const handler = getCall(context, node.name)
  if (!handler) {
    throw new Error(`flow.call: unknown operator '${node.name}'`)
  }
  const args = collectCallArgs(
    node,
    context,
    walkValue as (n: Cast, c: BaseContext) => unknown,
  )
  if (args.subject === undefined) args.subject = subject
  return handler(args, context)
}

// ---------------------------------------------------------------------------
// Fragment + key helpers
// ---------------------------------------------------------------------------

/**
 * Wrap a children array as a single result. If `context.fragment`
 * is provided, build a real fragment element. Otherwise return
 * the array as-is — most vdom libraries accept arrays directly
 * as a child slot.
 */
function wrapFragment(context: ElementContext, children: unknown[]): unknown {
  if (context.fragment !== undefined) {
    return context.builder(context.fragment, null, ...children)
  }
  return children
}

/**
 * If `child` is an element with a settable `key` slot, give it
 * a stable string key. Plain values pass through unchanged.
 *
 * Most vdoms (React, Preact) accept `key` as a special prop set
 * at creation time — that path is taken in `walkView` /
 * fragment construction. This helper is a fallback for elements
 * that came back from a custom form handler.
 */
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
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value)
  }
  return String(value)
}

export type { Scope }
