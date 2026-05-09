/**
 * AST `fold` primitive — embeds a named template and renders it
 * under a scope frame populated from `bind`.
 */

import { describe, expect, it } from 'vitest'
import { cast } from '@/cast'
import { compile, type CompiledFold } from '@/render'
import { makeScope } from '@/scope'
import type { Cast } from '@/cast'

describe('fold primitive', () => {
  it('builds the canonical shape', async () => {
    const tree = cast.fold('greeting', { count: 3, name: 'Lance' })
    expect(tree).toEqual({
      form: 'fold',
      name: 'greeting',
      bind: { count: 3, name: 'Lance' },
    })
  })

  it('embeds a named template and renders it under a scope frame', () => {
    const greeting: Cast = cast.text(
      'Hello, ',
      cast.read('name'),
      '!',
    )
    const greetingRender = compile(greeting, 'text')
    const tree = cast.fold('greeting', { name: 'Lance' })
    const out = compile(tree, 'text')(makeScope({}), {
      resolveFold: name => (name === 'greeting' ? greetingRender : undefined),
    })
    expect(out).toBe('Hello, Lance!')
  })

  it('returns null when the named fold is unknown', () => {
    const tree = cast.fold('missing')
    expect(
      compile(tree, 'text')(makeScope({}), {
        resolveFold: () => undefined,
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
