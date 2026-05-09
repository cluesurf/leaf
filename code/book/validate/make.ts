/**
 * Authored Flow declarations for the `validate` verb.
 *
 * Wraps a boolean test with an optional human-readable
 * message + slug. Returns a `{ ok, message?, slug? }` envelope
 * so consumers can collect failures across many validations.
 */

import type { Flow } from '@/form'

export const validate: Flow = {
  form: 'flow',
  save: 'validate',
  call: 'validate',
  take: {
    test: { like: 'boolean' },
    message: { like: 'string', need: false },
    slug: { like: 'string', need: false },
    kind: { like: 'string', need: false },
  },
  make: {
    ok: { like: 'boolean' },
    message: { like: 'string', need: false },
    slug: { like: 'string', need: false },
    kind: { like: 'string', need: false },
  },
}
