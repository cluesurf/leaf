/**
 * Build-time script: generate `code/base/code.ts` from the
 * standard catalog Book. Run with `pnpm tsx task/save.ts`
 * (or `pnpm make:base`).
 *
 * Output: `code/base/code.ts` — the colon-keyed `Code` type
 * aggregating every entry in the standard catalog. Consumed
 * by `Base<Code>` for type inference.
 */

import fs from 'node:fs'
import { Make } from '../code/make'
import standard from '../code/base'

async function main() {
  const make = new Make({ link: 'code/base', dry: true })
  make.book(standard)

  const result = await make.save()

  fs.writeFileSync('code/base/code.ts', result.code)
  console.log(
    `wrote code/base/code.ts (${result.code.length} chars, ${
      result.code.split('\n').length
    } lines)`,
  )
}

main()
