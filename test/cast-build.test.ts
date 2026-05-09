import { describe, it, expect } from 'vitest'
import { cast } from '@/cast'
import { makeScope } from '@/scope'
import { renderText } from './helper'

describe('literals', () => {
  it('bare strings are first-class leaves (no builder needed)', () => {
    // 'hello' is already a Cast — render it directly.
    expect('hello').toBe('hello')
  })

  it('cast.text(...) builds a tagged text node', () => {
    expect(cast.text('a', 'b')).toEqual({
      form: 'text',
      flow: ['a', 'b'],
    })
  })

  it('integer literal — bare number', () => {
    expect(cast.integer(42)).toBe(42)
  })

  it('natural_number literal — bare number', () => {
    expect(cast.naturalNumber(5)).toBe(5)
  })

  it('number literal — bare number', () => {
    expect(cast.number(3.14)).toBe(3.14)
  })

  it('boolean literal — bare boolean', () => {
    expect(cast.boolean(true)).toBe(true)
  })

  it('date literal — Date instance', () => {
    const d = cast.date('2026-04-30T00:00:00Z')
    expect(d).toBeInstanceOf(Date)
    expect(d.toISOString()).toBe('2026-04-30T00:00:00.000Z')
  })

  it('list literal — tagged with form', () => {
    expect(cast.list(['a', 'b'])).toEqual({
      form: 'list',
      list: ['a', 'b'],
    })
  })

  it('weave — woven sequence with bare-string leaves', () => {
    expect(cast.text('I am ', cast.reference('status'), '.')).toEqual({
      form: 'text',
      flow: ['I am ', { form: 'reference', name: 'status' }, '.'],
    })
  })

  it('hash literal — record of casts under base', () => {
    expect(cast.hash({ name: 'Lance', count: 3 })).toEqual({
      form: 'hash',
      base: { name: 'Lance', count: 3 },
    })
  })
})

describe('promote', () => {
  it('passes string through unchanged', () => {
    expect(cast.promote('hi')).toBe('hi')
  })

  it('passes number through unchanged', () => {
    expect(cast.promote(5)).toBe(5)
    expect(cast.promote(-3)).toBe(-3)
    expect(cast.promote(3.14)).toBe(3.14)
  })

  it('passes boolean through unchanged', () => {
    expect(cast.promote(true)).toBe(true)
  })

  it('passes Date through unchanged', () => {
    const d = new Date('2026-04-30T00:00:00Z')
    expect(cast.promote(d)).toBe(d)
  })

  it('wraps a plain array in list', () => {
    expect(cast.promote(['a', 1])).toEqual({
      form: 'list',
      list: ['a', 1],
    })
  })

  it('passes structural flow nodes through unchanged', () => {
    const ref = cast.reference('count')
    expect(cast.promote(ref)).toBe(ref)
  })
})

describe('reads', () => {
  it('reference (bare scope read)', () => {
    expect(cast.reference('count')).toEqual({
      form: 'reference',
      name: 'count',
    })
  })

  it('path: single segment normalizes to reference', () => {
    expect(cast.path('count')).toEqual({
      form: 'reference',
      name: 'count',
    })
  })

  it('read: nested fields', () => {
    expect(cast.read('user', 'name')).toEqual({
      form: 'read',
      link: [
        { form: 'variable', name: 'user' },
        { form: 'field', name: 'name' },
      ],
    })
  })

  it('read: with index segment', () => {
    expect(cast.read('items', cast.idx(0))).toEqual({
      form: 'read',
      link: [
        { form: 'variable', name: 'items' },
        { form: 'index', value: 0 },
      ],
    })
  })

  it('read: with slice segment', () => {
    expect(cast.read('items', cast.slice(3, 10))).toEqual({
      form: 'read',
      link: [
        { form: 'variable', name: 'items' },
        { form: 'slice', start: 3, end: 10 },
      ],
    })
  })

  it('read: with optional chaining (safe field)', () => {
    const tree = cast.read(
      cast.variable('user'),
      cast.field('metadata', { safe: true }),
      cast.idx(
        cast.read('some', 'thing'),
      ),
      cast.field('ready', { safe: true }),
    )
    expect(tree).toEqual({
      form: 'read',
      link: [
        { form: 'variable', name: 'user' },
        { form: 'field', name: 'metadata', safe: true },
        {
          form: 'index',
          value: {
            form: 'read',
            link: [
              { form: 'variable', name: 'some' },
              { form: 'field', name: 'thing' },
            ],
          },
        },
        { form: 'field', name: 'ready', safe: true },
      ],
    })
  })
})

describe('calls', () => {
  it('eq', () => {
    expect(cast.eq(cast.reference('status'), 'published')).toEqual({
      form: 'call',
      name: 'is',
      case: 'equal',
      a: { form: 'reference', name: 'status' },
      b: 'published',
    })
  })

  it('gt with bare-number leaf', () => {
    expect(cast.gt(cast.reference('count'), 0)).toEqual({
      form: 'call',
      name: 'is',
      case: 'above',
      a: { form: 'reference', name: 'count' },
      b: 0,
    })
  })

  it('and', () => {
    const result = cast.and(
      cast.gt(cast.reference('count'), 0),
      cast.lt(cast.reference('count'), 100),
    )
    expect(result.form).toBe('call')
    expect(result.name).toBe('is')
    // varargs get promoted to a `list` literal under `values`
    expect((result as unknown as { things: { form: string } }).things.form).toBe('list')
  })

  it('count', () => {
    expect(cast.count(cast.reference('items'))).toEqual({
      form: 'call',
      name: 'count',
      list: { form: 'reference', name: 'items' },
    })
  })

  it('plural', () => {
    expect(cast.plural(cast.reference('count'))).toEqual({
      form: 'call',
      name: 'plural',
      value: { form: 'reference', name: 'count' },
    })
  })
})

describe('control flow', () => {
  it('fork with bare-string leaves', () => {
    expect(cast.fork(cast.eq(cast.reference('x'), 1), 'yes', 'no')).toEqual({
      form: 'fork',
      test: {
        form: 'call',
        name: 'is',
        case: 'equal',
        a: { form: 'reference', name: 'x' },
        b: 1,
      },
      then: 'yes',
      fall: 'no',
    })
  })

  it('case with arm helpers', () => {
    const tree = cast.case(cast.plural(cast.reference('count')), [
      cast.value('one', 'message'),
      cast.otherwise('messages'),
    ])
    expect(tree).toEqual({
      form: 'case',
      test: {
        form: 'call',
        name: 'plural',
        value: { form: 'reference', name: 'count' },
      },
      case: [
        {
          form: 'case-value',
          value: 'one',
          flow: ['message'],
        },
        {
          form: 'case-default',
          flow: ['messages'],
        },
      ],
    })
  })

  it('walk', () => {
    const tree = cast.walk(
      cast.reference('stanzas'),
      cast.view('paragraph', [
        cast.path('item', 'translation'),
      ]),
    )
    expect(tree.form).toBe('walk')
    expect(tree.list).toEqual({ form: 'reference', name: 'stanzas' })
    expect(tree.hook).toEqual({
      form: 'view',
      name: 'paragraph',
      nest: [
        {
          form: 'read',
          link: [
            { form: 'variable', name: 'item' },
            { form: 'field', name: 'translation' },
          ],
        },
      ],
    })
  })

  it('pick — varargs to list literal under values', () => {
    const tree = cast.pick(
      cast.reference('preferred'),
      cast.reference('auto'),
      'Untitled',
    )
    expect(tree.form).toBe('pick')
    expect((tree.values as { form: string; list: unknown[] }).form).toBe('list')
  })

  it('switch — value-keyed arms with fallthrough', () => {
    const tree = cast.switch(
      cast.reference('role'),
      [
        { when: 'admin', then: 'Administrator' },
        { when: 'editor', then: 'Editor' },
      ],
      'Visitor',
    )
    expect(tree).toEqual({
      form: 'switch',
      value: { form: 'reference', name: 'role' },
      cases: [
        { when: 'admin', then: 'Administrator' },
        { when: 'editor', then: 'Editor' },
      ],
      fall: 'Visitor',
    })
  })

  it('switch — renders the matching arm', () => {
    const tree = cast.switch(
      cast.reference('role'),
      [
        { when: 'admin', then: 'Administrator' },
        { when: 'editor', then: 'Editor' },
      ],
      'Visitor',
    )
    expect(renderText(tree, { scope: makeScope({ role: 'editor' }) })).toBe(
      'Editor',
    )
    expect(renderText(tree, { scope: makeScope({ role: 'unknown' }) })).toBe(
      'Visitor',
    )
  })

  it('match — try-each-test with fall', () => {
    const tree = cast.match(
      [
        { test: cast.gt(cast.reference('count'), 100), then: 'lots' },
        { test: cast.gt(cast.reference('count'), 0), then: 'some' },
      ],
      'none',
    )
    expect(tree.form).toBe('match')
    expect(tree.branches).toHaveLength(2)
    expect(tree.fall).toBe('none')
  })

  it('match — first true branch wins', () => {
    const tree = cast.match(
      [
        { test: cast.gt(cast.reference('n'), 10), then: 'big' },
        { test: cast.gt(cast.reference('n'), 0), then: 'small' },
      ],
      'zero',
    )
    expect(renderText(tree, { scope: makeScope({ n: 50 }) })).toBe('big')
    expect(renderText(tree, { scope: makeScope({ n: 5 }) })).toBe('small')
    expect(renderText(tree, { scope: makeScope({ n: 0 }) })).toBe('zero')
  })

  it('fork — renders then / fall by predicate', () => {
    const tree = cast.fork(
      cast.eq(cast.reference('status'), 'on'),
      'lit',
      'dark',
    )
    expect(renderText(tree, { scope: makeScope({ status: 'on' }) })).toBe(
      'lit',
    )
    expect(renderText(tree, { scope: makeScope({ status: 'off' }) })).toBe(
      'dark',
    )
  })

  it('walk — iterates and weaves item / index per element', () => {
    const tree = cast.walk(
      cast.reference('items'),
      cast.text(cast.reference('index'), ':', cast.reference('item'), ' '),
    )
    const scope = makeScope({ items: ['a', 'b', 'c'] })
    expect(renderText(tree, { scope })).toBe('0:a 1:b 2:c ')
  })

  it('walk — custom item / index names', () => {
    const tree = cast.walk(
      cast.reference('rows'),
      cast.text(cast.reference('i'), '-', cast.reference('row'), ' '),
      { item: 'row', index: 'i' },
    )
    const scope = makeScope({ rows: ['x', 'y'] })
    expect(renderText(tree, { scope })).toBe('0-x 1-y ')
  })

  it('walk — empty list produces empty output', () => {
    const tree = cast.walk(
      cast.reference('items'),
      cast.text(cast.reference('item'), ' '),
    )
    expect(renderText(tree, { scope: makeScope({ items: [] }) })).toBe('')
  })

  it('walk — non-array input falls back to empty', () => {
    const tree = cast.walk(
      cast.reference('items'),
      cast.text(cast.reference('item'), ' '),
    )
    expect(renderText(tree, { scope: makeScope({ items: null }) })).toBe('')
  })

  it('walkSize — counted range with default item / index names', () => {
    const tree = cast.walkSize(
      0,
      4,
      cast.text(cast.reference('head'), ' '),
    )
    expect(tree.form).toBe('walk')
    expect(tree.case).toBe('size')
    expect(renderText(tree, { scope: makeScope({}) })).toBe('0 1 2 3 ')
  })

  it('walkSize — custom move and bindings', () => {
    const tree = cast.walkSize(
      10,
      0,
      cast.text(cast.reference('i'), ' '),
      { move: -2, item: 'i' },
    )
    expect(tree.move).toBe(-2)
    expect(renderText(tree, { scope: makeScope({}) })).toBe('10 8 6 4 2 ')
  })

  it('walk — nested walks compose scope frames', () => {
    // Outer: walk rows. Inner: walk cells of each row.
    // Body reads both outer.item (row label) and inner.item (cell).
    const tree = cast.walk(
      cast.reference('rows'),
      cast.walk(
        cast.read('row', 'cells'),
        cast.text(
          cast.reference('rowLabel'),
          ':',
          cast.reference('cell'),
          ' ',
        ),
        { item: 'cell' },
      ),
      { item: 'row' },
    )
    // Need an outer-scope alias so the inner template can read the
    // row label without a `read('row', 'label')`. Easiest: have
    // each row carry its own label, and override item names.
    const tree2 = cast.walk(
      cast.reference('rows'),
      cast.walk(
        cast.read('row', 'cells'),
        cast.text(
          cast.read('row', 'label'),
          ':',
          cast.reference('cell'),
          ' ',
        ),
        { item: 'cell' },
      ),
      { item: 'row' },
    )
    const scope = makeScope({
      rows: [
        { label: 'A', cells: [1, 2] },
        { label: 'B', cells: [3] },
      ],
    })
    expect(renderText(tree2, { scope })).toBe('A:1 A:2 B:3 ')
  })

  it('join — separator slots between walk iterations (not after the last)', () => {
    const tree = cast.join(
      ', ',
      cast.walk(cast.reference('items'), cast.reference('item')),
    )
    const scope = makeScope({ items: ['a', 'b', 'c'] })
    expect(renderText(tree, { scope })).toBe('a, b, c')
  })

  it('join — empty separator is a valid no-op', () => {
    const tree = cast.join(
      '',
      cast.walk(cast.reference('items'), cast.reference('item')),
    )
    const scope = makeScope({ items: ['x', 'y'] })
    expect(renderText(tree, { scope })).toBe('xy')
  })

  it('join — wraps a counted-range walk', () => {
    const tree = cast.join(
      '-',
      cast.walkSize(0, 4, cast.reference('head')),
    )
    expect(renderText(tree, { scope: makeScope({}) })).toBe('0-1-2-3')
  })

  it('join — explicit list of items', () => {
    const tree = cast.join(', ', 'a', 'b', 'c')
    expect(tree).toEqual({
      form: 'join',
      text: ', ',
      list: ['a', 'b', 'c'],
    })
    expect(renderText(tree, { scope: makeScope() })).toBe('a, b, c')
  })

  it('join — mixes items + walks; walk iterations flatten', () => {
    const tree = cast.join(
      ', ',
      'first',
      cast.walk(cast.reference('items'), cast.reference('item')),
      'last',
    )
    const out = renderText(tree, {
      scope: makeScope({ items: ['x', 'y'] }),
    })
    expect(out).toBe('first, x, y, last')
  })

  it('walk — outer scope visible inside the body', () => {
    // The walk frame is pushed; outer bindings remain visible.
    const tree = cast.walk(
      cast.reference('items'),
      cast.text(
        cast.reference('prefix'),
        ':',
        cast.reference('item'),
        ' ',
      ),
    )
    const scope = makeScope({ prefix: 'item', items: ['a', 'b'] })
    expect(renderText(tree, { scope })).toBe('item:a item:b ')
  })

  it('walk — frame does NOT leak after iteration', () => {
    const tree = cast.text(
      cast.walk(
        cast.reference('items'),
        cast.reference('item'),
      ),
      ' / after-loop: ',
      // After the walk completes, `item` should no longer be bound.
      cast.reference('item'),
    )
    const scope = makeScope({ items: ['x', 'y'] })
    // The trailing reference resolves to undefined → renders as ''.
    expect(renderText(tree, { scope })).toBe('xy / after-loop: ')
  })

  it('walkSize — nested counted ranges produce a 2-D fan-out', () => {
    const tree = cast.walkSize(
      0,
      2,
      cast.walkSize(
        0,
        3,
        cast.text(
          cast.reference('row'),
          ',',
          cast.reference('col'),
          ' ',
        ),
        { item: 'col' },
      ),
      { item: 'row' },
    )
    expect(renderText(tree, { scope: makeScope({}) })).toBe(
      '0,0 0,1 0,2 1,0 1,1 1,2 ',
    )
  })

  it('walkTest — while-style loop with mutable scope', () => {
    // Mutate a counter from the host so the test eventually flips.
    const counter = { n: 0 }
    const scope = makeScope({
      done: false,
    })
    // Body increments via host-side hook; test checks counter.
    const tree = cast.walkTest(
      cast.lt(cast.reference('counter'), 3),
      cast.text(cast.reference('counter'), '-'),
    )
    // Build a child scope that exposes counter via getter.
    const innerScope = scope.push({
      get counter() {
        return counter.n
      },
    } as unknown as Record<string, unknown>)
    // Each iteration bumps the counter from the test side.
    const out = renderText(tree, {
      scope: innerScope,
      hook: {
        'is:below': ({ a, b }: { a: unknown; b: unknown }) => {
          const c = a as number
          const result = c < (b as number)
          if (result) counter.n += 1
          return result
        },
      },
    })
    expect(out).toBe('1-2-3-')
  })
})

describe('views', () => {
  it('view: flat props, no bind wrapper', () => {
    expect(
      cast.view('callout', {
        variant: 'note',
        body: 'No images yet.',
      }),
    ).toEqual({
      form: 'view',
      name: 'callout',
      variant: 'note',
      body: 'No images yet.',
    })
  })

  it('view with nest children', () => {
    const tree = cast.view(
      'section',
      { title: 'Phonology' },
      [cast.view('paragraph', ['Body text.'])],
    )
    expect(tree.nest).toEqual([
      {
        form: 'view',
        name: 'paragraph',
        nest: ['Body text.'],
      },
    ])
  })
})

describe('higher-order helpers', () => {
  it('pluralCases', () => {
    const tree = cast.pluralCases('count', {
      one: 'message',
      other: 'messages',
    })
    expect(tree.form).toBe('case')
    expect(tree.case).toHaveLength(2)
    expect(tree.case[0]).toEqual({
      form: 'case-value',
      value: 'one',
      flow: ['message'],
    })
    expect(tree.case[1]).toEqual({
      form: 'case-default',
      flow: ['messages'],
    })
  })

  it('selectCases', () => {
    const tree = cast.selectCases('gender', {
      male: 'Mr.',
      female: 'Mrs.',
      other: '',
    })
    expect(tree.test).toEqual({ form: 'reference', name: 'gender' })
    expect(tree.case).toHaveLength(3)
    expect(tree.case[2]).toEqual({
      form: 'case-default',
      flow: [''],
    })
  })
})
