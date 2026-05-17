/**
 * `base.mold(name, cast)` — schema validation through the
 * compiled walker. Forms are compiled to closures at
 * `base.load(book)` time and stored in `base.form` keyed by
 * `Form.name`.
 */

import { describe, it, expect } from 'vitest'
import { Base, cast } from '../code'
import type { Norm, Rule, Test } from '../code/form'

describe('base.mold(name, cast) — Form validation', () => {
  it('parses an object that matches the Form', () => {
    const base = new Base()
    base.load({
      make: [
        {
          form: 'form',
          name: 'language',
          like: {
            id:        { like: 'string' },
            iso_639_3: { like: 'string' },
          },
        },
      ],
    })

    const out = base.mold('language', {
      id: 'lang_001',
      iso_639_3: 'eng',
    })
    expect(out).toEqual({ id: 'lang_001', iso_639_3: 'eng' })
  })

  it('throws when a required field is missing', () => {
    const base = new Base()
    base.load({
      make: [
        {
          form: 'form',
          name: 'language',
          like: {
            id: { like: 'string' },
          },
        },
      ],
    })
    expect(() => base.mold('language', {})).toThrow(/field_missing/)
  })

  it('throws when a field has the wrong shape', () => {
    const base = new Base()
    base.load({
      make: [
        {
          form: 'form', name: 'language',
          like: { id: { like: 'string' } },
        },
      ],
    })
    expect(() => base.mold('language', { id: 42 })).toThrow(/shape_string/)
  })

  it('honors `need: false` for optional fields', () => {
    const base = new Base()
    base.load({
      make: [
        {
          form: 'form', name: 'language',
          like: {
            id:    { like: 'string' },
            label: { like: 'string', need: false },
          },
        },
      ],
    })
    expect(base.mold('language', { id: 'a' })).toEqual({ id: 'a' })
    expect(base.mold('language', { id: 'a', label: 'b' })).toEqual({
      id: 'a',
      label: 'b',
    })
  })

  it('validates `take:` enums', () => {
    const base = new Base()
    base.load({
      make: [
        {
          form: 'form', name: 'event',
          like: {
            kind: { take: ['create', 'update', 'delete'] },
          },
        },
      ],
    })
    expect(base.mold('event', { kind: 'create' })).toEqual({
      kind: 'create',
    })
    expect(() => base.mold('event', { kind: 'reset' })).toThrow(
      /enum_invalid/,
    )
  })

  it('validates `list: true` arrays', () => {
    const base = new Base()
    base.load({
      make: [
        {
          form: 'form', name: 'doc',
          like: {
            tags: { like: 'string', list: true },
          },
        },
      ],
    })
    expect(base.mold('doc', { tags: ['a', 'b'] })).toEqual({
      tags: ['a', 'b'],
    })
    expect(() => base.mold('doc', { tags: 'a' })).toThrow(/shape_array/)
    expect(() => base.mold('doc', { tags: ['a', 5] })).toThrow(
      /shape_string/,
    )
  })

  it('runs Mold pipelines on Link fields', async () => {
    const standardBook = (await import('../code/book')).default
    const base = new Base()
    base.load(standardBook)

    const trimmed: Norm = {
      form: 'norm',
      hook: cast.call('make:trimmed', {
        text: cast.read('self'),
      }),
    }
    const present: Rule = {
      form: 'rule',
      name: 'is:present',
      hook: cast.call('is:present', {
        thing: cast.read('self'),
      }),
      miss: 'must be present',
    }

    base.load({
      make: [
        {
          form: 'form', name: 'note',
          like: {
            title: { like: 'string', mold: [trimmed, present] },
          },
        },
      ],
    })

    expect(base.mold('note', { title: '  hello  ' })).toEqual({
      title: 'hello',
    })
    expect(() => base.mold('note', { title: '   ' })).toThrow(
      /must be present|mold_failed/,
    )
  })
})

describe('base.mold(name, cast) — recursion', () => {
  it('handles forward / mutual references via lazy resolution', () => {
    const base = new Base()
    base.load({
      make: [
        {
          form: 'form', name: 'tree',
          like: {
            value:    { like: 'string' },
            children: { like: 'tree', list: true, need: false },
          },
        },
      ],
    })

    const out = base.mold('tree', {
      value: 'root',
      children: [
        { value: 'a', children: [{ value: 'a1' }] },
        { value: 'b' },
      ],
    })
    expect(out).toMatchObject({
      value: 'root',
      children: [
        { value: 'a', children: [{ value: 'a1' }] },
        { value: 'b' },
      ],
    })
  })
})

describe('base.mold(name, cast) — tagged unions', () => {
  it('routes by the discriminant when meshes share a single-value `take:`', () => {
    const base = new Base()
    base.load({
      make: [
        {
          form: 'form', name: 'shape',
          like: [
            {
              form:   { take: ['circle'] },
              radius: { like: 'number' },
            },
            {
              form:  { take: ['square'] },
              side:  { like: 'number' },
            },
          ],
        },
      ],
    })

    expect(base.mold('shape', { form: 'circle', radius: 5 })).toEqual({
      form: 'circle',
      radius: 5,
    })
    expect(base.mold('shape', { form: 'square', side: 3 })).toEqual({
      form: 'square',
      side: 3,
    })
    expect(() => base.mold('shape', { form: 'triangle' })).toThrow(
      /union_tag/,
    )
  })
})

describe('Form-level mold (whole-record validation)', () => {
  it('runs a `Form.mold` Test against the entire object', async () => {
    const standardBook = (await import('../code/book')).default
    const base = new Base()
    base.load(standardBook)

    // Mirrors the user's `branch` example: at least one of
    // `yes` or `no` must be supplied. Modeled here as a Form
    // (Flow.mold runtime integration is a separate concern).
    base.load({
      make: [
        {
          form: 'form',
          name: 'branch_input',
          like: {
            test: { like: 'boolean', need: false },
            yes:  { like: 'unknown', need: false },
            no:   { like: 'unknown', need: false },
          },
          mold: [
            {
              form: 'rule',
              name: 'is:any-of-yes-or-no',
              hook: cast.call('is:any', {
                things: [
                  cast.call('is:present', {
                    thing: cast.read('self', 'yes'),
                  }),
                  cast.call('is:present', {
                    thing: cast.read('self', 'no'),
                  }),
                ],
              }),
              miss: 'Need `yes` or `no` at least',
            },
          ],
        },
      ],
    })

    // `yes` present → passes
    expect(
      base.mold('branch_input', { test: true, yes: 'a' }),
    ).toMatchObject({ test: true, yes: 'a' })

    // `no` present → passes
    expect(
      base.mold('branch_input', { test: false, no: 'b' }),
    ).toMatchObject({ test: false, no: 'b' })

    // Both `yes` and `no` present → passes
    expect(
      base.mold('branch_input', { test: false, yes: 'a', no: 'b' }),
    ).toMatchObject({ test: false, yes: 'a', no: 'b' })

    // Neither → fails the mold test
    expect(() => base.mold('branch_input', { test: true })).toThrow(
      /Need .yes. or .no. at least|mold_failed/,
    )
  })
})

describe('Link pipeline (the blogPost pattern)', () => {
  it('title trims; slug trims then asserts present', async () => {
    const standardBook = (await import('../code/book')).default
    const base = new Base()
    base.load(standardBook)

    const trimmed: Norm = {
      form: 'norm',
      take: 'string',
      make: 'string',
      hook: cast.call('make:trimmed', {
        text: cast.read('self'),
      }),
    }

    base.load({
      make: [
        {
          form: 'form',
          name: 'blog_post',
          like: {
            title: {
              like: 'string',
              need: false,
              mold: trimmed,
            },
            slug: {
              like: 'string',
              need: false,
              mold: [
                trimmed,
                {
                  form: 'rule',
                  name: 'is:present',
                  hook: cast.call('is:present', {
                    thing: cast.read('self'),
                  }),
                  miss: 'Slug blank problem :)',
                },
              ],
            },
          },
        },
      ],
    })

    // Title trims, slug trims + passes present
    expect(
      base.mold('blog_post', {
        title: '  Hello World  ',
        slug: '  hello-world  ',
      }),
    ).toEqual({
      title: 'Hello World',
      slug: 'hello-world',
    })

    // Slug that trims to empty fails the present test
    expect(() =>
      base.mold('blog_post', {
        title: '  ok  ',
        slug: '   ',
      }),
    ).toThrow(/Slug blank problem|mold_failed/)

    // Title-only is fine since slug is `need: false`
    expect(
      base.mold('blog_post', { title: '  trimmed  ' }),
    ).toEqual({ title: 'trimmed' })
  })

  it('Norm threads the rewritten value forward to the next Test', async () => {
    const standardBook = (await import('../code/book')).default
    const base = new Base()
    base.load(standardBook)

    base.load({
      make: [
        {
          form: 'form',
          name: 'note',
          like: {
            body: {
              like: 'string',
              mold: [
                {
                  form: 'norm',
                  hook: cast.call('make:trimmed', {
                    text: cast.read('self'),
                  }),
                },
                {
                  form: 'norm',
                  hook: cast.call('format:lowercase', {
                    text: cast.read('self'),
                  }),
                },
                {
                  form: 'rule',
                  name: 'is:present',
                  hook: cast.call('is:present', {
                    thing: cast.read('self'),
                  }),
                  miss: 'body must be present after normalization',
                },
              ],
            },
          },
        },
      ],
    })

    expect(
      base.mold('note', { body: '  HELLO  ' }),
    ).toEqual({ body: 'hello' })

    // Whitespace-only fails the post-trim present check
    expect(() =>
      base.mold('note', { body: '   ' }),
    ).toThrow(/must be present|mold_failed/)
  })
})

describe('Mold legacy `form: \'test\'` compat shim (0.9.x)', () => {
  it('still validates when a Mold uses the deprecated `form: \'test\'`', async () => {
    const standardBook = (await import('../code/book')).default
    const base = new Base()
    base.load(standardBook)

    base.load({
      make: [
        {
          form: 'form',
          name: 'note_legacy',
          like: {
            title: {
              like: 'string',
              // Deliberately uses the legacy `'test'` form to
              // verify the 0.9 compat shim. Will be removed in
              // 0.10 alongside the form itself.
              mold: {
                form: 'test',
                hook: cast.call('is:present', {
                  thing: cast.read('self'),
                }),
                miss: 'must be present (legacy)',
              } as unknown as Test,
            },
          },
        },
      ],
    })

    expect(base.mold('note_legacy', { title: 'hi' })).toEqual({
      title: 'hi',
    })
    expect(() => base.mold('note_legacy', { title: '' })).toThrow(
      /must be present \(legacy\)|mold_failed/,
    )
  })
})

describe('base.toss removes compiled forms', () => {
  it('after toss, mold(name) throws "no schema registered"', () => {
    const base = new Base()
    const book = {
      make: [
        {
          form: 'form' as const,
          name: 'tmp',
          like: { x: { like: 'string' as const } },
        },
      ],
    }
    base.load(book)
    expect(base.mold('tmp', { x: 'a' })).toEqual({ x: 'a' })
    base.toss(book)
    expect(() => base.mold('tmp', { x: 'a' })).toThrow(
      /no schema registered/,
    )
  })
})
