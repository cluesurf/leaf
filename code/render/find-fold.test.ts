/**
 * AST `find` and `fold` primitives.
 *
 * `find` resolves through `context.find`. `fold` resolves a
 * named template through `context.fold` and renders it under a
 * scope frame populated from `bind`.
 */

import { describe, expect, it } from 'vitest'
import {
  cast,
  makeScope,
  renderText,
  evaluateText,
  compile,
} from '.'
import type { Cast } from '@/cast'

describe('find primitive', () => {
  it('builds the canonical shape', async () => {
    const tree = cast.find('page', {
      where: cast.eq(cast.read('status'), 'on'),
      sort: ['title'],
      limit: 10,
    })
    expect(tree).toEqual({
      form: 'find',
      resource: 'page',
      where: {
        form: 'call',
        name: 'is',
        case: 'equal',
        a: { form: 'reference', name: 'status' },
        b: 'on',
      },
      sort: ['title'],
      limit: 10,
    })
  })

  it('resolves through context.find', async () => {
    const rows = [{ id: 1 }, { id: 2 }]
    const tree = cast.find('page', { limit: 5 })
    const out = evaluateText(tree, {
      scope: makeScope({}),
      find: ({ resource, limit }) => {
        expect(resource).toBe('page')
        expect(limit).toBe(5)
        return rows
      },
    })
    expect(out).toEqual(rows)
  })

  it('returns null when no resolver is supplied', async () => {
    const tree = cast.find('page')
    expect(evaluateText(tree, { scope: makeScope({}) })).toBe(null)
  })

  it('evaluates `where` and `sort` before passing to the resolver', async () => {
    const tree = cast.find('page', {
      where: cast.read('filter'),
      sort: [cast.read('order')],
    })
    let captured: { where?: unknown; sort?: unknown[] } = {}
    evaluateText(tree, {
      scope: makeScope({ filter: { status: 'on' }, order: 'title' }),
      find: ({ where, sort }) => {
        captured = { where, sort }
        return []
      },
    })
    expect(captured.where).toEqual({ status: 'on' })
    expect(captured.sort).toEqual(['title'])
  })
})

describe('fold primitive', () => {
  it('builds the canonical shape', async () => {
    const tree = cast.fold('greeting', { count: 3, name: 'Lance' })
    expect(tree).toEqual({
      form: 'fold',
      name: 'greeting',
      bind: { count: 3, name: 'Lance' },
    })
  })

  it('embeds a named template and renders it under a scope frame', async () => {
    const greeting: Cast = cast.text(
      'Hello, ',
      cast.read('name'),
      '!',
    )
    const tree = cast.fold('greeting', { name: 'Lance' })
    const out = renderText(tree, {
      scope: makeScope({}),
      fold: name => (name === 'greeting' ? greeting : undefined),
    })
    expect(out).toBe('Hello, Lance!')
  })

  it('returns null when the named fold is unknown', async () => {
    const tree = cast.fold('missing')
    expect(
      evaluateText(tree, {
        scope: makeScope({}),
        fold: () => undefined,
      }),
    ).toBe(null)
  })

  it('auto-resolves through a Book registered on Base', async () => {
    const { Base } = await import('@/base')
    const greetingTree = cast.text(
      'Hello, ',
      cast.read('name'),
      '!',
    )
    const base = new Base()
    base.load({
      make: [
        {
          form: 'fold',
          case: 'greeting',
          cast: [greetingTree],
        },
      ],
    })
    const out = base.cast('greeting', { name: 'Lance' })
    expect(out).toBe('Hello, Lance!')
  })

  it('multi-node Fold trees concatenate in text mode', async () => {
    const { Base } = await import('@/base')
    const base = new Base()
    base.load({
      make: [
        {
          form: 'fold',
          case: 'list',
          cast: [
            'a-',
            { form: 'reference', name: 'item' },
            '-z',
          ],
        },
      ],
    })
    const out = base.cast('list', { item: 'mid' })
    expect(out).toBe('a-mid-z')
  })
})

