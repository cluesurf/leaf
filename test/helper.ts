import { Base } from '../code'
import type { Cast } from '../code/cast'
import {
  compile,
  type BaseRenderContext,
  type ElementBuilder,
} from '../code/render'
import type { Scope } from '../code/scope'

let foldCounter = 0

/**
 * Test helper: wrap an inline tree as a Fold, register it on
 * `base`, and cast it with `params`. Mirrors the public
 * `base.cast(name, params)` API while letting tests author
 * trees inline rather than declaring a Book.
 */
export function castInline(
  base: Base<any>,
  tree: Cast,
  params: Record<string, unknown> = {},
): unknown {
  const name = `__test_${++foldCounter}`
  base.load({ form: 'fold', case: name, cast: [tree] })
  return base.cast(name, params)
}

/** Compile + render a Cast in text mode under a live scope. */
export function renderText(
  tree: Cast,
  context: { scope: Scope } & BaseRenderContext,
): string {
  const v = compile(tree, 'text')(context.scope, context)
  return v == null ? '' : String(v)
}

/** Compile + evaluate a Cast in text mode (returns native value). */
export function evaluateText(
  tree: Cast,
  context: { scope: Scope } & BaseRenderContext,
): unknown {
  return compile(tree, 'text')(context.scope, context)
}

/** Compile + render a Cast in element mode under a live scope. */
export function renderElement<T = unknown>(
  tree: Cast,
  context: { scope: Scope; builder: ElementBuilder<T> } & BaseRenderContext,
): unknown {
  return compile(tree, 'element')(context.scope, {
    ...context,
    castView: context.builder,
  })
}
