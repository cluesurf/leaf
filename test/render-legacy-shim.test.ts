import { describe, it, expect } from 'vitest'
import { cast } from '@/cast'
import { makeScope } from '@/scope'
import { renderText, evaluateText } from './helper'

describe('literal rendering', () => {
  it('renders text', () => {
    expect(renderText('hello', { scope: makeScope() })).toBe('hello')
  })

  it('renders integer', () => {
    expect(renderText(cast.integer(42), { scope: makeScope() })).toBe('42')
  })

  it('renders boolean', () => {
    expect(renderText(cast.boolean(true), { scope: makeScope() })).toBe('true')
  })

  it('list literal evaluates to a JS array', () => {
    const tree = cast.list(['a', 'b', 'c'])
    expect(evaluateText(tree, { scope: makeScope() })).toEqual(['a', 'b', 'c'])
  })

  it('renders line as woven sequence', () => {
    const tree = cast.text('I am ', cast.reference('status'), '.')
    const out = renderText(tree, {
      scope: makeScope({ status: 'fine' }),
    })
    expect(out).toBe('I am fine.')
  })
})

describe('reference and path rendering', () => {
  it('reads a reference from scope', () => {
    const scope = makeScope({ name: 'Lance' })
    expect(renderText(cast.reference('name'), { scope })).toBe('Lance')
  })

  it('walks a nested path', () => {
    const scope = makeScope({ user: { name: 'Lance' } })
    const tree = cast.path('user', 'name')
    expect(renderText(tree, { scope })).toBe('Lance')
  })

  it('indexes a list', () => {
    const scope = makeScope({ items: ['apple', 'banana', 'cherry'] })
    const tree = cast.path('items', cast.idx(1))
    expect(renderText(tree, { scope })).toBe('banana')
  })

  it('negative index counts from the end', () => {
    const scope = makeScope({ items: ['a', 'b', 'c'] })
    expect(renderText(cast.path('items', cast.idx(-1)), { scope })).toBe('c')
  })

  it('slice', () => {
    const scope = makeScope({ items: [1, 2, 3, 4, 5] })
    const result = evaluateText(cast.path('items', cast.slice(1, 4)), { scope })
    expect(result).toEqual([2, 3, 4])
  })

  it('slice with negative bounds counts from the end', () => {
    const scope = makeScope({ items: [1, 2, 3, 4, 5] })
    const result = evaluateText(
      cast.path('items', cast.slice(-3, -1)),
      { scope },
    )
    expect(result).toEqual([3, 4])
  })

  it('slice with only a negative tail bound', () => {
    const scope = makeScope({ items: [1, 2, 3, 4, 5] })
    const result = evaluateText(
      cast.path('items', cast.slice(undefined, -2)),
      { scope },
    )
    expect(result).toEqual([1, 2, 3])
  })

  it('safe index short-circuits when intermediate is null', () => {
    const scope = makeScope({ user: null })
    const tree = cast.path(
      cast.variable('user'),
      cast.field('items', { safe: true }),
      cast.idx(0, { safe: true }),
    )
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('safe index short-circuits on out-of-bounds lookup', () => {
    const scope = makeScope({ items: [] })
    const tree = cast.path(
      cast.variable('items'),
      cast.idx(0, { safe: true }),
      cast.field('name', { safe: true }),
    )
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('non-safe index out-of-bounds returns undefined (no chain protection)', () => {
    const scope = makeScope({ items: [] })
    const tree = cast.path(cast.variable('items'), cast.idx(0))
    expect(evaluateText(tree, { scope })).toBeUndefined()
  })

  it('optional chaining returns null when intermediate is null', () => {
    const scope = makeScope({ user: null })
    const tree = cast.path(
      cast.variable('user'),
      cast.field('metadata', { safe: true }),
      cast.field('ready', { safe: true }),
    )
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('optional chaining short-circuits at first null', () => {
    const scope = makeScope({ user: { metadata: null } })
    const tree = cast.path(
      cast.variable('user'),
      cast.field('metadata', { safe: true }),
      cast.field('ready', { safe: true }),
    )
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('computed index uses inner path', () => {
    const scope = makeScope({
      items: ['a', 'b', 'c'],
      i: 2,
    })
    const tree = cast.path('items', cast.idx(cast.reference('i')))
    expect(renderText(tree, { scope })).toBe('c')
  })
})

describe('call rendering', () => {
  it('eq', () => {
    const scope = makeScope({ x: 5 })
    expect(
      evaluateText(cast.eq(cast.reference('x'), 5), { scope }),
    ).toBe(true)
  })

  it('gt', () => {
    const scope = makeScope({ x: 10 })
    expect(
      evaluateText(cast.gt(cast.reference('x'), 5), { scope }),
    ).toBe(true)
  })

  it('count', () => {
    const scope = makeScope({ items: [1, 2, 3] })
    expect(
      evaluateText(cast.count(cast.reference('items')), { scope }),
    ).toBe(3)
  })

  it('sum', () => {
    const scope = makeScope({ items: [1, 2, 3, 4] })
    expect(
      evaluateText(cast.sum(cast.reference('items')), { scope }),
    ).toBe(10)
  })

  it('plural — English', () => {
    const scope = makeScope({ count: 1, locale: 'en' })
    expect(
      evaluateText(cast.plural(cast.reference('count')), { scope }),
    ).toBe('one')
  })

  it('plural — many in English is "other"', () => {
    const scope = makeScope({ count: 5, locale: 'en' })
    expect(
      evaluateText(cast.plural(cast.reference('count')), { scope }),
    ).toBe('other')
  })
})

describe('control flow rendering', () => {
  it('fork — truthy goes to then', () => {
    const scope = makeScope({ x: 10 })
    const tree = cast.fork(cast.gt(cast.reference('x'), 0), 'yes', 'no')
    expect(renderText(tree, { scope })).toBe('yes')
  })

  it('fork — falsy goes to fall', () => {
    const scope = makeScope({ x: -1 })
    const tree = cast.fork(cast.gt(cast.reference('x'), 0), 'yes', 'no')
    expect(renderText(tree, { scope })).toBe('no')
  })

  it('switch matches', () => {
    const scope = makeScope({ kind: 'image' })
    const tree = cast.switch(cast.reference('kind'), [
      { when: 'audio', then: 'AUDIO' },
      { when: 'image', then: 'IMAGE' },
    ], 'OTHER')
    expect(renderText(tree, { scope })).toBe('IMAGE')
  })

  it('switch falls through', () => {
    const scope = makeScope({ kind: 'video' })
    const tree = cast.switch(cast.reference('kind'), [
      { when: 'audio', then: 'AUDIO' },
      { when: 'image', then: 'IMAGE' },
    ], 'OTHER')
    expect(renderText(tree, { scope })).toBe('OTHER')
  })

  it('match — first truthy wins', () => {
    const scope = makeScope({ count: 50 })
    const tree = cast.match([
      { test: cast.gt(cast.reference('count'), 100), then: 'many' },
      { test: cast.gt(cast.reference('count'), 10), then: 'some' },
    ], 'few')
    expect(renderText(tree, { scope })).toBe('some')
  })

  it('case — value match', () => {
    const scope = makeScope({ gender: 'female' })
    const tree = cast.case(cast.reference('gender'), [
      cast.value('male', 'Mr.'),
      cast.value('female', 'Mrs.'),
      cast.otherwise(''),
    ])
    expect(renderText(tree, { scope })).toBe('Mrs.')
  })

  it('case — default fallback', () => {
    const scope = makeScope({ gender: 'unknown' })
    const tree = cast.case(cast.reference('gender'), [
      cast.value('male', 'Mr.'),
      cast.value('female', 'Mrs.'),
      cast.otherwise(''),
    ])
    expect(renderText(tree, { scope })).toBe('')
  })

  it('case — plural integration', () => {
    const tree = cast.pluralCases('count', {
      one: 'message',
      other: 'messages',
    })
    expect(
      renderText(tree, {
        scope: makeScope({ count: 1, locale: 'en' }),
      }),
    ).toBe('message')
    expect(
      renderText(tree, {
        scope: makeScope({ count: 13, locale: 'en' }),
      }),
    ).toBe('messages')
  })

  it('pick — first non-null', () => {
    const scope = makeScope({ a: null, b: 'two', c: 'three' })
    const tree = cast.pick(
      cast.reference('a'),
      cast.reference('b'),
      cast.reference('c'),
    )
    expect(evaluateText(tree, { scope })).toBe('two')
  })

  it('pick — all null returns null', () => {
    const scope = makeScope({ a: null, b: null })
    const tree = cast.pick(cast.reference('a'), cast.reference('b'))
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('walk — iterates and concatenates', () => {
    const scope = makeScope({ items: ['a', 'b', 'c'] })
    const tree = cast.walk(
      cast.reference('items'),
      cast.text(cast.reference('item'), '|'),
    )
    expect(renderText(tree, { scope })).toBe('a|b|c|')
  })

  it('walk — index binding', () => {
    const scope = makeScope({ items: ['x', 'y'] })
    const tree = cast.walk(
      cast.reference('items'),
      cast.text(cast.reference('index'), ':', cast.reference('item'), ' '),
    )
    expect(renderText(tree, { scope })).toBe('0:x 1:y ')
  })

})

describe('localization template — full integration', () => {
  it('renders the greeting example', () => {
    const greeting = {
      form: 'text' as const,
      flow: [
        'You have ',
        { form: 'bind' as const, name: 'count' },
        ' ',
        cast.pluralCases('count', {
          one: 'message',
          other: 'messages',
        }),
        ' in your ',
        { form: 'bind' as const, name: 'thing' },
        ', ',
        cast.selectCases('gender', {
          male: 'Mr.',
          female: 'Mrs.',
          other: '',
        }),
        ' ',
        { form: 'bind' as const, name: 'name' },
      ],
    }

    const out = renderText(greeting, {
      scope: makeScope({
        count: 13,
        thing: 'inbox',
        gender: 'male',
        name: 'John',
        locale: 'en',
      }),
    })

    expect(out).toBe('You have 13 messages in your inbox, Mr. John')
  })
})
