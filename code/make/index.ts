import make_types, { Hold } from './form'
import make_parsers from './take'
import make_constants from './base'
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
 * accepts `Book` values via `make.book(book)` and converts
 * them to `MakeInput` internally.
 */
export default async function makeTree({
  testLink,
  codeLink,
  ...baseMesh
}: MakeInput): Promise<MakeBack> {
  const hold: Hold = { load: {}, save: {} }

  const type_list_hash = make_types(baseMesh, hold)
  const parser_list_hash = make_parsers(baseMesh, hold)
  const constant_list_hash = make_constants(baseMesh, hold)

  const form: Record<string, string> = {}
  const take: Record<string, string> = {}
  const base: Record<string, string> = {}

  for (const file in type_list_hash) {
    const list = type_list_hash[file]
    if (list?.length) {
      const castList = [...makeLoadList(hold, file), ...list]
      form[file] = castList.join('\n')
    }
  }

  for (const file in constant_list_hash) {
    const list = constant_list_hash[file]
    if (list?.length) {
      const castList = [...makeLoadList(hold, file), ...list]

      base[file] = castList.join('\n')
    }
  }

  for (const file in parser_list_hash) {
    const list = parser_list_hash[file]
    if (list?.length) {
      const castList = [
        `import { z } from 'zod'`,
        `import { LOAD, MAKE, TEST } from '@cluesurf/calm'`,
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
 *     make.book(standardCatalog)
 *     make.book(myAppBook)
 *
 *     await make.save()
 *
 * `make.book(book)` registers a Book; `make.save()` runs the
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

  book(book: Book): this {
    this.books.push(book)
    return this
  }

  async save(): Promise<
    MakeBack & { code: string; dirs: Record<string, string> }
  > {
    // Flatten every registered Book's `base` array into the
    // BaseHash shapes the codegen function expects. Each cast
    // is keyed by its `save` path (the canonical identity used
    // by the existing pipeline).
    const mesh: Record<string, any> = {}
    const link: Record<string, any> = {}

    for (const book of this.books) {
      for (const cast of book.base ?? []) {
        if ('save' in cast && typeof cast.save === 'string') {
          mesh[cast.save] = cast
          link[cast.save] = cast
        }
      }
    }

    const tree = await makeTree({
      mesh,
      link,
      name: this.take.name ?? {},
      cast: this.take.cast,
      hook: this.take.hook,
      testLink: this.take.testLink ?? this.take.link,
      codeLink: this.take.link,
    })

    // Build the per-directory TS index files and the bundled
    // `code.ts` aggregate.
    const { code, dirs } = makeCode(this.books)

    if (!this.take.dry) {
      const fs = await import('node:fs')
      const path = await import('node:path')

      for (const stream of ['form', 'take', 'base'] as const) {
        for (const name in tree[stream]) {
          const file = name.replace('~', '.')
          fs.mkdirSync(path.dirname(file), { recursive: true })
          fs.writeFileSync(`${file}.ts`, tree[stream][name]!)
        }
      }

      fs.mkdirSync(this.take.link, { recursive: true })

      // Per-directory TS index files (one per `save` group).
      for (const [subdir, content] of Object.entries(dirs)) {
        const dir = subdir
          ? `${this.take.link}/${subdir}`
          : this.take.link
        fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(`${dir}/index.ts`, content)
      }

      // Bundled aggregate at the link root.
      fs.writeFileSync(`${this.take.link}/code.ts`, code)
    }

    return { ...tree, code, dirs }
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
  dirs: Record<string, string>
} {
  // First pass: build a registry of named Forms so string refs
  // in Flow `take` / `make` (and Link `like`) resolve to the
  // matching Form's TS type instead of falling back to
  // `unknown`. Also capture each Form's `save` directory so
  // the bundled aggregate can import the right alias.
  const formRegistry = new Map<string, Form>()
  for (const book of books) {
    for (const cast of book.base ?? []) {
      if (cast.form === 'form') formRegistry.set(cast.cast, cast)
    }
  }

  const ctx: RenderContext = { forms: formRegistry }

  // Group casts by their `save` value (`''` = root directory).
  const groups = new Map<string, (Cast & { save?: string })[]>()
  for (const book of books) {
    for (const cast of book.base ?? []) {
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
  // every cast in that group.
  const dirs: Record<string, string> = {}
  for (const [save, casts] of groups) {
    const lines: string[] = [
      '// Generated by `Make.save()`. Do not edit.',
      '',
    ]
    for (const cast of casts) {
      switch (cast.form) {
        case 'form': {
          const tsName = toPascalCase(cast.cast)
          lines.push(
            `export type ${tsName} = ${renderShape(cast.like, ctx)}`,
          )
          break
        }
        case 'flow': {
          const tsBase = flowTsBase(cast)
          lines.push(
            `export type ${tsBase}Take = ${renderShape(cast.take, ctx)}`,
          )
          lines.push(
            `export type ${tsBase} = ${renderShape(cast.make, ctx)}`,
          )
          break
        }
        case 'hash': {
          const tsName = toPascalCase(cast.cast)
          const itemType = renderLink(cast.like, ctx)
          lines.push(
            `export type ${tsName} = Record<string, ${itemType}>`,
          )
          break
        }
        case 'list': {
          const tsName = toPascalCase(cast.cast)
          const itemType = renderLink(cast.like, ctx)
          lines.push(`export type ${tsName} = ${itemType}[]`)
          break
        }
        case 'fold': {
          const tsName = toPascalCase(cast.cast)
          lines.push(`export type ${tsName} = unknown`)
          break
        }
      }
    }
    lines.push('')
    dirs[save] = lines.join('\n')
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
    for (const cast of book.base ?? []) {
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
  const sortedSaves = [...importsBySave.keys()].sort()
  for (const save of sortedSaves) {
    const names = [...importsBySave.get(save)!].sort().join(', ')
    codeLines.push(`import type { ${names} } from './${save}'`)
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

  return { code: codeLines.join('\n'), dirs }
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
