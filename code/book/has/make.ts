/**
 * Authored Flow declarations for the `has` verb.
 *
 * Boolean possession predicates — given an object/list and a
 * key/value, return whether it's present.
 */

import type { Flow } from '@/form'

export const hasKey: Flow = {
  form: 'flow',
  save: 'has',
  call: 'has',
  case: 'key',
  take: {
    thing: { like: 'unknown' },
    key:   { like: 'string' },
  },
  make: 'boolean',
}

export const hasKeys: Flow = {
  form: 'flow',
  save: 'has',
  call: 'has',
  case: 'keys',
  take: {
    thing: { like: 'unknown' },
    keys:  { like: 'string', list: true },
  },
  make: 'boolean',
}

export const hasValue: Flow = {
  form: 'flow',
  save: 'has',
  call: 'has',
  case: 'value',
  take: {
    thing: { like: 'unknown' },
    value: { like: 'unknown' },
  },
  make: 'boolean',
}

export const hasItem: Flow = {
  form: 'flow',
  save: 'has',
  call: 'has',
  case: 'item',
  take: {
    items: { like: 'unknown', list: true },
    item:  { like: 'unknown' },
  },
  make: 'boolean',
}

export const hasPrefix: Flow = {
  form: 'flow',
  save: 'has',
  call: 'has',
  case: 'prefix',
  take: {
    text:   { like: 'string' },
    prefix: { like: 'string' },
  },
  make: 'boolean',
}

export const hasSuffix: Flow = {
  form: 'flow',
  save: 'has',
  call: 'has',
  case: 'suffix',
  take: {
    text:   { like: 'string' },
    suffix: { like: 'string' },
  },
  make: 'boolean',
}

export const hasSubstring: Flow = {
  form: 'flow',
  save: 'has',
  call: 'has',
  case: 'substring',
  take: {
    text:      { like: 'string' },
    substring: { like: 'string' },
  },
  make: 'boolean',
}

export const hasPattern: Flow = {
  form: 'flow',
  save: 'has',
  call: 'has',
  case: 'pattern',
  take: {
    text:    { like: 'string' },
    pattern: { like: 'string' },
  },
  make: 'boolean',
}
