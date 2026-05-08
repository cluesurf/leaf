import { describe, it, expect } from 'vitest'
import { Base } from '../code'
import standard, { hooks, CodeLink, type Code } from '../code/base'

describe('format verb — text shaping', () => {
  const base = new Base<Code>()
  base.bind(standard, hooks, CodeLink)

  it('format:capitalized capitalizes the first letter', () => {
    expect(
      base.call('format', { base: 'capitalized', text: 'hello' }),
    ).toBe('Hello')
    expect(
      base.call('format', { base: 'capitalized', text: '' }),
    ).toBe('')
  })

  it('format:reversed reverses unicode-aware', () => {
    expect(
      base.call('format', { base: 'reversed', text: 'hello' }),
    ).toBe('olleh')
    expect(
      base.call('format', { base: 'reversed', text: '🚀abc' }),
    ).toBe('cba🚀')
  })

  it('format:joined joins with optional separator', () => {
    expect(
      base.call('format', {
        base: 'joined',
        parts: ['a', 'b', 'c'],
        separator: '-',
      }),
    ).toBe('a-b-c')
    expect(
      base.call('format', {
        base: 'joined',
        parts: ['x', 'y'],
      }),
    ).toBe('xy')
  })

  it('format:split returns the value envelope', () => {
    expect(
      base.call('format', {
        base: 'split',
        text: 'a,b,c',
        separator: ',',
      }),
    ).toEqual({ value: ['a', 'b', 'c'] })
  })

  it('format:replaced replaces every occurrence', () => {
    expect(
      base.call('format', {
        base: 'replaced',
        text: 'foo bar foo',
        pattern: 'foo',
        replacement: 'baz',
      }),
    ).toBe('baz bar baz')
  })

  it('format:truncated cuts and appends suffix', () => {
    expect(
      base.call('format', {
        base: 'truncated',
        text: 'hello world',
        length: 8,
      }),
    ).toBe('hello w…')
    expect(
      base.call('format', {
        base: 'truncated',
        text: 'hello',
        length: 10,
      }),
    ).toBe('hello')
    expect(
      base.call('format', {
        base: 'truncated',
        text: 'hello world',
        length: 8,
        suffix: '...',
      }),
    ).toBe('hello...')
  })
})

describe('format verb — number formatting', () => {
  const base = new Base<Code>()
  base.bind(standard, hooks, CodeLink)

  it('format:number applies locale-aware grouping', () => {
    expect(
      base.call('format', {
        base: 'number',
        value: 1234567.89,
        locale: 'en-US',
      }),
    ).toBe('1,234,567.89')
  })

  it('format:currency formats with currency code', () => {
    expect(
      base.call('format', {
        base: 'currency',
        value: 19.5,
        currency: 'USD',
        locale: 'en-US',
      }),
    ).toBe('$19.50')
  })

  it('format:percent formats with percent style', () => {
    expect(
      base.call('format', {
        base: 'percent',
        value: 0.875,
        locale: 'en-US',
      }),
    ).toBe('88%')
  })
})

describe('format verb — date formatting', () => {
  const base = new Base<Code>()
  base.bind(standard, hooks, CodeLink)

  it('format:date returns a non-empty string', () => {
    const result = base.call('format', {
      base: 'date',
      value: new Date('2026-01-15T12:00:00Z'),
      locale: 'en-US',
    }) as string
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('format:relative produces "yesterday" / "tomorrow" style strings', () => {
    const now = new Date('2026-01-15T12:00:00Z')
    const tomorrow = new Date('2026-01-16T12:00:00Z')
    const result = base.call('format', {
      base: 'relative',
      value: tomorrow,
      now,
      locale: 'en-US',
    }) as string
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('format verb — pluralization', () => {
  const base = new Base<Code>()
  base.bind(standard, hooks, CodeLink)

  it('format:plural picks singular for one', () => {
    expect(
      base.call('format', {
        base: 'plural',
        count: 1,
        singular: 'item',
        plural: 'items',
        locale: 'en-US',
      }),
    ).toBe('item')
  })

  it('format:plural picks plural for multi/zero', () => {
    expect(
      base.call('format', {
        base: 'plural',
        count: 5,
        singular: 'item',
        plural: 'items',
        locale: 'en-US',
      }),
    ).toBe('items')
    expect(
      base.call('format', {
        base: 'plural',
        count: 0,
        singular: 'item',
        plural: 'items',
        locale: 'en-US',
      }),
    ).toBe('items')
  })
})
