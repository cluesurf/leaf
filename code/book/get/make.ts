/**
 * Authored Flow declarations for the `get` verb.
 *
 * Identity is `(call, base?, case?)`. Inline `take` shapes
 * are LinkMesh records; primitive `make` outputs are string
 * refs.
 */

import type { Flow } from '@/form'

// ─── Accessors ────────────────────────────────────────────

export const getLength: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  case: 'length',
  take: { text: { like: 'string' } },
  make: 'number',
}

export const getCount: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  case: 'count',
  take: { items: { like: 'unknown', list: true } },
  make: 'number',
}

export const getFirst: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  case: 'first',
  take: { items: { like: 'unknown', list: true } },
  make: 'unknown',
}

export const getLast: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  case: 'last',
  take: { items: { like: 'unknown', list: true } },
  make: 'unknown',
}

// ─── Aggregates ───────────────────────────────────────────

export const getSum: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  case: 'sum',
  take: { numbers: { like: 'number', list: true } },
  make: 'number',
}

export const getAverage: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  case: 'average',
  take: { numbers: { like: 'number', list: true } },
  make: 'number',
}

export const getSmallest: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  case: 'smallest',
  take: { numbers: { like: 'number', list: true } },
  make: 'number',
}

export const getLargest: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  case: 'largest',
  take: { numbers: { like: 'number', list: true } },
  make: 'number',
}
