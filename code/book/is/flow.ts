/**
 * Hook implementations for the `is` verb's Flow declarations.
 *
 * Each export's name matches the corresponding Flow declared
 * in the sibling `make.ts`. Returns the Flow's `make` type
 * directly — primitive booleans, not wrapped in an envelope.
 */

// ─── Always-true / always-false ───────────────────────────

export const always_true = (): boolean => true
export const always_false = (): boolean => false

// ─── Type predicates ──────────────────────────────────────

export const is_string = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'string'

export const is_integer = ({ thing }: { thing: unknown }): boolean =>
  Number.isInteger(thing)

export const is_decimal = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'number' && !Number.isInteger(thing)

export const is_boolean = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'boolean'

export const is_list = ({ thing }: { thing: unknown }): boolean =>
  Array.isArray(thing)

export const is_map = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'object' && thing !== null && !Array.isArray(thing)

export const is_null = ({ thing }: { thing: unknown }): boolean =>
  thing == null

export const is_blank = ({ thing }: { thing: unknown }): boolean =>
  thing == null || thing === ''

// ─── Equality / comparison ────────────────────────────────

export const is_equal = ({
  this: a,
  that: b,
}: {
  this: unknown
  that: unknown
}): boolean => Object.is(a, b)

export const is_above = ({
  this: a,
  that: b,
}: {
  this: any
  that: any
}): boolean => a > b

export const is_below = ({
  this: a,
  that: b,
}: {
  this: any
  that: any
}): boolean => a < b

export const is_min = ({
  this: a,
  that: b,
}: {
  this: any
  that: any
}): boolean => a >= b

export const is_max = ({
  this: a,
  that: b,
}: {
  this: any
  that: any
}): boolean => a <= b

export const is_between = ({
  thing,
  min,
  max,
}: {
  thing: any
  min: any
  max: any
}): boolean => thing >= min && thing <= max

export const is_among = ({
  thing,
  choices,
}: {
  thing: unknown
  choices: unknown[]
}): boolean => choices.includes(thing)

// ─── Logical composition ──────────────────────────────────

export const is_all = ({ things }: { things: boolean[] }): boolean =>
  things.every(Boolean)

export const is_any = ({ things }: { things: boolean[] }): boolean =>
  things.some(Boolean)

export const is_one = ({ things }: { things: boolean[] }): boolean =>
  things.filter(Boolean).length === 1

export const is_not = ({ thing }: { thing: boolean }): boolean => !thing

// ─── String shape ─────────────────────────────────────────

export const is_lowercase = ({ text }: { text: string }): boolean =>
  text === text.toLowerCase()

export const is_uppercase = ({ text }: { text: string }): boolean =>
  text === text.toUpperCase()

export const is_slug = ({ text }: { text: string }): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text)

export const is_uuid = ({ text }: { text: string }): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    text,
  )

export const is_email = ({ text }: { text: string }): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)

export const is_url = ({ text }: { text: string }): boolean => {
  try {
    new URL(text)
    return true
  } catch {
    return false
  }
}

// ─── Linguistic format predicates ─────────────────────────

const IPA_PATTERN = /^[\p{L}\p{M}ˈˌːʼʰ]+$/u

export const is_ipa = ({ text }: { text: string }): boolean =>
  IPA_PATTERN.test(text)

export const is_ipa_broad = ({ text }: { text: string }): boolean =>
  IPA_PATTERN.test(text)

export const is_ipa_narrow = ({ text }: { text: string }): boolean =>
  IPA_PATTERN.test(text)

// ─── Numeric predicates ───────────────────────────────────

export const is_positive = ({ number }: { number: number }): boolean =>
  number > 0

export const is_negative = ({ number }: { number: number }): boolean =>
  number < 0

export const is_zero = ({ number }: { number: number }): boolean =>
  number === 0

export const is_finite = ({ number }: { number: number }): boolean =>
  Number.isFinite(number)

export const is_whole = ({ number }: { number: number }): boolean =>
  Number.isInteger(number)
