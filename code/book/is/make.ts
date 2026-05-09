/**
 * Authored Flow declarations for the `is` verb.
 *
 * Identity is `(call, base?, case?)`. Inline `take` shapes
 * are LinkMesh records; primitive `make` outputs are string
 * refs to the type name.
 */

import type { Flow } from '@/form'

// ─── Always-true / always-false ───────────────────────────

export const alwaysTrue: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'always_true',
  make: 'boolean',
}

export const alwaysFalse: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'always_false',
  make: 'boolean',
}

// ─── Type predicates ──────────────────────────────────────

export const isString: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'string',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const isInteger: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'integer',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const isDecimal: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'decimal',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const isBoolean: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'boolean',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const isList: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'list',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const isMap: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'map',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const isNull: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'null',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const isBlank: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'blank',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

export const isPresent: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'present',
  take: { thing: { like: 'unknown' } },
  make: 'boolean',
}

// ─── Equality / comparison ────────────────────────────────

export const isEqual: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'equal',
  take: {
    a: { like: 'unknown' },
    b: { like: 'unknown' },
  },
  make: 'boolean',
}

export const isAbove: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'above',
  take: {
    a: { like: 'unknown' },
    b: { like: 'unknown' },
  },
  make: 'boolean',
}

export const isBelow: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'below',
  take: {
    a: { like: 'unknown' },
    b: { like: 'unknown' },
  },
  make: 'boolean',
}

export const isMin: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'min',
  take: {
    a: { like: 'unknown' },
    b: { like: 'unknown' },
  },
  make: 'boolean',
}

export const isMax: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'max',
  take: {
    a: { like: 'unknown' },
    b: { like: 'unknown' },
  },
  make: 'boolean',
}

export const isBetween: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'between',
  take: {
    thing: { like: 'unknown' },
    min:   { like: 'unknown' },
    max:   { like: 'unknown' },
  },
  make: 'boolean',
}

export const isAmong: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'among',
  take: {
    thing:   { like: 'unknown' },
    choices: { like: 'unknown', list: true },
  },
  make: 'boolean',
}

// ─── Logical composition ──────────────────────────────────

export const isAll: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'all',
  take: {
    things: { like: 'boolean', list: true },
  },
  make: 'boolean',
}

export const isAny: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'any',
  take: {
    things: { like: 'boolean', list: true },
  },
  make: 'boolean',
}

export const isOne: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'one',
  take: {
    things: { like: 'boolean', list: true },
  },
  make: 'boolean',
}

export const isNot: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'not',
  take: {
    thing: { like: 'boolean' },
  },
  make: 'boolean',
}

// ─── String shape ─────────────────────────────────────────

export const isLowercase: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'lowercase',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const isUppercase: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'uppercase',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const isSlug: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'slug',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const isUuid: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'uuid',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const isEmail: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'email',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const isUrl: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'url',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

// ─── Linguistic format predicates ─────────────────────────

export const isIpa: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'ipa',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const isIpaBroad: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'ipa:broad',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

export const isIpaNarrow: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'ipa:narrow',
  take: { text: { like: 'string' } },
  make: 'boolean',
}

// ─── Numeric predicates ───────────────────────────────────

export const isPositive: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'positive',
  take: { number: { like: 'number' } },
  make: 'boolean',
}

export const isNegative: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'negative',
  take: { number: { like: 'number' } },
  make: 'boolean',
}

export const isZero: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'zero',
  take: { number: { like: 'number' } },
  make: 'boolean',
}

export const isFinite: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'finite',
  take: { number: { like: 'number' } },
  make: 'boolean',
}

export const isWhole: Flow = {
  form: 'flow',
  save: 'is',
  call: 'is',
  case: 'whole',
  take: { number: { like: 'number' } },
  make: 'boolean',
}
