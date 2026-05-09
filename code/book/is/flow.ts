/**
 * Hook implementations for the `is` verb's Flow declarations.
 *
 * Each export's name matches the corresponding Flow declared
 * in the sibling `make.ts`. Returns the Flow's `make` type
 * directly — primitive booleans, not wrapped in an envelope.
 */

// ─── Always-true / always-false ───────────────────────────

const alwaysTrue = (): boolean => true
const alwaysFalse = (): boolean => false

// ─── Type predicates ──────────────────────────────────────

const isString = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'string'

const isInteger = ({ thing }: { thing: unknown }): boolean =>
  Number.isInteger(thing)

const isDecimal = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'number' && !Number.isInteger(thing)

const isBoolean = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'boolean'

const isList = ({ thing }: { thing: unknown }): boolean =>
  Array.isArray(thing)

const isMap = ({ thing }: { thing: unknown }): boolean =>
  typeof thing === 'object' && thing !== null && !Array.isArray(thing)

const isNull = ({ thing }: { thing: unknown }): boolean =>
  thing == null

const isBlank = ({ thing }: { thing: unknown }): boolean =>
  thing == null || thing === ''

const isPresent = ({ thing }: { thing: unknown }): boolean =>
  thing != null && thing !== ''

// ─── Equality / comparison ────────────────────────────────

const isEqual = ({ a, b }: { a: unknown; b: unknown }): boolean => Object.is(a, b)

const isAbove = ({ a, b }: { a: any; b: any }): boolean => a > b

const isBelow = ({ a, b }: { a: any; b: any }): boolean => a < b

const isMin = ({ a, b }: { a: any; b: any }): boolean => a >= b

const isMax = ({ a, b }: { a: any; b: any }): boolean => a <= b

const isBetween = ({
  thing,
  min,
  max,
}: {
  thing: any
  min: any
  max: any
}): boolean => thing >= min && thing <= max

const isAmong = ({
  thing,
  choices,
}: {
  thing: unknown
  choices: unknown[]
}): boolean => choices.includes(thing)

// ─── Logical composition ──────────────────────────────────

const isAll = ({ things }: { things: boolean[] }): boolean =>
  Array.isArray(things) && things.every(Boolean)

const isAny = ({ things }: { things: boolean[] }): boolean =>
  Array.isArray(things) && things.some(Boolean)

const isOne = ({ things }: { things: boolean[] }): boolean =>
  Array.isArray(things) && things.filter(Boolean).length === 1

const isNot = ({ thing }: { thing: boolean }): boolean => !thing

// ─── String shape ─────────────────────────────────────────

const isLowercase = ({ text }: { text: string }): boolean =>
  text === text.toLowerCase()

const isUppercase = ({ text }: { text: string }): boolean =>
  text === text.toUpperCase()

const isSlug = ({ text }: { text: string }): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text)

const isUuid = ({ text }: { text: string }): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    text,
  )

const isEmail = ({ text }: { text: string }): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)

const isUrl = ({ text }: { text: string }): boolean => {
  try {
    new URL(text)
    return true
  } catch {
    return false
  }
}

// ─── Linguistic format predicates ─────────────────────────

const IPA_PATTERN = /^[\p{L}\p{M}ˈˌːʼʰ]+$/u

const isIpa = ({ text }: { text: string }): boolean =>
  IPA_PATTERN.test(text)

const isIpaBroad = ({ text }: { text: string }): boolean =>
  IPA_PATTERN.test(text)

const isIpaNarrow = ({ text }: { text: string }): boolean =>
  IPA_PATTERN.test(text)

// ─── Numeric predicates ───────────────────────────────────

const isPositive = ({ number }: { number: number }): boolean =>
  number > 0

const isNegative = ({ number }: { number: number }): boolean =>
  number < 0

const isZero = ({ number }: { number: number }): boolean =>
  number === 0

const isFinite = ({ number }: { number: number }): boolean =>
  Number.isFinite(number)

const isWhole = ({ number }: { number: number }): boolean =>
  Number.isInteger(number)

// ─── Cast-shape predicates ────────────────────────────────
//
// Each takes a Cast node and returns whether it conforms to a
// specific typed-literal / range shape. Used in `mold:` pipelines
// to gate which Cast values are allowed at a field.

/** Pattern characters in the query-system grammar.
 *  `*`, `?`, `~` outside of literal escape; `[abc]` character class;
 *  `\{name}` keyword reference. */
const PATTERN_CHARS_RE = /[*?~]|\[[^\]]+\]|\\\{[^}]+\}/

const hasPatternSyntax = (text: string): boolean =>
  PATTERN_CHARS_RE.test(text)

const isCastForm = (v: unknown, form: string): boolean =>
  v !== null &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  !(v instanceof Date) &&
  (v as { form?: unknown }).form === form

const isLiteralString = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'string')) return false
  const text = (thing as { text?: unknown }).text
  return typeof text === 'string' && !hasPatternSyntax(text)
}

const isStringPattern = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'string')) return false
  return typeof (thing as { text?: unknown }).text === 'string'
}

const isIntegerLiteral = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'integer')) return false
  return Number.isInteger((thing as { value?: unknown }).value)
}

const isIntegerRange = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'range')) return false
  return (thing as { like?: unknown }).like === 'integer'
}

const isDecimalLiteral = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'decimal')) return false
  return typeof (thing as { value?: unknown }).value === 'number'
}

const isDecimalRange = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'range')) return false
  return (thing as { like?: unknown }).like === 'decimal'
}

const isBooleanLiteral = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'boolean')) return false
  return typeof (thing as { value?: unknown }).value === 'boolean'
}

const isDateLiteral = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'date')) return false
  const value = (thing as { value?: unknown }).value
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}

const isDateRange = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'range')) return false
  return (thing as { like?: unknown }).like === 'date'
}

const isCodeLiteral = ({ thing }: { thing: unknown }): boolean => {
  if (!isCastForm(thing, 'code')) return false
  return typeof (thing as { text?: unknown }).text === 'string'
}


const flow = {
  'is:always_true': alwaysTrue,
  'is:always_false': alwaysFalse,
  'is:string': isString,
  'is:integer': isInteger,
  'is:decimal': isDecimal,
  'is:boolean': isBoolean,
  'is:list': isList,
  'is:map': isMap,
  'is:null': isNull,
  'is:blank': isBlank,
  'is:present': isPresent,
  'is:equal': isEqual,
  'is:above': isAbove,
  'is:below': isBelow,
  'is:min': isMin,
  'is:max': isMax,
  'is:between': isBetween,
  'is:among': isAmong,
  'is:all': isAll,
  'is:any': isAny,
  'is:one': isOne,
  'is:not': isNot,
  'is:lowercase': isLowercase,
  'is:uppercase': isUppercase,
  'is:slug': isSlug,
  'is:uuid': isUuid,
  'is:email': isEmail,
  'is:url': isUrl,
  'is:ipa': isIpa,
  'is:ipa:broad': isIpaBroad,
  'is:ipa:narrow': isIpaNarrow,
  'is:positive': isPositive,
  'is:negative': isNegative,
  'is:zero': isZero,
  'is:finite': isFinite,
  'is:whole': isWhole,
  'is:literal-string': isLiteralString,
  'is:string-pattern': isStringPattern,
  'is:integer-literal': isIntegerLiteral,
  'is:integer-range': isIntegerRange,
  'is:decimal-literal': isDecimalLiteral,
  'is:decimal-range': isDecimalRange,
  'is:boolean-literal': isBooleanLiteral,
  'is:date-literal': isDateLiteral,
  'is:date-range': isDateRange,
  'is:code-literal': isCodeLiteral,
}

export default flow
