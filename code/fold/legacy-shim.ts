/**
 * Compatibility re-export. Originally lived at `make/render.ts`
 * as a deprecated shim pointing at `make/render/index.ts`.
 * Migrated into the `render/` folder during the bead cutover.
 * Direct imports from this file are deprecated. Import from
 * `@cluesurf/bead/make` instead.
 */

export {
  evaluateText as evaluate,
  evaluateText,
  makeScope,
  renderText as render,
  renderText,
} from '.'

export type {
  BaseContext,
  Scope,
  TextContext,
  TextContext as RenderCtx,
} from '.'
