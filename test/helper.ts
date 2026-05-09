import { Base } from '../code'
import type { Cast as FoldNode } from '../code/cast'

let foldCounter = 0

/**
 * Test helper: wrap an inline tree as a Fold, register it on
 * `base`, and cast it with `params`. Mirrors the public
 * `base.cast(name, params)` API while letting tests author
 * trees inline rather than declaring a Book.
 */
export function castInline(
  base: Base<any>,
  tree: FoldNode,
  params: Record<string, unknown> = {},
): unknown {
  const name = `__test_${++foldCounter}`
  base.load({ form: 'fold', case: name, cast: [tree] })
  return base.cast(name, params)
}
