import fs from 'node:fs/promises'
import type { Book } from '@/form'
import { collectCollisions } from './check'
import { makeBookCode } from './typescript'
import { makeBookData } from './data'
import { wash } from './wash'

/**
 * Codegen entry point. Walks the registered Book(s), validates
 * identity-tuple uniqueness, and emits the generated artifacts
 * to `link` (or returns them in-memory when `fake: true`).
 *
 *     import save from '@cluesurf/bead/save'
 *     import beadBook from './book'
 *
 *     await save({ link: 'host/code', book: beadBook })
 *
 * `book` accepts a single Book or an array. Output:
 *
 *   <link>/code.ts            — bundled Code aggregate + CodeLink
 *   <link>/<save>/index.ts    — TS type aliases per declared cast
 *   <link>/<save>/data.ts     — literal data for Hash/List with `load:`
 *
 * Every emitted file is washed through the host's ESLint +
 * Prettier configs (when present), matching VS Code "Save"
 * semantics.
 */
export type SaveTake = {
  /** Root output directory. */
  link: string
  /** One or more Books to feed into the codegen. */
  book: Book | Book[]
  /**
   * When true, returns the in-memory result without writing
   * to disk. Useful for tests.
   */
  fake?: boolean
}

export type SaveMake = {
  /** Bundled `code.ts` content — Code aggregate + CodeLink. */
  code: string
  /** Per-`save`-directory `index.ts` content (TS type aliases). */
  link: Record<string, string>
  /** Per-`save`-directory `data.ts` content (Hash/List literal data). */
  base: Record<string, string>
}

export default async function save(take: SaveTake): Promise<SaveMake> {
  const books = Array.isArray(take.book) ? take.book : [take.book]

  const collisions = collectCollisions(books)
  if (collisions.length > 0) {
    throw new Error(
      `save: identity-tuple collisions:\n` +
        collisions.map(c => `  ${c}`).join('\n'),
    )
  }

  const root = take.link
  const { code, link } = makeBookCode(books)
  const data = makeBookData(books)

  const fakeWrite = take.fake
  const writeOne = async (filePath: string, content: string) => {
    const formatted = await wash(filePath, content)
    if (!fakeWrite) {
      await fs.mkdir(dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, formatted)
    }
    return formatted
  }

  const dirFor = (subdir: string) =>
    subdir ? `${root}/${subdir}` : root

  const [formattedCode, linkPairs, dataPairs] = await Promise.all([
    writeOne(`${root}/code.ts`, code),
    Promise.all(
      Object.entries(link).map(
        async ([subdir, content]) =>
          [
            subdir,
            await writeOne(`${dirFor(subdir)}/index.ts`, content),
          ] as const,
      ),
    ),
    Promise.all(
      Object.entries(data).map(
        async ([subdir, content]) =>
          [
            subdir,
            await writeOne(`${dirFor(subdir)}/data.ts`, content),
          ] as const,
      ),
    ),
  ])

  return {
    code: formattedCode,
    link: Object.fromEntries(linkPairs),
    base: Object.fromEntries(dataPairs),
  }
}

function dirname(filePath: string): string {
  const slash = filePath.lastIndexOf('/')
  return slash > -1 ? filePath.slice(0, slash) : '.'
}
