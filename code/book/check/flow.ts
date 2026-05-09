/**
 * AST built-in operators. The runtime falls back to this map
 * when no host Book has registered a matching `'flow:<path>'`
 * handler. Keys are the colon-scoped Flow paths the AST
 * builders (`cast.eq`, `cast.gt`, …) emit.
 *
 * This is the **internal default** for the Fold renderer. The
 * standard book's per-verb files (`is/`, `make/`, `format/`,
 * `get/`) carry the public Flow declarations + handlers; this
 * map exists for AST evaluation when no Book is loaded.
 */

import { deepEq } from '@/tool'

// ---------------------------------------------------------------------------
// Predicates
// ---------------------------------------------------------------------------

const eq = ({ a, b }: Record<string, unknown>) => deepEq(a, b)

const ne = ({ a, b }: Record<string, unknown>) => !deepEq(a, b)

const gt = ({ a, b, subject }: Record<string, unknown>) =>
  Number((a ?? subject) as number) > Number(b as number)

const gte = ({ a, b, subject }: Record<string, unknown>) =>
  Number((a ?? subject) as number) >= Number(b as number)

const lt = ({ a, b, subject }: Record<string, unknown>) =>
  Number((a ?? subject) as number) < Number(b as number)

const lte = ({ a, b, subject }: Record<string, unknown>) =>
  Number((a ?? subject) as number) <= Number(b as number)

const inOf = ({
  value,
  list,
  subject,
}: Record<string, unknown>) => {
  const v = value ?? subject
  return Array.isArray(list) && list.some(item => deepEq(item, v))
}

const negate = ({ value }: Record<string, unknown>) => !value

const and = ({ things }: Record<string, unknown>) =>
  Array.isArray(things) && things.every(Boolean)

const or = ({ things }: Record<string, unknown>) =>
  Array.isArray(things) && things.some(Boolean)

const isNull = ({ value }: Record<string, unknown>) =>
  value == null

const isEmpty = ({ value }: Record<string, unknown>) => {
  if (value == null) return true
  if (typeof value === 'string') return value.length === 0
  if (Array.isArray(value)) return value.length === 0
  return false
}

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

const count = ({ list }: Record<string, unknown>) =>
  Array.isArray(list) ? list.length : 0

const sum = ({ list }: Record<string, unknown>) =>
  Array.isArray(list) ? list.reduce((s, n) => s + Number(n), 0) : 0

const mean = ({ list }: Record<string, unknown>) => {
  if (!Array.isArray(list) || list.length === 0) return 0
  return list.reduce((s, n) => s + Number(n), 0) / list.length
}

const min = ({ list }: Record<string, unknown>) =>
  Array.isArray(list) ? Math.min(...list.map(n => Number(n))) : 0

const max = ({ list }: Record<string, unknown>) =>
  Array.isArray(list) ? Math.max(...list.map(n => Number(n))) : 0

const length = ({ value }: Record<string, unknown>) =>
  value == null ? 0 : String(value).length

// ---------------------------------------------------------------------------
// Plural-rule lookup (returns 'zero' | 'one' | 'two' | 'few' | 'many' | 'other')
// ---------------------------------------------------------------------------
//
// Distinct from `format:plural` (which picks between caller-
// supplied singular/plural strings). This is the rule-string
// AST primitive used by `cast.plural(value)` and `cast.match(...)`
// arms keyed on plural categories.

import type { HandlerContext } from '@/render'

const DEFAULT_LOCALE = 'en'

const readLocale = (context?: HandlerContext): string => {
  const v = context?.scope.get('locale')
  return typeof v === 'string' ? v : DEFAULT_LOCALE
}

const plural = (
  { value }: Record<string, unknown>,
  context?: HandlerContext,
) => new Intl.PluralRules(readLocale(context)).select(Number(value))


const flow = {
  // is: predicates
  'is:equal': eq,
  'is:not:equal': ne,
  'is:above': gt,
  'is:min': gte,
  'is:below': lt,
  'is:max': lte,
  'is:among': inOf,
  'is:not': negate,
  'is:all': and,
  'is:any': or,
  'is:null': isNull,
  'is:empty': isEmpty,

  // get: accessors / aggregates
  count,
  sum,
  'get:mean': mean,
  'get:smallest': min,
  'get:largest': max,
  'get:length': length,

  // plural-rule lookup (paired with `cast.plural(value)`)
  plural,
}

export default flow
