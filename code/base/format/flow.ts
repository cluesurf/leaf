/**
 * Hook implementations for the `format` verb.
 */

// ─── Number formatting ────────────────────────────────────

export const format_number = ({
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
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: minimum,
    maximumFractionDigits: maximum,
  }).format(value)

export const format_currency = ({
  value,
  currency,
  locale,
}: {
  value: number
  currency: string
  locale?: string
}): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
    value,
  )

export const format_percent = ({
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
  new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: minimum,
    maximumFractionDigits: maximum,
  }).format(value)

// ─── Date / time formatting ───────────────────────────────

type DateStyle = 'full' | 'long' | 'medium' | 'short'

export const format_date = ({
  value,
  locale,
  style,
}: {
  value: Date
  locale?: string
  style?: DateStyle
}): string =>
  new Intl.DateTimeFormat(locale, { dateStyle: style ?? 'medium' }).format(
    value,
  )

export const format_time = ({
  value,
  locale,
  style,
}: {
  value: Date
  locale?: string
  style?: DateStyle
}): string =>
  new Intl.DateTimeFormat(locale, { timeStyle: style ?? 'short' }).format(
    value,
  )

export const format_relative = ({
  value,
  locale,
  now,
}: {
  value: Date
  locale?: string
  now?: Date
}): string => {
  const reference = now ?? new Date()
  const diffMs = value.getTime() - reference.getTime()
  const seconds = Math.round(diffMs / 1000)

  const buckets: [number, Intl.RelativeTimeFormatUnit][] = [
    [60,                  'second'],
    [60 * 60,             'minute'],
    [60 * 60 * 24,        'hour'],
    [60 * 60 * 24 * 30,   'day'],
    [60 * 60 * 24 * 365,  'month'],
    [Infinity,            'year'],
  ]

  let unit: Intl.RelativeTimeFormatUnit = 'second'
  let value_in_unit = seconds
  let prevLimit = 1
  for (const [limit, u] of buckets) {
    if (Math.abs(seconds) < limit) {
      value_in_unit = Math.round(seconds / prevLimit)
      unit = u
      break
    }
    prevLimit = limit
  }

  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
    value_in_unit,
    unit,
  )
}

// ─── Text shaping / joining ───────────────────────────────

export const format_capitalized = ({ text }: { text: string }): string =>
  text.length === 0 ? text : text[0]!.toUpperCase() + text.slice(1)

export const format_reversed = ({ text }: { text: string }): string =>
  Array.from(text).reverse().join('')

export const format_joined = ({
  parts,
  separator,
}: {
  parts: string[]
  separator?: string
}): string => parts.join(separator ?? '')

export const format_split = ({
  text,
  separator,
}: {
  text: string
  separator: string
}): { value: string[] } => ({ value: text.split(separator) })

export const format_replaced = ({
  text,
  pattern,
  replacement,
}: {
  text: string
  pattern: string
  replacement: string
}): string => text.split(pattern).join(replacement)

export const format_truncated = ({
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

// ─── Plural-aware formatting ──────────────────────────────

export const format_plural = ({
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
  const rule = new Intl.PluralRules(locale).select(count)
  return rule === 'one' ? singular : plural
}
