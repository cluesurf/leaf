/**
 * Type helpers for the `Base` runtime class.
 *
 * The `Code` interface is a kysely-style aggregate keyed by
 * each entry's colon-namespaced identity:
 *
 *   - Flows: `'flow:<name>:<base?>:<case?>'`
 *   - Forms: `'form:<cast>:<call?>:<case?>'`
 *
 * Each Flow entry has shape `{ take: <input>; make: <output> }`.
 *
 * These helpers reverse-engineer the (name, base, case) triple
 * from each Flow key so:
 *
 *   base.flow('is', { base: 'ipa', case: 'broad' }, ...)
 *
 * infers args and return type from
 * `Code['flow:is:ipa:broad']`.
 */

/** Every Flow entry carries `{ take, make }`. */
export type FlowEntryShape = { take: unknown; make: unknown }

/** All Flow keys in the registry. */
export type FlowKey<R> = string & keyof R

/**
 * Extract the verb / flow name (the segment immediately
 * after the `flow:` prefix).
 */
export type FlowName<R> = {
  [K in keyof R]: K extends `flow:${infer N}:${string}`
    ? N
    : K extends `flow:${infer N}`
      ? N
      : never
}[keyof R] &
  string

/**
 * For a verb `N`, all valid base values (the segment after
 * `flow:<N>:`).
 */
export type FlowBaseValue<R, N extends string> = {
  [K in keyof R]: K extends `flow:${N}:${infer Rest}`
    ? Rest extends `${infer B}:${string}`
      ? B
      : Rest
    : never
}[keyof R] &
  string

/** For a (verb, base) pair, all valid case values. */
export type FlowCaseValue<R, N extends string, B extends string> = {
  [K in keyof R]: K extends `flow:${N}:${B}:${infer C}` ? C : never
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
    ? `flow:${N}:${B}:${C}` extends keyof R
      ? R[`flow:${N}:${B}:${C}`]
      : never
    : `flow:${N}:${B}` extends keyof R
      ? R[`flow:${N}:${B}`]
      : never
  : `flow:${N}` extends keyof R
    ? R[`flow:${N}`]
    : never

/** Pull the input shape from a registry entry. */
export type FlowTake<E> = E extends { take: infer T } ? T : never

/** Pull the output / return type from a registry entry. */
export type FlowLike<E> = E extends { make: infer M } ? M : never

/** Hook signature for a (name, base?, case?) registration. */
export type FlowHook<
  R,
  N extends string,
  B extends string | undefined = undefined,
  C extends string | undefined = undefined,
> = (
  args: FlowTake<FlowResolve<R, N, B, C>>,
) => FlowLike<FlowResolve<R, N, B, C>>

/** Verbs callable with no base / no case (bare `flow:<N>` keys). */
export type BareFlowName<R> = {
  [K in keyof R]: K extends `flow:${infer N}`
    ? N extends `${string}:${string}`
      ? never
      : N
    : never
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
}
