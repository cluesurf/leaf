/**
 * Build-time script: generate `code/base/code.ts` (the bundled
 * `Code` aggregate + `CodeLink` table) and per-`save`-directory
 * `index.ts` files (one per verb group) from the standard
 * catalog Book. Run with `pnpm tsx task/save.ts` (or
 * `pnpm make:base`).
 */

import { Make } from '../code/make'
import beadBook from '../code/book'

async function main() {
  const make = new Make({ link: 'code/base' })
  make.load(beadBook)

  const result = await make.save()

  console.log(
    `wrote code/base/code.ts (${result.code.length} chars, ${
      result.code.split('\n').length
    } lines)`,
  )
  for (const [stream, bundle] of [
    ['index.ts', result.link],
    ['form.ts', result.form],
    ['base.ts', result.base],
  ] as const) {
    for (const [save, content] of Object.entries(bundle)) {
      const dir = save || '(root)'
      console.log(
        `wrote code/base/${dir}/${stream} (${content.length} chars, ${
          content.split('\n').length
        } lines)`,
      )
    }
  }
}

main()
