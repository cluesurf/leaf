/**
 * Hook implementations for the `is` verb's Flow declarations.
 *
 * Each export's name matches the corresponding Flow declared
 * in the sibling `make.ts`. Returns the Flow's `make` type
 * directly — primitive booleans, not wrapped in an envelope.
 */

// ─── Always-true / always-false ───────────────────────────

export const alwaysTrue = (): boolean => true
export const alwaysFalse = (): boolean => false

// ─── Type predicates ──────────────────────────────────────

export const isString = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'string'

export const isInteger = ({ thing }: { thing: unknown }): boolean =>
  Number.isInteger(thing)

export const isDecimal = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'number' && !Number.isInteger(thing)

export const isBoolean = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'boolean'

export const isList = ({ thing }: { thing: unknown }): boolean =>
  Array.isArray(thing)

export const isMap = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'object' && thing !== null && !Array.isArray(thing)

export const isNull = ({ thing }: { thing: unknown }): boolean =>
  thing == null

export const isBlank = ({ thing }: { thing: unknown }): boolean =>
  thing == null || thing === ''

// ─── Equality / comparison ────────────────────────────────

export const isEqual = ({
  this: a,
  that: b,
}: {
  this: unknown
  that: unknown
}): boolean => Object.is(a, b)

export const isAbove = ({
  this: a,
  that: b,
}: {
  this: any
  that: any
}): boolean => a > b

export const isBelow = ({
  this: a,
  that: b,
}: {
  this: any
  that: any
}): boolean => a < b

export const isMin = ({
  this: a,
  that: b,
}: {
  this: any
  that: any
}): boolean => a >= b

export const isMax = ({
  this: a,
  that: b,
}: {
  this: any
  that: any
}): boolean => a <= b

export const isBetween = ({
  thing,
  min,
  max,
}: {
  thing: any
  min: any
  max: any
}): boolean => thing >= min && thing <= max

export const isAmong = ({
  thing,
  choices,
}: {
  thing: unknown
  choices: unknown[]
}): boolean => choices.includes(thing)

// ─── Logical composition ──────────────────────────────────

export const isAll = ({ things }: { things: boolean[] }): boolean =>
  things.every(Boolean)

export const isAny = ({ things }: { things: boolean[] }): boolean =>
  things.some(Boolean)

export const isOne = ({ things }: { things: boolean[] }): boolean =>
  things.filter(Boolean).length === 1

export const isNot = ({ thing }: { thing: boolean }): boolean => !thing

// ─── String shape ─────────────────────────────────────────

export const isLowercase = ({ text }: { text: string }): boolean =>
  text === text.toLowerCase()

export const isUppercase = ({ text }: { text: string }): boolean =>
  text === text.toUpperCase()

export const isSlug = ({ text }: { text: string }): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text)

export const isUuid = ({ text }: { text: string }): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    text,
  )

export const isEmail = ({ text }: { text: string }): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)

export const isUrl = ({ text }: { text: string }): boolean => {
  try {
    new URL(text)
    return true
  } catch {
    return false
  }
}

// ─── Linguistic format predicates ─────────────────────────

const IPA_PATTERN = /^[\p{L}\p{M}ˈˌːʼʰ]+$/u

export const isIpa = ({ text }: { text: string }): boolean =>
  IPA_PATTERN.test(text)

export const isIpaBroad = ({ text }: { text: string }): boolean =>
  IPA_PATTERN.test(text)

export const isIpaNarrow = ({ text }: { text: string }): boolean =>
  IPA_PATTERN.test(text)

// ─── Numeric predicates ───────────────────────────────────

export const isPositive = ({ number }: { number: number }): boolean =>
  number > 0

export const isNegative = ({ number }: { number: number }): boolean =>
  number < 0

export const isZero = ({ number }: { number: number }): boolean =>
  number === 0

export const isFinite = ({ number }: { number: number }): boolean =>
  Number.isFinite(number)

export const isWhole = ({ number }: { number: number }): boolean =>
  Number.isInteger(number)
