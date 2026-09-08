/**
 * `note`, `show` and `mark`: the documentation layer on the Form DSL.
 *
 * The rules these pin, each of which is a decision that could have
 * gone another way:
 *
 *   - a named example composes into a COMPLETE object, because a
 *     fragment is not something a reader can paste
 *   - `show` beats `base` beats a synthesised value
 *   - `list: true` means `show` is one element and the walker wraps it
 *   - a union picks the member declaring the name, and ambiguity is a
 *     fault rather than a coin toss
 *   - an example that disagrees with its own schema is reported
 *   - a field marked `internal` is in neither the example nor the docs
 *
 * The composition rule is the one worth the most tests. A per-field
 * example that only emits the fields somebody annotated looks correct
 * on a two-field shape and falls apart on a real one.
 */

import { describe, it, expect } from 'vitest'
import { readShow, readMark } from '../code/show'
import type { Form } from '../code/form'

/** A filter request, the shape most of these rules are about. */
const font = {
  form: 'form',
  name: 'filter_font_request',
  note: 'Search the font catalogue.',
  like: {
    size: { like: 'number', base: 20 },
    weight: {
      like: 'number',
      base: 400,
      note: 'The OS/2 weight class.',
      show: { by_weight: 800 },
    },
    script: {
      like: 'string',
      base: 'latin',
      show: { by_script: 'hebrew' },
    },
  },
} satisfies Form

describe('readShow, composing a named example', () => {
  it('names every example any field declares', () => {
    const read = readShow(font)

    expect(read.case.map(one => one.name)).toEqual([
      'by_weight',
      'by_script',
    ])
    expect(read.miss).toEqual([])
  })

  /*
   * THE RULE THE WHOLE DESIGN RESTS ON. One field declares the name
   * and the other two fall back to their defaults, so the example is
   * a request rather than a fragment of one.
   */
  it('fills every other field from base, so the example is complete', () => {
    const read = readShow(font)
    const one = read.case.find(x => x.name === 'by_weight')!

    expect(one.base).toEqual({ size: 20, weight: 800, script: 'latin' })
  })

  it('gives each example its own values', () => {
    const read = readShow(font)
    const one = read.case.find(x => x.name === 'by_script')!

    expect(one.base).toEqual({ size: 20, weight: 400, script: 'hebrew' })
  })

  /*
   * The contributor list is what makes a typo visible. `by_weight`
   * with three contributors beside `byWeight` with one is a
   * misspelling, and a generator can say so.
   */
  it('records which fields had a hand in each example', () => {
    const read = readShow(font)

    expect(read.case.find(x => x.name === 'by_weight')!.from).toEqual([
      'weight',
    ])
    expect(read.case.find(x => x.name === 'by_script')!.from).toEqual([
      'script',
    ])
  })

  it('has no examples when nothing declares one', () => {
    const bare = {
      form: 'form',
      name: 'bare',
      like: { id: { like: 'string' } },
    } satisfies Form

    expect(readShow(bare).case).toEqual([])
  })
})

describe('readShow, falling back', () => {
  it('prefers show, then base, then a synthesised value', () => {
    const form = {
      form: 'form',
      name: 'order',
      like: {
        told: { like: 'string', base: 'from base', show: { one: 'from show' } },
        based: { like: 'string', base: 'from base' },
        bare: { like: 'string' },
      },
    } satisfies Form

    expect(readShow(form).case[0]!.base).toEqual({
      told: 'from show',
      based: 'from base',
      bare: null,
    })
  })

  /*
   * A single-value `take` IS the answer, so a discriminant documents
   * itself and nobody annotates `form: 'create'` by hand.
   */
  it('synthesises a single-value take as that value', () => {
    const form = {
      form: 'form',
      name: 'kind',
      like: {
        form: { like: 'string', take: ['create'] },
        name: { like: 'string', show: { one: 'Inter' } },
      },
    } satisfies Form

    expect(readShow(form).case[0]!.base).toEqual({
      form: 'create',
      name: 'Inter',
    })
  })

  /* Never the string `'string'`, which is the placeholder that makes
   * a generated reference read as unfinished. */
  it('never synthesises a type name as a value', () => {
    const form = {
      form: 'form',
      name: 'kinds',
      like: {
        a: { like: 'string' },
        b: { like: 'boolean' },
        c: { like: 'number' },
        d: { like: 'integer' },
        e: { like: { deep: { like: 'string' } } },
        f: { like: 'string', show: { one: 'x' } },
      },
    } satisfies Form

    const made = readShow(form).case[0]!.base as Record<string, unknown>

    expect(made.a).toBeNull()
    expect(made.b).toBe(false)
    expect(made.c).toBe(0)
    expect(made.d).toBe(0)
    expect(made.e).toEqual({ deep: null })
  })
})

describe('readShow, nesting', () => {
  it('reaches a field declared inside a nested shape', () => {
    const form = {
      form: 'form',
      name: 'nested',
      like: {
        size: { like: 'number', base: 20 },
        test: {
          like: {
            weight: { like: 'number', base: 400, show: { heavy: 900 } },
            script: { like: 'string', base: 'latin' },
          },
        },
      },
    } satisfies Form

    const read = readShow(form)

    expect(read.case[0]!.base).toEqual({
      size: 20,
      test: { weight: 900, script: 'latin' },
    })
    expect(read.case[0]!.from).toEqual(['test.weight'])
  })
})

describe('readShow, lists', () => {
  it('wraps a single show value on a list field', () => {
    const form = {
      form: 'form',
      name: 'listed',
      like: { tags: { like: 'string', list: true, show: { one: 'latin' } } },
    } satisfies Form

    expect(readShow(form).case[0]!.base).toEqual({ tags: ['latin'] })
  })

  /* An array passes through, which is how a caller says "these exact
   * elements" rather than "one of them". */
  it('passes an array through untouched', () => {
    const form = {
      form: 'form',
      name: 'listed',
      like: {
        tags: {
          like: 'string',
          list: true,
          show: { one: ['latin', 'greek'] },
        },
      },
    } satisfies Form

    expect(readShow(form).case[0]!.base).toEqual({
      tags: ['latin', 'greek'],
    })
  })

  it('wraps a base and a synthesised value too', () => {
    const form = {
      form: 'form',
      name: 'listed',
      like: {
        based: { like: 'string', list: true, base: 'latin' },
        bare: { like: 'boolean', list: true },
        told: { like: 'string', show: { one: 'x' } },
      },
    } satisfies Form

    const made = readShow(form).case[0]!.base as Record<string, unknown>

    expect(made.based).toEqual(['latin'])
    expect(made.bare).toEqual([false])
  })
})

describe('readShow, unions', () => {
  /** The shape a `mutate` request actually has. */
  const mutate = {
    form: 'form',
    name: 'mutate_font_input',
    like: [
      {
        form: { like: 'string', take: ['create'] },
        base: {
          like: {
            name: { like: 'string', show: { create_one: 'Inter' } },
            weight: { like: 'number', base: 400 },
          },
        },
      },
      {
        form: { like: 'string', take: ['update'] },
        base: {
          like: {
            id: { like: 'string', show: { update_one: 'kvmtnhbs' } },
          },
        },
      },
      {
        form: { like: 'string', take: ['remove'] },
        base: { like: { id: { like: 'string' } } },
      },
    ],
  } satisfies Form

  it('selects the member whose fields declare the name', () => {
    const read = readShow(mutate)
    const made = read.case.find(x => x.name === 'create_one')!

    expect(made.base).toEqual({
      form: 'create',
      base: { name: 'Inter', weight: 400 },
    })
    expect(read.miss).toEqual([])
  })

  it('selects a different member for a different name', () => {
    const made = readShow(mutate).case.find(
      x => x.name === 'update_one',
    )!

    expect(made.base).toEqual({
      form: 'update',
      base: { id: 'kvmtnhbs' },
    })
  })

  /*
   * AMBIGUITY IS A FAULT, not a coin toss. An example picked silently
   * would be right about its values and wrong about its shape, which
   * is the hardest kind of wrong to notice in a document.
   */
  it('reports a name declared in more than one member', () => {
    const both = {
      form: 'form',
      name: 'both',
      like: [
        { a: { like: 'string', show: { one: 'x' } } },
        { b: { like: 'string', show: { one: 'y' } } },
      ],
    } satisfies Form

    const read = readShow(both)

    expect(read.miss).toHaveLength(1)
    expect(read.miss[0]!.name).toBe('one')
    expect(read.miss[0]!.note).toContain('ambiguous')
  })

  it('falls back to the first member when nothing declares it', () => {
    const read = readShow({
      form: 'form',
      name: 'neither',
      like: [
        { a: { like: 'string', base: 'first' } },
        { b: { like: 'string', base: 'second' } },
      ],
    } satisfies Form)

    expect(read.case).toEqual([])
  })
})

describe('readShow, refusing a value that disagrees with its field', () => {
  it('reports a wrong primitive type', () => {
    const read = readShow({
      form: 'form',
      name: 'wrong',
      like: { weight: { like: 'number', show: { one: 'heavy' } } },
    } satisfies Form)

    expect(read.miss).toHaveLength(1)
    expect(read.miss[0]!.path).toBe('weight')
    expect(read.miss[0]!.note).toContain('is a string')
  })

  it('reports a value outside a take', () => {
    const read = readShow({
      form: 'form',
      name: 'wrong',
      like: {
        status: {
          like: 'string',
          take: ['candidate', 'accepted'],
          show: { one: 'rejected' },
        },
      },
    } satisfies Form)

    expect(read.miss).toHaveLength(1)
    expect(read.miss[0]!.note).toContain('is not one of')
  })

  it('reports an array on a field that is not a list', () => {
    const read = readShow({
      form: 'form',
      name: 'wrong',
      like: { name: { like: 'string', show: { one: ['a', 'b'] } } },
    } satisfies Form)

    expect(read.miss.some(one => one.note.includes('not a list'))).toBe(
      true,
    )
  })

  it('checks every element of a list against its take', () => {
    const read = readShow({
      form: 'form',
      name: 'wrong',
      like: {
        tags: {
          like: 'string',
          list: true,
          take: ['latin', 'greek'],
          show: { one: ['latin', 'runic'] },
        },
      },
    } satisfies Form)

    expect(read.miss).toHaveLength(1)
    expect(read.miss[0]!.note).toContain('"runic"')
  })

  /*
   * `like: 'other_form'` is a reference this module cannot resolve.
   * Refusing what it cannot check would fail every legitimate nested
   * example, so an unknown type name is left alone.
   */
  it('leaves a Form reference alone rather than guessing at it', () => {
    const read = readShow({
      form: 'form',
      name: 'ref',
      like: { at: { like: 'some_other_form', show: { one: { id: 'x' } } } },
    } satisfies Form)

    expect(read.miss).toEqual([])
  })

  it('checks a base as well as a show', () => {
    const read = readShow({
      form: 'form',
      name: 'wrong',
      like: {
        weight: { like: 'number', base: 'heavy' },
        name: { like: 'string', show: { one: 'Inter' } },
      },
    } satisfies Form)

    expect(read.miss.some(one => one.path === 'weight')).toBe(true)
  })

  /* Everything wrong, not the first thing wrong, so a caller fixes
   * them in one pass. */
  it('reports every fault rather than the first', () => {
    const read = readShow({
      form: 'form',
      name: 'wrong',
      like: {
        a: { like: 'number', show: { one: 'no' } },
        b: { like: 'boolean', show: { one: 'no' } },
      },
    } satisfies Form)

    expect(read.miss).toHaveLength(2)
  })
})

describe('mark', () => {
  const form = {
    form: 'form',
    name: 'marked',
    like: {
      name: { like: 'string', show: { one: 'Inter' } },
      origin: {
        like: 'string',
        base: 'natural',
        mark: [
          { form: 'deprecated', note: 'Use `visibility` instead.' },
        ],
      },
      secret: {
        like: 'string',
        base: 'hidden',
        mark: [{ form: 'internal' }],
      },
    },
  } satisfies Form

  /*
   * AN INTERNAL FIELD IS NOT IN THE EXAMPLE, for the same reason it
   * is not in the reference: an example is a promise about the shape,
   * and showing a field nobody may rely on makes a promise nobody
   * meant.
   */
  it('omits an internal field from the example', () => {
    const made = readShow(form).case[0]!.base as Record<string, unknown>

    expect(made).toEqual({ name: 'Inter', origin: 'natural' })
    expect('secret' in made).toBe(false)
  })

  it('keeps a deprecated field, because it still works', () => {
    const made = readShow(form).case[0]!.base as Record<string, unknown>

    expect(made.origin).toBe('natural')
  })

  it('reads a mark of one kind by path', () => {
    expect(readMark(form, 'deprecated')).toEqual([
      { path: 'origin', note: 'Use `visibility` instead.' },
    ])
    expect(readMark(form, 'internal')).toEqual([
      { path: 'secret', note: undefined },
    ])
    expect(readMark(form, 'experimental')).toEqual([])
  })

  it('reads a mark on the Form itself, at the empty path', () => {
    const whole = {
      form: 'form',
      name: 'whole',
      mark: [{ form: 'experimental', note: 'Shape may change.' }],
      like: { id: { like: 'string' } },
    } satisfies Form

    expect(readMark(whole, 'experimental')).toEqual([
      { path: '', note: 'Shape may change.' },
    ])
  })

  it('finds a mark nested inside a shape', () => {
    const deep = {
      form: 'form',
      name: 'deep',
      like: {
        test: {
          like: {
            old: { like: 'string', mark: [{ form: 'deprecated' }] },
          },
        },
      },
    } satisfies Form

    expect(readMark(deep, 'deprecated')).toEqual([
      { path: 'test.old', note: undefined },
    ])
  })

  it('gives an internal Form no examples at all', () => {
    const hidden = {
      form: 'form',
      name: 'hidden',
      mark: [{ form: 'internal' }],
      like: { name: { like: 'string', show: { one: 'x' } } },
    } satisfies Form

    expect(readShow(hidden).case).toEqual([])
  })
})

describe('note', () => {
  /*
   * `note` is inert: it is read by a documentation generator and by
   * nothing else. The test that matters is that it is DECLARABLE
   * everywhere, which the type checker settles at compile time, and
   * that it survives to a reader.
   */
  it('is readable off a Form and off its fields', () => {
    expect(font.note).toBe('Search the font catalogue.')
    expect(font.like.weight.note).toBe('The OS/2 weight class.')
  })
})
