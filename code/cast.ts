/**
 * Cast — the AST primitive shape and builder namespace.
 *
 * The runtime renders AST trees built by `cast.text(...)`,
 * `cast.call(...)`, etc. Types declare every node kind; builders
 * compose them into the canonical JSON shape, byte for byte.
 */

/**
 * @cluesurf/leaf fold-tree type definitions.
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
  start?: number | Cast | null
  end?: number | Cast | null
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
 * A Call carries one of two flavors:
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
 * Iteration. Three case-discriminated variants:
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
 *   cast.join(', ', cast.walk(items, body))
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


// ---- builders ----

/**
 * `flow.*` builder helpers.
 *
 * Helpers compose into the canonical JSON shape, byte for byte.
 * Promotion: a primitive passed where a Cast is expected gets
 * wrapped automatically (`0` → integer/natural_number,
 * `'hello'` → text, `true` → boolean, `Date` → date,
 * `[...]` → list, plain object with a `form` field passes
 * through unchanged).
 */


// ---------------------------------------------------------------------------
// Promotion
// ---------------------------------------------------------------------------

export type Promotable =
  | Cast
  | string
  | number
  | boolean
  | Date
  | unknown[]
  | Record<string, unknown>

/**
 * Normalize a value for inclusion in a fold tree.
 *
 * Native scalars (`string`, `number`, `boolean`, `Date`, `null`)
 * pass through unchanged — they ARE leaves of the tree. Tagged
 * structural nodes (anything with a `form` field) pass through.
 * Plain arrays wrap into a `list` so they can't be confused
 * with view-nest children or arbitrary array-typed props.
 */
export function promote(value: Promotable): Cast {
  if (value === null) return null
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value
  if (value instanceof Date) return value
  if (Array.isArray(value)) {
    return list(value.map(v => promote(v as Promotable)))
  }
  if (typeof value === 'object') {
    // Tagged structural Cast — pass through unchanged.
    if ('form' in (value as Record<string, unknown>)) {
      return value as Cast
    }
    // Plain object — treat as a record literal. Used by lazy
    // verbs like `cast.call('bind', { names: { x: 1 } })` and
    // anywhere a Cast field accepts an inline mapping.
    return value as Cast
  }
  throw new Error(`cast.promote: unsupported value ${String(value)}`)
}

// ---------------------------------------------------------------------------
// Scalar pass-throughs
//
// Native scalars are first-class fold-tree leaves. These helpers
// exist for symmetry with structural builders (so call sites can
// read `cast.text(...)` / `cast.integer(...)` for clarity) but
// they're identity functions that return the input native value.
// ---------------------------------------------------------------------------

export function integer(n: number): number {
  return n
}

export function naturalNumber(n: number): number {
  return n
}

export function number(n: number): number {
  return n
}

export function boolean(b: boolean): boolean {
  return b
}

export function date(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value)
}

export function list(items: Cast[]): ListPrimitive {
  return { form: 'list', list: items }
}

export function text(
  ...children: Promotable[]
): TextPrimitive {
  return { form: 'text', flow: children.map(promote) }
}

/**
 * Render every item with `text` slotted between adjacent
 * items. Items can be any Cast; walks flatten in (each
 * iteration becomes a separate join entry, so the separator
 * lands between iterations naturally).
 *
 *   cast.join(', ', 'a', 'b', 'c')
 *   // → 'a, b, c'
 *
 *   cast.join(', ', cast.walk(items, body))
 *   // → 'body(items[0]), body(items[1]), …'
 */
export function join(
  text: string,
  ...items: Promotable[]
): JoinPrimitive {
  return { form: 'join', text, list: items.map(promote) }
}

export function hash(base: Record<string, Promotable>): HashPrimitive {
  const out: Record<string, Cast> = {}
  for (const [k, v] of Object.entries(base)) {
    out[k] = promote(v)
  }
  return { form: 'hash', base: out }
}

/**
 * Embed a named Fold declaration with optional bindings.
 *
 *   cast.fold('greeting', { count: 5, name: 'Lance' })
 */
export function fold(
  name: string,
  bind?: Record<string, Promotable>,
): FoldPrimitive {
  const node: FoldPrimitive = { form: 'fold', name }
  if (bind) {
    const out: Record<string, Cast> = {}
    for (const [k, v] of Object.entries(bind)) {
      out[k] = promote(v)
    }
    node.bind = out
  }
  return node
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export function reference(name: string): Reference {
  return { form: 'reference', name }
}

// ----- path segments -----

export function variable(
  name: string,
  opts?: { safe?: boolean },
): VariableSeg {
  return opts?.safe
    ? { form: 'variable', name, safe: true }
    : { form: 'variable', name }
}

export function field(
  name: string,
  opts?: { safe?: boolean },
): FieldSeg {
  return opts?.safe
    ? { form: 'field', name, safe: true }
    : { form: 'field', name }
}

export function idx(
  value: number | Cast,
  opts?: { safe?: boolean },
): IndexSeg {
  return opts?.safe
    ? { form: 'index', value, safe: true }
    : { form: 'index', value }
}

export function slice(
  start?: number | Cast | null,
  end?: number | Cast | null,
  opts?: { safe?: boolean },
): SliceSeg {
  const seg: SliceSeg = { form: 'slice' }
  if (start !== undefined) seg.start = start
  if (end !== undefined) seg.end = end
  if (opts?.safe) seg.safe = true
  return seg
}

/**
 * Build a Read tree from a chain of segments. First arg is the
 * head (string → variable segment by name; or a pre-built
 * segment object). Subsequent string args become field
 * segments; segment objects pass through.
 *
 * Examples:
 *   read('count')                 // → reference (single segment, normalized)
 *   read('user', 'name')          // user.name
 *   read('items', idx(0))         // items[0]
 *   read('items', slice(3, 10))   // items[3..10]
 */
export function read(
  ...segments: (string | ReadLink)[]
): Reference | ReadPrimitive {
  if (segments.length === 0) {
    throw new Error('cast.read: at least one segment required')
  }
  const built: ReadLink[] = segments.map((s, i) => {
    if (typeof s === 'string') {
      return i === 0
        ? { form: 'variable', name: s }
        : { form: 'field', name: s }
    }
    return s
  })
  // Normalize a single bare-variable to a `reference` node.
  const head = built[0]
  if (built.length === 1 && head?.form === 'variable' && !head.safe) {
    return { form: 'reference', name: head.name }
  }
  return { form: 'read', link: built }
}

// Back-compat alias for callers that still use `path()`.
export const path = read

// ---------------------------------------------------------------------------
// Calls
// ---------------------------------------------------------------------------

/**
 * Build a Call node. The first arg is a colon-scoped action
 * path:
 *
 *   cast.call('eq', { a, b })
 *   cast.call('format:capitalized', { text: 'hi' })
 *   cast.call('is:ipa:broad', { text: 'fəˈnɛtɪk' })
 *
 * The leading segment is the verb (`call`); the rest is the
 * `case` (a single colon-joined string).
 */
export function call(
  path: string,
  args?: Record<string, Promotable>,
): Call {
  const colon = path.indexOf(':')
  const node: Call =
    colon < 0
      ? { form: 'call', name: path }
      : {
          form: 'call',
          name: path.slice(0, colon),
          case: path.slice(colon + 1),
        }
  if (args) {
    for (const [k, v] of Object.entries(args)) {
      ;(node as Record<string, unknown>)[k] = promote(v)
    }
  }
  return node
}

// ----- predicates (resolve via book/check/flow.ts) -----

export const eq = (a: Promotable, b: Promotable) =>
  call('is:equal', { a, b })
export const ne = (a: Promotable, b: Promotable) =>
  call('is:not:equal', { a, b })
export const gt = (a: Promotable, b: Promotable) =>
  call('is:above', { a, b })
export const gte = (a: Promotable, b: Promotable) =>
  call('is:min', { a, b })
export const lt = (a: Promotable, b: Promotable) =>
  call('is:below', { a, b })
export const lte = (a: Promotable, b: Promotable) =>
  call('is:max', { a, b })

export function inOf(value: Promotable, listOf: Promotable[]): Call {
  return call('is:among', { value, list: listOf })
}

export function negate(value: Promotable): Call {
  return call('is:not', { value })
}

export function and(...things: Promotable[]): Call {
  return call('is:all', { things })
}

export function or(...things: Promotable[]): Call {
  return call('is:any', { things })
}

export const isNull = (value: Promotable) =>
  call('is:null', { value })
export const isEmpty = (value: Promotable) =>
  call('is:empty', { value })

// ----- aggregates -----

export const count = (listOf: Promotable) =>
  call('count', { list: listOf })
export const sum = (listOf: Promotable) =>
  call('sum', { list: listOf })
export const mean = (listOf: Promotable) =>
  call('get:mean', { list: listOf })
export const min = (listOf: Promotable) =>
  call('get:smallest', { list: listOf })
export const max = (listOf: Promotable) =>
  call('get:largest', { list: listOf })

// ----- derives -----

export const plural = (value: Promotable) =>
  call('plural', { value })
export const length = (value: Promotable) =>
  call('get:length', { value })

// ----- formatters -----
//
// `options?` accepts either a flow node (rare; for runtime-
// computed options) or a plain options object. The walker
// passes it through to the hook unchanged via `collectCallArgs`.

export type FormatOptions = Promotable | Record<string, unknown>

function withOptions(
  name: string,
  value: Promotable,
  options?: FormatOptions,
): Call {
  if (options === undefined) return call(name, { value })
  return call(name, { value, options: options })
}

export const formatNumber = (
  value: Promotable,
  options?: FormatOptions,
) => withOptions('format:number', value, options)

export const currency = (value: Promotable, code: string) =>
  call('format:currency', { value, code })

export const percent = (value: Promotable) =>
  call('format:percent', { value })

export const formatDate = (
  value: Promotable,
  options?: FormatOptions,
) => withOptions('format:date', value, options)

export const formatTime = (
  value: Promotable,
  options?: FormatOptions,
) => withOptions('format:time', value, options)

export const relative = (value: Promotable, unit: string) =>
  call('format:relative', { value, unit })

// Back-compat aliases for the old `fmt*` names. Remove
// after a deprecation cycle.
export const fmtNumber = formatNumber
export const fmtDate = formatDate
export const fmtTime = formatTime

// ---------------------------------------------------------------------------
// Control flow
// ---------------------------------------------------------------------------

export function fork(
  test: Promotable,
  thenNode: Promotable,
  fall?: Promotable,
): ForkPrimitive {
  const node: ForkPrimitive = {
    form: 'fork',
    test: promote(test),
    then: promote(thenNode),
  }
  if (fall !== undefined) node.fall = promote(fall)
  return node
}

export function switchOn(
  value: Promotable,
  cases: { when: Promotable; then: Promotable }[],
  fall?: Promotable,
): SwitchPrimitive {
  const node: SwitchPrimitive = {
    form: 'switch',
    value: promote(value),
    cases: cases.map(c => ({
      when: promote(c.when),
      then: promote(c.then),
    })),
  }
  if (fall !== undefined) node.fall = promote(fall)
  return node
}

export function match(
  branches: { test: Promotable; then: Promotable }[],
  fall?: Promotable,
): MatchPrimitive {
  const node: MatchPrimitive = {
    form: 'match',
    branches: branches.map(b => ({
      test: promote(b.test),
      then: promote(b.then),
    })),
  }
  if (fall !== undefined) node.fall = promote(fall)
  return node
}

// ----- case arms -----

export function valueArm(
  value: string | number | boolean,
  flow: Cast[] | string,
): CaseValueArm {
  return {
    form: 'case-value',
    value,
    flow: typeof flow === 'string' ? [flow] : flow,
  }
}

export function testArm(
  testCall: Call,
  flow: Cast[] | string,
): CaseTestArm {
  return {
    form: 'case-test',
    test: testCall,
    flow: typeof flow === 'string' ? [flow] : flow,
  }
}

export function otherwise(flow: Cast[] | string): CaseDefaultArm {
  return {
    form: 'case-default',
    flow: typeof flow === 'string' ? [flow] : flow,
  }
}

export function caseOf(
  test: Promotable,
  arms: CaseArm[],
): CasePrimitive {
  return { form: 'case', test: promote(test), case: arms }
}

// ----- pick -----

export function pick(...values: Promotable[]): PickPrimitive {
  return {
    form: 'pick',
    values: { form: 'list', list: values.map(promote) },
  }
}

// ----- walk: 3 variants -----

/**
 * For-each over a collection. The body (`hook`) renders once
 * per item with `item` and `index` bound in scope.
 *
 * For separator-between-iterations, wrap with `cast.join`:
 *   cast.join(', ', cast.walk(items, body))
 */
export function walk(
  listOf: Promotable,
  hook: Promotable,
  opts?: { item?: string; index?: string },
): WalkPrimitive {
  const node: WalkPrimitive = {
    form: 'walk',
    case: 'list',
    list: promote(listOf),
    hook: promote(hook),
  }
  if (opts?.item) node.item = opts.item
  if (opts?.index) node.index = opts.index
  return node
}

/**
 * While-style loop. Re-evaluate `test`; while truthy, render
 * `hook`. Wrap with `cast.join` for separator semantics.
 */
export function walkTest(
  test: Promotable,
  hook: Promotable,
): WalkPrimitive {
  return {
    form: 'walk',
    case: 'test',
    test: promote(test),
    hook: promote(hook),
  }
}

/**
 * Counted range. Iterates from `base` (inclusive) to `head`
 * (exclusive) by `move` (default 1). The current value is
 * bound under `item` (default `'head'`); `index` (default
 * `'index'`) carries the 0-based step counter.
 */
export function walkSize(
  base: Promotable,
  head: Promotable,
  hook: Promotable,
  opts?: { move?: number; item?: string; index?: string },
): WalkPrimitive {
  const node: WalkPrimitive = {
    form: 'walk',
    case: 'size',
    base: promote(base),
    head: promote(head),
    hook: promote(hook),
  }
  if (opts?.move !== undefined) node.move = opts.move
  if (opts?.item) node.item = opts.item
  if (opts?.index) node.index = opts.index
  return node
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

export function view(name: string): ViewPrimitive
export function view(name: string, nest: Promotable[]): ViewPrimitive
export function view(
  name: string,
  props: Record<string, Promotable>,
  nest?: Promotable[],
): ViewPrimitive
export function view(
  name: string,
  propsOrNest?: Record<string, Promotable> | Promotable[],
  nest?: Promotable[],
): ViewPrimitive {
  const node: ViewPrimitive = { form: 'view', name }

  // Two-arg shorthand: `view('paragraph', ['Inventory.'])` —
  // skip the empty-props slot entirely when the second arg is
  // an array.
  if (Array.isArray(propsOrNest)) {
    nest = propsOrNest
  } else if (propsOrNest) {
    for (const [k, v] of Object.entries(propsOrNest)) {
      ;(node as Record<string, unknown>)[k] = promote(v)
    }
  }

  if (nest && nest.length > 0) {
    node.nest = nest.map(promote)
  }
  return node
}

// ---------------------------------------------------------------------------
// Higher-order template helpers
// ---------------------------------------------------------------------------

/**
 * Plural switch keyed by CLDR category names.
 *
 *   pluralCases('count', { one: 'message', other: 'messages' })
 *
 * Compiles to a `case` over `plural(reference(name))` with one
 * `case-value` arm per non-`other` key plus a `case-default`
 * arm for `other`.
 */
export function pluralCases(
  refName: string,
  arms: Record<string, Cast[] | string>,
): CasePrimitive {
  const armsList: CaseArm[] = []
  for (const [k, v] of Object.entries(arms)) {
    if (k === 'other') continue
    armsList.push(valueArm(k, v))
  }
  if ('other' in arms) {
    armsList.push(otherwise(arms.other))
  }
  return caseOf(plural(reference(refName)), armsList)
}

/**
 * Select switch keyed by literal values.
 *
 *   selectCases('gender', { male: 'Mr.', female: 'Mrs.', other: '' })
 *
 * Compiles to a `case` over `reference(name)` with one
 * `case-value` arm per non-`other` key plus a `case-default`
 * arm for `other` if present.
 */
export function selectCases(
  refName: string,
  arms: Record<string, Cast[] | string>,
): CasePrimitive {
  const armsList: CaseArm[] = []
  for (const [k, v] of Object.entries(arms)) {
    if (k === 'other') continue
    armsList.push(valueArm(k, v))
  }
  if ('other' in arms) {
    armsList.push(otherwise(arms.other))
  }
  return caseOf(reference(refName), armsList)
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Builder namespace
//
// The `cast.text(...)` / `cast.call(...)` ergonomic surface. Mirrors the
// named exports above, with a few key remaps where the JS identifier
// can't match the desired namespace key (`switch` / `case` / `in` are
// reserved, etc.).
// ---------------------------------------------------------------------------

export const cast = {
  // promotion
  promote,
  // literals + structural
  integer,
  naturalNumber,
  number,
  boolean,
  date,
  list,
  text,
  hash,
  join,
  fold,
  // reads
  reference,
  read,
  path,
  variable,
  field,
  idx,
  slice,
  // calls
  call,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  in: inOf,
  negate,
  and,
  or,
  isNull,
  isEmpty,
  count,
  sum,
  mean,
  min,
  max,
  plural,
  length,
  formatNumber,
  currency,
  percent,
  formatDate,
  formatTime,
  relative,
  fmtNumber,
  fmtDate,
  fmtTime,
  // control flow
  fork,
  switch: switchOn,
  match,
  case: caseOf,
  value: valueArm,
  test: testArm,
  otherwise,
  pick,
  walk,
  walkTest,
  walkSize,
  // views
  view,
  // higher-order
  pluralCases,
  selectCases,
} as const
