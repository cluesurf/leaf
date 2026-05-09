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
  call?: Record<string, (input: any, context?: any) => any>
  code?: Record<string, number>
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
  cast: string
  call?: string
  case?: string
  like: LinkMesh | LinkMesh[]
  head?: string[]
  /**
   * Output sub-directory under `MakeTake.link`. Convention:
   * `'<verb>'` or `'<verb>/<base>'` (`'is'`, `'is/ipa'`,
   * `'make'`, `'language'`). When absent, the cast's
   * generated TS / Zod / data files land directly in the
   * `link` root.
   */
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
  call: string
  base?: string
  case?: string
  take?: string | LinkMesh | (string | LinkMesh)[]
  make?: string | LinkMesh | (string | LinkMesh)[]
  /**
   * Output sub-directory under `MakeTake.link`. Convention:
   * `'<verb>'` or `'<verb>/<base>'`. When absent, the cast's
   * generated TS / Zod / data files land directly in the
   * `link` root.
   */
  save?: string
}

/**
 * A `Fold` is a renderable tree. Document templates and
 * authored documents both live as Folds.
 */
export type Fold = {
  form: 'fold'
  cast: string
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
  cast: string
  like: Link
  load?: Record<string, unknown>
  /** @internal codegen output path. */
  save?: string
  /** @internal legacy: literal hash data, used by codegen. */
  hash?: Record<string, any>
  /** @internal legacy: declared field name for hash entries. */
  link?: string
  /** @internal legacy: per-value type. */
  bond?: FormLike
}

/**
 * A `List` is a homogeneous list of literal items, used for
 * static enum value sets generated from data.
 */
export type List = {
  form: 'list'
  cast: string
  like: Link
  load?: unknown[]
  /** @internal codegen output path. */
  save?: string
  /** @internal legacy: literal list data, used by codegen. */
  list?: any[]
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
  take?: string[] | any[]
  test?: Cast | string
  list?: boolean

  // ─── Legacy fields used by the existing codegen ───
  // Kept optional so the codegen continues to compile;
  // remove once the codegen is rewritten against the
  // simplified Link shape.

  /** @internal legacy: nested record (use `like: LinkMesh` going forward). */
  link?: LinkMesh
  /** @internal legacy: enum members or sub-variant union. */
  case?: Record<string, Link> | Link[]
  /** @internal legacy: variant union members. */
  fuse?: Link[]
  /** @internal legacy: literal default-value or guide-system flag. */
  bind?: FormBond | Record<string, FormBond> | FormBond[] | boolean
  /** @internal legacy. */
  bond?: Link
  /** @internal legacy: required-by-default trait bound. */
  fall?: any
  /** @internal legacy. */
  head?: string
  /** @internal legacy. */
  note?: string
  /** @internal legacy. */
  back?: string
  /** @internal legacy. */
  fill?: boolean
  /** @internal legacy. */
  hold?: boolean
  /** @internal legacy. */
  trim?: boolean
  /** @internal legacy. */
  load?: boolean
  /** @internal legacy. */
  name?: { base?: string; mark?: string }
  /** @internal legacy. */
  size?:
    | number
    | {
        fall?: number
        fall_meet?: number
        rise?: number
        rise_meet?: number
      }
  /** @internal legacy. View-tree extensions. */
  slot?: string
  view?: boolean
  pick?: string
  tags?: string[]
}

export type LinkMesh = Record<string, Link>

// ─── Codegen-config types (consumed by `Make`) ────────────

export type BaseHash = Record<string, Cast>

export type NameHash = Record<string, string>

export type HookHash = Record<
  string,
  (input: any, context?: any) => any
>

/**
 * Codegen overrides for the built-in `like` → output
 * mappings.
 *
 *  - `form` overrides TypeScript type emission.
 *  - `take` overrides Zod parser emission.
 */
export type CastHash = {
  form?: Record<string, string>
  take?: Record<string, string>
}

export type MakeTake = {
  mesh: BaseHash
  link: BaseHash
  name: NameHash
  hook?: HookHash
  cast?: CastHash
}

export type Load = MakeTake & {
  testLink: string
  codeLink: string
}

// ─── Legacy compat aliases ────────────────────────────────
//
// The existing codegen pipeline (`code/make/{base,form,take}.ts`)
// imports several type names from the older form-DSL shape.
// Aliased here as no-op shims so the codegen still compiles
// while we migrate it onto the simplified Form/Flow/Link
// types above.

/** @deprecated The codegen-config type is now `MakeTake`. */
export type Base = MakeTake

export type FormBond = string | number | boolean | null

/** @deprecated A Form variant member shape used by the legacy codegen. */
export type FormLike = {
  like: string
  test?: (bond: any, link?: any) => boolean
  note?: string
}

/** @deprecated Legacy Form-with-cases variant used by the codegen. */
export type FormBaseCase = {
  form: 'form'
  save: string
  case: FormLike[]
}

/** @deprecated Legacy. */
export type FormLikeCase = {
  case: FormLike[]
}

/** @deprecated Legacy back-pointer record used by codegen sweeps. */
export type TestBack = {
  message?: string
  path?: string[]
  params?: any
}

/** @deprecated Use `Flow` directly. */
export type Test = {
  form: 'test'
  save: string
  test: (bond: any, name: string) => boolean | string | TestBack
}

/** @deprecated Use `Flow` directly. */
export type Make = {
  form: 'make'
  save: string
  make: (bond: any, context: any, name: string) => any
}
