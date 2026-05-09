import { describe, expect, it } from 'vitest'
import { Base, cast } from '@/index'
import standard from '@/book'

const base = new Base()
base.load(standard)

describe('Cast-shape predicates (Mold gating)', () => {
  describe('is:literal-string', () => {
    it('accepts plain strings without pattern chars', () => {
      expect(
        base.call('is:literal-string', { thing: cast.string('english') }),
      ).toBe(true)
      expect(
        base.call('is:literal-string', { thing: cast.string('Hello, world.') }),
      ).toBe(true)
    })

    it('rejects strings with pattern syntax', () => {
      expect(
        base.call('is:literal-string', { thing: cast.string('hello*') }),
      ).toBe(false)
      expect(
        base.call('is:literal-string', { thing: cast.string('c?t') }),
      ).toBe(false)
      expect(
        base.call('is:literal-string', { thing: cast.string('~helo') }),
      ).toBe(false)
      expect(
        base.call('is:literal-string', { thing: cast.string('k[ieaou]*') }),
      ).toBe(false)
      expect(
        base.call('is:literal-string', { thing: cast.string('k\\{vowel}*') }),
      ).toBe(false)
    })

    it('rejects non-string forms', () => {
      expect(
        base.call('is:literal-string', { thing: cast.integer(5) }),
      ).toBe(false)
      expect(base.call('is:literal-string', { thing: 'plain' })).toBe(false)
    })
  })

  describe('is:string-pattern', () => {
    it('accepts both plain and pattern-bearing strings', () => {
      expect(
        base.call('is:string-pattern', { thing: cast.string('english') }),
      ).toBe(true)
      expect(
        base.call('is:string-pattern', { thing: cast.string('hello*') }),
      ).toBe(true)
    })

    it('rejects non-string forms', () => {
      expect(base.call('is:string-pattern', { thing: cast.code('x') })).toBe(
        false,
      )
    })
  })

  describe('is:integer-literal', () => {
    it('accepts integer wrapped form', () => {
      expect(
        base.call('is:integer-literal', { thing: cast.integer(5) }),
      ).toBe(true)
    })
    it('rejects decimal, string, range', () => {
      expect(
        base.call('is:integer-literal', { thing: cast.decimal(3.14) }),
      ).toBe(false)
      expect(
        base.call('is:integer-literal', {
          thing: cast.range({ like: 'integer' }),
        }),
      ).toBe(false)
    })
  })

  describe('is:integer-range', () => {
    it('accepts integer range', () => {
      const r = cast.range({
        like: 'integer',
        start: { inclusive: true, value: cast.integer(5) },
        end: { inclusive: false, value: cast.integer(10) },
      })
      expect(base.call('is:integer-range', { thing: r })).toBe(true)
    })

    it('rejects decimal range or non-range', () => {
      const r = cast.range({ like: 'decimal' })
      expect(base.call('is:integer-range', { thing: r })).toBe(false)
      expect(base.call('is:integer-range', { thing: cast.integer(5) })).toBe(
        false,
      )
    })
  })

  describe('is:date-literal + is:date-range', () => {
    it('accepts date wrapped form', () => {
      expect(
        base.call('is:date-literal', { thing: cast.date('2025-01-15') }),
      ).toBe(true)
    })
    it('rejects invalid date strings', () => {
      expect(
        base.call('is:date-literal', {
          thing: { form: 'date', value: 'not-a-date' },
        }),
      ).toBe(false)
    })
    it('accepts date range', () => {
      const r = cast.range({
        like: 'date',
        start: { inclusive: true, value: cast.date('2025-01-01') },
        end: { inclusive: true, value: cast.date('2025-12-31') },
      })
      expect(base.call('is:date-range', { thing: r })).toBe(true)
    })
  })

  describe('is:boolean-literal + is:code-literal', () => {
    it('accepts wrapped forms', () => {
      expect(
        base.call('is:boolean-literal', { thing: cast.boolean(true) }),
      ).toBe(true)
      expect(
        base.call('is:code-literal', { thing: cast.code('uuid-x') }),
      ).toBe(true)
    })
    it('rejects mismatched forms', () => {
      expect(
        base.call('is:boolean-literal', { thing: cast.code('x') }),
      ).toBe(false)
    })
  })

  describe('composition via is:any', () => {
    it('integer-literal OR integer-range allows both', () => {
      const allow = (thing: unknown) =>
        base.call('is:any', {
          things: [
            base.call('is:integer-literal', { thing }),
            base.call('is:integer-range', { thing }),
          ],
        })
      expect(allow(cast.integer(5))).toBe(true)
      expect(
        allow(
          cast.range({
            like: 'integer',
            start: { inclusive: true, value: cast.integer(0) },
            end: { inclusive: true, value: cast.integer(9) },
          }),
        ),
      ).toBe(true)
      expect(allow(cast.string('foo'))).toBe(false)
    })
  })
})
