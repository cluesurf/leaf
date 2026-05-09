/**
 * Schema walker. Compiles each Form / Hash / List / Flow into
 * a parser closure at `base.load(book)` time. The closure
 * captures the field-by-field validation in its scope so each
 * `base.mold(name, cast)` call is a single function dispatch
 * plus inline checks, no schema-as-data lookup.
 *
 * Parsers are stored in `base.parser`, keyed by the schema's
 * name (Form.name, Hash.name, List.name, or `flow:<call>:<case?>`
 * for Flow take/make).
 *
 * Recursion handled via lazy `base.parser.get(refName)` lookup
 * at call time. Forward refs and mutual recursion fall out for
 * free.
 *
 * Errors throw via `@cluesurf/kink` when the consumer has it
 * installed. The fallback is a plain `Error` with the same
 * `path` / `note` / `link` info so failure detail is preserved.
 */

import type { Form, Hash, Link, LinkMesh, List, Mold } from '@/form'

// Re-export render types so consumers can import them from a single
// place (bind.ts is the schema-bind entry; render.ts owns the AST
// engine). The runtime `Base` class wires Form/Hash/List validation
// (compileForm/Hash/List below) alongside Fold rendering
// (compileFold from @/render).
export {
  compile,
  compileFold,
  type BaseRenderContext,
  type CompiledFold,
  type ElementBuilder,
  type FoldRender,
  type Render,
} from '@/render'

export type Parser = (cast: unknown, path?: string) => unknown

export type ParserStore = Map<string, Parser>

/**
 * Lookup helper passed into compiled closures. The closure
 * captures *the function*, not a snapshot of the map, so
 * forward / mutual references resolve at call time.
 */
type Resolve = (name: string) => Parser | undefined

/**
 * Mold runner injected from `Base`. Lets parsers run
 * field-level Mold pipelines without re-implementing the AST
 * evaluator. Receives the current `cast` and the Mold; returns
 * the (possibly normalized) result; throws on test failure.
 */
type RunMold = (cast: unknown, mold: Mold | Mold[]) => unknown

export type CompileTake = {
  resolve: Resolve
  runMold: RunMold
}

// ---------------------------------------------------------------------------
// Top-level builders (one per cast kind)
// ---------------------------------------------------------------------------

export function compileForm(form: Form, take: CompileTake): Parser {
  const meshes: LinkMesh[] = Array.isArray(form.like)
    ? form.like
    : [form.like]
  // Tagged-union shortcut: when more than one mesh and they all
  // distinguish on a `form:` discriminant via a single-value `take`
  // on a shared field, route by the discriminant.
  const tagged = detectTaggedUnion(meshes)
  const branches: ((o: Record<string, unknown>, p: string) => void)[] =
    meshes.map(mesh => compileMesh(mesh, take))

  const formMolds = normalizeMolds(form.mold)
  const label = form.name

  if (tagged) {
    const { tagKey, tagToBranchIndex } = tagged
    return (cast, path = label) => {
      const obj = expectObject(cast, path)
      const tag = obj[tagKey]
      if (typeof tag !== 'string' || !(tag in tagToBranchIndex)) {
        throw makeKink('union_tag', {
          path,
          tag_key: tagKey,
          got: tag,
          expected: Object.keys(tagToBranchIndex),
        })
      }
      branches[tagToBranchIndex[tag]!]!(obj, path)
      for (const m of formMolds) runMold(obj, m, path, take.runMold)
      return obj
    }
  }

  const single = branches[0]!
  return (cast, path = label) => {
    const obj = expectObject(cast, path)
    single(obj, path)
    for (const m of formMolds) runMold(obj, m, path, take.runMold)
    return obj
  }
}

export function compileHash(hash: Hash, take: CompileTake): Parser {
  const itemCheck = compileLink(hash.like, take)
  const label = hash.name
  return (cast, path = label) => {
    const obj = expectObject(cast, path)
    for (const k of Object.keys(obj)) {
      obj[k] = itemCheck(obj[k], `${path}.${k}`)
    }
    return obj
  }
}

export function compileList(list: List, take: CompileTake): Parser {
  const itemCheck = compileLink(list.like, take)
  const label = list.name
  return (cast, path = label) => {
    if (!Array.isArray(cast)) {
      throw makeKink('shape_array', { path, got: typeOf(cast) })
    }
    for (let i = 0; i < cast.length; i++) {
      cast[i] = itemCheck(cast[i], `${path}[${i}]`)
    }
    return cast
  }
}

// ---------------------------------------------------------------------------
// Mesh + Link compilation
// ---------------------------------------------------------------------------

/**
 * Compile one LinkMesh into a function that validates +
 * normalizes every field of an object in place.
 */
function compileMesh(
  mesh: LinkMesh,
  take: CompileTake,
): (obj: Record<string, unknown>, path: string) => void {
  type FieldChecker = (
    obj: Record<string, unknown>,
    path: string,
  ) => void
  const checkers: FieldChecker[] = []
  for (const [key, link] of Object.entries(mesh)) {
    const linkCheck = compileLink(link, take)
    const optional = link.need === false
    checkers.push((obj, path) => {
      const v = obj[key]
      if (optional && (v === undefined || v === null)) return
      if (!optional && v === undefined) {
        throw makeKink('field_missing', { path: `${path}.${key}` })
      }
      obj[key] = linkCheck(v, `${path}.${key}`)
    })
  }
  return (obj, path) => {
    for (const c of checkers) c(obj, path)
  }
}

/**
 * Compile one Link into a `(value, path) => normalized` check.
 * `link.list` wraps in an array iteration. `link.take` short-
 * circuits to enum membership. `link.like` resolves to a primitive
 * check, a referenced parser (lazy), or a nested mesh.
 */
function compileLink(link: Link, take: CompileTake): Parser {
  const linkMolds = normalizeMolds(link.mold)
  const inner = compileLinkInner(link, take)
  if (linkMolds.length === 0) return inner
  return (cast, path = '') => {
    let v = inner(cast, path)
    for (const m of linkMolds) v = runMold(v, m, path, take.runMold)
    return v
  }
}

function compileLinkInner(link: Link, take: CompileTake): Parser {
  // 1. Enum (`take:`)
  if (Array.isArray(link.take) && link.take.length > 0) {
    const allowed = new Set(link.take as unknown[])
    const baseCheck: Parser = (cast, path = '') => {
      if (!allowed.has(cast)) {
        throw makeKink('enum_invalid', {
          path,
          got: cast,
          expected: [...allowed],
        })
      }
      return cast
    }
    return link.list ? listWrap(baseCheck) : baseCheck
  }

  // 2. Nested mesh inline (`like: { ... }`)
  if (
    link.like != null &&
    typeof link.like === 'object' &&
    !Array.isArray(link.like)
  ) {
    const mesh = link.like
    const nested = compileMesh(mesh, take)
    const baseCheck: Parser = (cast, path = '') => {
      const obj = expectObject(cast, path)
      nested(obj, path)
      return obj
    }
    return link.list ? listWrap(baseCheck) : baseCheck
  }

  // 3. Union of meshes / refs (`like: ['a', 'b']` or array of meshes)
  if (Array.isArray(link.like)) {
    const parts = link.like.map(part =>
      typeof part === 'string'
        ? compileRef(part, take)
        : (() => {
            const nested = compileMesh(part, take)
            return ((cast, path = '') => {
              const obj = expectObject(cast, path)
              nested(obj, path)
              return obj
            }) as Parser
          })(),
    )
    const baseCheck: Parser = (cast, path = '') => {
      // Try each member; first one to succeed wins. Tagged
      // unions handled at the Form level (faster path) — this
      // is the fallback for un-tagged unions.
      let lastError: unknown
      for (const p of parts) {
        try {
          return p(cast, path)
        } catch (err) {
          lastError = err
        }
      }
      throw lastError ?? makeKink('union_invalid', { path })
    }
    return link.list ? listWrap(baseCheck) : baseCheck
  }

  // 4. String ref → primitive or named schema
  if (typeof link.like === 'string') {
    const baseCheck = compileRef(link.like, take)
    return link.list ? listWrap(baseCheck) : baseCheck
  }

  // 5. No `like` → accept anything
  return identity
}

/**
 * Resolve a string `like:` ref. Primitives get an inline check.
 * Named refs (`'language'`) lazy-resolve through `take.resolve`
 * at call time (handles forward refs + recursion).
 */
function compileRef(name: string, take: CompileTake): Parser {
  const prim = PRIMITIVES[name]
  if (prim) return prim

  // Named-schema reference. Resolve lazily.
  return (cast, path = '') => {
    const parser = take.resolve(name)
    if (!parser) {
      throw makeKink('schema_missing', { path, name })
    }
    return parser(cast, path)
  }
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

const isString: Parser = (cast, path = '') => {
  if (typeof cast !== 'string') {
    throw makeKink('shape_string', { path, got: typeOf(cast) })
  }
  return cast
}

const isNumber: Parser = (cast, path = '') => {
  if (typeof cast !== 'number') {
    throw makeKink('shape_number', { path, got: typeOf(cast) })
  }
  return cast
}

const isInteger: Parser = (cast, path = '') => {
  if (!Number.isInteger(cast)) {
    throw makeKink('shape_integer', { path, got: typeOf(cast) })
  }
  return cast
}

const isNaturalNumber: Parser = (cast, path = '') => {
  if (!Number.isInteger(cast) || (cast as number) < 0) {
    throw makeKink('shape_natural_number', {
      path,
      got: typeOf(cast),
    })
  }
  return cast
}

const isBoolean: Parser = (cast, path = '') => {
  if (typeof cast !== 'boolean') {
    throw makeKink('shape_boolean', { path, got: typeOf(cast) })
  }
  return cast
}

const isDate: Parser = (cast, path = '') => {
  if (!(cast instanceof Date)) {
    throw makeKink('shape_date', { path, got: typeOf(cast) })
  }
  return cast
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const isUuid: Parser = (cast, path = '') => {
  if (typeof cast !== 'string' || !UUID_RE.test(cast)) {
    throw makeKink('shape_uuid', { path, got: cast })
  }
  return cast
}

const identity: Parser = cast => cast

const PRIMITIVES: Record<string, Parser> = {
  string: isString,
  number: isNumber,
  decimal: isNumber,
  integer: isInteger,
  'number:natural': isNaturalNumber,
  boolean: isBoolean,
  date: isDate,
  timestamp: isDate,
  uuid: isUuid,
  json: identity,
  unknown: identity,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function listWrap(item: Parser): Parser {
  return (cast, path = '') => {
    if (!Array.isArray(cast)) {
      throw makeKink('shape_array', { path, got: typeOf(cast) })
    }
    for (let i = 0; i < cast.length; i++) {
      cast[i] = item(cast[i], `${path}[${i}]`)
    }
    return cast
  }
}

function expectObject(
  cast: unknown,
  path: string,
): Record<string, unknown> {
  if (
    typeof cast !== 'object' ||
    cast === null ||
    Array.isArray(cast) ||
    cast instanceof Date
  ) {
    throw makeKink('shape_object', { path, got: typeOf(cast) })
  }
  return cast as Record<string, unknown>
}

function typeOf(cast: unknown): string {
  if (cast === null) return 'null'
  if (Array.isArray(cast)) return 'array'
  if (cast instanceof Date) return 'date'
  return typeof cast
}

function normalizeMolds(mold: Mold | Mold[] | undefined): Mold[] {
  if (mold == null) return []
  return Array.isArray(mold) ? mold : [mold]
}

/**
 * Run a single Mold against a value through the user-supplied
 * `runMold` (which is `Base.mold(value, mold)` under the hood).
 * Wraps errors with the field path so the failure carries the
 * full location, not just the Mold's own `miss` message.
 */
function runMold(
  cast: unknown,
  mold: Mold,
  path: string,
  base: RunMold,
): unknown {
  try {
    return base(cast, mold)
  } catch (err) {
    throw makeKink('mold_failed', {
      path,
      note: err instanceof Error ? err.message : String(err),
    })
  }
}

/**
 * Detect a tagged union of LinkMeshes. Returns `null` when the
 * meshes don't share a single discriminant field via
 * single-value `take:`. We use the first field name that:
 *
 *   - Exists in every mesh.
 *   - In every mesh, has a `take:` array of length 1 (the tag value).
 *   - Tag values are unique across meshes.
 *
 * In practice the discriminant is `form` for Bead-shaped trees,
 * but we don't hardcode the key.
 */
function detectTaggedUnion(
  meshes: LinkMesh[],
): { tagKey: string; tagToBranchIndex: Record<string, number> } | null {
  if (meshes.length < 2) return null

  // Collect candidate keys (intersection across meshes where the
  // field is a single-value enum).
  const candidates = new Set<string>()
  for (const k of Object.keys(meshes[0]!)) {
    const lk = meshes[0]![k]!
    if (Array.isArray(lk.take) && lk.take.length === 1)
      candidates.add(k)
  }
  for (const mesh of meshes.slice(1)) {
    for (const k of [...candidates]) {
      const lk = mesh[k]
      if (!lk || !Array.isArray(lk.take) || lk.take.length !== 1) {
        candidates.delete(k)
      }
    }
  }
  if (candidates.size === 0) return null

  // Pick the first surviving candidate.
  const tagKey = [...candidates][0]!
  const tagToBranchIndex: Record<string, number> = {}
  for (let i = 0; i < meshes.length; i++) {
    const tag = String(meshes[i]![tagKey]!.take![0])
    if (tag in tagToBranchIndex) return null // tags must be unique
    tagToBranchIndex[tag] = i
  }
  return { tagKey, tagToBranchIndex }
}

// ---------------------------------------------------------------------------
// Error wrapping
// ---------------------------------------------------------------------------

/**
 * Throw via `@cluesurf/kink` when available; fall back to a
 * plain `Error` so the package works without kink installed.
 */
let kinkFactory:
  | ((form: string, link: Record<string, unknown>) => Error)
  | undefined

export function setKinkFactory(
  factory: (form: string, link: Record<string, unknown>) => Error,
): void {
  kinkFactory = factory
}

function makeKink(form: string, link: Record<string, unknown>): Error {
  if (kinkFactory) return kinkFactory(form, link)
  const path = link.path ?? '?'
  const got =
    link.got !== undefined ? ` got=${JSON.stringify(link.got)}` : ''
  const err = new Error(`${path}: ${form}${got}`) as Error & {
    form: string
    link: Record<string, unknown>
  }
  err.form = form
  err.link = link
  return err
}

// Fold → render closure lives in `@/render` (compileFold,
// compile). It's re-exported above so consumers can import
// everything from this one module.
