import make_types, { Hold } from './form'
import make_parsers from './take'
import make_constants from './base'
import { Load, type Book } from '@/form'
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
 * `make.book(book)` registers a Book by appending it to the
 * internal list. `make.save()` walks every registered Book,
 * invokes `makeTree()` on the union, and writes the output.
 *
 * The bridge from the new Book-shaped registration surface to
 * the existing `MakeInput` codegen is intentionally thin —
 * `Make.save()` flattens registered Books' `base: Cast[]`
 * arrays into the `mesh` / `link` / `name` records the codegen
 * function expects.
 */
export type MakeTake = {
  link: string
}

export class Make {
  private books: Book[] = []

  constructor(private take: MakeTake) {}

  book(book: Book): this {
    this.books.push(book)
    return this
  }

  async save(): Promise<MakeBack> {
    // Flatten every registered Book's `base` array into the
    // BaseHash shapes the codegen function expects.
    const mesh: Record<string, any> = {}
    const link: Record<string, any> = {}
    const name: Record<string, string> = {}

    for (const book of this.books) {
      for (const cast of book.base ?? []) {
        if ('save' in cast && typeof cast.save === 'string') {
          mesh[cast.save] = cast
          link[cast.save] = cast
        }
      }
    }

    return makeTree({
      mesh,
      link,
      name,
      testLink: this.take.link,
      codeLink: this.take.link,
    })
  }
}
