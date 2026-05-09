/**
 * AST `find` and `fold` primitives.
 *
 * `find` resolves through `context.find`. `fold` resolves a
 * named template through `context.fold` and renders it under a
 * scope frame populated from `bind`.
 */

import { describe, expect, it } from 'vitest'
import { make } from './index'
import type { Cast } from './types'

describe('find primitive', () => {
  it('builds the canonical shape', () => {
    const tree = make.find('page', {
      where: make.eq(make.read('status'), 'on'),
      sort: ['title'],
      limit: 10,
    })
    expect(tree).toEqual({
      form: 'find',
      resource: 'page',
      where: {
        form: 'call',
        name: 'eq',
        a: { form: 'reference', name: 'status' },
        b: 'on',
      },
      sort: ['title'],
      limit: 10,
    })
  })

  it('resolves through context.find', () => {
    const rows = [{ id: 1 }, { id: 2 }]
    const tree = make.find('page', { limit: 5 })
    const out = make.evaluate(tree, {
      scope: make.scope({}),
      find: ({ resource, limit }) => {
        expect(resource).toBe('page')
        expect(limit).toBe(5)
        return rows
      },
    })
    expect(out).toEqual(rows)
  })

  it('returns null when no resolver is supplied', () => {
    const tree = make.find('page')
    expect(make.evaluate(tree, { scope: make.scope({}) })).toBe(null)
  })

  it('evaluates `where` and `sort` before passing to the resolver', () => {
    const tree = make.find('page', {
      where: make.read('filter'),
      sort: [make.read('order')],
    })
    let captured: { where?: unknown; sort?: unknown[] } = {}
    make.evaluate(tree, {
      scope: make.scope({ filter: { status: 'on' }, order: 'title' }),
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
  it('builds the canonical shape', () => {
    const tree = make.fold('greeting', { count: 3, name: 'Lance' })
    expect(tree).toEqual({
      form: 'fold',
      cast: 'greeting',
      bind: { count: 3, name: 'Lance' },
    })
  })

  it('embeds a named template and renders it under a scope frame', () => {
    const greeting: Cast = make.templateString(
      'Hello, ',
      make.read('name'),
      '!',
    )
    const tree = make.fold('greeting', { name: 'Lance' })
    const out = make.render(tree, {
      scope: make.scope({}),
      fold: name => (name === 'greeting' ? greeting : undefined),
    })
    expect(out).toBe('Hello, Lance!')
  })

  it('returns null when the named fold is unknown', () => {
    const tree = make.fold('missing')
    expect(
      make.evaluate(tree, {
        scope: make.scope({}),
        fold: () => undefined,
      }),
    ).toBe(null)
  })

  it('auto-resolves through a Book registered on Base', async () => {
    const { Base } = await import('@/base')
    const greetingTree = make.templateString(
      'Hello, ',
      make.read('name'),
      '!',
    )
    const base = new Base()
    base.load({
      cast: [
        {
          form: 'fold',
          cast: 'greeting',
          tree: [greetingTree],
        },
      ],
    })
    const out = base.cast(
      make.fold('greeting', { name: 'Lance' }),
    )
    expect(out).toBe('Hello, Lance!')
  })

  it('multi-node Fold trees concatenate in text mode', async () => {
    const { Base } = await import('@/base')
    const base = new Base()
    base.load({
      cast: [
        {
          form: 'fold',
          cast: 'list',
          tree: [
            'a-',
            { form: 'reference', name: 'item' },
            '-z',
          ],
        },
      ],
    })
    const out = base.cast(make.fold('list', { item: 'mid' }))
    expect(out).toBe('a-mid-z')
  })
})

describe('compile pass walks find / fold subtrees', () => {
  const codeTable = { 'flow:eq': 1 }

  it('compiles nested calls inside find.where', () => {
    const tree = make.find('page', {
      where: make.eq(make.read('status'), 'on'),
    })
    const wake = make.compile(tree, codeTable) as {
      form: 'find'
      where: { form: 'call'; code: number; bind: Record<string, unknown> }
    }
    expect(wake.where.form).toBe('call')
    expect(wake.where.code).toBe(1)
    expect(wake.where.bind).toEqual({
      a: { form: 'reference', name: 'status' },
      b: 'on',
    })
  })

  it('compiles nested calls inside fold.bind', () => {
    const tree = make.fold('greeting', {
      ok: make.eq(make.read('flag'), true),
    })
    const wake = make.compile(tree, codeTable) as {
      form: 'fold'
      bind: Record<string, { form: 'call'; code: number }>
    }
    expect(wake.bind.ok!.code).toBe(1)
  })
})
