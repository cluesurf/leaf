/**
 * Renderer surface (text only).
 *
 * The React renderer lives at `../react` as a separate entry
 * point so `react` stays an optional peer dep rather than
 * forcing every form.js consumer to install it.
 *
 *   import { make } from '@cluesurf/bead'              // text + builders
 *   import { renderReact } from '@cluesurf/bead/make/render/react'
 */

export type { Scope } from './scope'
export { makeScope } from './scope'

export type {
  BaseContext,
  CallEntry,
  CallHandler,
} from './registry'
export {
  DEFAULT_HOOK,
  deepEq,
  getCall,
  isCast,
} from './registry'

export type { TextContext } from './text'
export { evaluateText, renderText } from './text'
