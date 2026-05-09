import { describe, it, expect } from 'vitest'
import { make, makeScope, renderText, evaluateText } from '..'

describe('literal rendering', () => {
  it('renders text', () => {
    expect(renderText(make.text('hello'), { scope: makeScope() })).toBe('hello')
  })

  it('renders integer', () => {
    expect(renderText(make.integer(42), { scope: makeScope() })).toBe('42')
  })

  it('renders boolean', () => {
    expect(renderText(make.boolean(true), { scope: makeScope() })).toBe('true')
  })

  it('list literal evaluates to a JS array', () => {
    const tree = make.list([make.text('a'), make.text('b'), make.text('c')])
    expect(evaluateText(tree, { scope: makeScope() })).toEqual(['a', 'b', 'c'])
  })

  it('renders line as woven sequence', () => {
    const tree = make.templateString('I am ', make.reference('status'), '.')
    const out = renderText(tree, {
      scope: makeScope({ status: 'fine' }),
    })
    expect(out).toBe('I am fine.')
  })
})

describe('reference and path rendering', () => {
  it('reads a reference from scope', () => {
    const scope = makeScope({ name: 'Lance' })
    expect(renderText(make.reference('name'), { scope })).toBe('Lance')
  })

  it('walks a nested path', () => {
    const scope = makeScope({ user: { name: 'Lance' } })
    const tree = make.path('user', 'name')
    expect(renderText(tree, { scope })).toBe('Lance')
  })

  it('indexes a list', () => {
    const scope = makeScope({ items: ['apple', 'banana', 'cherry'] })
    const tree = make.path('items', make.idx(1))
    expect(renderText(tree, { scope })).toBe('banana')
  })

  it('negative index counts from the end', () => {
    const scope = makeScope({ items: ['a', 'b', 'c'] })
    expect(renderText(make.path('items', make.idx(-1)), { scope })).toBe('c')
  })

  it('slice', () => {
    const scope = makeScope({ items: [1, 2, 3, 4, 5] })
    const result = evaluateText(make.path('items', make.slice(1, 4)), { scope })
    expect(result).toEqual([2, 3, 4])
  })

  it('slice with negative bounds counts from the end', () => {
    const scope = makeScope({ items: [1, 2, 3, 4, 5] })
    const result = evaluateText(
      make.path('items', make.slice(-3, -1)),
      { scope },
    )
    expect(result).toEqual([3, 4])
  })

  it('slice with only a negative tail bound', () => {
    const scope = makeScope({ items: [1, 2, 3, 4, 5] })
    const result = evaluateText(
      make.path('items', make.slice(undefined, -2)),
      { scope },
    )
    expect(result).toEqual([1, 2, 3])
  })

  it('safe index short-circuits when intermediate is null', () => {
    const scope = makeScope({ user: null })
    const tree = make.path(
      make.variable('user'),
      make.field('items', { safe: true }),
      make.idx(0, { safe: true }),
    )
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('safe index short-circuits on out-of-bounds lookup', () => {
    const scope = makeScope({ items: [] })
    const tree = make.path(
      make.variable('items'),
      make.idx(0, { safe: true }),
      make.field('name', { safe: true }),
    )
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('non-safe index out-of-bounds returns undefined (no chain protection)', () => {
    const scope = makeScope({ items: [] })
    const tree = make.path(make.variable('items'), make.idx(0))
    expect(evaluateText(tree, { scope })).toBeUndefined()
  })

  it('optional chaining returns null when intermediate is null', () => {
    const scope = makeScope({ user: null })
    const tree = make.path(
      make.variable('user'),
      make.field('metadata', { safe: true }),
      make.field('ready', { safe: true }),
    )
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('optional chaining short-circuits at first null', () => {
    const scope = makeScope({ user: { metadata: null } })
    const tree = make.path(
      make.variable('user'),
      make.field('metadata', { safe: true }),
      make.field('ready', { safe: true }),
    )
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('computed index uses inner path', () => {
    const scope = makeScope({
      items: ['a', 'b', 'c'],
      i: 2,
    })
    const tree = make.path('items', make.idx(make.reference('i')))
    expect(renderText(tree, { scope })).toBe('c')
  })
})

describe('call rendering', () => {
  it('eq', () => {
    const scope = makeScope({ x: 5 })
    expect(
      evaluateText(make.eq(make.reference('x'), 5), { scope }),
    ).toBe(true)
  })

  it('gt', () => {
    const scope = makeScope({ x: 10 })
    expect(
      evaluateText(make.gt(make.reference('x'), 5), { scope }),
    ).toBe(true)
  })

  it('count', () => {
    const scope = makeScope({ items: [1, 2, 3] })
    expect(
      evaluateText(make.count(make.reference('items')), { scope }),
    ).toBe(3)
  })

  it('sum', () => {
    const scope = makeScope({ items: [1, 2, 3, 4] })
    expect(
      evaluateText(make.sum(make.reference('items')), { scope }),
    ).toBe(10)
  })

  it('plural — English', () => {
    const scope = makeScope({ count: 1, locale: 'en' })
    expect(
      evaluateText(make.plural(make.reference('count')), { scope }),
    ).toBe('one')
  })

  it('plural — many in English is "other"', () => {
    const scope = makeScope({ count: 5, locale: 'en' })
    expect(
      evaluateText(make.plural(make.reference('count')), { scope }),
    ).toBe('other')
  })
})

describe('control flow rendering', () => {
  it('fork — truthy goes to then', () => {
    const scope = makeScope({ x: 10 })
    const tree = make.fork(make.gt(make.reference('x'), 0), 'yes', 'no')
    expect(renderText(tree, { scope })).toBe('yes')
  })

  it('fork — falsy goes to fall', () => {
    const scope = makeScope({ x: -1 })
    const tree = make.fork(make.gt(make.reference('x'), 0), 'yes', 'no')
    expect(renderText(tree, { scope })).toBe('no')
  })

  it('switch matches', () => {
    const scope = makeScope({ kind: 'image' })
    const tree = make.switch(make.reference('kind'), [
      { when: 'audio', then: 'AUDIO' },
      { when: 'image', then: 'IMAGE' },
    ], 'OTHER')
    expect(renderText(tree, { scope })).toBe('IMAGE')
  })

  it('switch falls through', () => {
    const scope = makeScope({ kind: 'video' })
    const tree = make.switch(make.reference('kind'), [
      { when: 'audio', then: 'AUDIO' },
      { when: 'image', then: 'IMAGE' },
    ], 'OTHER')
    expect(renderText(tree, { scope })).toBe('OTHER')
  })

  it('match — first truthy wins', () => {
    const scope = makeScope({ count: 50 })
    const tree = make.match([
      { test: make.gt(make.reference('count'), 100), then: 'many' },
      { test: make.gt(make.reference('count'), 10), then: 'some' },
    ], 'few')
    expect(renderText(tree, { scope })).toBe('some')
  })

  it('case — value match', () => {
    const scope = makeScope({ gender: 'female' })
    const tree = make.case(make.reference('gender'), [
      make.value('male', 'Mr.'),
      make.value('female', 'Mrs.'),
      make.otherwise(''),
    ])
    expect(renderText(tree, { scope })).toBe('Mrs.')
  })

  it('case — default fallback', () => {
    const scope = makeScope({ gender: 'unknown' })
    const tree = make.case(make.reference('gender'), [
      make.value('male', 'Mr.'),
      make.value('female', 'Mrs.'),
      make.otherwise(''),
    ])
    expect(renderText(tree, { scope })).toBe('')
  })

  it('case — plural integration', () => {
    const tree = make.pluralCases('count', {
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
    const tree = make.pick(
      make.reference('a'),
      make.reference('b'),
      make.reference('c'),
    )
    expect(evaluateText(tree, { scope })).toBe('two')
  })

  it('pick — all null returns null', () => {
    const scope = makeScope({ a: null, b: null })
    const tree = make.pick(make.reference('a'), make.reference('b'))
    expect(evaluateText(tree, { scope })).toBeNull()
  })

  it('walk — iterates and concatenates', () => {
    const scope = makeScope({ items: ['a', 'b', 'c'] })
    const tree = make.walk(
      make.reference('items'),
      make.templateString(make.reference('item'), '|'),
    )
    expect(renderText(tree, { scope })).toBe('a|b|c|')
  })

  it('walk — index binding', () => {
    const scope = makeScope({ items: ['x', 'y'] })
    const tree = make.walk(
      make.reference('items'),
      make.templateString(make.reference('index'), ':', make.reference('item'), ' '),
    )
    expect(renderText(tree, { scope })).toBe('0:x 1:y ')
  })

})

describe('localization template — full integration', () => {
  it('renders the greeting example', () => {
    const greeting = {
      form: 'template_string' as const,
      flow: [
        'You have ',
        { form: 'reference' as const, name: 'count' },
        ' ',
        make.pluralCases('count', {
          one: 'message',
          other: 'messages',
        }),
        ' in your ',
        { form: 'reference' as const, name: 'thing' },
        ', ',
        make.selectCases('gender', {
          male: 'Mr.',
          female: 'Mrs.',
          other: '',
        }),
        ' ',
        { form: 'reference' as const, name: 'name' },
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
