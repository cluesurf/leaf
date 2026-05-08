import make_types, { Hold } from './form'
import make_parsers from './take'
import make_constants from './base'
import {
  Load,
  type Book,
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

  async save(): Promise<MakeBack & { code: string }> {
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

    // Build the bundled `Code` type from every registered Flow.
    const code = makeCode(this.books)

    if (!this.take.dry) {
      const fs = await import('node:fs')
      const path = await import('node:path')

      for (const stream of ['form', 'take', 'base'] as const) {
        for (const name in tree[stream]) {
          const file = name.replace('~', '.')
          fs.mkdirSync(path.dirname(file), { recursive: true })
          fs.writeFileSync(`${file}.ts`, tree[stream][name] as string)
        }
      }

      fs.mkdirSync(this.take.link, { recursive: true })
      fs.writeFileSync(`${this.take.link}/code.ts`, code)
    }

    return { ...tree, code }
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
function makeCode(books: Book[]): string {
  // First pass: build a registry of named Forms so string refs
  // in Flow `take` / `make` (and Link `like`) resolve to the
  // matching Form's TS type instead of falling back to
  // `unknown`.
  const formRegistry = new Map<string, Form>()
  for (const book of books) {
    for (const cast of book.base ?? []) {
      if (cast.form === 'form') {
        const form = cast as Form
        formRegistry.set(form.cast, form)
      }
    }
  }

  const ctx: RenderContext = { forms: formRegistry }

  const lines: string[] = [
    '// Generated by `Make.save()`. Do not edit.',
    '',
  ]

  // Emit one `export type <PascalCast> = ...` for each Form
  // first, so the Code aggregate below can reference them by
  // name (and consumers can import them directly).
  for (const form of formRegistry.values()) {
    const tsName = toPascalCase(form.cast)
    lines.push(`export type ${tsName} = ${renderShape(form.like, ctx)}`)
  }
  if (formRegistry.size > 0) lines.push('')

  lines.push('export type Code = {')

  for (const book of books) {
    for (const cast of book.base ?? []) {
      switch (cast.form) {
        case 'flow': {
          const flow = cast as Flow
          const segments = ['flow', flow.call]
          if (flow.base) segments.push(flow.base)
          if (flow.case) segments.push(flow.case)
          const key = segments.join(':')
          const takeType = renderShape(flow.take, ctx)
          const makeType = renderShape(flow.make, ctx)
          lines.push(
            `  '${key}': { take: ${takeType}; make: ${makeType} }`,
          )
          break
        }
        case 'form': {
          const form = cast as Form
          const segments = ['form', form.cast]
          if (form.call) segments.push(form.call)
          if (form.case) segments.push(form.case)
          const key = segments.join(':')
          // Reference the named TS type emitted above.
          const tsName = toPascalCase(form.cast)
          lines.push(`  '${key}': { cast: ${tsName} }`)
          break
        }
        case 'fold': {
          const fold = cast as Fold
          const key = `fold:${fold.cast}`
          lines.push(`  '${key}': { cast: unknown }`)
          break
        }
        case 'hash': {
          const hash = cast as Hash
          const key = `hash:${hash.cast}`
          const itemType = renderLink(hash.like, ctx)
          lines.push(
            `  '${key}': { cast: Record<string, ${itemType}> }`,
          )
          break
        }
        case 'list': {
          const list = cast as List
          const key = `list:${list.cast}`
          const itemType = renderLink(list.like, ctx)
          lines.push(`  '${key}': { cast: ${itemType}[] }`)
          break
        }
      }
    }
  }

  lines.push('}')
  lines.push('')
  lines.push('export default Code')
  lines.push('')

  return lines.join('\n')
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
  for (const [name, link] of Object.entries(shape as LinkMesh)) {
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
    inner = renderShape(link.like as LinkMesh, ctx)
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
