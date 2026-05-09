import type { Cast as FoldNode } from '@/fold/types'

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
  cast?: Cast[]
  // Input + context positions use `any` so concrete handlers
  // `(args: { text }) => ...` remain assignable (contravariance).
  // Return is `unknown`. Callers must narrow.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  call?: Record<string, (input: any, context?: any) => unknown>
  code?: Record<string, number>
  /**
   * View components keyed by view name (`'callout'`, `'page'`,
   * etc.). Wired into element-mode rendering when the Base is
   * configured with `createElement`.
   */
  view?: Record<string, unknown>
}

/**
 * `Cast` is the umbrella for any JSON object the runtime
 * processes — Form / Flow / Fold / Hash / List declarations,
 * Call AST nodes, and record instances.
 */
export type Cast = Form | Flow | Fold | Hash | List

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
  tree: FoldNode[]
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
 *  - `test` is a constraint sub-tree that returns boolean.
 *  - `list` indicates the field is a list of `like`-typed
 *    values.
 */
export type Link = {
  like?: string | string[] | LinkMesh | LinkMesh[]
  need?: boolean
  base?: unknown
  take?: string[] | unknown[]
  test?: Cast | string
  list?: boolean
}

export type LinkMesh = Record<string, Link>

