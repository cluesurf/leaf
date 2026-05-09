/**
 * Host-side helpers for walking Cast trees:
 *
 *   - `extractFinds(node)` → every `find` node in the tree
 *   - `extractCodes(node)` → every `code` node, with type inferred
 *     from the enclosing `find.call` when no explicit `base:` set
 *   - `substituteFinds(node, results)` → produce a clone with each
 *     `find` replaced by its resolved value (a literal Cast)
 *
 * Hosts use these in the pre-render pipeline (per
 * `note/platform/site/word.surf/feature/guide-system/seed-system.md`):
 *
 *   1. extractFinds(seed.cast) → batch + run via host resolver
 *   2. substituteFinds(seed.cast, results) → seed with values
 *   3. extractCodes(seed.cast + view.cast) → page_dependency rows
 *   4. base.cast(view.case, scope from substituted seed)
 *
 * Leaf doesn't do I/O; these utilities give hosts the walker
 * primitives they need, without re-implementing tree traversal.
 */

import type {
  Cast,
  CodePrimitive,
  FindPrimitive,
} from '@/cast'

// =============================================================================
// extractFinds
// =============================================================================

export function extractFinds(node: Cast): FindPrimitive[] {
  const out: FindPrimitive[] = []
  walkCasts(node, n => {
    if (isFind(n)) out.push(n)
  })
  return out
}

// =============================================================================
// extractCodes
// =============================================================================

/**
 * Every `code` node in the tree, paired with its inferred resource
 * type. Type comes from the explicit `code.base:` if set, else from
 * the nearest enclosing `find.call:` (`'select:language'` →
 * `'language'`), else `undefined` (host decides how to handle).
 */
export type ExtractedCode = {
  code: CodePrimitive
  resource: string | undefined
}

export function extractCodes(node: Cast): ExtractedCode[] {
  const out: ExtractedCode[] = []
  walkCastsWithFindContext(node, undefined, (n, enclosingFind) => {
    if (isCode(n)) {
      const resource = n.base ?? resourceFromFind(enclosingFind)
      out.push({ code: n, resource })
    }
  })
  return out
}

function resourceFromFind(find: FindPrimitive | undefined): string | undefined {
  if (!find) return undefined
  // 'select:language' → 'language'
  // 'filter:word' → 'word'
  // 'filter:language-string' → 'language-string'
  const idx = find.call.indexOf(':')
  return idx >= 0 ? find.call.slice(idx + 1) : undefined
}

// =============================================================================
// substituteFinds
// =============================================================================

/**
 * Produce a clone of `node` with each `find` replaced by its
 * resolved value. Resolution map keys are the original `FindPrimitive`
 * objects (identity-keyed) — the same objects the host gets back
 * from `extractFinds`.
 *
 * The substituted value is wrapped as a Cast literal: it could be
 * a typed-literal (e.g. `{form: 'string', text: '...'}`), a `hash`,
 * a `list`, or a bare native value (string / number / etc.). The
 * caller is responsible for deciding the wrapping shape; this
 * helper only does the structural replacement.
 */
export function substituteFinds(
  node: Cast,
  results: Map<FindPrimitive, Cast>,
): Cast {
  if (node === null || node === undefined) return node
  if (typeof node !== 'object') return node
  if (node instanceof Date) return node

  if (isFind(node) && results.has(node)) {
    return results.get(node)!
  }

  if (Array.isArray(node)) {
    return node.map(c => substituteFinds(c as Cast, results)) as unknown as Cast
  }

  // Recurse into every property that could hold a Cast. For
  // unresolved finds, this still rewrites their `test` / `sort` /
  // `bind` children so any inner finds get substituted.
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(node)) {
    const v = (node as Record<string, unknown>)[k]
    out[k] = recurseIntoValue(v, results)
  }
  return out as Cast
}

function recurseIntoValue(
  v: unknown,
  results: Map<FindPrimitive, Cast>,
): unknown {
  if (v === null || v === undefined) return v
  if (typeof v !== 'object') return v
  if (v instanceof Date) return v
  if (Array.isArray(v)) {
    return v.map(item => recurseIntoValue(item, results))
  }
  // If it has a `form:`, treat as Cast and substitute.
  if ('form' in (v as Record<string, unknown>)) {
    return substituteFinds(v as Cast, results)
  }
  // Otherwise it's a plain record (e.g. `find.bind` / `range.start`
  // wrapper) — recurse into its values.
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(v)) {
    out[k] = recurseIntoValue((v as Record<string, unknown>)[k], results)
  }
  return out
}

// =============================================================================
// Walk helpers
// =============================================================================

/** Visit every Cast in the tree, parents before children. */
function walkCasts(node: Cast, visit: (n: Cast) => void): void {
  if (node === null || node === undefined) return
  if (typeof node !== 'object') return
  if (node instanceof Date) return
  visit(node)
  // Recurse into every property that could hold a Cast.
  for (const k of Object.keys(node)) {
    const v = (node as Record<string, unknown>)[k]
    walkValue(v, visit)
  }
}

function walkValue(v: unknown, visit: (n: Cast) => void): void {
  if (v === null || v === undefined) return
  if (typeof v !== 'object') return
  if (v instanceof Date) return
  if (Array.isArray(v)) {
    for (const item of v) walkValue(item, visit)
    return
  }
  if ('form' in (v as Record<string, unknown>)) {
    walkCasts(v as Cast, visit)
    return
  }
  // Plain wrapper record (e.g. range.start = { inclusive, value }).
  for (const k of Object.keys(v)) {
    walkValue((v as Record<string, unknown>)[k], visit)
  }
}

/**
 * Walker that threads the most-recent enclosing `find` into the
 * visitor. Used to infer resource type for `code` nodes.
 */
function walkCastsWithFindContext(
  node: Cast,
  enclosingFind: FindPrimitive | undefined,
  visit: (n: Cast, enclosingFind: FindPrimitive | undefined) => void,
): void {
  if (node === null || node === undefined) return
  if (typeof node !== 'object') return
  if (node instanceof Date) return
  visit(node, enclosingFind)
  const childContext = isFind(node) ? node : enclosingFind
  for (const k of Object.keys(node)) {
    const v = (node as Record<string, unknown>)[k]
    walkValueWithFindContext(v, childContext, visit)
  }
}

function walkValueWithFindContext(
  v: unknown,
  enclosingFind: FindPrimitive | undefined,
  visit: (n: Cast, enclosingFind: FindPrimitive | undefined) => void,
): void {
  if (v === null || v === undefined) return
  if (typeof v !== 'object') return
  if (v instanceof Date) return
  if (Array.isArray(v)) {
    for (const item of v) walkValueWithFindContext(item, enclosingFind, visit)
    return
  }
  if ('form' in (v as Record<string, unknown>)) {
    walkCastsWithFindContext(v as Cast, enclosingFind, visit)
    return
  }
  for (const k of Object.keys(v)) {
    walkValueWithFindContext(
      (v as Record<string, unknown>)[k],
      enclosingFind,
      visit,
    )
  }
}

function isFind(node: Cast): node is FindPrimitive {
  return (
    node !== null &&
    typeof node === 'object' &&
    !(node instanceof Date) &&
    (node as Cast & { form?: string }).form === 'find'
  )
}

function isCode(node: Cast): node is CodePrimitive {
  return (
    node !== null &&
    typeof node === 'object' &&
    !(node instanceof Date) &&
    (node as Cast & { form?: string }).form === 'code'
  )
}
