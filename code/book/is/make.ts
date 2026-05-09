/**
 * Authored Flow declarations for the `is` verb.
 *
 * Identity is `(call, base?, case?)`. Inline `take` shapes
 * are LinkMesh records; primitive `make` outputs are string
 * refs to the type name.
 */

import type { Flow } from '@/form'

// ─── Always-true / always-false ───────────────────────────

export const always_true: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'always_true',
  make: 'boolean',
}

export const always_false: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'always_false',
  make: 'boolean',
}

// ─── Type predicates ──────────────────────────────────────

export const is_string: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'string',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const is_integer: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'integer',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const is_decimal: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'decimal',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const is_boolean: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'boolean',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const is_list: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'list',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const is_map: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'map',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const is_null: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'null',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const is_blank: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'blank',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

// ─── Equality / comparison ────────────────────────────────

export const is_equal: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'equal',
  take: {
    this: { like: 'unknown' },
    that: { like: 'unknown' },
  },
  make: 'boolean',
}

export const is_above: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'above',
  take: {
    this: { like: 'unknown' },
    that: { like: 'unknown' },
  },
  make: 'boolean',
}

export const is_below: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'below',
  take: {
    this: { like: 'unknown' },
    that: { like: 'unknown' },
  },
  make: 'boolean',
}

export const is_min: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'min',
  take: {
    this: { like: 'unknown' },
    that: { like: 'unknown' },
  },
  make: 'boolean',
}

export const is_max: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'max',
  take: {
    this: { like: 'unknown' },
    that: { like: 'unknown' },
  },
  make: 'boolean',
}

export const is_between: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'between',
  take: {
    thing: { like: 'unknown' },
    min:   { like: 'unknown' },
    max:   { like: 'unknown' },
  },
  make: 'boolean',
}

export const is_among: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'among',
  take: {
    thing:   { like: 'unknown' },
    choices: { like: 'unknown', list: true },
  },
  make: 'boolean',
}

// ─── Logical composition ──────────────────────────────────

export const is_all: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'all',
  take: {
    things: { like: 'boolean', list: true },
  },
  make: 'boolean',
}

export const is_any: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'any',
  take: {
    things: { like: 'boolean', list: true },
  },
  make: 'boolean',
}

export const is_one: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'one',
  take: {
    things: { like: 'boolean', list: true },
  },
  make: 'boolean',
}

export const is_not: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'not',
  take: {
    thing: { like: 'boolean' },
  },
  make: 'boolean',
}

// ─── String shape ─────────────────────────────────────────

export const is_lowercase: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'lowercase',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const is_uppercase: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'uppercase',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const is_slug: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'slug',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const is_uuid: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'uuid',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const is_email: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'email',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const is_url: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'url',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

// ─── Linguistic format predicates ─────────────────────────

export const is_ipa: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'ipa',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const is_ipa_broad: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'ipa',
  case: 'broad',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const is_ipa_narrow: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'ipa',
  case: 'narrow',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

// ─── Numeric predicates ───────────────────────────────────

export const is_positive: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'positive',
  take: { number: { like: 'number' } },
  make: 'boolean',
}

export const is_negative: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'negative',
  take: { number: { like: 'number' } },
  make: 'boolean',
}

export const is_zero: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'zero',
  take: { number: { like: 'number' } },
  make: 'boolean',
}

export const is_finite: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'finite',
  take: { number: { like: 'number' } },
  make: 'boolean',
}

export const is_whole: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  base: 'whole',
  take: { number: { like: 'number' } },
  make: 'boolean',
}
