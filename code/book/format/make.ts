/**
 * Authored Flow declarations for the `format` verb.
 *
 * Text / number / date formatters that turn typed values into
 * display strings — used in i18n templates, table cells, and
 * any UI that needs locale-aware output.
 */

import type { Flow } from '@/form'

// ─── Number formatting ────────────────────────────────────

export const formatNumber: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'number',
  take: {
    value:    { like: 'number' },
    locale:   { like: 'string', need: false },
    minimum:  { like: 'integer', need: false },
    maximum:  { like: 'integer', need: false },
  },
  make: 'string',
}

export const formatCurrency: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'currency',
  take: {
    value:    { like: 'number' },
    currency: { like: 'string' },
    locale:   { like: 'string', need: false },
  },
  make: 'string',
}

export const formatPercent: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'percent',
  take: {
    value:   { like: 'number' },
    locale:  { like: 'string', need: false },
    minimum: { like: 'integer', need: false },
    maximum: { like: 'integer', need: false },
  },
  make: 'string',
}

// ─── Date / time formatting ───────────────────────────────

export const formatDate: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'date',
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

export const formatTime: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'time',
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

export const formatRelative: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'relative',
  take: {
    value:  { like: 'date' },
    locale: { like: 'string', need: false },
    now:    { like: 'date', need: false },
  },
  make: 'string',
}

// ─── Text shaping / joining ───────────────────────────────

export const formatCapitalized: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'capitalized',
  take: { text: { like: 'string' } },
  make: 'string',
}

export const formatReversed: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'reversed',
  take: { text: { like: 'string' } },
  make: 'string',
}

export const formatJoined: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'joined',
  take: {
    parts:     { like: 'string', list: true },
    separator: { like: 'string', need: false },
  },
  make: 'string',
}

export const formatSplit: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'split',
  take: {
    text:      { like: 'string' },
    separator: { like: 'string' },
  },
  make: { value: { like: 'string', list: true } },
}

export const formatReplaced: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'replaced',
  take: {
    text:        { like: 'string' },
    pattern:     { like: 'string' },
    replacement: { like: 'string' },
  },
  make: 'string',
}

export const formatTruncated: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'truncated',
  take: {
    text:    { like: 'string' },
    length:  { like: 'integer' },
    suffix:  { like: 'string', need: false },
  },
  make: 'string',
}

// ─── Plural-aware formatting ──────────────────────────────

export const formatPlural: Flow = {
  form: 'flow',
  save: 'format',
  call: 'format',
  case: 'plural',
  take: {
    count:    { like: 'integer' },
    singular: { like: 'string' },
    plural:   { like: 'string' },
    locale:   { like: 'string', need: false },
  },
  make: 'string',
}
