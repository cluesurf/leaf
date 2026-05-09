import type { Cast } from '@/cast'

/**
 * A `Book` is a published bundle of declarations. Three slots:
 *
 *  - `cast` — the array of declarations (Form / Flow / Fold /
 *    Hash / List). Codegen dispatches each by its `form:`
 *    discriminant.
 *  - `call` — runtime hook implementations, keyed by each
 *    Flow's exported-constant name (e.g. `is_ipa_broad`).
 *  - `code` — the generated CodeLink table mapping colon-keyed
 *    flow ids to integer ids for compiled-call dispatch.
 *
 * Optional `host` + `name` are bundle-level metadata.
 */
export type Book = {
  host?: string
  name?: string
  make?: Make[]
  /**
   * Flow handlers keyed by colon-scoped Flow path. The key
   * matches a `Flow` declaration's `(call, case?)` joined with
   * `:`. Examples: `'is:string'`, `'is:ipa:broad'`, `'fork'`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flow?: Record<string, (input: any, context?: any) => unknown>
  /** Generated `CodeLink` integer-id table. */
  code?: Record<string, number>
  /**
   * View components keyed by view name (`'callout'`, `'page'`,
   * etc.). Wired into element-mode rendering when the Base is
   * configured with `createElement`.
   */
  view?: Record<string, unknown>
}

/**
 * `Make` is the umbrella for every top-level declaration —
 * Form / Flow / Fold / Hash / List. The schema-level kind tag.
 *
 * Distinct from `Cast` (imported above), which is the AST
 * primitive node type for trees built by `cast.text(...)`,
 * `cast.call(...)`, etc.
 */
export type Make = Form | Flow | Fold | Hash | List

/**
 * A `Form` declares a data shape. Identity is the
 * `(cast, call?, case?)` triple.
 *
 *  - `cast` is the resource the Form shapes (`'language'`,
 *    `'language_string'`, …).
 *  - `call` (optional) is the action context — the verb this
 *    Form serves as input/output for. A Form with `cast:
 *    'language', call: 'select'` is the response/request
 *    shape of a `select_language` Flow.
 *  - `case` (optional) is a variant within an action context.
 *  - `like` is the field map (LinkMesh).
 *  - `head` (optional) declares generic type parameters.
 */
export type Form = {
  form: 'form'
  /** Resource name (`'language'`, `'language_string'`, …). */
  name: string
  /** Action context — the verb this Form serves as input/output for. */
  flow?: string
  /** Variant within an action context. */
  case?: string
  like: LinkMesh | LinkMesh[]
  head?: string[]
  /**
   * Validators / normalizers applied to the whole input record.
   * Single Mold or array. See `Mold` below.
   */
  mold?: Mold | Mold[]
  /** Output sub-directory under `MakeTake.link`. */
  save?: string
}

/**
 * A `Flow` declares a function. Identity is the
 * `(call, base?, case?)` triple.
 *
 *  - `call` is the verb (`'is'`, `'make'`, `'get'`, …). Named
 *    `call` (not `name`) because `form` is the kind tag — the
 *    same word `call` is what a Call AST node carries via its
 *    `name:` prop.
 *  - `base` is the resource the verb acts on.
 *  - `case` is a variant within `(call, base)`.
 *  - `take` is the input shape: Form name, inline LinkMesh,
 *    or array of either (union).
 *  - `make` is the output shape: same polymorphism.
 */
export type Flow = {
  form: 'flow'
  /** Verb (`'is'`, `'make'`, `'get'`, …). */
  call: string
  /**
   * Colon-scoped case path. Together with `call`, forms the
   * dispatch identity: `'<call>:<case>'`. Examples:
   *
   *   `case: 'string'`              → invoke as `'is:string'`
   *   `case: 'string:lowercase'`    → invoke as `'is:string:lowercase'`
   *   `case: 'ipa:broad'`           → invoke as `'is:ipa:broad'`
   *
   * The colon nesting is convention; the runtime treats the
   * whole `case` value as one opaque key segment after `call`.
   */
  case?: string
  take?: string | LinkMesh | (string | LinkMesh)[]
  make?: string | LinkMesh | (string | LinkMesh)[]
  /**
   * Validators / normalizers applied to `take` (the input args).
   * Single Mold or array. See `Mold` below.
   */
  mold?: Mold | Mold[]
  /** Output sub-directory under `MakeTake.link`. */
  save?: string
}

/**
 * A `Fold` is a renderable tree. Document templates and
 * authored documents both live as Folds.
 */
export type Fold = {
  form: 'fold'
  /** Colon-scoped lookup name (`'email:status'`, `'page:render'`). */
  case: string
  take?: string | LinkMesh
  cast: Cast[]
  /** @internal codegen output path. */
  save?: string
}

/**
 * A `Hash` is a record with dynamic keys, all values one
 * shape.
 */
export type Hash = {
  form: 'hash'
  name: string
  like: Link
  load?: Record<string, unknown>
  /** @internal codegen output path. */
  save?: string
}

/**
 * A `List` is a homogeneous list of literal items, used for
 * static enum value sets generated from data.
 */
export type List = {
  form: 'list'
  name: string
  like: Link
  load?: unknown[]
  /** @internal codegen output path. */
  save?: string
}

/**
 * A `Link` declares one field's type and constraints.
 *
 *  - `like` is the type signature: a primitive name / Form
 *    ref (string), a union of those (string[]), an inline
 *    nested record (LinkMesh), or a union of inline shapes
 *    (LinkMesh[]).
 *  - `need` marks the field required (default true).
 *  - `base` is the default value when missing.
 *  - `take` is the field's allowed enum values (string[]).
 *  - `list` indicates the field is a list of `like`-typed
 *    values.
 *  - `mold` carries validators / normalizers (replaces the
 *    earlier `test` field; see `Mold` below).
 */
export type Link = {
  like?: string | string[] | LinkMesh | LinkMesh[]
  need?: boolean
  base?: unknown
  take?: string[] | unknown[]
  list?: boolean
  /**
   * Validators / normalizers applied to this field's value.
   * Inside a Mold's `hook`, the field is bound as `self`
   * (read via `cast.read('self')`). Single Mold or array.
   */
  mold?: Mold | Mold[]
}

export type LinkMesh = Record<string, Link>

// ─── Mold ─────────────────────────────────────────────────

/**
 * A `Mold` is the unified validator-and-normalizer attached
 * to a Form / Flow / Link. Two flavors:
 *
 *  - `Norm` ("normalize / clean / format") rewrites the value.
 *    `hook` is a Call AST node (or array; pipeline) evaluated
 *    against a scope where the current value is bound as
 *    `self`. The result replaces the value.
 *
 *  - `Test` ("validate") asserts a boolean. `hook` is a Call
 *    (or array; all must pass) evaluated against the same
 *    `{ self }` scope. On failure throws with `miss`.
 *
 * `mold:` accepts a single Mold or an array. Array entries
 * run in order; for Norms the threaded `self` is the prior
 * Norm's output. Tests check whatever the current `self` is
 * at that point in the pipeline.
 */
export type Mold = Norm | Test

/**
 * Normalizer / cleaner / formatter. Returns a new value the
 * pipeline threads forward as `self`.
 */
export type Norm = {
  form: 'norm'
  /** Optional declared input shape (for codegen / typing). */
  take?: string | LinkMesh | (string | LinkMesh)[]
  /** Optional declared output shape (for codegen / typing). */
  make?: string | LinkMesh | (string | LinkMesh)[]
  /** Call AST node (or array — sequential pipeline). */
  hook: Cast | Cast[]
}

/**
 * Validator. Boolean Call (or array — all must pass). On
 * failure, the runtime throws an `Error` with `miss` as the
 * message (or a generic fallback when omitted).
 */
export type Test = {
  form: 'test'
  hook: Cast | Cast[]
  /** Error message when the test fails. */
  miss?: string
}
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

/**
 * Colon-scoped Flow path: every Code key with the `flow:`
 * prefix stripped. Lets `base.call('is:email', args)` and
 * `base.cast('email:status', params)` typecheck against the
 * registry.
 */
export type FlowPath<R> = {
  [K in keyof R]: K extends `flow:${infer P}` ? P : never
}[keyof R] &
  string

/** The Code entry for a given colon-scoped path. */
export type FlowAt<R, P extends string> = `flow:${P}` extends keyof R
  ? R[`flow:${P}`]
  : never

/** All registered Fold case names (the keys after `fold:`). */
export type FoldCase<R> = {
  [K in keyof R]: K extends `fold:${infer C}` ? C : never
}[keyof R] &
  string

/**
 * All registered schema names — the union of every Form, Hash,
 * and List `name` from the loaded Books. Computed from `Code`
 * keys: `'form:<n>'`, `'hash:<n>'`, `'list:<n>'`. The first
 * colon-scoped segment after the prefix is the resource name.
 *
 * Used by `base.mold(name, cast)` so the caller's `name` is
 * type-checked against the registry.
 */
export type FormName<R> = {
  [K in keyof R]: K extends `form:${infer N}:${string}`
    ? N
    : K extends `form:${infer N}`
      ? N
      : K extends `hash:${infer N}`
        ? N
        : K extends `list:${infer N}`
          ? N
          : never
}[keyof R] &
  string

/**
 * The validated value type for a given schema name. Looks up
 * the Code entry whose `<name>` segment matches and pulls its
 * `cast` field. Falls back to `unknown` for names without a
 * matching entry.
 */
export type FormCast<R, N extends string> =
  | (`form:${N}` extends keyof R
      ? R[`form:${N}`] extends { cast: infer T }
        ? T
        : never
      : never)
  | (`hash:${N}` extends keyof R
      ? R[`hash:${N}`] extends { cast: infer T }
        ? T
        : never
      : never)
  | (`list:${N}` extends keyof R
      ? R[`list:${N}`] extends { cast: infer T }
        ? T
        : never
      : never) extends infer X
  ? [X] extends [never]
    ? unknown
    : X
  : unknown
