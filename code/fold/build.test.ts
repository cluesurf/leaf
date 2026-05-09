import { describe, it, expect } from 'vitest'
import { make } from './index'

describe('literals', () => {
  it('text literal — bare string', () => {
    expect(make.text('hello')).toBe('hello')
  })

  it('integer literal — bare number', () => {
    expect(make.integer(42)).toBe(42)
  })

  it('natural_number literal — bare number', () => {
    expect(make.naturalNumber(5)).toBe(5)
  })

  it('number literal — bare number', () => {
    expect(make.number(3.14)).toBe(3.14)
  })

  it('boolean literal — bare boolean', () => {
    expect(make.boolean(true)).toBe(true)
  })

  it('date literal — Date instance', () => {
    const d = make.date('2026-04-30T00:00:00Z')
    expect(d).toBeInstanceOf(Date)
    expect(d.toISOString()).toBe('2026-04-30T00:00:00.000Z')
  })

  it('list literal — tagged with form', () => {
    expect(make.list([make.text('a'), make.text('b')])).toEqual({
      form: 'list',
      list: ['a', 'b'],
    })
  })

  it('weave — woven sequence with bare-string leaves', () => {
    expect(make.templateString('I am ', make.reference('status'), '.')).toEqual({
      form: 'template_string',
      flow: ['I am ', { form: 'reference', name: 'status' }, '.'],
    })
  })

  it('hash literal — record of casts under base', () => {
    expect(make.hash({ name: 'Lance', count: 3 })).toEqual({
      form: 'hash',
      base: { name: 'Lance', count: 3 },
    })
  })
})

describe('promote', () => {
  it('passes string through unchanged', () => {
    expect(make.promote('hi')).toBe('hi')
  })

  it('passes number through unchanged', () => {
    expect(make.promote(5)).toBe(5)
    expect(make.promote(-3)).toBe(-3)
    expect(make.promote(3.14)).toBe(3.14)
  })

  it('passes boolean through unchanged', () => {
    expect(make.promote(true)).toBe(true)
  })

  it('passes Date through unchanged', () => {
    const d = new Date('2026-04-30T00:00:00Z')
    expect(make.promote(d)).toBe(d)
  })

  it('wraps a plain array in list', () => {
    expect(make.promote(['a', 1])).toEqual({
      form: 'list',
      list: ['a', 1],
    })
  })

  it('passes structural flow nodes through unchanged', () => {
    const ref = make.reference('count')
    expect(make.promote(ref)).toBe(ref)
  })
})

describe('reads', () => {
  it('reference (bare scope read)', () => {
    expect(make.reference('count')).toEqual({
      form: 'reference',
      name: 'count',
    })
  })

  it('path: single segment normalizes to reference', () => {
    expect(make.path('count')).toEqual({
      form: 'reference',
      name: 'count',
    })
  })

  it('read: nested fields', () => {
    expect(make.read('user', 'name')).toEqual({
      form: 'read',
      link: [
        { form: 'variable', name: 'user' },
        { form: 'field', name: 'name' },
      ],
    })
  })

  it('read: with index segment', () => {
    expect(make.read('items', make.idx(0))).toEqual({
      form: 'read',
      link: [
        { form: 'variable', name: 'items' },
        { form: 'index', value: 0 },
      ],
    })
  })

  it('read: with slice segment', () => {
    expect(make.read('items', make.slice(3, 10))).toEqual({
      form: 'read',
      link: [
        { form: 'variable', name: 'items' },
        { form: 'slice', rise: 3, fall: 10 },
      ],
    })
  })

  it('read: with optional chaining (safe field)', () => {
    const tree = make.read(
      make.variable('user'),
      make.field('metadata', { safe: true }),
      make.idx(
        make.read('some', 'thing'),
      ),
      make.field('ready', { safe: true }),
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
    expect(make.eq(make.reference('status'), 'published')).toEqual({
      form: 'call',
      name: 'eq',
      a: { form: 'reference', name: 'status' },
      b: 'published',
    })
  })

  it('gt with bare-number leaf', () => {
    expect(make.gt(make.reference('count'), 0)).toEqual({
      form: 'call',
      name: 'gt',
      a: { form: 'reference', name: 'count' },
      b: 0,
    })
  })

  it('and', () => {
    const result = make.and(
      make.gt(make.reference('count'), 0),
      make.lt(make.reference('count'), 100),
    )
    expect(result.form).toBe('call')
    expect(result.name).toBe('and')
    // varargs get promoted to a `list` literal under `values`
    expect((result as unknown as { values: { form: string } }).values.form).toBe('list')
  })

  it('count', () => {
    expect(make.count(make.reference('items'))).toEqual({
      form: 'call',
      name: 'count',
      list: { form: 'reference', name: 'items' },
    })
  })

  it('plural', () => {
    expect(make.plural(make.reference('count'))).toEqual({
      form: 'call',
      name: 'plural',
      value: { form: 'reference', name: 'count' },
    })
  })
})

describe('control flow', () => {
  it('fork with bare-string leaves', () => {
    expect(make.fork(make.eq(make.reference('x'), 1), 'yes', 'no')).toEqual({
      form: 'fork',
      test: {
        form: 'call',
        name: 'eq',
        a: { form: 'reference', name: 'x' },
        b: 1,
      },
      then: 'yes',
      fall: 'no',
    })
  })

  it('case with arm helpers', () => {
    const tree = make.case(make.plural(make.reference('count')), [
      make.value('one', 'message'),
      make.otherwise('messages'),
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
    const tree = make.walk(
      make.reference('stanzas'),
      make.view('paragraph', [
        make.path('item', 'translation'),
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
    const tree = make.pick(
      make.reference('preferred'),
      make.reference('auto'),
      'Untitled',
    )
    expect(tree.form).toBe('pick')
    expect((tree.values as { form: string; list: unknown[] }).form).toBe('list')
  })

  it('switch — value-keyed arms with fallthrough', () => {
    const tree = make.switch(
      make.reference('role'),
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
    const tree = make.switch(
      make.reference('role'),
      [
        { when: 'admin', then: 'Administrator' },
        { when: 'editor', then: 'Editor' },
      ],
      'Visitor',
    )
    expect(make.render(tree, { scope: make.scope({ role: 'editor' }) })).toBe(
      'Editor',
    )
    expect(make.render(tree, { scope: make.scope({ role: 'unknown' }) })).toBe(
      'Visitor',
    )
  })

  it('match — try-each-test with fall', () => {
    const tree = make.match(
      [
        { test: make.gt(make.reference('count'), 100), then: 'lots' },
        { test: make.gt(make.reference('count'), 0), then: 'some' },
      ],
      'none',
    )
    expect(tree.form).toBe('match')
    expect(tree.branches).toHaveLength(2)
    expect(tree.fall).toBe('none')
  })

  it('match — first true branch wins', () => {
    const tree = make.match(
      [
        { test: make.gt(make.reference('n'), 10), then: 'big' },
        { test: make.gt(make.reference('n'), 0), then: 'small' },
      ],
      'zero',
    )
    expect(make.render(tree, { scope: make.scope({ n: 50 }) })).toBe('big')
    expect(make.render(tree, { scope: make.scope({ n: 5 }) })).toBe('small')
    expect(make.render(tree, { scope: make.scope({ n: 0 }) })).toBe('zero')
  })

  it('fork — renders then / fall by predicate', () => {
    const tree = make.fork(
      make.eq(make.reference('status'), 'on'),
      'lit',
      'dark',
    )
    expect(make.render(tree, { scope: make.scope({ status: 'on' }) })).toBe(
      'lit',
    )
    expect(make.render(tree, { scope: make.scope({ status: 'off' }) })).toBe(
      'dark',
    )
  })

  it('walk — iterates and weaves item / index per element', () => {
    const tree = make.walk(
      make.reference('items'),
      make.templateString(make.reference('index'), ':', make.reference('item'), ' '),
    )
    const scope = make.scope({ items: ['a', 'b', 'c'] })
    expect(make.render(tree, { scope })).toBe('0:a 1:b 2:c ')
  })

  it('walk — custom item / index names', () => {
    const tree = make.walk(
      make.reference('rows'),
      make.templateString(make.reference('i'), '-', make.reference('row'), ' '),
      { item: 'row', index: 'i' },
    )
    const scope = make.scope({ rows: ['x', 'y'] })
    expect(make.render(tree, { scope })).toBe('0-x 1-y ')
  })

  it('walk — empty list produces empty output', () => {
    const tree = make.walk(
      make.reference('items'),
      make.templateString(make.reference('item'), ' '),
    )
    expect(make.render(tree, { scope: make.scope({ items: [] }) })).toBe('')
  })

  it('walk — non-array input falls back to empty', () => {
    const tree = make.walk(
      make.reference('items'),
      make.templateString(make.reference('item'), ' '),
    )
    expect(make.render(tree, { scope: make.scope({ items: null }) })).toBe('')
  })

  it('walkSize — counted range with default item / index names', () => {
    const tree = make.walkSize(
      0,
      4,
      make.templateString(make.reference('head'), ' '),
    )
    expect(tree.form).toBe('walk')
    expect(tree.case).toBe('size')
    expect(make.render(tree, { scope: make.scope({}) })).toBe('0 1 2 3 ')
  })

  it('walkSize — custom move and bindings', () => {
    const tree = make.walkSize(
      10,
      0,
      make.templateString(make.reference('i'), ' '),
      { move: -2, item: 'i' },
    )
    expect(tree.move).toBe(-2)
    expect(make.render(tree, { scope: make.scope({}) })).toBe('10 8 6 4 2 ')
  })

  it('walkTest — while-style loop with mutable scope', () => {
    // Mutate a counter from the host so the test eventually flips.
    const counter = { n: 0 }
    const scope = make.scope({
      done: false,
    })
    // Body increments via host-side hook; test checks counter.
    const tree = make.walkTest(
      make.lt(make.reference('counter'), 3),
      make.templateString(make.reference('counter'), '-'),
    )
    // Build a child scope that exposes counter via getter.
    const innerScope = scope.push({
      get counter() {
        return counter.n
      },
    } as unknown as Record<string, unknown>)
    // Each iteration bumps the counter from the test side.
    const out = make.render(tree, {
      scope: innerScope,
      hook: {
        lt: ({ a, b }: { a: unknown; b: unknown }) => {
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
      make.view('callout', {
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
    const tree = make.view(
      'section',
      { title: 'Phonology' },
      [make.view('paragraph', ['Body text.'])],
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
    const tree = make.pluralCases('count', {
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
    const tree = make.selectCases('gender', {
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
