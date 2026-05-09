/**
 * Hook implementations for the `walk` verb.
 *
 * Eager-arg form: callers pass a parallel array of per-item
 * values (already resolved by the AST walker). For true
 * scoped iteration, use `make.walk(...)` / `make.walkSize` /
 * `make.walkTest` from `@cluesurf/bead`.
 */

export const walkMap = ({
  yield: values,
}: {
  items: unknown[]
  yield: unknown
}): unknown[] => {
  return Array.isArray(values) ? values : []
}

export const walkFilter = ({
  items,
  test,
}: {
  items: unknown[]
  test: unknown
}): unknown[] => {
  if (!Array.isArray(test)) return []
  const out: unknown[] = []
  for (let i = 0; i < items.length; i += 1) {
    if (test[i]) out.push(items[i])
  }
  return out
}

export const walkReduce = ({
  yield: stepResult,
}: {
  items: unknown[]
  initial: unknown
  yield: unknown
}): unknown => {
  // The AST-side walker accumulates step-by-step. The
  // eager-arg fallback simply returns the last produced
  // value (or initial when no items processed).
  return stepResult
}

export const walkChunk = ({
  items,
  size,
}: {
  items: unknown[]
  size: number
}): unknown[][] => {
  if (size <= 0) return []
  const out: unknown[][] = []
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size))
  }
  return out
}

export const walkDistinct = ({
  items,
}: {
  items: unknown[]
}): unknown[] => {
  return Array.from(new Set(items))
}
