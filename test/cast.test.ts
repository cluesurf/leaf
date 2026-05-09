/**
 * `base.cast(tree, scope?)` evaluates a make tree against
 * the Base's registered catalog handlers. Bridges authored
 * data-as-code (Cast trees) into the catalog runtime.
 *
 * Call shape mirrors `base.call`:
 *
 *   make.call('<verb>', { base: <noun>, case: <variant>, ...take })
 *
 * The runtime resolves `(name, base, case)` against the same
 * registry that backs `base.call(...)`, falling through to the
 * compiled `code:` integer id when present.
 */

import { describe, it, expect } from 'vitest'
import { Base, make } from '../code'
import standard, { hooks, CodeLink, type Code } from '../code/book'

describe('base.cast — bridge to make trees', () => {
  const base = new Base<Code>()
  base.load(standard)

  it('evaluates literal nodes directly', () => {
    expect(base.cast(make.text('hello'))).toBe('hello')
    expect(base.cast(make.integer(42))).toBe(42)
    expect(base.cast(make.boolean(true))).toBe(true)
  })

  it('evaluates a `make.weave` (string concatenation)', () => {
    const tree = make.templateString(make.text('a'), make.text('b'), make.text('c'))
    expect(base.cast(tree)).toBe('abc')
  })

  it('evaluates a path against scope', () => {
    const tree = make.path('user', 'name')
    const scope = make.scope({ user: { name: 'Lance' } })
    expect(base.cast(tree, scope)).toBe('Lance')
  })

  it('dispatches a (name, base) call to a catalog hook', () => {
    const tree = make.call('format', {
      base: 'capitalized',
      text: 'hello',
    })
    expect(base.cast(tree)).toBe('Hello')
  })

  it('dispatches a (name, base, case) call to a catalog hook', () => {
    const tree = make.call('is', {
      base: 'ipa',
      case: 'broad',
      text: 'fəˈnɛtɪk',
    })
    expect(base.cast(tree)).toBe(true)
  })

  it('composes nested make.call within make.weave', () => {
    const tree = make.templateString(
      make.text('Hi, '),
      make.call('format', { base: 'capitalized', text: 'world' }),
      make.text('!'),
    )
    expect(base.cast(tree)).toBe('Hi, World!')
  })

  it('resolves scope-derived inputs inside take args', () => {
    const tree = make.call('format', {
      base: 'truncated',
      text: make.path('message'),
      length: make.integer(8),
    })
    const scope = make.scope({ message: 'hello world' })
    expect(base.cast(tree, scope)).toBe('hello w…')
  })

  it('evaluates conditional forking', () => {
    const tree = make.fork(
      make.gt(make.path('count'), make.integer(0)),
      make.text('items'),
      make.text('no items'),
    )
    expect(base.cast(tree, make.scope({ count: 5 }))).toBe('items')
    expect(base.cast(tree, make.scope({ count: 0 }))).toBe('no items')
  })

  it('catalog flows compose with make.* builtins', () => {
    const tree = make.templateString(
      make.text('Items: '),
      make.call('format', {
        base: 'number',
        value: make.count(make.path('items')),
      }),
    )
    const scope = make.scope({ items: [1, 2, 3, 4, 5] })
    expect(base.cast(tree, scope)).toBe('Items: 5')
  })

  it('honors compiled `code:` integer ids when present', () => {
    // Authoring path: the codegen rewrite would set `code` to
    // the CodeLink integer for the (name, base, case) triple.
    // The runtime short-circuits straight to the integer id
    // and ignores name / base / case.
    const tree = {
      form: 'call' as const,
      name: 'IGNORED-AT-RUNTIME',
      code: CodeLink['flow:format:capitalized'],
      text: 'hello',
    }
    expect(base.cast(tree as any)).toBe('Hello')
  })
})
