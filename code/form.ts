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
export type Make = Form | Flow | Fold | Hash | List | Seed

/**
 * An annotation on a shape or a field. Order is not meaningful and a
 * thing may carry several: a field can be deprecated AND experimental
 * without either needing to know about the other, which is the whole
 * reason this is a list of tagged records rather than a boolean per
 * idea.
 *
 * A CLOSED VOCABULARY, deliberately. An open `form: string` would let
 * anybody write a mark nothing renders, which is a comment with extra
 * syntax. Adding a kind is a one-line edit here, and that edit is the
 * moment somebody decides how it is shown.
 *
 * `form` is the discriminant, as it is on every tagged union in this
 * codebase.
 */
export type Mark =
  /**
   * Going away. `note` says what to use instead, which is the half
   * that makes a deprecation actionable rather than alarming.
   */
  | { form: 'deprecated'; note?: string }
  /**
   * Real, and may change without notice. Outside whatever stability
   * contract the surface publishes.
   */
  | { form: 'experimental'; note?: string }
  /**
   * Real, and NOT part of the public surface. A documentation
   * generator omits it entirely rather than showing it as available,
   * so the docs and the promise stay the same thing.
   */
  | { form: 'internal'; note?: string }
  /** When it appeared. `note` carries the version or the date. */
  | { form: 'since'; note?: string }

/**
 * The example values a field takes, keyed by EXAMPLE NAME.
 *
 * Every field mentioning a name contributes its value to that named
 * example, and a field that does not mention it falls back to `base`,
 * so each named example composes into a COMPLETE object rather than a
 * fragment. That is the difference between an example somebody can
 * paste and one they have to finish.
 *
 * The example lives beside the field it varies, which is the same
 * argument that puts `note` there: a shape and its documentation move
 * together or they drift.
 *
 * See `readTour` in `./tour` for the composition rules, which cover
 * lists, unions and defaults.
 *
 * NAMED `tour` FROM 0.11.0, and `show` before it. A tour is a walk
 * through the shape with real values in it, which is what the reader
 * gets: `readTour` fills every field, so one annotated field yields a
 * complete object rather than a fragment. "Show" named the rendering,
 * and the rendering belongs to whoever draws the page.
 *
 * ONE WORD FOR A SAMPLE, EVERYWHERE. The exception registry in
 * `@cluesurf/belt` carries a `tour` on each error definition, meaning
 * the same thing: one filled-in body a docs page can print. A reader
 * who learns the word on a field already knows it on an error.
 *
 * `Mesh` is the suffix this file uses for a keyed record, as in
 * `LinkMesh`.
 */
export type TourMesh = Record<string, unknown>

/**
 * One way a call can answer: a status code, and the exception behind
 * it when the code is a refusal.
 *
 * THE DOCS CANNOT GUESS THIS. A field table says what a caller sends
 * and what a success holds, and says nothing about the four ways the
 * call can fail, which is most of what integrating against it costs.
 * `send` is that list, declared where the shape is, so the two move
 * together.
 *
 * `case` NAMES AN EXCEPTION rather than restating it, and it is `case`
 * because that is what an exception already calls its own name on the
 * wire: `{ form: 'exception', case: 'absence', … }`. The exception's
 * definition carries its fields and its `tour` sample values, so a
 * docs page renders a real example body by looking the name up instead
 * of by repeating it here, and the two cannot disagree.
 *
 * `note` says WHEN, which is the part the code alone does not carry: a
 * 404 on a select means the record is absent, and a 404 on an owned
 * resource can also mean the caller may not see it, and those are
 * different things to a reader.
 *
 * NAMED `send` RATHER THAN `halt`, which it was first. `halt` fits a
 * refusal and fights a 200: a success is not the call stopping, it is
 * the call answering, and the list is every answer. Leaving the
 * successes out would make it read as "the failures" and leave nowhere
 * to say what a 201 or a 301 means.
 */
export type Send = {
  /** The HTTP status. */
  code: number
  /** When this happens, in one line. */
  note?: string
  /**
   * The exception's name, for a refusal. Looked up rather than
   * restated, so a sample body comes from the exception itself.
   */
  case?: string
}

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
  /**
   * Markdown. What this shape is, and when a caller reaches for it.
   *
   * BESIDE THE THING IT DESCRIBES, so a change meets its own
   * documentation in the same diff. Prose kept in another file goes
   * stale without anybody noticing.
   */
  note?: string
  /**
   * Annotations: deprecated, experimental, internal, since. See
   * `Mark`. Marked `internal` means a public reference omits it
   * entirely, so the docs and the promise stay the same thing.
   */
  mark?: Mark[]
  /**
   * Every status this call can answer with, and the exception behind
   * each refusal. See `Send`.
   *
   * ON THE FORM, NOT ON A FIELD, because a status is a fact about the
   * CALL. Two fields cannot each own the 404.
   */
  send?: Send[]
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
  /**
   * Markdown. What this function does.
   *
   * BESIDE THE THING IT DESCRIBES, so a change meets its own
   * documentation in the same diff. Prose kept in another file goes
   * stale without anybody noticing.
   */
  note?: string
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
  /**
   * Markdown. What this tree renders.
   *
   * BESIDE THE THING IT DESCRIBES, so a change meets its own
   * documentation in the same diff. Prose kept in another file goes
   * stale without anybody noticing.
   */
  note?: string
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
  /**
   * Markdown. What this record holds.
   *
   * BESIDE THE THING IT DESCRIBES, so a change meets its own
   * documentation in the same diff. Prose kept in another file goes
   * stale without anybody noticing.
   */
  note?: string
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
  /**
   * Markdown. What this list enumerates.
   *
   * BESIDE THE THING IT DESCRIBES, so a change meets its own
   * documentation in the same diff. Prose kept in another file goes
   * stale without anybody noticing.
   */
  note?: string
}

/**
 * A `Seed` is a typed-data record. Bundles a Form (the schema)
 * with an instance Cast tree (the values). Used for page-level
 * data containers per the seed-system spec.
 *
 * Field values inside `cast:` may be wrapped scalar literals
 * (`string` / `integer` / ...), `code` references, `find` queries
 * (host pre-resolves), `range` intervals, or `list` of any of the
 * above. The `like:` mesh validates the per-field shape via
 * `base.mold(...)`.
 *
 * Seeds are anonymous in v1 — no `name:` field.
 */
export type Seed = {
  form: 'seed'
  /** Schema reference. Either a string ref to a registered Form,
   *  or an inline LinkMesh. */
  like: string | LinkMesh
  /** Per-field instance values. */
  cast: Record<string, Cast>
  mark?: string
  /**
   * Markdown. What this record is an instance of.
   *
   * BESIDE THE THING IT DESCRIBES, so a change meets its own
   * documentation in the same diff. Prose kept in another file goes
   * stale without anybody noticing.
   */
  note?: string
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
 *  - `hold` declares runtime storage policy for the field's
 *    value when bound to a state-manager record (URL query,
 *    localStorage, sessionStorage). Inert at the schema
 *    layer; consumed by `@cluesurf/face`'s `useRecord` (see
 *    `Hold` below).
 */
export type Link = {
  like?: string | string[] | LinkMesh | LinkMesh[]
  need?: boolean
  base?: unknown
  take?: string[] | unknown[]
  list?: boolean
  /**
   * Markdown. What this field is, in prose, for whoever reads the
   * docs rather than the declaration.
   *
   * BESIDE THE FIELD, not in a document elsewhere, so a change to the
   * shape meets its own documentation in the same diff. A description
   * kept in another file is a description that goes stale without
   * anybody noticing.
   */
  note?: string
  /**
   * Example values for this field, keyed by example name. See
   * `TourMesh`.
   *
   * Composed against `base`, so a name mentioned by one field still
   * produces a complete object: every other field falls back to its
   * default. `readTour` in `./seed` does the composing.
   */
  tour?: TourMesh
  /**
   * Annotations: deprecated, experimental, internal, since. See
   * `Mark`.
   */
  mark?: Mark[]
  /**
   * Validators / normalizers applied to this field's value.
   * Inside a Mold's `hook`, the field is bound as `self`
   * (read via `cast.read('self')`). Single Mold or array.
   */
  mold?: Mold | Mold[]
  /**
   * Runtime storage policy. See `Hold` below. Inert at the
   * schema / codegen layer.
   */
  hold?: Hold
}

export type LinkMesh = Record<string, Link>

// ─── Hold ─────────────────────────────────────────────────

/**
 * A `Hold` declares where a field's value lives at runtime
 * once bound to a reactive record. Pure declarative metadata;
 * the schema and codegen layers ignore it. The persistence
 * engine in `@cluesurf/face` (`useRecord`) reads it to wire
 * URL sync, local / session storage, and TTL sweeps.
 *
 *  - `site` is the storage substrate:
 *      `'url'`     mirror to the page's URL query string.
 *      `'local'`   persist across sessions in `localStorage`.
 *      `'session'` persist across reloads in `sessionStorage`.
 *      `'none'`    memory only (the default when `hold` is
 *                  omitted).
 *  - `time` is an optional TTL. When present, the persistence
 *    engine writes an expiration alongside the value and
 *    discards expired entries at app boot. Accepted formats
 *    are duration shorthand: `'30s'`, `'15m'`, `'12h'`,
 *    `'7d'`, `'4w'`. Ignored when `site` is `'url'` or
 *    `'none'`.
 *
 * When a parent Form's containing context also declares a
 * `hold`, the field-level value wins; the parent provides
 * the default. Mixing `site` values across fields in the
 * same Form is allowed.
 */
export type Hold = {
  site: 'url' | 'local' | 'session' | 'none'
  time?: string
}

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
 *  - `Rule` ("validate") asserts a boolean. `hook` is a Call
 *    (or array; all must pass) evaluated against the same
 *    `{ self }` scope. On failure throws with `miss`. Rules
 *    carry a required `name:` (e.g. `'is:slug'`) used by UI
 *    tooling to look up contextual hints / autocomplete /
 *    inline help per field.
 *
 * `mold:` accepts a single Mold or an array. Array entries
 * run in order; for Norms the threaded `self` is the prior
 * Norm's output. Rules check whatever the current `self` is
 * at that point in the pipeline.
 */
export type Mold = Norm | Rule

/**
 * Normalizer / cleaner / formatter. Returns a new value the
 * pipeline threads forward as `self`.
 */
export type Norm = {
  form: 'norm'
  /** Optional identifier for the normalizer (e.g. `'make:trimmed'`). */
  name?: string
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
 *
 * `name:` is a required identifier the UI layer matches on
 * to render contextual help / autocomplete / placeholder hints.
 * Examples: `'is:present'`, `'is:slug'`, `'is:integer-range'`,
 * `'is:text-search-mode'`. By convention the rule name matches
 * the dominant Flow its `hook:` calls, but this is not
 * enforced.
 */
export type Rule = {
  form: 'rule'
  /** UI hint identifier (e.g. `'is:slug'`). */
  name: string
  hook: Cast | Cast[]
  /** Error message when the rule fails. */
  miss?: string
}

/**
 * @deprecated Use `Rule`. `Test` is the legacy name kept as a
 * compat alias for one release. Will be removed in 0.10.
 */
export type Test = Rule
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
