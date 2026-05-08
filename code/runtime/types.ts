/**
 * Type helpers for the `Book` runtime class.
 *
 * The `Base` interface is a kysely-style aggregate keyed by
 * the constant's exported name (`is_ipa_broad`, `make_sum`,
 * etc.). Each entry has shape `{ take: <input>; like: <output> }`.
 *
 * These helpers reverse-engineer the (name, base, case) triple
 * from each key so `book.flow('is', { base: 'ipa', case:
 * 'broad' }, ...)` infers args and return type from
 * `Base['is_ipa_broad']`.
 *
 * Convention: keys are `name`, `name_base`, or
 * `name_base_case` (snake-case, joined by `_`). The first
 * underscore-segment is the verb / flow name; the second is
 * the base; the rest is the case.
 */

/** Every entry in `R` carries `{ take, like }`. */
export type FlowEntryShape = { take: unknown; like: unknown }

/** All Flow keys in the registry. */
export type FlowKey<R> = string & keyof R

/** Extract the leading segment (the verb / flow name). */
export type FlowName<R> = {
  [K in keyof R]: K extends `${infer N}_${string}`
    ? N
    : K extends string
    ? K
    : never
}[keyof R] &
  string

/**
 * For a verb `N`, all valid base values.
 *
 * `Rest` is everything after `${N}_`. The base is `Rest`'s
 * leading segment (or `Rest` itself if no case follows).
 */
export type FlowBaseValue<R, N extends string> = {
  [K in keyof R]: K extends `${N}_${infer Rest}`
    ? Rest extends `${infer B}_${string}`
      ? B
      : Rest
    : never
}[keyof R] &
  string

/** For a (verb, base) pair, all valid case values. */
export type FlowCaseValue<
  R,
  N extends string,
  B extends string,
> = {
  [K in keyof R]: K extends `${N}_${B}_${infer C}` ? C : never
}[keyof R] &
  string

/** Resolve the registry entry from a (name, base?, case?) triple. */
export type FlowResolve<
  R,
  N extends string,
  B extends string | undefined,
  C extends string | undefined,
> = B extends string
  ? C extends string
    ? `${N}_${B}_${C}` extends keyof R
      ? R[`${N}_${B}_${C}`]
      : never
    : `${N}_${B}` extends keyof R
    ? R[`${N}_${B}`]
    : never
  : N extends keyof R
  ? R[N]
  : never

/** Pull the input shape from a registry entry. */
export type FlowTake<E> = E extends { take: infer T } ? T : never

/** Pull the return type from a registry entry. */
export type FlowLike<E> = E extends { like: infer L } ? L : never

/** Handler signature for a (name, base?, case?) registration. */
export type FlowHandler<
  R,
  N extends string,
  B extends string | undefined = undefined,
  C extends string | undefined = undefined,
> = (
  args: FlowTake<FlowResolve<R, N, B, C>>,
) => FlowLike<FlowResolve<R, N, B, C>>

/** Verbs that can be called with no base / no case. */
export type BareFlowName<R> = {
  [K in keyof R]: K extends `${string}_${string}` ? never : K
}[keyof R] &
  string

/** Flow registration options. */
export type FlowOptions<
  R,
  N extends string,
  B extends FlowBaseValue<R, N>,
  C extends FlowCaseValue<R, N, B>,
> = {
  base?: B
  case?: C
  like?: string
  take?: unknown
  async?: boolean
  pure?: boolean
  cancelable?: boolean
}
