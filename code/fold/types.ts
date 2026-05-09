/**
 * @cluesurf/bead fold-tree type definitions.
 *
 * Scalar leaves are native JS values: `string`, `number`,
 * `boolean`, `Date`, `null`. Structural nodes carry a `form`
 * discriminant. Reserved metadata keys on tagged nodes are
 * `form`, `name`, `version`, `id`, `meta`.
 */

export type Meta = Record<string, unknown>

// ---------------------------------------------------------------------------
// Literals — bare native values, no wrapper
// ---------------------------------------------------------------------------

export type Literal = string | number | boolean | Date | null

// ---------------------------------------------------------------------------
// List + weave (structural — kept tagged so they don't collide
// with view `nest` children or arbitrary native arrays in props)
// ---------------------------------------------------------------------------

export type ListPrimitive = {
  form: 'list'
  list: Cast[]
  id?: string
  meta?: Meta
}

export type TextPrimitive = {
  form: 'text'
  flow: Cast[]
  id?: string
  meta?: Meta
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export type Reference = {
  form: 'reference'
  name: string
  id?: string
  meta?: Meta
}

export type VariableSeg = {
  form: 'variable'
  name: string
  safe?: boolean
}

export type FieldSeg = {
  form: 'field'
  name: string
  safe?: boolean
}

export type IndexSeg = {
  form: 'index'
  value: number | Cast
  safe?: boolean
}

export type SliceSeg = {
  form: 'slice'
  rise?: number | Cast | null
  fall?: number | Cast | null
  safe?: boolean
}

export type ReadLink = VariableSeg | FieldSeg | IndexSeg | SliceSeg

export type ReadPrimitive = {
  form: 'read'
  link: ReadLink[]
  id?: string
  meta?: Meta
}

// ---------------------------------------------------------------------------
// Calls
// ---------------------------------------------------------------------------

/**
 * A Call carries one of two flavors per `note/ast.md`:
 *
 *  - **Make form** (`name` set, args flat at top level) — what
 *    authors write and what's stored at rest.
 *  - **Wake form** (`code` set, args under `bind`) — what the
 *    runtime evaluates after the compile step. Faster lookup,
 *    args validated.
 *
 * Both forms share `mark?` (schema-version stamp / editor
 * memoization key). The compile step preserves `mark`.
 */
export type Call = {
  form: 'call'
  /** Verb identity (make form). */
  name?: string
  /** Resource the verb acts on (make form). */
  base?: string
  /** Variant within `(name, base)` (make form). */
  case?: string
  /** Compiled integer id from `CodeLink` (wake form). */
  code?: number
  /** Args bag (wake form — produced by compile). */
  bind?: Record<string, unknown>
  /** Per-instance schema-version stamp (semver). */
  mark?: string
  // make-form take-side args sit flat at the top level
  [arg: string]: unknown
}

// ---------------------------------------------------------------------------
// Control flow
// ---------------------------------------------------------------------------

export type ForkPrimitive = {
  form: 'fork'
  test: Cast
  then: Cast
  fall?: Cast
  version?: number
  id?: string
  meta?: Meta
}

export type SwitchPrimitive = {
  form: 'switch'
  value: Cast
  cases: { when: Cast; then: Cast }[]
  fall?: Cast
  version?: number
  id?: string
  meta?: Meta
}

export type MatchPrimitive = {
  form: 'match'
  branches: { test: Cast; then: Cast }[]
  fall?: Cast
  version?: number
  id?: string
  meta?: Meta
}

export type CaseValueArm = {
  form: 'case-value'
  value: string | number | boolean
  flow: Cast[]
}

export type CaseTestArm = {
  form: 'case-test'
  test: Call
  flow: Cast[]
}

export type CaseDefaultArm = {
  form: 'case-default'
  flow: Cast[]
}

export type CaseArm = CaseValueArm | CaseTestArm | CaseDefaultArm

export type CasePrimitive = {
  form: 'case'
  test: Cast
  case: CaseArm[]
  id?: string
  meta?: Meta
}

export type PickPrimitive = {
  form: 'pick'
  values: Cast
  version?: number
  id?: string
  meta?: Meta
}

/**
 * Iteration. Three case-discriminated variants per
 * `note/ast.md`:
 *
 *  - `walk(list)`  — for-each over a collection (the original)
 *  - `walk(test)`  — while-style; loop while a test is truthy
 *  - `walk(size)`  — counted range (i = base..head step move)
 */
/**
 * Join — render each entry in `list` and concatenate them
 * with `text` between adjacent items.
 *
 *   { form: 'join', list: [a, b, c], text: ', ' }   // → 'a, b, c'
 *
 * Walks inside `list` flatten in: each walk iteration's body
 * becomes a separate join entry, so the separator slots
 * between iterations naturally.
 *
 *   make.join(', ', make.walk(items, body))
 *   // ≡ { form: 'join', list: [<walk>], text: ', ' }
 *   // → 'body(items[0]), body(items[1]), …'
 *
 * `text` is a literal string (not a Cast) so the wire format
 * stays predictable.
 */
export type JoinPrimitive = {
  form: 'join'
  list: Cast[]
  text: string
  mark?: string
}

export type WalkListPrimitive = {
  form: 'walk'
  case: 'list'
  list: Cast
  item?: string
  index?: string
  hook: Cast
  version?: number
  id?: string
  meta?: Meta
  mark?: string
}

export type WalkTestPrimitive = {
  form: 'walk'
  case: 'test'
  test: Cast
  hook: Cast
  version?: number
  id?: string
  meta?: Meta
  mark?: string
}

export type WalkSizePrimitive = {
  form: 'walk'
  case: 'size'
  base: Cast               // start (inclusive)
  head: Cast               // end (exclusive)
  move?: number            // increment, default 1
  item?: string            // iterator binding name (default 'head')
  index?: string           // optional index binding
  hook: Cast
  version?: number
  id?: string
  meta?: Meta
  mark?: string
}

export type WalkPrimitive =
  | WalkListPrimitive
  | WalkTestPrimitive
  | WalkSizePrimitive

export type ControlFlow =
  | ForkPrimitive
  | SwitchPrimitive
  | MatchPrimitive
  | CasePrimitive
  | PickPrimitive
  | WalkPrimitive

// ---------------------------------------------------------------------------
// Hash (object literal — keys to Cast values)
// ---------------------------------------------------------------------------

export type HashPrimitive = {
  form: 'hash'
  base: Record<string, Cast>
  id?: string
  meta?: Meta
}

// ---------------------------------------------------------------------------
// Find — query expression. Resolved by a host-supplied `find`
// resolver (typically batched, async).
// ---------------------------------------------------------------------------

export type FindPrimitive = {
  form: 'find'
  /** Resource to query (`'language_string'`, `'page'`, …). */
  resource: string
  /** Filter expression. Tree of predicates; resolver-defined. */
  where?: Cast
  /** Ordering — list of `{ field, direction }` Casts. */
  sort?: Cast[]
  /** Page size. */
  limit?: number
  /** Page offset. */
  offset?: number
  /**
   * Aggregation kind: when set, returns the aggregate instead
   * of the row list (`'count' | 'sum' | 'mean' | 'first' | …`).
   */
  kind?: string
  mark?: string
}

// ---------------------------------------------------------------------------
// Fold — embedded template reference. Resolves the named Fold
// declaration through a host-supplied `fold` resolver and
// renders its tree with the supplied bindings.
// ---------------------------------------------------------------------------

export type FoldPrimitive = {
  form: 'fold'
  /** Name of the Fold declaration to embed. */
  name: string
  /** Template parameter bindings (snake_case → Cast). */
  bind?: Record<string, Cast>
  mark?: string
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

export type ViewPrimitive = {
  form: 'view'
  name: string
  version?: number
  id?: string
  meta?: Meta
  nest?: Cast[]
  // typed props sit flat at the top level
  [prop: string]: unknown
}

// ---------------------------------------------------------------------------
// Tagged structural nodes (everything carrying a `form:`)
// ---------------------------------------------------------------------------

export type Structural =
  | ListPrimitive
  | TextPrimitive
  | Reference
  | ReadPrimitive
  | Call
  | ControlFlow
  | HashPrimitive
  | FindPrimitive
  | FoldPrimitive
  | JoinPrimitive
  | ViewPrimitive

// ---------------------------------------------------------------------------
// Cast — the universal tree node
// ---------------------------------------------------------------------------

export type Cast = Literal | Structural

// ---------------------------------------------------------------------------
// Reserved keys
// ---------------------------------------------------------------------------

/**
 * Keys that are metadata or structural on operator-like nodes.
 * Anything else at the top level of a `view` or `call` is a
 * user-defined prop / arg.
 */
export const RESERVED_CAST_KEYS = new Set<string>([
  'form',
  'name',
  'base',
  'case',
  'mark',
  'code',
  'bind',
])
