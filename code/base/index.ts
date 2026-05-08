/**
 * The standard catalog's bundled `Code` type.
 *
 * This file is the kysely-style aggregate of every flow the
 * standard catalog ships. Every entry maps a flow's identity
 * tuple (encoded as a snake_case key) to its `{ take, like }`
 * signature.
 *
 * Hosts that bring their own catalog re-export their generated
 * `Code` from their own bundle and pass it as the `Base`
 * runtime class's type parameter.
 *
 * The entries below are a minimal seed set. The full catalog
 * (~115 flows across 9 verbs) is generated from declarations
 * once Phase 6 lands — see `note/roadmap.md`.
 */

export type Code = {
  // Always-true / always-false constants.
  always_true:  { take: Record<string, never>; like: boolean }
  always_false: { take: Record<string, never>; like: boolean }

  // Type predicates.
  is_string:  { take: { thing: unknown }; like: boolean }
  is_integer: { take: { thing: unknown }; like: boolean }
  is_decimal: { take: { thing: unknown }; like: boolean }
  is_boolean: { take: { thing: unknown }; like: boolean }
  is_list:    { take: { thing: unknown }; like: boolean }
  is_map:     { take: { thing: unknown }; like: boolean }
  is_null:    { take: { thing: unknown }; like: boolean }
  is_blank:   { take: { thing: unknown }; like: boolean }

  // Equality / comparison.
  is_equal:    { take: { this: unknown; that: unknown };           like: boolean }
  is_above:    { take: { this: unknown; that: unknown };           like: boolean }
  is_below:    { take: { this: unknown; that: unknown };           like: boolean }
  is_min:      { take: { this: unknown; that: unknown };           like: boolean }
  is_max:      { take: { this: unknown; that: unknown };           like: boolean }
  is_between:  { take: { thing: unknown; min: unknown; max: unknown }; like: boolean }
  is_among:    { take: { thing: unknown; choices: unknown[] };     like: boolean }

  // Logical composition.
  is_all: { take: { things: boolean[] }; like: boolean }
  is_any: { take: { things: boolean[] }; like: boolean }
  is_one: { take: { things: boolean[] }; like: boolean }
  is_not: { take: { thing: boolean };    like: boolean }

  // String shape.
  is_lowercase: { take: { text: string }; like: boolean }
  is_uppercase: { take: { text: string }; like: boolean }
  is_slug:      { take: { text: string }; like: boolean }
  is_uuid:      { take: { text: string }; like: boolean }
  is_email:     { take: { text: string }; like: boolean }
  is_url:       { take: { text: string }; like: boolean }

  // Linguistic format predicates (catalog-driven).
  is_ipa:        { take: { text: string }; like: boolean }
  is_ipa_broad:  { take: { text: string }; like: boolean }
  is_ipa_narrow: { take: { text: string }; like: boolean }

  // Numeric predicates.
  is_positive: { take: { number: number }; like: boolean }
  is_negative: { take: { number: number }; like: boolean }
  is_zero:     { take: { number: number }; like: boolean }
  is_finite:   { take: { number: number }; like: boolean }
  is_whole:    { take: { number: number }; like: boolean }

  // String transforms.
  make_lowercase: { take: { text: string }; like: string }
  make_uppercase: { take: { text: string }; like: string }
  make_trimmed:   { take: { text: string }; like: string }

  // Numeric transforms.
  make_sum:        { take: { a: number; b: number }; like: number }
  make_difference: { take: { a: number; b: number }; like: number }
  make_product:    { take: { a: number; b: number }; like: number }
  make_quotient:   { take: { a: number; b: number }; like: number }

  // Accessors.
  get_length: { take: { text: string }; like: number }
  get_count:  { take: { items: unknown[] }; like: number }
  get_first:  { take: { items: unknown[] }; like: unknown }
  get_last:   { take: { items: unknown[] }; like: unknown }

  // Aggregates.
  get_sum:      { take: { numbers: number[] }; like: number }
  get_average:  { take: { numbers: number[] }; like: number }
  get_smallest: { take: { numbers: number[] }; like: number }
  get_largest:  { take: { numbers: number[] }; like: number }
}

export default Code
