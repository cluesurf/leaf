import makeTypes, { Hold } from './form'
import makeParsers from './take'
import makeConstants from './base'
import {
  Load,
  type Book,
  type Cast,
  type Flow,
  type Form,
  type Hash,
  type List,
  type Fold,
  type LinkMesh,
  type Link,
} from '@/form'
import { washFileList } from './wash'

export type MakeInput = Load

export interface MakeBack {
  form: Record<string, string>
  take: Record<string, string>
  base: Record<string, string>
}

/**
 * The codegen entry point. Walks the registered declarations
 * (passed via `MakeInput`) and emits the four-stream output:
 * `form` (TS types), `take` (Zod parsers), `base` (runtime
 * registry).
 *
 * Most consumers should use the `Make` class wrapper below
 * instead of calling this function directly. The class
 * accepts `Book` values via `make.load(book)` and converts
 * them to `MakeInput` internally.
 */
export default async function makeTree({
  testLink,
  codeLink,
  ...baseMesh
}: MakeInput): Promise<MakeBack> {
  const hold: Hold = { load: {}, save: {} }

  const typeListHash = makeTypes(baseMesh, hold)
  const parserListHash = makeParsers(baseMesh, hold)
  const constantListHash = makeConstants(baseMesh, hold)

  const form: Record<string, string> = {}
  const take: Record<string, string> = {}
  const base: Record<string, string> = {}

  for (const file in typeListHash) {
    const list = typeListHash[file]
    if (list?.length) {
      const castList = [...makeLoadList(hold, file), ...list]
      form[file] = castList.join('\n')
    }
  }

  for (const file in constantListHash) {
    const list = constantListHash[file]
    if (list?.length) {
      const castList = [...makeLoadList(hold, file), ...list]

      base[file] = castList.join('\n')
    }
  }

  for (const file in parserListHash) {
    const list = parserListHash[file]
    if (list?.length) {
      const castList = [
        `import { z } from 'zod'`,
        `import { LOAD, MAKE, TEST } from '@cluesurf/bead'`,
        `import * as code from '${testLink}'`,
        ``,
        ...makeLoadList(hold, file),
        ...list,
      ]

      take[file] = castList.join('\n')
    }
  }

  return wash({ form, take, base, codeLink })
}

async function wash(
  take: MakeBack & { codeLink: string },
): Promise<MakeBack> {
  const make: MakeBack = {
    form: await washList(take.form, take.codeLink),
    take: await washList(take.take, take.codeLink),
    base: await washList(take.base, take.codeLink),
  }

  return make
}

async function washList(
  mesh: Record<string, string>,
  codeLink: string,
) {
  const list = await washFileList(
    Object.keys(mesh).map(file => {
      const text = mesh[file]!
      // Convert ~ paths to valid file paths for ts-morph
      const virtualPath = file.replace(/^~/, codeLink) + '.ts'
      return { file: virtualPath, text }
    }),
  )

  // Map back to original keys
  const originalKeys = Object.keys(mesh)
  return list.reduce((newMesh, site, index) => {
    const originalKey = originalKeys[index]!
    newMesh[originalKey] = site.text!
    return newMesh
  }, {})
}

function makeLoadList(hold: Hold, file: string) {
  const hash: Record<string, string[]> = {}
  const text: string[] = []
  const load = hold.load[file]!

  for (const name in load) {
    const holdFile = hold.save[name]
    const fileLink = holdFile?.file
    if (!fileLink || file === fileLink) {
      continue
    }
    const list = (hash[fileLink] ??= [])
    list.push(name)
  }

  for (const file in hash) {
    const list = hash[file]!

    const fileBase = file.endsWith('/index')
      ? file.replace(/\/index$/, '')
      : file

    text.push(`import { ${list.sort().join(', ')} } from '${fileBase}'`)
  }

  text.push(``)

  return text
}

import type { CastHash, HookHash, NameHash } from '@/form'

/**
 * `Make` is the codegen orchestrator class.
 *
 *     const make = new Make({ link: './libs' })
 *
 *     make.load(standardCatalog)
 *     make.load(myAppBook)
 *
 *     await make.save()
 *
 * `make.load(book)` registers a Book; `make.save()` runs the
 * codegen and (when `link` is a real directory) writes the
 * generated files to disk.
 *
 * For the rich codegen options the existing pipeline supports
 * (per-name overrides, hooks, casts), pass them through the
 * constructor's `MakeTake` — they're forwarded to `makeTree`
 * verbatim.
 */
export type MakeTake = {
  /** Root output folder for generated files. */
  link: string
  /** Per-name overrides (e.g., `html_div_element` → `HTMLDivElement`). */
  name?: NameHash
  /** Codegen overrides for the built-in `like` mappings. */
  cast?: CastHash
  /** Hook implementations consumed by the codegen pipeline. */
  hook?: HookHash
  /** Test-fixture entry path used by the existing pipeline. */
  testLink?: string
  /**
   * When true, `save()` returns the in-memory result without
   * writing to disk. Useful for tests.
   */
  dry?: boolean
}

export class Make {
  private books: Book[] = []

  constructor(private take: MakeTake) {}

  load(book: Book): this {
    this.books.push(book)
    return this
  }

  async save(): Promise<{
    /** Bundled `code.ts` content — Code aggregate + CodeLink. */
    code: string
    /** Per-`save`-directory `index.ts` content (TS type aliases). */
    link: Record<string, string>
    /** Per-`save`-directory `form.ts` content (Zod parsers). */
    form: Record<string, string>
    /** Per-`save`-directory `base.ts` content (Hash/List literal data). */
    base: Record<string, string>
    /** Legacy codegen pipeline output (kept while old fixtures migrate). */
    legacy: MakeBack
  }> {
    // Identity-tuple collision check. Two declarations across
    // any registered Books with the same identity are an
    // error — codegen aborts before writing anything.
    const collisions = collectCollisions(this.books)
    if (collisions.length > 0) {
      throw new Error(
        `Make.save: identity-tuple collisions:\n` +
          collisions.map(c => `  ${c}`).join('\n'),
      )
    }

    // Flatten every registered Book's `base` array into the
    // BaseHash shapes the legacy codegen expects. Each cast
    // keyed by its `save` path.
    const mesh: Record<string, any> = {}
    const linkMap: Record<string, any> = {}

    for (const book of this.books) {
      for (const cast of book.cast ?? []) {
        if ('save' in cast && typeof cast.save === 'string') {
          mesh[cast.save] = cast
          linkMap[cast.save] = cast
        }
      }
    }

    const legacy = await makeTree({
      mesh,
      link: linkMap,
      name: this.take.name ?? {},
      cast: this.take.cast,
      hook: this.take.hook,
      testLink: this.take.testLink ?? this.take.link,
      codeLink: this.take.link,
    })

    // Build the per-directory TS / Zod / data files and the
    // bundled `code.ts` aggregate.
    const { code, link } = makeCode(this.books)
    const form = makeForm(this.books)
    const base = makeBase(this.books)

    if (!this.take.dry) {
      const fs = await import('node:fs')
      const path = await import('node:path')

      for (const stream of ['form', 'take', 'base'] as const) {
        for (const name in legacy[stream]) {
          const file = name.replace('~', '.')
          fs.mkdirSync(path.dirname(file), { recursive: true })
          fs.writeFileSync(`${file}.ts`, legacy[stream][name]!)
        }
      }

      fs.mkdirSync(this.take.link, { recursive: true })

      const writeDir = (
        bundle: Record<string, string>,
        filename: string,
      ) => {
        for (const [subdir, content] of Object.entries(bundle)) {
          const dir = subdir
            ? `${this.take.link}/${subdir}`
            : this.take.link
          fs.mkdirSync(dir, { recursive: true })
          fs.writeFileSync(`${dir}/${filename}`, content)
        }
      }

      writeDir(link, 'index.ts')
      writeDir(form, 'form.ts')
      writeDir(base, 'base.ts')

      // Bundled aggregate at the link root.
      fs.writeFileSync(`${this.take.link}/code.ts`, code)
    }

    return { code, link, form, base, legacy }
  }
}

/**
 * Walk every registered Book and build the colon-keyed `Code`
 * aggregate type — the kysely-DB equivalent.
 *
 * Entry shapes by `form:` discriminant:
 *
 *   Flow  → `'flow:<call>:<base?>:<case?>': { take, make }`
 *   Form  → `'form:<cast>:<call?>:<case?>': { cast: <ShapeType> }`
 *   Fold  → `'fold:<cast>': { cast: <ShapeType> }`
 *   Hash  → `'hash:<cast>': { cast: Record<string, <ItemType>> }`
 *   List  → `'list:<cast>': { cast: <ItemType>[] }`
 *
 * String refs in `take` / `make` / `like` resolve through the
 * primitive map; unknown names fall back to `unknown`.
 */
function makeCode(books: Book[]): {
  /** Bundled `code.ts` content — Code aggregate + CodeLink table. */
  code: string
  /**
   * Per-`save`-directory TS index files. Keyed by the cast's
   * `save` value (or `''` for casts without `save`). Each
   * entry is the content of that directory's `index.ts`.
   */
  link: Record<string, string>
} {
  // First pass: build a registry of named Forms so string refs
  // in Flow `take` / `make` (and Link `like`) resolve to the
  // matching Form's TS type instead of falling back to
  // `unknown`. Also capture each Form's `save` directory so
  // the bundled aggregate can import the right alias.
  const formRegistry = new Map<string, Form>()
  for (const book of books) {
    for (const cast of book.cast ?? []) {
      if (cast.form === 'form') formRegistry.set(cast.cast, cast)
    }
  }

  const ctx: RenderContext = { forms: formRegistry }

  // Group casts by their `save` value (`''` = root directory).
  const groups = new Map<string, (Cast & { save?: string })[]>()
  for (const book of books) {
    for (const cast of book.cast ?? []) {
      const save =
        ('save' in cast && typeof cast.save === 'string'
          ? cast.save
          : '') ?? ''
      ;(groups.get(save) ?? groups.set(save, []).get(save)!).push(
        cast as Cast & { save?: string },
      )
    }
  }

  // Build per-directory `index.ts` contents — type aliases for
  // every cast in that group, separated by blank lines.
  const link: Record<string, string> = {}
  for (const [save, casts] of groups) {
    const blocks: string[][] = []
    for (const cast of casts) {
      switch (cast.form) {
        case 'form': {
          const tsName = toPascalCase(cast.cast)
          blocks.push([
            `export type ${tsName} = ${renderShape(cast.like, ctx)}`,
          ])
          break
        }
        case 'flow': {
          const tsBase = flowTsBase(cast)
          blocks.push([
            `export type ${tsBase}Take = ${renderShape(cast.take, ctx)}`,
            `export type ${tsBase} = ${renderShape(cast.make, ctx)}`,
          ])
          break
        }
        case 'hash': {
          const tsName = toPascalCase(cast.cast)
          const itemType = renderLink(cast.like, ctx)
          blocks.push([
            `export type ${tsName} = Record<string, ${itemType}>`,
          ])
          break
        }
        case 'list': {
          const tsName = toPascalCase(cast.cast)
          const itemType = renderLink(cast.like, ctx)
          blocks.push([`export type ${tsName} = ${itemType}[]`])
          break
        }
        case 'fold': {
          const tsName = toPascalCase(cast.cast)
          blocks.push([`export type ${tsName} = unknown`])
          break
        }
      }
    }

    const body = blocks.map(b => b.join('\n')).join('\n\n')
    link[save] =
      [
        '// Generated by `Make.save()`. Do not edit.',
        '',
        body,
        '',
      ].join('\n')
  }

  // Build the bundled `code.ts`: imports from each save-dir,
  // the `Code` aggregate referencing the imported names, and
  // the `CodeLink` integer-id table.
  const colonKeys: string[] = []
  const importsBySave = new Map<string, Set<string>>()
  const ensureImport = (save: string, name: string) => {
    if (save === '') return // same directory; no import needed
    const set = importsBySave.get(save) ?? new Set()
    set.add(name)
    importsBySave.set(save, set)
  }

  const codeBodyLines: string[] = ['export type Code = {']
  for (const book of books) {
    for (const cast of book.cast ?? []) {
      const save =
        ('save' in cast && typeof cast.save === 'string'
          ? cast.save
          : '') ?? ''
      switch (cast.form) {
        case 'flow': {
          const segments = ['flow', cast.call]
          if (cast.base) segments.push(cast.base)
          if (cast.case) segments.push(cast.case)
          const key = segments.join(':')
          colonKeys.push(key)
          const tsBase = flowTsBase(cast)
          ensureImport(save, `${tsBase}Take`)
          ensureImport(save, tsBase)
          codeBodyLines.push(
            `  '${key}': { take: ${tsBase}Take; make: ${tsBase} }`,
          )
          break
        }
        case 'form': {
          const segments = ['form', cast.cast]
          if (cast.call) segments.push(cast.call)
          if (cast.case) segments.push(cast.case)
          const key = segments.join(':')
          colonKeys.push(key)
          const tsName = toPascalCase(cast.cast)
          ensureImport(save, tsName)
          codeBodyLines.push(`  '${key}': { cast: ${tsName} }`)
          break
        }
        case 'fold': {
          const key = `fold:${cast.cast}`
          colonKeys.push(key)
          const tsName = toPascalCase(cast.cast)
          ensureImport(save, tsName)
          codeBodyLines.push(`  '${key}': { cast: ${tsName} }`)
          break
        }
        case 'hash': {
          const key = `hash:${cast.cast}`
          colonKeys.push(key)
          const tsName = toPascalCase(cast.cast)
          ensureImport(save, tsName)
          codeBodyLines.push(`  '${key}': { cast: ${tsName} }`)
          break
        }
        case 'list': {
          const key = `list:${cast.cast}`
          colonKeys.push(key)
          const tsName = toPascalCase(cast.cast)
          ensureImport(save, tsName)
          codeBodyLines.push(`  '${key}': { cast: ${tsName} }`)
          break
        }
      }
    }
  }
  codeBodyLines.push('}')

  const codeLines: string[] = [
    '// Generated by `Make.save()`. Do not edit.',
    '',
  ]
  // Emit imports for each save group, sorted for stability.
  // Wrap long import lists across lines for readability.
  const sortedSaves = [...importsBySave.keys()].sort()
  for (const save of sortedSaves) {
    const names = [...importsBySave.get(save)!].sort()
    const oneLine = `import type { ${names.join(', ')} } from './${save}'`
    if (oneLine.length <= 80) {
      codeLines.push(oneLine)
    } else {
      codeLines.push('import type {')
      for (const n of names) codeLines.push(`  ${n},`)
      codeLines.push(`} from './${save}'`)
    }
  }
  if (sortedSaves.length > 0) codeLines.push('')

  codeLines.push(...codeBodyLines)
  codeLines.push('')

  // Emit the integer-id table (`CodeLink`) — sorted lex,
  // 1-based, stable across re-runs. Compile target for
  // `base.call(...)` rewrites.
  const sortedKeys = [...new Set(colonKeys)].sort()
  codeLines.push('export const CodeLink = {')
  for (let i = 0; i < sortedKeys.length; i++) {
    codeLines.push(`  '${sortedKeys[i]}': ${i + 1},`)
  }
  codeLines.push('} as const')
  codeLines.push('')
  codeLines.push(
    'export type CodeLink = (typeof CodeLink)[keyof typeof CodeLink]',
  )
  codeLines.push('')
  codeLines.push('export default Code')
  codeLines.push('')

  return { code: codeLines.join('\n'), link }
}

/**
 * Walk every registered Book's `base` array and find any
 * identity-tuple collisions:
 *
 *   - Forms identified by `(cast, call?, case?)`
 *   - Flows identified by `(call, base?, case?, take?, make?)`
 *
 * Two declarations with the same identity are duplicates.
 * Returns a list of human-readable collision descriptions
 * (one per duplicated tuple), empty when none.
 */
function collectCollisions(books: Book[]): string[] {
  const seen = new Map<string, { count: number; from: string[] }>()

  const bookLabel = (b: Book) =>
    b.host && b.name
      ? `${b.host}:${b.name}`
      : (b.host ?? b.name ?? '<anonymous>')

  for (const book of books) {
    const label = bookLabel(book)
    for (const cast of book.cast ?? []) {
      let key: string
      switch (cast.form) {
        case 'form': {
          const c = cast as Form
          key = `form:(cast=${c.cast}, call=${c.call ?? ''}, case=${c.case ?? ''})`
          break
        }
        case 'flow': {
          const f = cast as Flow
          // Take/make included so two Flows with the same
          // (call, base, case) but different signatures are
          // also flagged (would otherwise silently overwrite
          // each other).
          const takeSig = JSON.stringify(f.take ?? null)
          const makeSig = JSON.stringify(f.make ?? null)
          key = `flow:(call=${f.call}, base=${f.base ?? ''}, case=${f.case ?? ''}, take=${takeSig}, make=${makeSig})`
          break
        }
        case 'fold':
          key = `fold:(cast=${(cast as Fold).cast})`
          break
        case 'hash':
          key = `hash:(cast=${(cast as Hash).cast})`
          break
        case 'list':
          key = `list:(cast=${(cast as List).cast})`
          break
      }
      const entry = seen.get(key) ?? { count: 0, from: [] }
      entry.count += 1
      entry.from.push(label)
      seen.set(key, entry)
    }
  }

  const out: string[] = []
  for (const [key, { count, from }] of seen) {
    if (count > 1) {
      out.push(`${key} — appears ${count}× across [${from.join(', ')}]`)
    }
  }
  return out
}

/** PascalCase compound name for a Flow's per-take/make alias. */
function flowTsBase(flow: Flow): string {
  return (
    toPascalCase(flow.call) +
    (flow.base ? toPascalCase(flow.base) : '') +
    (flow.case ? toPascalCase(flow.case) : '')
  )
}

type RenderContext = { forms: Map<string, Form> }

/** PascalCase an export name (handles snake_case / kebab-case). */
function toPascalCase(s: string): string {
  return s
    .split(/[_-]/)
    .filter(Boolean)
    .map(w => w[0]!.toUpperCase() + w.slice(1))
    .join('')
}

/**
 * Resolve a string ref. Primitives map through `PRIMITIVE_TS`;
 * named Forms resolve to their PascalCase type alias; unknown
 * names fall back to the raw string (TS will surface the
 * error if it doesn't resolve).
 */
function resolveRef(name: string, ctx: RenderContext): string {
  if (PRIMITIVE_TS[name] != null) return PRIMITIVE_TS[name]
  if (ctx.forms.has(name)) return toPascalCase(name)
  return name
}

/**
 * Map a Flow's `take` / `make` value to its TypeScript type
 * source.
 */
function renderShape(
  shape: string | LinkMesh | (string | LinkMesh)[] | undefined,
  ctx: RenderContext,
): string {
  if (shape == null) return 'unknown'

  if (typeof shape === 'string') return resolveRef(shape, ctx)

  if (Array.isArray(shape)) {
    return shape.map(s => renderShape(s, ctx)).join(' | ')
  }

  // Inline LinkMesh — emit a TS object type.
  const fields: string[] = []
  for (const [name, link] of Object.entries(shape)) {
    const optional = link.need === false ? '?' : ''
    fields.push(`${name}${optional}: ${renderLink(link, ctx)}`)
  }
  return `{ ${fields.join('; ')} }`
}

/** Render one Link's value type, including list-wrapping. */
function renderLink(link: Link, ctx: RenderContext): string {
  let inner: string
  if (typeof link.like === 'string') {
    inner = resolveRef(link.like, ctx)
  } else if (Array.isArray(link.like)) {
    inner = link.like
      .map(part =>
        typeof part === 'string'
          ? resolveRef(part, ctx)
          : renderShape(part, ctx),
      )
      .join(' | ')
  } else if (link.like != null && typeof link.like === 'object') {
    inner = renderShape(link.like, ctx)
  } else {
    inner = 'unknown'
  }
  return link.list ? `${inner}[]` : inner
}

const PRIMITIVE_TS: Record<string, string> = {
  boolean: 'boolean',
  number: 'number',
  decimal: 'number',
  integer: 'number',
  natural_number: 'number',
  string: 'string',
  uuid: 'string',
  date: 'Date',
  timestamp: 'Date',
  json: 'object',
  unknown: 'unknown',
}

const PRIMITIVE_ZOD: Record<string, string> = {
  boolean: 'z.boolean()',
  number: 'z.number()',
  decimal: 'z.number()',
  integer: 'z.number().int()',
  natural_number: 'z.number().int().nonnegative()',
  string: 'z.string()',
  uuid: 'z.string().uuid()',
  date: 'z.coerce.date()',
  timestamp: 'z.coerce.date()',
  json: 'z.any()',
  unknown: 'z.unknown()',
}

/**
 * Walk every registered Book and emit per-`save`-directory
 * Zod parsers. Each TS type alias from the matching
 * `index.ts` gets a paired `<TypeName>Form` parser locked via
 * `satisfies z.ZodType<<TypeName>>`.
 *
 * Output: `Record<save, parserFileContent>` — one `form.ts`
 * body per save directory.
 */
function makeForm(books: Book[]): Record<string, string> {
  const formRegistry = new Map<string, Form>()
  for (const book of books) {
    for (const cast of book.cast ?? []) {
      if (cast.form === 'form') formRegistry.set(cast.cast, cast)
    }
  }
  const ctx: RenderContext = { forms: formRegistry }

  // Group casts by save directory, just like makeCode.
  const groups = new Map<string, (Cast & { save?: string })[]>()
  for (const book of books) {
    for (const cast of book.cast ?? []) {
      const save =
        ('save' in cast && typeof cast.save === 'string'
          ? cast.save
          : '') ?? ''
      ;(groups.get(save) ?? groups.set(save, []).get(save)!).push(
        cast as Cast & { save?: string },
      )
    }
  }

  const out: Record<string, string> = {}
  for (const [save, casts] of groups) {
    // Track which TS type names this file references so we can
    // emit the right `import type { ... }` block.
    const typeImports = new Set<string>()
    const blocks: string[][] = []

    for (const cast of casts) {
      switch (cast.form) {
        case 'form': {
          const tsName = toPascalCase(cast.cast)
          typeImports.add(tsName)
          blocks.push([
            `export const ${tsName}Form = ${zodShape(cast.like, ctx)} satisfies z.ZodType<${tsName}>`,
          ])
          break
        }
        case 'flow': {
          const tsBase = flowTsBase(cast)
          typeImports.add(`${tsBase}Take`)
          typeImports.add(tsBase)
          blocks.push([
            `export const ${tsBase}TakeForm = ${zodShape(cast.take, ctx)} satisfies z.ZodType<${tsBase}Take>`,
            `export const ${tsBase}Form = ${zodShape(cast.make, ctx)} satisfies z.ZodType<${tsBase}>`,
          ])
          break
        }
        case 'hash': {
          const tsName = toPascalCase(cast.cast)
          typeImports.add(tsName)
          blocks.push([
            `export const ${tsName}Form = z.record(z.string(), ${zodLink(cast.like, ctx)}) satisfies z.ZodType<${tsName}>`,
          ])
          break
        }
        case 'list': {
          const tsName = toPascalCase(cast.cast)
          typeImports.add(tsName)
          blocks.push([
            `export const ${tsName}Form = z.array(${zodLink(cast.like, ctx)}) satisfies z.ZodType<${tsName}>`,
          ])
          break
        }
        case 'fold':
          // Folds emit `unknown` for now — tree shape is TBD.
          break
      }
    }

    // Skip emitting the file entirely when the group has no
    // parser blocks — keeps disk output clean.
    if (blocks.length === 0) continue

    const header = [
      '// Generated by `Make.save()`. Do not edit.',
      '',
      "import { z } from 'zod'",
    ]
    if (typeImports.size > 0) {
      const sortedTypes = [...typeImports].sort()
      const oneLine = `import type { ${sortedTypes.join(', ')} } from '.'`
      if (oneLine.length <= 80) {
        header.push(oneLine)
      } else {
        header.push('import type {')
        for (const n of sortedTypes) header.push(`  ${n},`)
        header.push("} from '.'")
      }
    }
    header.push('')

    const body = blocks.map(b => b.join('\n')).join('\n\n')
    out[save] = [...header, body, ''].join('\n')
  }
  return out
}

/** Render a Flow's take/make value as a Zod expression. */
function zodShape(
  shape: string | LinkMesh | (string | LinkMesh)[] | undefined,
  ctx: RenderContext,
): string {
  if (shape == null) return 'z.unknown()'

  if (typeof shape === 'string') return zodRef(shape, ctx)

  if (Array.isArray(shape)) {
    const parts = shape.map(s => zodShape(s, ctx))
    return `z.union([${parts.join(', ')}])`
  }

  // Inline LinkMesh.
  const fields: string[] = []
  for (const [name, link] of Object.entries(shape)) {
    const inner = zodLink(link, ctx)
    const wrapped = link.need === false ? `${inner}.optional()` : inner
    fields.push(`  ${name}: ${wrapped},`)
  }
  return `z.object({\n${fields.join('\n')}\n})`
}

/** Render one Link's value as a Zod expression, list-aware. */
function zodLink(link: Link, ctx: RenderContext): string {
  let inner: string
  if (typeof link.like === 'string') {
    inner = zodRef(link.like, ctx)
  } else if (Array.isArray(link.like)) {
    const parts = link.like.map(part =>
      typeof part === 'string' ? zodRef(part, ctx) : zodShape(part, ctx),
    )
    inner = `z.union([${parts.join(', ')}])`
  } else if (link.like != null && typeof link.like === 'object') {
    inner = zodShape(link.like, ctx)
  } else {
    inner = 'z.unknown()'
  }
  return link.list ? `z.array(${inner})` : inner
}

/** Resolve a string ref to a Zod expression. */
function zodRef(name: string, ctx: RenderContext): string {
  if (PRIMITIVE_ZOD[name] != null) return PRIMITIVE_ZOD[name]
  if (ctx.forms.has(name)) return `${toPascalCase(name)}Form`
  return 'z.unknown()'
}

/**
 * Walk every registered Book and emit per-`save`-directory
 * runtime data files (`base.ts`). Each Hash/List with a
 * `load:` literal becomes an `export const <TypeName>Base = …`.
 */
function makeBase(books: Book[]): Record<string, string> {
  const groups = new Map<string, (Cast & { save?: string })[]>()
  for (const book of books) {
    for (const cast of book.cast ?? []) {
      const save =
        ('save' in cast && typeof cast.save === 'string'
          ? cast.save
          : '') ?? ''
      ;(groups.get(save) ?? groups.set(save, []).get(save)!).push(
        cast as Cast & { save?: string },
      )
    }
  }

  const out: Record<string, string> = {}
  for (const [save, casts] of groups) {
    const blocks: string[] = []
    for (const cast of casts) {
      if (
        (cast.form === 'list' || cast.form === 'hash') &&
        cast.load != null
      ) {
        const tsName = toPascalCase(cast.cast)
        blocks.push(
          `export const ${tsName}Base = ${JSON.stringify(cast.load, null, 2)} as const`,
        )
      }
    }

    // Skip empty groups so we don't write blank files.
    if (blocks.length === 0) continue

    out[save] =
      [
        '// Generated by `Make.save()`. Do not edit.',
        '',
        blocks.join('\n\n'),
        '',
      ].join('\n')
  }
  return out
}
