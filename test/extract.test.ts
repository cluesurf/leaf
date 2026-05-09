import { describe, expect, it } from 'vitest'
import { cast } from '@/index'
import {
  extractFinds,
  extractCodes,
  substituteFinds,
} from '@/extract'
import type { Cast, FindPrimitive } from '@/cast'

describe('extractFinds', () => {
  it('returns empty for non-find trees', () => {
    expect(extractFinds(cast.string('hi'))).toEqual([])
    expect(extractFinds({ form: 'hash', base: { a: cast.integer(1) } })).toEqual([])
  })

  it('returns a single find', () => {
    const f = cast.find('select:language')
    expect(extractFinds(f)).toEqual([f])
  })

  it('finds nested finds inside a hash', () => {
    const fA = cast.find('select:language')
    const fB = cast.find('filter:word')
    const tree: Cast = {
      form: 'hash',
      base: {
        language: fA,
        words: fB,
        title: cast.string('Demo'),
      },
    }
    const out = extractFinds(tree)
    expect(out).toHaveLength(2)
    expect(out).toContain(fA)
    expect(out).toContain(fB)
  })

  it('finds finds inside list and seed.cast values', () => {
    const fA = cast.find('select:foo')
    const seed = {
      form: 'seed',
      like: 'demo',
      cast: {
        items: { form: 'list', list: [fA] },
      },
    } as unknown as Cast
    expect(extractFinds(seed)).toEqual([fA])
  })

  it('does not recurse into Dates', () => {
    const tree: Cast = { form: 'hash', base: { d: new Date() as unknown as Cast } }
    expect(extractFinds(tree)).toEqual([])
  })
})

describe('extractCodes', () => {
  it('infers resource type from enclosing find.call', () => {
    const tree = cast.find('select:language', {
      test: cast.code('uuid-spanish'),
    })
    const out = extractCodes(tree)
    expect(out).toHaveLength(1)
    expect(out[0]?.code.text).toBe('uuid-spanish')
    expect(out[0]?.resource).toBe('language')
  })

  it('uses explicit code.base if set', () => {
    const tree = cast.code('uuid-x', 'language')
    const [hit] = extractCodes(tree)
    expect(hit?.resource).toBe('language')
  })

  it('explicit code.base overrides enclosing find.call', () => {
    const tree = cast.find('select:language', {
      test: cast.code('uuid-x', 'word'),
    })
    const [hit] = extractCodes(tree)
    expect(hit?.resource).toBe('word')
  })

  it('returns undefined resource when no context available', () => {
    const tree = cast.code('uuid-x')
    const [hit] = extractCodes(tree)
    expect(hit?.resource).toBeUndefined()
  })

  it('extracts multiple codes inside an `all` test', () => {
    const tree = cast.find('filter:language-string', {
      test: {
        form: 'call',
        name: 'is',
        case: 'all',
        things: {
          form: 'list',
          list: [
            cast.code('uuid-a'),
            cast.code('uuid-b'),
          ],
        },
      } as unknown as Cast,
    })
    const out = extractCodes(tree)
    expect(out.map(o => o.code.text)).toEqual(['uuid-a', 'uuid-b'])
    expect(out.every(o => o.resource === 'language-string')).toBe(true)
  })
})

describe('substituteFinds', () => {
  it('replaces a single find with its resolved value', () => {
    const f = cast.find('select:language')
    const resolved: Cast = cast.string('Spanish')
    const out = substituteFinds(f, new Map([[f, resolved]]))
    expect(out).toEqual(resolved)
  })

  it('replaces nested finds inside a hash', () => {
    const f = cast.find('select:language')
    const tree: Cast = {
      form: 'hash',
      base: { language: f, title: cast.string('Demo') },
    }
    const resolved: Cast = cast.string('Spanish')
    const out = substituteFinds(tree, new Map([[f, resolved]]))
    expect(out).toEqual({
      form: 'hash',
      base: { language: cast.string('Spanish'), title: cast.string('Demo') },
    })
  })

  it('leaves the tree unchanged when no resolutions provided', () => {
    const f = cast.find('select:language')
    const tree: Cast = {
      form: 'hash',
      base: { language: f },
    }
    const out = substituteFinds(tree, new Map())
    expect(out).toEqual(tree)
  })

  it('does not mutate the input tree', () => {
    const f = cast.find('select:language')
    const tree: Cast = { form: 'hash', base: { language: f } }
    substituteFinds(tree, new Map([[f, cast.string('X')]]))
    expect((tree as { base: Record<string, Cast> }).base.language).toBe(f)
  })

  it('recurses into find.test (which is itself a Cast)', () => {
    const inner = cast.find('select:language')
    const outer = cast.find('filter:word', { test: inner })
    const out = substituteFinds(
      outer,
      new Map<FindPrimitive, Cast>([[inner, cast.string('resolved')]]),
    )
    // outer's `test:` is now the resolved value; outer itself is
    // unresolved (not in the map), so it remains as a find with
    // its test substituted.
    expect((out as FindPrimitive).form).toBe('find')
    expect((out as FindPrimitive).test).toEqual(cast.string('resolved'))
  })
})
