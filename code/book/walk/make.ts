/**
 * Authored Flow declarations for the `walk` verb.
 *
 * Array transforms — map / filter / reduce / flat-map. Each
 * takes an `items` list and a per-item lambda. The lambda
 * runs eagerly: callers pass an already-resolved value or use
 * the AST-side `walk` primitive (`make.walk` etc.) for true
 * scoped iteration.
 *
 * Naming note: there's both an AST `walk` primitive (a fold-
 * tree node form) AND this catalog `walk` verb. They share
 * the name; usage context disambiguates.
 */

import type { Flow } from '@/form'

export const walkMap: Flow = {
  form: 'flow',
  save: 'walk',
  call: 'walk',
  case: 'map',
  take: {
    items: { like: 'unknown', list: true },
    yield: { like: 'unknown' },     // pre-resolved per-item value
  },
  make: 'unknown',
}

export const walkFilter: Flow = {
  form: 'flow',
  save: 'walk',
  call: 'walk',
  case: 'filter',
  take: {
    items: { like: 'unknown', list: true },
    test: { like: 'unknown' },      // pre-resolved per-item boolean (or boolean[])
  },
  make: 'unknown',
}

export const walkReduce: Flow = {
  form: 'flow',
  save: 'walk',
  call: 'walk',
  case: 'reduce',
  take: {
    items: { like: 'unknown', list: true },
    initial: { like: 'unknown' },
    yield: { like: 'unknown' },
  },
  make: 'unknown',
}

export const walkChunk: Flow = {
  form: 'flow',
  save: 'walk',
  call: 'walk',
  case: 'chunk',
  take: {
    items: { like: 'unknown', list: true },
    size: { like: 'natural_number' },
  },
  make: 'unknown',
}

export const walkDistinct: Flow = {
  form: 'flow',
  save: 'walk',
  call: 'walk',
  case: 'distinct',
  take: {
    items: { like: 'unknown', list: true },
  },
  make: 'unknown',
}
