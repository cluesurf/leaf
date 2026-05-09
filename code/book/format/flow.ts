/**
 * Hook implementations for the `format` verb.
 *
 * Locale-aware operators are backed by `@formatjs/intl`, which
 * wraps the native `Intl.*` constructors with cross-engine
 * quirk smoothing and per-locale instance caching. Constructing
 * `Intl.NumberFormat` etc. is expensive (~100 µs); a page can
 * render hundreds of values, so the cache keeps subsequent
 * calls cheap.
 */

import {
  createIntl,
  createIntlCache,
  type IntlShape,
} from '@formatjs/intl'

const intlCache = createIntlCache()
const intlByLocale = new Map<string, IntlShape>()
const DEFAULT_LOCALE = 'en'

function getIntl(locale: string | undefined): IntlShape {
  const key = locale ?? DEFAULT_LOCALE
  let intl = intlByLocale.get(key)
  if (!intl) {
    intl = createIntl({ locale: key, messages: {} }, intlCache)
    intlByLocale.set(key, intl)
  }
  return intl
}

// ─── Number formatting ────────────────────────────────────

const formatNumber = ({
  value,
  locale,
  minimum,
  maximum,
}: {
  value: number
  locale?: string
  minimum?: number
  maximum?: number
}): string =>
  getIntl(locale).formatNumber(value, {
    minimumFractionDigits: minimum,
    maximumFractionDigits: maximum,
  })

const formatCurrency = ({
  value,
  currency,
  locale,
}: {
  value: number
  currency: string
  locale?: string
}): string =>
  getIntl(locale).formatNumber(value, {
    style: 'currency',
    currency,
  })

const formatPercent = ({
  value,
  locale,
  minimum,
  maximum,
}: {
  value: number
  locale?: string
  minimum?: number
  maximum?: number
}): string =>
  getIntl(locale).formatNumber(value, {
    style: 'percent',
    minimumFractionDigits: minimum,
    maximumFractionDigits: maximum,
  })

// ─── Date / time formatting ───────────────────────────────

type DateStyle = 'full' | 'long' | 'medium' | 'short'

const formatDate = ({
  value,
  locale,
  style,
}: {
  value: Date
  locale?: string
  style?: DateStyle
}): string =>
  getIntl(locale).formatDate(value, { dateStyle: style ?? 'medium' })

const formatTime = ({
  value,
  locale,
  style,
}: {
  value: Date
  locale?: string
  style?: DateStyle
}): string =>
  getIntl(locale).formatTime(value, { timeStyle: style ?? 'short' })

const formatRelative = ({
  value,
  locale,
  now,
}: {
  value: Date
  locale?: string
  now?: Date
}): string => {
  const reference = now ?? new Date()
  const seconds = Math.round(
    (value.getTime() - reference.getTime()) / 1000,
  )

  const buckets: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60 * 60, 'minute'],
    [60 * 60 * 24, 'hour'],
    [60 * 60 * 24 * 30, 'day'],
    [60 * 60 * 24 * 365, 'month'],
    [Infinity, 'year'],
  ]

  let unit: Intl.RelativeTimeFormatUnit = 'second'
  let valueInUnit = seconds
  let prevLimit = 1
  for (const [limit, u] of buckets) {
    if (Math.abs(seconds) < limit) {
      valueInUnit = Math.round(seconds / prevLimit)
      unit = u
      break
    }
    prevLimit = limit
  }

  return getIntl(locale).formatRelativeTime(valueInUnit, unit, {
    numeric: 'auto',
  })
}

// ─── Text shaping / joining ───────────────────────────────

const formatCapitalized = ({ text }: { text: string }): string =>
  text.length === 0 ? text : text[0]!.toUpperCase() + text.slice(1)

const formatReversed = ({ text }: { text: string }): string =>
  Array.from(text).reverse().join('')

const formatJoined = ({
  parts,
  separator,
}: {
  parts: string[]
  separator?: string
}): string => parts.join(separator ?? '')

const formatSplit = ({
  text,
  separator,
}: {
  text: string
  separator: string
}): { value: string[] } => ({ value: text.split(separator) })

const formatReplaced = ({
  text,
  pattern,
  replacement,
}: {
  text: string
  pattern: string
  replacement: string
}): string => text.split(pattern).join(replacement)

const formatTruncated = ({
  text,
  length,
  suffix,
}: {
  text: string
  length: number
  suffix?: string
}): string => {
  if (text.length <= length) return text
  const suf = suffix ?? '…'
  return text.slice(0, Math.max(0, length - suf.length)) + suf
}

// ─── Locale-sensitive case conversion ─────────────────────
//
// Plain `String.prototype.toLocaleLowerCase` / `toLocaleUpperCase`
// are already cache-free. No Intl object needed.

const formatLowercase = ({
  text,
  locale,
}: {
  text: string
  locale?: string
}): string =>
  String(text ?? '').toLocaleLowerCase(locale ?? DEFAULT_LOCALE)

const formatUppercase = ({
  text,
  locale,
}: {
  text: string
  locale?: string
}): string =>
  String(text ?? '').toLocaleUpperCase(locale ?? DEFAULT_LOCALE)

// ─── Plural-aware formatting ──────────────────────────────
//
// User-facing plural chooser. Distinct from the bare `plural`
// AST operator (in `book/check/flow.ts`) which returns the
// rule string ('one' / 'other' / etc).

const formatPlural = ({
  count,
  singular,
  plural,
  locale,
}: {
  count: number
  singular: string
  plural: string
  locale?: string
}): string => {
  const rule = getIntl(locale).formatPlural(count)
  return rule === 'one' ? singular : plural
}


const flow = {
  'format:number': formatNumber,
  'format:currency': formatCurrency,
  'format:percent': formatPercent,
  'format:date': formatDate,
  'format:time': formatTime,
  'format:relative': formatRelative,
  'format:capitalized': formatCapitalized,
  'format:reversed': formatReversed,
  'format:joined': formatJoined,
  'format:split': formatSplit,
  'format:replaced': formatReplaced,
  'format:truncated': formatTruncated,
  'format:plural': formatPlural,
  'format:lowercase': formatLowercase,
  'format:uppercase': formatUppercase,
}

export default flow
