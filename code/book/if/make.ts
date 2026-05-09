/**
 * Authored Flow declarations for the `if` verb.
 *
 * `if` is the value-selector form. Both `then` and `else` are
 * eagerly evaluated and the matching one is returned.
 *
 * For lazy / short-circuiting semantics, use the AST-side
 * `fork` primitive (`make.fork(test, then, fall)`) — the
 * walker only evaluates the selected branch.
 */

import type { Flow } from '@/form'

export const if_: Flow = {
  form: 'flow',
  save: 'if',
  call: 'if',
  take: {
    test: { like: 'boolean' },
    then: { like: 'unknown' },
    else: { like: 'unknown', need: false },
  },
  make: 'unknown',
}
