import { describe, it, expect } from 'vitest'
import { Base } from '../code'
import standard, { CodeLink, type Code } from '../code/book'

const is_ipa_symbol = (ch: string): boolean =>
  /^[\p{L}\p{M}ˈˌːʼʰ]$/u.test(ch)

describe('Base runtime — load with flow map', () => {
  it('loads a Book containing flow handlers keyed by colon path', () => {
    const base = new Base<Code>()
    base.load({
      flow: {
        'is:ipa:broad': ({ text }: { text: string }) =>
          Array.from(text).every(is_ipa_symbol),
      },
    })
    expect(base.test('flow:is:ipa:broad')).toBe(true)
    expect(base.call('is:ipa:broad', { text: 'fəˈnɛtɪk' })).toBe(true)
  })

  it('loads multiple paths in one book', () => {
    const base = new Base<Code>()
    base.load({
      flow: {
        'is:string': ({ thing }: { thing: unknown }) =>
          typeof thing === 'string',
        'make:sum': ({ a, b }: { a: number; b: number }) => a + b,
        'get:length': ({ text }: { text: string }) => text.length,
        always_true: () => true,
      },
    })
    expect(base.call('is:string', { thing: 'hello' })).toBe(true)
    expect(base.call('is:string', { thing: 42 })).toBe(false)
    expect(base.call('make:sum', { a: 2, b: 3 })).toBe(5)
    expect(base.call('get:length', { text: 'hello' })).toBe(5)
    expect(base.call('always_true', {})).toBe(true)
  })

  it('throws when calling an unregistered flow', () => {
    const base = new Base<Code>()
    expect(() => base.call('is:ipa:broad', { text: 'x' })).toThrow(
      /no flow registered/,
    )
  })
})

describe('Base runtime — type inference', () => {
  it('exposes the generated Code keys as registry entries', () => {
    type Keys = keyof Code
    const k1: Keys = 'flow:is:ipa:broad'
    const k2: Keys = 'flow:make:sum'
    const k3: Keys = 'flow:get:length'
    const k4: Keys = 'flow:has:prefix'
    expect([k1, k2, k3, k4].length).toBe(4)
  })

  it('base.load(book) registers every Flow handler at once', () => {
    const base = new Base<Code>()
    base.load({ ...standard, code: undefined })

    expect(base.size).toBeGreaterThan(40)

    expect(base.call('is:string', { thing: 'hello' })).toBe(true)
    expect(base.call('is:string', { thing: 42 })).toBe(false)
    expect(base.call('make:sum', { a: 2, b: 3 })).toBe(5)
    expect(base.call('get:length', { text: 'hello' })).toBe(5)
    expect(
      base.call('has:prefix', { text: 'foobar', prefix: 'foo' }),
    ).toBe(true)
    expect(base.call('is:ipa:broad', { text: 'fəˈnɛtɪk' })).toBe(true)
  })

  it('catalog verbs `fork`, `validate`, `walk` are registered', () => {
    const base = new Base<Code>()
    base.load({ ...standard, code: undefined })

    expect(
      base.call('branch', { test: true, yes: 'yes', no: 'no' }),
    ).toBe('yes')
    expect(
      base.call('branch', { test: false, yes: 'yes', no: 'no' }),
    ).toBe('no')

    expect(base.call('validate', { test: true })).toEqual({ ok: true })
    expect(
      base.call('validate', { test: false, message: 'bad', kind: 'data' }),
    ).toEqual({ ok: false, message: 'bad', kind: 'data' })

    expect(
      base.call('walk:chunk', { items: [1, 2, 3, 4, 5], size: 2 }),
    ).toEqual([[1, 2], [3, 4], [5]])

    expect(
      base.call('walk:distinct', { items: [1, 2, 2, 3, 1] }),
    ).toEqual([1, 2, 3])
  })

  it('`bind` returns the body unchanged (eager-arg form)', () => {
    const base = new Base<Code>()
    base.load({ ...standard, code: undefined })
    expect(base.call('bind', { names: { x: 1 }, then: 'value' })).toBe(
      'value',
    )
  })

  it('base.call(<id>, bind) dispatches via CodeLink integer ids', () => {
    const base = new Base<Code>()
    base.load(standard)

    expect(
      base.call(CodeLink['flow:is:string'], { thing: 'hello' }),
    ).toBe(true)
    expect(base.call(CodeLink['flow:make:sum'], { a: 2, b: 3 })).toBe(5)
    expect(
      base.call(CodeLink['flow:get:length'], { text: 'hello' }),
    ).toBe(5)
    expect(
      base.call(CodeLink['flow:is:ipa:broad'], { text: 'fəˈnɛtɪk' }),
    ).toBe(true)

    expect(base.call('is:string', { thing: 'hello' })).toBe(true)
  })
})
