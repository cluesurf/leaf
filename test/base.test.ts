import { describe, it, expect } from 'vitest'
import { Base } from '../code'
import type { Code } from '../code/base'

// IPA symbol predicate — minimal stub for the example.
const is_ipa_symbol = (ch: string): boolean =>
  /^[\p{L}\p{M}ˈˌːʼʰ]$/u.test(ch)

describe('Base runtime — typed flow registration', () => {
  it('registers a (name, base, case) Flow handler', () => {
    const base = new Base<Code>()

    base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      Array.from(text).every(is_ipa_symbol),
    )

    expect(base.size).toBe(1)
    expect(base.test('is_ipa_broad')).toBe(true)
  })

  it('invokes a registered handler via call()', () => {
    const base = new Base<Code>()

    base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      Array.from(text).every(is_ipa_symbol),
    )

    expect(base.call('is_ipa_broad', { text: 'fəˈnɛtɪk' })).toBe(true)
  })

  it('registers (name, base) without case', () => {
    const base = new Base<Code>()

    base.flow('is', { base: 'string' }, ({ thing }) => typeof thing === 'string')

    expect(base.test('is_string')).toBe(true)
    expect(base.call('is_string', { thing: 'hello' })).toBe(true)
    expect(base.call('is_string', { thing: 42 })).toBe(false)
  })

  it('registers a bare verb (no base / no case)', () => {
    const base = new Base<Code>()

    base.flow('always_true', () => true)

    expect(base.test('always_true')).toBe(true)
    expect(base.call('always_true', {})).toBe(true)
  })

  it('throws when calling an unregistered flow', () => {
    const base = new Base<Code>()

    expect(() => base.call('is_ipa_broad', { text: 'x' })).toThrow(
      /no flow registered/,
    )
  })

  it('handles multiple registrations against the same Base', () => {
    const base = new Base<Code>()

    base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      Array.from(text).every(is_ipa_symbol),
    )
    base.flow('is', { base: 'ipa', case: 'narrow' }, ({ text }) =>
      Array.from(text).every(is_ipa_symbol),
    )
    base.flow('make', { base: 'sum' }, ({ a, b }) => a + b)
    base.flow('get', { base: 'length' }, ({ text }) => text.length)

    expect(base.size).toBe(4)
    expect(base.call('make_sum', { a: 2, b: 3 })).toBe(5)
    expect(base.call('get_length', { text: 'hello' })).toBe(5)
  })
})

describe('Base runtime — type inference', () => {
  // These tests exist to make TypeScript prove the type system
  // works. If they compile, the inference is correct.

  it('infers args type from (name, base, case) lookup', () => {
    const base = new Base<Code>()

    base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) => {
      // text is typed as string from Code['is_ipa_broad'].take.text
      const length: number = text.length
      return length > 0
    })
  })

  it('infers return type from like', () => {
    const base = new Base<Code>()

    // Compiles only if the handler returns boolean (matching
    // Code['is_ipa_broad'].like).
    base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      text.startsWith('/'),
    )
  })

  it('typechecks bare-verb registration', () => {
    const base = new Base<Code>()
    base.flow('always_true', () => true)
    base.flow('always_false', () => false)
  })
})
