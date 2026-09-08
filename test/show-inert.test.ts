/**
 * `note`, `show` and `mark` are INERT in the codegen path.
 *
 * THE ONE THING THAT WOULD MAKE THEM UNSHIPPABLE. These three fields
 * are documentation, and 127 resource modules in `@cluesurf/base`
 * generate their typed client and Zod parsers from the same Forms. If
 * an annotation leaked into that output it would appear as a field on
 * every record shape, and the leak would be found by whoever's build
 * broke rather than here.
 *
 * The generators read a `Link` by known key (`link.need`, `link.take`,
 * `link.like`, `link.list`) rather than by walking its properties, so
 * this holds by construction. It is tested anyway, because the next
 * person to add an annotation will reach for `Object.entries(link)`
 * and this is what stops it.
 *
 * Also pinned: a Form annotated identically to an un-annotated one
 * emits BYTE-IDENTICAL output. That is the property that makes
 * annotating `deck/base` safe to do a field at a time.
 */

import { describe, it, expect } from 'vitest'
import save from '../code/save'

const bare = {
  make: [
    {
      form: 'form' as const,
      name: 'font',
      like: {
        name: { like: 'string' },
        weight: { like: 'number', base: 400 },
        status: { take: ['draft', 'live'] },
        tags: { like: 'string', list: true },
      },
    },
  ],
}

/** The same Form, annotated as heavily as the DSL allows. */
const said = {
  make: [
    {
      form: 'form' as const,
      name: 'font',
      note: 'A typeface, and every weight it ships.',
      mark: [{ form: 'experimental' as const, note: 'Shape may move.' }],
      like: {
        name: {
          like: 'string',
          note: 'The family name from the OS/2 table.',
          show: { by_weight: 'Inter', by_status: 'Inter' },
        },
        weight: {
          like: 'number',
          base: 400,
          note: 'The OS/2 weight class.',
          show: { by_weight: 800 },
          mark: [{ form: 'since' as const, note: '2026-09' }],
        },
        status: {
          take: ['draft', 'live'],
          note: 'Whether the family is published.',
          show: { by_status: 'live' },
          mark: [
            { form: 'deprecated' as const, note: 'Use `visibility`.' },
          ],
        },
        tags: {
          like: 'string',
          list: true,
          note: 'Free-form labels.',
          show: { by_status: 'display' },
        },
      },
    },
  ],
}

describe('the documentation fields do not reach the generated code', () => {
  it('emits byte-identical TypeScript with and without them', async () => {
    const plain = await save({ link: '.', fake: true, book: bare })
    const rich = await save({ link: '.', fake: true, book: said })

    expect(rich.link['']).toBe(plain.link[''])
  })

  it('names none of them anywhere in the output', async () => {
    const rich = await save({ link: '.', fake: true, book: said })

    for (const [name, text] of Object.entries(rich.link)) {
      for (const word of [
        'note',
        'show',
        'mark',
        'by_weight',
        'by_status',
        'experimental',
        'deprecated',
        'OS/2',
        'Shape may move',
      ]) {
        expect(
          text.includes(word),
          `${word} leaked into ${name || '(root)'}`,
        ).toBe(false)
      }
    }
  })

  it('still emits the shape the Form declares', async () => {
    const rich = await save({ link: '.', fake: true, book: said })
    const ts = rich.link['']

    // The annotations are gone and the schema is untouched: the
    // take is still a union, the list is still an array, the
    // optional-ness is unchanged.
    expect(ts).toContain('name: string')
    expect(ts).toContain('weight: number')
    expect(ts).toContain("'draft' | 'live'")
    expect(ts).toContain('tags: string[]')
  })
})
