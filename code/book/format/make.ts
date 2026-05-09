/**
 * Authored Flow declarations for the `format` verb.
 *
 * Text / number / date formatters that turn typed values into
 * display strings — used in i18n templates, table cells, and
 * any UI that needs locale-aware output.
 */

import type { Flow } from '@/form'

// ─── Number formatting ────────────────────────────────────

export const format_number: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'number',
  take: {
    value:    { like: 'number' },
    locale:   { like: 'string', need: false },
    minimum:  { like: 'integer', need: false },
    maximum:  { like: 'integer', need: false },
  },
  make: 'string',
}

export const format_currency: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'currency',
  take: {
    value:    { like: 'number' },
    currency: { like: 'string' },
    locale:   { like: 'string', need: false },
  },
  make: 'string',
}

export const format_percent: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'percent',
  take: {
    value:   { like: 'number' },
    locale:  { like: 'string', need: false },
    minimum: { like: 'integer', need: false },
    maximum: { like: 'integer', need: false },
  },
  make: 'string',
}

// ─── Date / time formatting ───────────────────────────────

export const format_date: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'date',
  take: {
    value:  { like: 'date' },
    locale: { like: 'string', need: false },
    style:  {
      like: 'string',
      take: ['full', 'long', 'medium', 'short'],
      need: false,
    },
  },
  make: 'string',
}

export const format_time: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'time',
  take: {
    value:  { like: 'date' },
    locale: { like: 'string', need: false },
    style:  {
      like: 'string',
      take: ['full', 'long', 'medium', 'short'],
      need: false,
    },
  },
  make: 'string',
}

export const format_relative: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'relative',
  take: {
    value:  { like: 'date' },
    locale: { like: 'string', need: false },
    now:    { like: 'date', need: false },
  },
  make: 'string',
}

// ─── Text shaping / joining ───────────────────────────────

export const format_capitalized: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'capitalized',
  take: { text: { like: 'string' } },
  make: 'string',
}

export const format_reversed: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'reversed',
  take: { text: { like: 'string' } },
  make: 'string',
}

export const format_joined: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'joined',
  take: {
    parts:     { like: 'string', list: true },
    separator: { like: 'string', need: false },
  },
  make: 'string',
}

export const format_split: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'split',
  take: {
    text:      { like: 'string' },
    separator: { like: 'string' },
  },
  make: { value: { like: 'string', list: true } },
}

export const format_replaced: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'replaced',
  take: {
    text:        { like: 'string' },
    pattern:     { like: 'string' },
    replacement: { like: 'string' },
  },
  make: 'string',
}

export const format_truncated: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'truncated',
  take: {
    text:    { like: 'string' },
    length:  { like: 'integer' },
    suffix:  { like: 'string', need: false },
  },
  make: 'string',
}

// ─── Plural-aware formatting ──────────────────────────────

export const format_plural: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  base: 'plural',
  take: {
    count:    { like: 'integer' },
    singular: { like: 'string' },
    plural:   { like: 'string' },
    locale:   { like: 'string', need: false },
  },
  make: 'string',
}
