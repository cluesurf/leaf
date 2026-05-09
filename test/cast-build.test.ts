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

  it('integer literal — wrapped form', () => {
    expect(cast.integer(42)).toEqual({ form: 'integer', value: 42 })
  })

  it('natural_number literal — wrapped form', () => {
    expect(cast.naturalNumber(5)).toEqual({ form: 'integer', value: 5 })
  })

  it('number literal — wrapped decimal form', () => {
    expect(cast.number(3.14)).toEqual({ form: 'decimal', value: 3.14 })
  })

  it('boolean literal — wrapped form', () => {
    expect(cast.boolean(true)).toEqual({ form: 'boolean', value: true })
  })

  it('date literal — wrapped form with ISO value', () => {
    const d = cast.date('2026-04-30T00:00:00Z')
    expect(d).toEqual({ form: 'date', value: '2026-04-30T00:00:00.000Z' })
  })

  it('string literal — wrapped form', () => {
    expect(cast.string('foo')).toEqual({ form: 'string', text: 'foo' })
  })

  it('null literal — wrapped form', () => {
    expect(cast.nil()).toEqual({ form: 'null' })
  })

  it('code literal — wrapped form, with optional type hint', () => {
    expect(cast.code('uuid-x')).toEqual({ form: 'code', text: 'uuid-x' })
    expect(cast.code('uuid-y', 'language')).toEqual({
      form: 'code',
      text: 'uuid-y',
      base: 'language',
    })
  })

  it('range — structured bounds', () => {
    const r = cast.range({
      like: 'integer',
      start: { inclusive: true, value: cast.integer(5) },
      end: { inclusive: false, value: cast.integer(10) },
    })
    expect(r).toEqual({
      form: 'range',
      like: 'integer',
      start: { inclusive: true, value: { form: 'integer', value: 5 } },
      end: { inclusive: false, value: { form: 'integer', value: 10 } },
    })
  })

  it('find — bare call ref', () => {
    expect(cast.find('select:language')).toEqual({
      form: 'find',
      call: 'select:language',
    })
  })

  it('find — with test, sort, size, slot', () => {
    const f = cast.find('filter:word', {
      test: cast.code('uuid-spanish'),
      sort: ['frequency:desc'],
      size: 20,
      slot: 0,
    })
    expect(f).toEqual({
      form: 'find',
      call: 'filter:word',
      test: { form: 'code', text: 'uuid-spanish' },
      sort: ['frequency:desc'],
      size: 20,
      slot: 0,
    })
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
      flow: ['I am ', { form: 'bind', name: 'status' }, '.'],
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
      form: 'bind',
      name: 'count',
    })
  })

  it('path: single segment normalizes to reference', () => {
    expect(cast.path('count')).toEqual({
      form: 'bind',
      name: 'count',
    })
  })

  it('read: nested fields', () => {
    expect(cast.read('user', 'name')).toEqual({
      form: 'read',
      link: [
        { form: 'bind', name: 'user' },
        { form: 'bind', name: 'name' },
      ],
    })
  })

  it('read: with index segment (literal → stringified bind)', () => {
    expect(cast.read('items', cast.idx(0))).toEqual({
      form: 'read',
      link: [
        { form: 'bind', name: 'items' },
        { form: 'bind', name: '0' },
      ],
    })
  })

  it('read: with slice segment', () => {
    expect(cast.read('items', cast.slice(3, 10))).toEqual({
      form: 'read',
      link: [
        { form: 'bind', name: 'items' },
        { form: 'slice', start: 3, end: 10 },
      ],
    })
  })

  it('read: with optional chaining (safe bind) + dynamic-key nested read', () => {
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
        { form: 'bind', name: 'user' },
        { form: 'bind', name: 'metadata', safe: true },
        // Dynamic-key index becomes a nested read whose result is
        // the access key for the next chain step.
        {
          form: 'read',
          link: [
            { form: 'bind', name: 'some' },
            { form: 'bind', name: 'thing' },
          ],
        },
        { form: 'bind', name: 'ready', safe: true },
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
      a: { form: 'bind', name: 'status' },
      b: 'published',
    })
  })

  it('gt with bare-number leaf', () => {
    expect(cast.gt(cast.reference('count'), 0)).toEqual({
      form: 'call',
      name: 'is',
      case: 'above',
      a: { form: 'bind', name: 'count' },
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
      list: { form: 'bind', name: 'items' },
    })
  })

  it('plural', () => {
    expect(cast.plural(cast.reference('count'))).toEqual({
      form: 'call',
      name: 'plural',
      value: { form: 'bind', name: 'count' },
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
        a: { form: 'bind', name: 'x' },
        b: 1,
      },
      then: 'yes',
      fall: 'no',
    })
  })

  it('case with arm helpers — compiles to a match AST with subject folded into each branch', () => {
    const subject = cast.plural(cast.reference('count'))
    const tree = cast.case(subject, [
      cast.value('one', 'message'),
      cast.otherwise('messages'),
    ])
    expect(tree.form).toBe('match')
    expect(tree.branches).toHaveLength(1)
    expect(tree.branches[0]).toEqual({
      test: {
        form: 'call',
        name: 'is',
        case: 'equal',
        a: subject,
        b: 'one',
      },
      then: 'message',
    })
    expect(tree.fall).toBe('messages')
  })

  it('walk', () => {
    const tree = cast.walk(
      cast.reference('stanzas'),
      cast.view('paragraph', [
        cast.path('item', 'translation'),
      ]),
    )
    expect(tree.form).toBe('walk')
    expect(tree.list).toEqual({ form: 'bind', name: 'stanzas' })
    expect(tree.hook).toEqual({
      form: 'view',
      name: 'paragraph',
      nest: [
        {
          form: 'read',
          link: [
            { form: 'bind', name: 'item' },
            { form: 'bind', name: 'translation' },
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
      value: { form: 'bind', name: 'role' },
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

  it('match — accepts cast.when / cast.otherwise arms', () => {
    const tree = cast.match([
      cast.when(cast.gt(cast.reference('n'), 100), 'lots'),
      cast.when(cast.gt(cast.reference('n'), 0), 'some'),
      cast.otherwise('none'),
    ])
    expect(tree.form).toBe('match')
    expect(tree.branches).toHaveLength(2)
    expect(tree.fall).toBe('none')
    expect(renderText(tree, { scope: makeScope({ n: 5 }) })).toBe('some')
    expect(renderText(tree, { scope: makeScope({ n: 0 }) })).toBe('none')
  })

  it('walk — accepts object-arg form', () => {
    const tree = cast.walk({
      list: cast.reference('items'),
      hook: cast.text(cast.read('item'), '|'),
      item: 'item',
    })
    expect(tree.form).toBe('walk')
    expect(tree.case).toBe('list')
    expect(tree.item).toBe('item')
    expect(
      renderText(tree, { scope: makeScope({ items: ['a', 'b', 'c'] }) }),
    ).toBe('a|b|c|')
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
  it('pluralCases — compiles to match AST with `is:equal` branches', () => {
    const tree = cast.pluralCases('count', {
      one: 'message',
      other: 'messages',
    })
    expect(tree.form).toBe('match')
    expect(tree.branches).toHaveLength(1)
    expect(tree.branches[0]?.then).toBe('message')
    expect((tree.branches[0]?.test as { name: string }).name).toBe('is')
    expect(tree.fall).toBe('messages')
  })

  it('selectCases — compiles to match AST keyed by `reference(gender)`', () => {
    const tree = cast.selectCases('gender', {
      male: 'Mr.',
      female: 'Mrs.',
      other: '',
    })
    expect(tree.form).toBe('match')
    expect(tree.branches).toHaveLength(2)
    expect(tree.fall).toBe('')
    const firstTest = tree.branches[0]?.test as {
      form: string
      a: { form: string; name: string }
      b: string
    }
    expect(firstTest.a).toEqual({ form: 'bind', name: 'gender' })
    expect(firstTest.b).toBe('male')
  })
})
