import { describe, it, expect } from 'vitest'
import { Base } from '../code'
import standard, { hooks, type Code } from '../code/base'

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
    expect(base.test('flow:is:ipa:broad')).toBe(true)
  })

  it('invokes a registered handler via call()', () => {
    const base = new Base<Code>()

    base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      Array.from(text).every(is_ipa_symbol),
    )

    expect(
      base.call('is', { base: 'ipa', case: 'broad', text: 'fəˈnɛtɪk' }),
    ).toBe(true)
  })

  it('registers (name, base) without case', () => {
    const base = new Base<Code>()

    base.flow('is', { base: 'string' }, ({ thing }) => typeof thing === 'string')

    expect(base.test('flow:is:string')).toBe(true)
    expect(base.call('is', { base: 'string', thing: 'hello' })).toBe(true)
    expect(base.call('is', { base: 'string', thing: 42 })).toBe(false)
  })

  it('registers a bare verb (no base / no case)', () => {
    const base = new Base<Code>()

    base.flow('always_true', () => true)

    expect(base.test('flow:always_true')).toBe(true)
    expect(base.call('always_true', {})).toBe(true)
  })

  it('throws when calling an unregistered flow', () => {
    const base = new Base<Code>()

    expect(() =>
      base.call('is', { base: 'ipa', case: 'broad', text: 'x' }),
    ).toThrow(/no flow registered/)
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
    expect(base.call('make', { base: 'sum', a: 2, b: 3 })).toBe(5)
    expect(base.call('get', { base: 'length', text: 'hello' })).toBe(5)
  })
})

describe('Base runtime — type inference', () => {
  // These tests exist to make TypeScript prove the type system
  // works. If they compile, the inference is correct.

  it('infers args type from (call, base, case) lookup', () => {
    const base = new Base<Code>()

    base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) => {
      // text is typed as string from Code['flow:is:ipa:broad'].take.text
      const length: number = text.length
      return length > 0
    })
  })

  it('infers return type from make', () => {
    const base = new Base<Code>()

    // Compiles only if the handler returns boolean (matching
    // Code['flow:is:ipa:broad'].make).
    base.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      text.startsWith('/'),
    )
  })

  it('infers args + return for arithmetic flows', () => {
    const base = new Base<Code>()

    base.flow('make', { base: 'sum' }, ({ a, b }) => {
      // a, b typed as number from Code['flow:make:sum'].take
      const sum: number = a + b
      return sum
    })

    base.flow('get', { base: 'length' }, ({ text }) => {
      // text typed as string from Code['flow:get:length'].take
      return text.length
    })
  })

  it('exposes the generated Code keys as registry entries', () => {
    type Keys = keyof Code
    // Compile-time assertion: these literals must be assignable
    // to `Keys`. If the generated Code drops one, this errors.
    const k1: Keys = 'flow:is:ipa:broad'
    const k2: Keys = 'flow:make:sum'
    const k3: Keys = 'flow:get:length'
    const k4: Keys = 'flow:has:prefix'
    expect([k1, k2, k3, k4].length).toBe(4)
  })

  it('base.bind(book, hooks) registers every Flow handler at once', () => {
    const base = new Base<Code>()
    base.bind(standard, hooks)

    // The standard catalog has many flows; bind should
    // register a handler for each (Form/Hash/List entries
    // are skipped — they don't have hooks).
    expect(base.size).toBeGreaterThan(40)

    // Calling registered flows mirrors the registration shape:
    // verb + { base, case?, ...takeArgs }.
    expect(base.call('is', { base: 'string', thing: 'hello' })).toBe(true)
    expect(base.call('is', { base: 'string', thing: 42 })).toBe(false)
    expect(base.call('make', { base: 'sum', a: 2, b: 3 })).toBe(5)
    expect(base.call('get', { base: 'length', text: 'hello' })).toBe(5)
    expect(
      base.call('has', { base: 'prefix', text: 'foobar', prefix: 'foo' }),
    ).toBe(true)
    expect(
      base.call('is', { base: 'ipa', case: 'broad', text: 'fəˈnɛtɪk' }),
    ).toBe(true)
  })

})
