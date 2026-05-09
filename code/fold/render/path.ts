/**
 * Shared `read` evaluation. Walks typed segments, threads
 * scope, applies optional-chain (`safe`) short-circuiting.
 */

import type { Cast, ReadPrimitive, ReadLink } from '../types'
import type { BaseContext } from './registry'

/**
 * Resolve a read node to its value. The renderer passes a
 * `evaluateNode` callback so nested nodes inside index/slice
 * bounds are evaluated in the same flavor (text or react).
 */
export function evaluatePath(
  node: ReadPrimitive,
  context: BaseContext,
  evaluateNode: (n: Cast, context: BaseContext) => unknown,
): unknown {
  let current: unknown = undefined
  for (let i = 0; i < node.link.length; i += 1) {
    const seg = node.link[i]
    if (!seg) continue
    if (i === 0) {
      if (seg.form !== 'variable') {
        throw new Error(
          `make.read: first segment must be a variable, got ${seg.form}`,
        )
      }
      current = context.scope.get(seg.name)
      if (seg.safe && current == null) return null
      continue
    }
    if (current == null) return null
    current = evaluateSeg(seg, current, context, evaluateNode)
    if ((seg as { safe?: boolean }).safe && current == null) return null
  }
  return current
}

function evaluateSeg(
  seg: ReadLink,
  current: unknown,
  context: BaseContext,
  evaluateNode: (n: Cast, context: BaseContext) => unknown,
): unknown {
  switch (seg.form) {
    case 'variable':
      throw new Error('make.read: variable segment only valid at head')
    case 'field':
      return (current as Record<string, unknown>)[seg.name]
    case 'index': {
      const i =
        typeof seg.value === 'number'
          ? seg.value
          : Number(evaluateNode(seg.value, context))
      if (Array.isArray(current)) {
        const j = i < 0 ? current.length + i : i
        return current[j]
      }
      return (current as Record<string, unknown>)[String(i)]
    }
    case 'slice': {
      if (!Array.isArray(current)) return current
      const rise =
        seg.rise == null
          ? 0
          : typeof seg.rise === 'number'
            ? seg.rise
            : Number(evaluateNode(seg.rise, context))
      const fall =
        seg.fall == null
          ? current.length
          : typeof seg.fall === 'number'
            ? seg.fall
            : Number(evaluateNode(seg.fall, context))
      return current.slice(rise, fall)
    }
  }
}
