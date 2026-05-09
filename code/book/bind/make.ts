/**
 * Authored Flow declarations for the `bind` verb.
 *
 * `bind` is the let-binding form. Names are bound to values
 * before evaluating the body. For lazy semantics (binding to
 * un-evaluated Casts that read other bound names), the AST
 * walker handles `bind` as a special form during render —
 * this Flow is the eager-arg fallback.
 */

import type { Flow } from '@/form'

export const bind: Flow = {
  form: 'flow',
  save: 'bind',
  call: 'bind',
  take: {
    names: { like: 'unknown' },     // Record<string, unknown>
    then: { like: 'unknown' },
  },
  make: 'unknown',
}
