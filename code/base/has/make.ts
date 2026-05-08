/**
 * Authored Flow declarations for the `has` verb.
 *
 * Boolean possession predicates — given an object/list and a
 * key/value, return whether it's present.
 */

import type { Flow } from '@/form'

export const has_key: Flow = {
  form: 'flow',
  call: 'has',
  base: 'key',
  take: {
    thing: { like: 'unknown' },
    key:   { like: 'string' },
  },
  make: 'boolean',
}

export const has_keys: Flow = {
  form: 'flow',
  call: 'has',
  base: 'keys',
  take: {
    thing: { like: 'unknown' },
    keys:  { like: 'string', list: true },
  },
  make: 'boolean',
}

export const has_value: Flow = {
  form: 'flow',
  call: 'has',
  base: 'value',
  take: {
    thing: { like: 'unknown' },
    value: { like: 'unknown' },
  },
  make: 'boolean',
}

export const has_item: Flow = {
  form: 'flow',
  call: 'has',
  base: 'item',
  take: {
    items: { like: 'unknown', list: true },
    item:  { like: 'unknown' },
  },
  make: 'boolean',
}

export const has_prefix: Flow = {
  form: 'flow',
  call: 'has',
  base: 'prefix',
  take: {
    text:   { like: 'string' },
    prefix: { like: 'string' },
  },
  make: 'boolean',
}

export const has_suffix: Flow = {
  form: 'flow',
  call: 'has',
  base: 'suffix',
  take: {
    text:   { like: 'string' },
    suffix: { like: 'string' },
  },
  make: 'boolean',
}

export const has_substring: Flow = {
  form: 'flow',
  call: 'has',
  base: 'substring',
  take: {
    text:      { like: 'string' },
    substring: { like: 'string' },
  },
  make: 'boolean',
}

export const has_pattern: Flow = {
  form: 'flow',
  call: 'has',
  base: 'pattern',
  take: {
    text:    { like: 'string' },
    pattern: { like: 'string' },
  },
  make: 'boolean',
}
