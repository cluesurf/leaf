/**
 * Smoke tests for the generated Zod parsers in
 * `code/base/<verb>/form.ts`. Each `<TypeName>Form` is paired
 * with its TS type via `satisfies z.ZodType<TypeName>`; this
 * suite proves the parsers actually `.parse()` valid input
 * and reject invalid input at runtime.
 */

import { describe, it, expect } from 'vitest'

import {
  IsIpaBroadTakeForm,
  IsStringTakeForm,
  IsAmongTakeForm,
  IsAllTakeForm,
} from '../code/base/is/form'

import {
  MakeSumTakeForm,
  MakeLowercaseTakeForm,
} from '../code/base/make/form'

import { GetLengthTakeForm, GetSumTakeForm } from '../code/base/get/form'

import {
  HasPrefixTakeForm,
  HasItemTakeForm,
} from '../code/base/has/form'

import {
  FormatNumberTakeForm,
  FormatDateTakeForm,
  FormatPluralTakeForm,
  FormatTruncatedTakeForm,
} from '../code/base/format/form'

describe('generated Zod parsers — is verb', () => {
  it('IsIpaBroadTakeForm parses { text: string }', () => {
    expect(IsIpaBroadTakeForm.parse({ text: 'fəˈnɛtɪk' })).toEqual({
      text: 'fəˈnɛtɪk',
    })
  })

  it('IsIpaBroadTakeForm rejects wrong-typed input', () => {
    expect(() => IsIpaBroadTakeForm.parse({ text: 123 })).toThrow()
    expect(() => IsIpaBroadTakeForm.parse({})).toThrow()
  })

  it('IsStringTakeForm accepts unknown thing', () => {
    expect(IsStringTakeForm.parse({ thing: 'hello' })).toEqual({
      thing: 'hello',
    })
    expect(IsStringTakeForm.parse({ thing: 42 })).toEqual({ thing: 42 })
    expect(IsStringTakeForm.parse({ thing: null })).toEqual({ thing: null })
  })

  it('IsAmongTakeForm requires choices: array', () => {
    expect(
      IsAmongTakeForm.parse({ thing: 'B1', choices: ['A1', 'B1', 'C1'] }),
    ).toEqual({ thing: 'B1', choices: ['A1', 'B1', 'C1'] })
    expect(() =>
      IsAmongTakeForm.parse({ thing: 'B1', choices: 'not-an-array' }),
    ).toThrow()
  })

  it('IsAllTakeForm requires things: boolean[]', () => {
    expect(
      IsAllTakeForm.parse({ things: [true, false, true] }),
    ).toEqual({ things: [true, false, true] })
    expect(() =>
      IsAllTakeForm.parse({ things: ['true', 'false'] }),
    ).toThrow()
  })
})

describe('generated Zod parsers — make verb', () => {
  it('MakeSumTakeForm requires { a: number; b: number }', () => {
    expect(MakeSumTakeForm.parse({ a: 2, b: 3 })).toEqual({ a: 2, b: 3 })
    expect(() => MakeSumTakeForm.parse({ a: '2', b: 3 })).toThrow()
    expect(() => MakeSumTakeForm.parse({ a: 2 })).toThrow()
  })

  it('MakeLowercaseTakeForm requires { text: string }', () => {
    expect(MakeLowercaseTakeForm.parse({ text: 'Hello' })).toEqual({
      text: 'Hello',
    })
    expect(() => MakeLowercaseTakeForm.parse({})).toThrow()
  })
})

describe('generated Zod parsers — get verb', () => {
  it('GetLengthTakeForm requires { text: string }', () => {
    expect(GetLengthTakeForm.parse({ text: 'hello' })).toEqual({
      text: 'hello',
    })
  })

  it('GetSumTakeForm requires { numbers: number[] }', () => {
    expect(GetSumTakeForm.parse({ numbers: [1, 2, 3] })).toEqual({
      numbers: [1, 2, 3],
    })
    expect(() =>
      GetSumTakeForm.parse({ numbers: ['1', '2'] }),
    ).toThrow()
  })
})

describe('generated Zod parsers — has verb', () => {
  it('HasPrefixTakeForm requires { text, prefix }', () => {
    expect(
      HasPrefixTakeForm.parse({ text: 'foobar', prefix: 'foo' }),
    ).toEqual({ text: 'foobar', prefix: 'foo' })
    expect(() => HasPrefixTakeForm.parse({ text: 'foo' })).toThrow()
  })

  it('HasItemTakeForm requires { items, item }', () => {
    expect(
      HasItemTakeForm.parse({ items: [1, 2, 3], item: 2 }),
    ).toEqual({ items: [1, 2, 3], item: 2 })
    expect(() => HasItemTakeForm.parse({ item: 2 })).toThrow()
  })
})

describe('generated Zod parsers — format verb', () => {
  it('FormatNumberTakeForm allows optional locale', () => {
    expect(FormatNumberTakeForm.parse({ value: 1234 })).toEqual({
      value: 1234,
    })
    expect(
      FormatNumberTakeForm.parse({ value: 1234, locale: 'en-US' }),
    ).toEqual({ value: 1234, locale: 'en-US' })
  })

  it('FormatDateTakeForm coerces date input', () => {
    const date = new Date('2026-01-15')
    expect(FormatDateTakeForm.parse({ value: date })).toMatchObject({
      value: expect.any(Date),
    })
  })

  it('FormatPluralTakeForm validates plural-form fields', () => {
    expect(
      FormatPluralTakeForm.parse({
        count: 3,
        singular: 'item',
        plural: 'items',
      }),
    ).toEqual({ count: 3, singular: 'item', plural: 'items' })
  })

  it('FormatTruncatedTakeForm requires { text, length }', () => {
    expect(
      FormatTruncatedTakeForm.parse({ text: 'hello', length: 3 }),
    ).toEqual({ text: 'hello', length: 3 })
  })
})
