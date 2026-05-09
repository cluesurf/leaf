/**
 * `castInline` wraps a tree as a Fold + casts it. Bridges
 * authored data-as-code (Cast trees) into the catalog runtime.
 *
 * Public API is `base.cast(name, params)` — tests use the
 * inline helper to avoid declaring a Book per case.
 */

import { describe, it, expect } from 'vitest'
import { Base, make } from '../code'
import standard, { CodeLink, type Code } from '../code/book'
import { castInline } from './helper'

describe('base.cast — bridge to make trees', () => {
  const base = new Base<Code>()
  base.load(standard)

  it('evaluates literal nodes directly', async () => {
    expect(castInline(base, 'hello')).toBe('hello')
    expect(castInline(base, make.integer(42))).toBe(42)
    expect(castInline(base, make.boolean(true))).toBe(true)
  })

  it('evaluates a `make.weave` (string concatenation)', async () => {
    const tree = make.text('a', 'b', 'c')
    expect(castInline(base, tree)).toBe('abc')
  })

  it('evaluates a path against scope', async () => {
    const tree = make.path('user', 'name')
    expect(
      castInline(base, tree, { user: { name: 'Lance' } }),
    ).toBe('Lance')
  })

  it('dispatches a (name, base) call to a catalog hook', async () => {
    const tree = make.call('format:capitalized', { text: 'hello' })
    expect(castInline(base, tree)).toBe('Hello')
  })

  it('dispatches a (name, base, case) call to a catalog hook', async () => {
    const tree = make.call('is:ipa:broad', { text: 'fəˈnɛtɪk' })
    expect(castInline(base, tree)).toBe(true)
  })

  it('composes nested make.call within make.weave', async () => {
    const tree = make.text(
      'Hi, ',
      make.call('format:capitalized', { text: 'world' }),
      '!',
    )
    expect(castInline(base, tree)).toBe('Hi, World!')
  })

  it('resolves scope-derived inputs inside take args', async () => {
    const tree = make.call('format:truncated', {
      text: make.path('message'),
      length: make.integer(8),
    })
    expect(
      castInline(base, tree, { message: 'hello world' }),
    ).toBe('hello w…')
  })

  it('evaluates conditional forking', async () => {
    const tree = make.fork(
      make.gt(make.path('count'), make.integer(0)),
      'items',
      'no items',
    )
    expect(castInline(base, tree, { count: 5 })).toBe('items')
    expect(castInline(base, tree, { count: 0 })).toBe('no items')
  })

  it('catalog flows compose with make.* builtins', async () => {
    const tree = make.text(
      'Items: ',
      make.call('format:number', {
        value: make.count(make.path('items')),
      }),
    )
    expect(
      castInline(base, tree, { items: [1, 2, 3, 4, 5] }),
    ).toBe('Items: 5')
  })

  it('honors compiled `code:` integer ids when present', async () => {
    const tree = {
      form: 'call' as const,
      name: 'IGNORED-AT-RUNTIME',
      code: CodeLink['flow:format:capitalized'],
      text: 'hello',
    }
    expect(castInline(base, tree as any)).toBe('Hello')
  })
})
