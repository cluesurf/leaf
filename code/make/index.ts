import fs from 'node:fs/promises'
import type { Book } from '@/form'
import { collectCollisions } from './check'
import { makeBookCode } from './form/typescript'
import { makeBookForm } from './form/zod'
import { makeBookBase } from './base'
import { wash } from './wash'

/**
 * `Make` is the codegen orchestrator.
 *
 *     const make = new Make({ link: './libs' })
 *     make.load(beadBook)
 *     make.load(myAppBook)
 *     await make.save()
 *
 * `make.load(book)` registers a Book; `make.save()` runs the
 * codegen and (when `link` is a real directory) writes the
 * generated files to disk. Every emitted file is washed
 * through the host's ESLint + Prettier configs (when present),
 * matching VS Code "Save" semantics.
 */
export type MakeTake = {
  /** Root output folder for generated files. */
  link: string
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
  }> {
    const collisions = collectCollisions(this.books)
    if (collisions.length > 0) {
      throw new Error(
        `Make.save: identity-tuple collisions:\n` +
          collisions.map(c => `  ${c}`).join('\n'),
      )
    }

    const root = this.take.link
    const { code, link } = makeBookCode(this.books)
    const form = makeBookForm(this.books)
    const base = makeBookBase(this.books)

    const dryWrite = this.take.dry
    const writeOne = async (filePath: string, content: string) => {
      const formatted = await wash(filePath, content)
      if (!dryWrite) {
        await fs.mkdir(dirname(filePath), { recursive: true })
        await fs.writeFile(filePath, formatted)
      }
      return formatted
    }

    const dirFor = (subdir: string) =>
      subdir ? `${root}/${subdir}` : root

    const [
      formattedCode,
      linkPairs,
      formPairs,
      basePairs,
    ] = await Promise.all([
      writeOne(`${root}/code.ts`, code),
      Promise.all(
        Object.entries(link).map(async ([subdir, content]) => [
          subdir,
          await writeOne(`${dirFor(subdir)}/index.ts`, content),
        ] as const),
      ),
      Promise.all(
        Object.entries(form).map(async ([subdir, content]) => [
          subdir,
          await writeOne(`${dirFor(subdir)}/form.ts`, content),
        ] as const),
      ),
      Promise.all(
        Object.entries(base).map(async ([subdir, content]) => [
          subdir,
          await writeOne(`${dirFor(subdir)}/base.ts`, content),
        ] as const),
      ),
    ])

    return {
      code: formattedCode,
      link: Object.fromEntries(linkPairs),
      form: Object.fromEntries(formPairs),
      base: Object.fromEntries(basePairs),
    }
  }
}

function dirname(filePath: string): string {
  const slash = filePath.lastIndexOf('/')
  return slash > -1 ? filePath.slice(0, slash) : '.'
}
