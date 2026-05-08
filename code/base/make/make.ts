/**
 * Authored Flow declarations for the `make` verb.
 *
 * Identity is `(call, base?, case?)`. Inline `take` shapes
 * are LinkMesh records; primitive `make` outputs are string
 * refs.
 */

import type { Flow } from '@/form'

// ─── String transforms ────────────────────────────────────

export const make_lowercase: Flow = {
  form: 'flow',
  call: 'make',
  base: 'lowercase',
  take: { text: { like: 'string' } },
  make: 'string',
}

export const make_uppercase: Flow = {
  form: 'flow',
  call: 'make',
  base: 'uppercase',
  take: { text: { like: 'string' } },
  make: 'string',
}

export const make_trimmed: Flow = {
  form: 'flow',
  call: 'make',
  base: 'trimmed',
  take: { text: { like: 'string' } },
  make: 'string',
}

// ─── Numeric transforms ───────────────────────────────────

export const make_sum: Flow = {
  form: 'flow',
  call: 'make',
  base: 'sum',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
  make: 'number',
}

export const make_difference: Flow = {
  form: 'flow',
  call: 'make',
  base: 'difference',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
  make: 'number',
}

export const make_product: Flow = {
  form: 'flow',
  call: 'make',
  base: 'product',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
  make: 'number',
}

export const make_quotient: Flow = {
  form: 'flow',
  call: 'make',
  base: 'quotient',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
  make: 'number',
}
