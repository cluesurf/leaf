/**
 * Tests for `link.*` shape modifiers in the Book-driven codegen.
 *
 *   - `link.take: [...]` — enum / allowed-values
 *   - `link.list: true` — array wrapper
 *   - combination of both
 *
 * Generates a small inline Book through `Make`, inspects the
 * emitted TS aliases and Zod parsers.
 */

import { describe, it, expect } from 'vitest'
import save from '../code/save'

const inline = {
  make: [
    {
      form: 'form' as const,
      name: 'event',
      like: {
        // enum of strings
        action: { take: ['create', 'update', 'delete'] },
        // single allowed value
        single: { take: ['only'] },
        // mixed-type literals (numbers)
        numeric: { take: [1, 2, 3] },
        // primitive list
        tags: { like: 'string', list: true },
        // enum + list combination
        flags: { take: ['archived', 'pinned'], list: true },
      },
    },
  ],
}

describe('link.take (enum / allowed values)', () => {
  it('emits a string-literal union in TS', async () => {
    const r = await save({ link: '.', fake: true, book: inline })
    const ts = r.link['']
    expect(ts).toContain(
      "action: 'create' | 'update' | 'delete'",
    )
  })

  it('emits a single literal type for one allowed value', async () => {
    const r = await save({ link: '.', fake: true, book: inline })
    expect(r.link['']).toContain("single: 'only'")
  })

  it('emits a literal-number union for non-string values', async () => {
    const r = await save({ link: '.', fake: true, book: inline })
    expect(r.link['']).toContain('numeric: 1 | 2 | 3')
  })

})

describe('link.list (array wrapper)', () => {
  it('emits T[] in TS for primitive list', async () => {
    const r = await save({ link: '.', fake: true, book: inline })
    expect(r.link['']).toContain('tags: string[]')
  })
})

describe('link.take + link.list combined', () => {
  it('parenthesizes the union before [] in TS', async () => {
    const r = await save({ link: '.', fake: true, book: inline })
    // Without parens, prettier would emit a wrong-precedence type.
    expect(r.link['']).toContain(
      "flags: ('archived' | 'pinned')[]",
    )
  })
})
