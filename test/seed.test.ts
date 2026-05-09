import { describe, expect, it } from 'vitest'
import { Base, cast } from '@/index'
import { compile } from '@/render'
import { makeScope } from '@/scope'
import type { Cast } from '@/cast'
import type { Seed } from '@/form'

describe('Seed Make declaration', () => {
  it('accepts the seed form and loads silently', () => {
    const seed: Seed = {
      form: 'seed',
      like: 'page_data:demo',
      cast: {
        title: { form: 'string', text: 'Hello' },
        count: { form: 'integer', value: 42 },
      },
    }
    const base = new Base()
    expect(() => base.load(seed)).not.toThrow()
  })

  it('renders typed-literal scalars to their inner value', () => {
    const tree: Cast = cast.text(
      cast.read('title'),
      ' — ',
      cast.read('count'),
    )
    const scope = makeScope({
      title: 'Hello',
      count: 42,
    })
    expect(compile(tree, 'text')(scope, {})).toBe('Hello — 42')
  })

  it('typed-literal forms render to their inner values', () => {
    const out = compile(cast.string('hi'), 'text')(makeScope({}), {})
    expect(out).toBe('hi')
    expect(compile(cast.integer(7), 'text')(makeScope({}), {})).toBe(7)
    expect(compile(cast.boolean(true), 'text')(makeScope({}), {})).toBe(true)
    expect(compile(cast.nil(), 'text')(makeScope({}), {})).toBe(null)
    expect(compile(cast.code('uuid-x'), 'text')(makeScope({}), {})).toBe(
      'uuid-x',
    )
  })

  it('range renders to a structured object', () => {
    const r = cast.range({
      like: 'integer',
      start: { inclusive: true, value: cast.integer(5) },
      end: { inclusive: false, value: cast.integer(10) },
    })
    expect(compile(r, 'text')(makeScope({}), {})).toEqual({
      form: 'range',
      like: 'integer',
      start: { inclusive: true, value: 5 },
      end: { inclusive: false, value: 10 },
    })
  })

  it('find throws if reached at render time (host must pre-resolve)', () => {
    const f = cast.find('select:language', {
      test: cast.code('uuid-spanish'),
    })
    expect(() =>
      compile(f, 'text')(makeScope({}), {}),
    ).toThrowError(/cast\.find: unresolved query 'select:language'/)
  })
})
