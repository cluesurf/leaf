/**
 * Build-time codegen. Reads the standard catalog Book and
 * regenerates the per-verb TS type aliases plus the bundled
 * `Code` aggregate + `CodeLink` integer-id table.
 *
 * Output (rooted at `code/book`):
 *   code.ts                — Code + CodeLink
 *   <verb>/index.ts        — TS type aliases per declared cast
 *   <verb>/data.ts         — literal data for Hash/List with `load:`
 *
 * Run with `pnpm tsx task/save.ts` (or `pnpm make:base`).
 */

import save from '../code/save'
import beadBook from '../code/book'

async function main() {
  const result = await save({ link: 'code/book', book: beadBook })

  const codeLines = result.code.split('\n').length
  console.log(
    `wrote code/book/code.ts (${result.code.length} chars, ${codeLines} lines)`,
  )
  for (const [stream, bundle] of [
    ['index.ts', result.link],
    ['data.ts', result.base],
  ] as const) {
    for (const [verb, content] of Object.entries(bundle)) {
      const dir = verb || '(root)'
      console.log(
        `wrote code/book/${dir}/${stream} (${content.length} chars, ${
          content.split('\n').length
        } lines)`,
      )
    }
  }
}

main()
