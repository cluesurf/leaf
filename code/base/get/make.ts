/**
 * Authored Flow declarations for the `get` verb.
 *
 * Identity is `(call, base?, case?)`. Inline `take` shapes
 * are LinkMesh records; primitive `make` outputs are string
 * refs.
 */

import type { Flow } from '@/form'

// ─── Accessors ────────────────────────────────────────────

export const get_length: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  base: 'length',
  take: { text: { like: 'string' } },
  make: 'number',
}

export const get_count: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  base: 'count',
  take: { items: { like: 'unknown', list: true } },
  make: 'number',
}

export const get_first: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  base: 'first',
  take: { items: { like: 'unknown', list: true } },
  make: 'unknown',
}

export const get_last: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  base: 'last',
  take: { items: { like: 'unknown', list: true } },
  make: 'unknown',
}

// ─── Aggregates ───────────────────────────────────────────

export const get_sum: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  base: 'sum',
  take: { numbers: { like: 'number', list: true } },
  make: 'number',
}

export const get_average: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  base: 'average',
  take: { numbers: { like: 'number', list: true } },
  make: 'number',
}

export const get_smallest: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  base: 'smallest',
  take: { numbers: { like: 'number', list: true } },
  make: 'number',
}

export const get_largest: Flow = {
  form: 'flow',
  save: 'get',
  call: 'get',
  base: 'largest',
  take: { numbers: { like: 'number', list: true } },
  make: 'number',
}
