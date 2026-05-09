/**
 * Authored Flow declarations for the `make` verb.
 *
 * Identity is `(call, base?, case?)`. Inline `take` shapes
 * are LinkMesh records; primitive `make` outputs are string
 * refs.
 */

import type { Flow } from '@/form'

// ─── String transforms ────────────────────────────────────

export const makeLowercase: Flow = {
  form: 'flow',
  save: 'make',
  call: 'make',
  case: 'lowercase',
  take: { text: { like: 'string' } },
  make: 'string',
}

export const makeUppercase: Flow = {
  form: 'flow',
  save: 'make',
  call: 'make',
  case: 'uppercase',
  take: { text: { like: 'string' } },
  make: 'string',
}

export const makeTrimmed: Flow = {
  form: 'flow',
  save: 'make',
  call: 'make',
  case: 'trimmed',
  take: { text: { like: 'string' } },
  make: 'string',
}

// ─── Numeric transforms ───────────────────────────────────

export const makeSum: Flow = {
  form: 'flow',
  save: 'make',
  call: 'make',
  case: 'sum',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
  make: 'number',
}

export const makeDifference: Flow = {
  form: 'flow',
  save: 'make',
  call: 'make',
  case: 'difference',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
  make: 'number',
}

export const makeProduct: Flow = {
  form: 'flow',
  save: 'make',
  call: 'make',
  case: 'product',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
  make: 'number',
}

export const makeQuotient: Flow = {
  form: 'flow',
  save: 'make',
  call: 'make',
  case: 'quotient',
  take: {
    a: { like: 'number' },
    b: { like: 'number' },
  },
  make: 'number',
}

// ─── Host primitives ──────────────────────────────────────

export const makeNow: Flow = {
  form: 'flow',
  save: 'make',
  call: 'make',
  case: 'now',
  make: 'date',
}

export const makeUuid: Flow = {
  form: 'flow',
  save: 'make',
  call: 'make',
  case: 'uuid',
  make: 'string',
}
