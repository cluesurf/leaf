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

import type {
  ForkPrimitive,
  Call,
  CaseArm,
  CaseDefaultArm,
  CasePrimitive,
  CaseTestArm,
  CaseValueArm,
  Cast,
  FieldSeg,
  FindPrimitive,
  FoldPrimitive,
  HashPrimitive,
  IndexSeg,
  ListPrimitive,
  MatchPrimitive,
  ReadPrimitive,
  ReadLink,
  PickPrimitive,
  Reference,
  SliceSeg,
  SwitchPrimitive,
  VariableSeg,
  ViewPrimitive,
  WalkPrimitive,
  TemplateStringPrimitive,
} from './types'

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
  if (
    typeof value === 'object' &&
    'form' in (value as Record<string, unknown>)
  ) {
    return value as Cast
  }
  throw new Error(`make.promote: unsupported value ${String(value)}`)
}

// ---------------------------------------------------------------------------
// Scalar pass-throughs
//
// Native scalars are first-class fold-tree leaves. These helpers
// exist for symmetry with structural builders (so call sites can
// read `make.text(...)` / `make.integer(...)` for clarity) but
// they're identity functions that return the input native value.
// ---------------------------------------------------------------------------

export function text(s: string): string {
  return s
}

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

export function templateString(...children: Promotable[]): TemplateStringPrimitive {
  return { form: 'template_string', flow: children.map(promote) }
}

export function hash(base: Record<string, Promotable>): HashPrimitive {
  const out: Record<string, Cast> = {}
  for (const [k, v] of Object.entries(base)) {
    out[k] = promote(v)
  }
  return { form: 'hash', base: out }
}

/**
 * Query expression. Resolves through a host-supplied `find`
 * resolver — typically batched and async. Renderers that don't
 * supply a resolver render `find` as `null`.
 *
 *   make.find('page', { where: ..., sort: [...], limit: 20 })
 */
export function find(
  resource: string,
  options?: {
    where?: Promotable
    sort?: Promotable[]
    limit?: number
    offset?: number
    kind?: string
  },
): FindPrimitive {
  const node: FindPrimitive = { form: 'find', resource }
  if (options?.where !== undefined) node.where = promote(options.where)
  if (options?.sort !== undefined) node.sort = options.sort.map(promote)
  if (options?.limit !== undefined) node.limit = options.limit
  if (options?.offset !== undefined) node.offset = options.offset
  if (options?.kind !== undefined) node.kind = options.kind
  return node
}

/**
 * Embed a named Fold declaration with optional bindings.
 *
 *   make.fold('greeting', { count: 5, name: 'Lance' })
 */
export function fold(
  cast: string,
  bind?: Record<string, Promotable>,
): FoldPrimitive {
  const node: FoldPrimitive = { form: 'fold', cast }
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
  rise?: number | Cast | null,
  fall?: number | Cast | null,
  opts?: { safe?: boolean },
): SliceSeg {
  const seg: SliceSeg = { form: 'slice' }
  if (rise !== undefined) seg.rise = rise
  if (fall !== undefined) seg.fall = fall
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
    throw new Error('make.read: at least one segment required')
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

export function call(
  name: string,
  args?: Record<string, Promotable>,
): Call {
  const node: Call = { form: 'call', name }
  if (args) {
    for (const [k, v] of Object.entries(args)) {
      // `base` and `case` are part of the call's identity
      // tuple — keep them as bare strings on the node, not
      // wrapped as literal AST nodes.
      if ((k === 'base' || k === 'case') && typeof v === 'string') {
        ;(node as Record<string, unknown>)[k] = v
      } else {
        ;(node as Record<string, unknown>)[k] = promote(v)
      }
    }
  }
  return node
}

// ----- predicates -----

export const eq = (a: Promotable, b: Promotable) => call('eq', { a, b })
export const ne = (a: Promotable, b: Promotable) => call('ne', { a, b })
export const gt = (a: Promotable, b: Promotable) => call('gt', { a, b })
export const gte = (a: Promotable, b: Promotable) =>
  call('gte', { a, b })
export const lt = (a: Promotable, b: Promotable) => call('lt', { a, b })
export const lte = (a: Promotable, b: Promotable) =>
  call('lte', { a, b })

export function inOf(
  value: Promotable,
  listOf: Promotable[],
): Call {
  return call('in', { value, list: listOf })
}

export function negate(value: Promotable): Call {
  return call('negate', { value })
}

export function and(...values: Promotable[]): Call {
  return call('and', { values })
}

export function or(...values: Promotable[]): Call {
  return call('or', { values })
}

export const isNull = (value: Promotable) => call('is-null', { value })
export const isEmpty = (value: Promotable) =>
  call('is-empty', { value })

// ----- aggregates -----

export const count = (listOf: Promotable) =>
  call('count', { list: listOf })
export const sum = (listOf: Promotable) => call('sum', { list: listOf })
export const mean = (listOf: Promotable) =>
  call('mean', { list: listOf })
export const min = (listOf: Promotable) => call('min', { list: listOf })
export const max = (listOf: Promotable) => call('max', { list: listOf })

// ----- derives -----

export const plural = (value: Promotable) => call('plural', { value })
export const length = (value: Promotable) => call('length', { value })

// ----- formatters (note: these overlap by name with literals; helpers
// below are explicit) -----
//
// `options?` accepts either a flow node (rare; for runtime-
// computed options) or a plain options object — the walker
// passes it through to the hook unchanged via `collectCallArgs`.

export type FormatOptions =
  | Promotable
  | Record<string, unknown>

function withOptions(name: string, value: Promotable, options?: FormatOptions): Call {
  if (options === undefined) return call(name, { value })
  return call(name, { value, options: options as Promotable })
}

export const formatNumber = (value: Promotable, options?: FormatOptions) =>
  withOptions('number', value, options)

export const currency = (value: Promotable, code: string) =>
  call('currency', { value, code })

export const percent = (value: Promotable) => call('percent', { value })

export const formatDate = (value: Promotable, options?: FormatOptions) =>
  withOptions('date', value, options)

export const formatTime = (value: Promotable, options?: FormatOptions) =>
  withOptions('time', value, options)

export const relative = (value: Promotable, unit: string) =>
  call('relative', { value, unit })

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
    flow: typeof flow === 'string' ? [text(flow)] : flow,
  }
}

export function testArm(
  testCall: Call,
  flow: Cast[] | string,
): CaseTestArm {
  return {
    form: 'case-test',
    test: testCall,
    flow: typeof flow === 'string' ? [text(flow)] : flow,
  }
}

export function otherwise(flow: Cast[] | string): CaseDefaultArm {
  return {
    form: 'case-default',
    flow: typeof flow === 'string' ? [text(flow)] : flow,
  }
}

export function caseOf(test: Promotable, arms: CaseArm[]): CasePrimitive {
  return { form: 'case', test: promote(test), case: arms }
}

// ----- pick -----

export function pick(...values: Promotable[]): PickPrimitive {
  return {
    form: 'pick',
    values: { form: 'list', list: values.map(promote) },
  }
}

// ----- walk: 3 variants per note/ast.md -----

/**
 * For-each over a collection. The body (`hook`) renders once
 * per item with `item` and `index` bound in scope.
 *
 * `join` is rendered between iterations (not after the last).
 */
export function walk(
  listOf: Promotable,
  hook: Promotable,
  opts?: { item?: string; index?: string; join?: Promotable },
): WalkPrimitive {
  const node: WalkPrimitive = {
    form: 'walk',
    case: 'list',
    list: promote(listOf),
    hook: promote(hook),
  }
  if (opts?.item) node.item = opts.item
  if (opts?.index) node.index = opts.index
  if (opts?.join !== undefined) node.join = promote(opts.join)
  return node
}

/**
 * While-style loop. Re-evaluate `test`; while truthy, render
 * `hook`. Body renders concatenated (text mode) or as a
 * fragment (element mode). `join` slots between iterations.
 */
export function walkTest(
  test: Promotable,
  hook: Promotable,
  opts?: { join?: Promotable },
): WalkPrimitive {
  const node: WalkPrimitive = {
    form: 'walk',
    case: 'test',
    test: promote(test),
    hook: promote(hook),
  }
  if (opts?.join !== undefined) node.join = promote(opts.join)
  return node
}

/**
 * Counted range. Iterates from `base` (inclusive) to `head`
 * (exclusive) by `move` (default 1). The current value is
 * bound under `item` (default `'head'`); `index` (default
 * `'index'`) carries the 0-based step counter. `join` slots
 * between iterations.
 */
export function walkSize(
  base: Promotable,
  head: Promotable,
  hook: Promotable,
  opts?: {
    move?: number
    item?: string
    index?: string
    join?: Promotable
  },
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
  if (opts?.join !== undefined) node.join = promote(opts.join)
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
