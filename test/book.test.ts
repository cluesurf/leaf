import { describe, it, expect } from 'vitest'
import { Book } from '../code'
import type { Base } from '../code/base'

// IPA symbol predicate — minimal stub for the example.
const is_ipa_symbol = (ch: string): boolean =>
  /^[\p{L}\p{M}ˈˌːʼʰ]$/u.test(ch)

describe('Book runtime — typed flow registration', () => {
  it('registers a (name, base, case) Flow handler', () => {
    const book = new Book<Base>()

    book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      Array.from(text).every(is_ipa_symbol),
    )

    expect(book.size).toBe(1)
    expect(book.has('is_ipa_broad')).toBe(true)
  })

  it('invokes a registered handler via call()', () => {
    const book = new Book<Base>()

    book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      Array.from(text).every(is_ipa_symbol),
    )

    expect(book.call('is_ipa_broad', { text: 'fəˈnɛtɪk' })).toBe(true)
  })

  it('registers (name, base) without case', () => {
    const book = new Book<Base>()

    book.flow('is', { base: 'string' }, ({ thing }) => typeof thing === 'string')

    expect(book.has('is_string')).toBe(true)
    expect(book.call('is_string', { thing: 'hello' })).toBe(true)
    expect(book.call('is_string', { thing: 42 })).toBe(false)
  })

  it('registers a bare verb (no base / no case)', () => {
    const book = new Book<Base>()

    book.flow('always_true', () => true)

    expect(book.has('always_true')).toBe(true)
    expect(book.call('always_true', {})).toBe(true)
  })

  it('throws when calling an unregistered flow', () => {
    const book = new Book<Base>()

    expect(() => book.call('is_ipa_broad', { text: 'x' })).toThrow(
      /no flow registered/,
    )
  })

  it('handles multiple registrations against the same Book', () => {
    const book = new Book<Base>()

    book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      Array.from(text).every(is_ipa_symbol),
    )
    book.flow('is', { base: 'ipa', case: 'narrow' }, ({ text }) =>
      Array.from(text).every(is_ipa_symbol),
    )
    book.flow('make', { base: 'sum' }, ({ a, b }) => a + b)
    book.flow('get', { base: 'length' }, ({ text }) => text.length)

    expect(book.size).toBe(4)
    expect(book.call('make_sum', { a: 2, b: 3 })).toBe(5)
    expect(book.call('get_length', { text: 'hello' })).toBe(5)
  })
})

describe('Book runtime — type inference', () => {
  // These tests exist to make TypeScript prove the type system
  // works. If they compile, the inference is correct.

  it('infers args type from (name, base, case) lookup', () => {
    const book = new Book<Base>()

    book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) => {
      // text is typed as string from Base['is_ipa_broad'].take.text
      const length: number = text.length
      return length > 0
    })
  })

  it('infers return type from like', () => {
    const book = new Book<Base>()

    // Compiles only if the handler returns boolean (matching
    // Base['is_ipa_broad'].like).
    book.flow('is', { base: 'ipa', case: 'broad' }, ({ text }) =>
      text.startsWith('/'),
    )

    // If the handler returned a string, this would be a type
    // error. We can't easily assert that in a runtime test, but
    // the fact that this file compiles is the proof.
  })

  it('typechecks bare-verb registration', () => {
    const book = new Book<Base>()
    book.flow('always_true', () => true)
    book.flow('always_false', () => false)
  })
})
