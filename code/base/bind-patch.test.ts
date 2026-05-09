/**
 * `base.bind` + `base.bindPatch` — capture a tree's evaluation
 * envelope and apply mark-targeted patches.
 *
 * Patch ops:
 *   - { op: 'replace', mark, value }
 *   - { op: 'remove', mark }
 *   - { op: 'insert', parent, key, value }
 *
 * Re-render is currently full (no memoization). The API will
 * keep its signature when partial recomputation lands.
 */

import { describe, expect, it } from 'vitest'
import { Base } from './index'
import { make } from '@/fold'
import type { Cast } from '@/fold/types'

describe('base.bind — captures tree + output', () => {
  it('returns the tree, the rendered output, and the scope', () => {
    const base = new Base()
    const tree: Cast = make.templateString('hi ', make.reference('name'))
    const result = base.bind(tree, make.scope({ name: 'Lance' }))
    expect(result.tree).toBe(tree)
    expect(result.output).toBe('hi Lance')
  })
})

describe('base.bindPatch — replace by mark', () => {
  it('replaces the marked node and re-evaluates', () => {
    const base = new Base()
    const tree: Cast = {
      form: 'template_string',
      flow: ['hello ', { form: 'reference', name: 'name', mark: 'M-name' }],
    }
    const r0 = base.bind(tree, make.scope({ name: 'A' }))
    expect(r0.output).toBe('hello A')

    const r1 = base.bindPatch(r0, [
      { op: 'replace', mark: 'M-name', value: 'world' },
    ])
    expect(r1.output).toBe('hello world')
    // Original tree untouched.
    expect(r0.tree).toBe(tree)
  })

  it('replace targeting a nested call works', () => {
    const base = new Base()
    const inner: Cast = {
      form: 'call',
      name: 'eq',
      mark: 'M-eq',
      a: 1,
      b: 1,
    }
    const tree: Cast = make.fork(inner, 'yes', 'no')
    const r0 = base.bind(tree)
    expect(r0.output).toBe('yes')
    const r1 = base.bindPatch(r0, [
      {
        op: 'replace',
        mark: 'M-eq',
        value: { form: 'call', name: 'eq', a: 1, b: 2 },
      },
    ])
    expect(r1.output).toBe('no')
  })
})

describe('base.bindPatch — insert into a list-shaped child', () => {
  it('appends to template_string.flow', () => {
    const base = new Base()
    const tree: Cast = {
      form: 'template_string',
      mark: 'M-root',
      flow: ['a'],
    }
    const r0 = base.bind(tree)
    expect(r0.output).toBe('a')
    const r1 = base.bindPatch(r0, [
      { op: 'insert', parent: 'M-root', key: 'flow', value: 'b' },
    ])
    expect(r1.output).toBe('ab')
  })
})

describe('base.bindPatch — remove by mark', () => {
  it('drops a list-element child', () => {
    const base = new Base()
    const tree: Cast = {
      form: 'template_string',
      flow: [
        'a',
        { form: 'reference', name: 'x', mark: 'M-x' },
        'c',
      ],
    }
    const r0 = base.bind(tree, make.scope({ x: 'b' }))
    expect(r0.output).toBe('abc')
    const r1 = base.bindPatch(r0, [
      { op: 'remove', mark: 'M-x' },
    ])
    expect(r1.output).toBe('ac')
  })
})

describe('mark stays stable across patch + compile round-trip', () => {
  it('replace preserves the patched node\'s own mark', () => {
    const base = new Base()
    const tree: Cast = {
      form: 'template_string',
      flow: [{ form: 'reference', name: 'x', mark: 'X' }],
    }
    const r0 = base.bind(tree, make.scope({ x: 1 }))
    const replacement: Cast = {
      form: 'reference',
      name: 'y',
      mark: 'Y',
    }
    const r1 = base.bindPatch(r0, [
      { op: 'replace', mark: 'X', value: replacement },
    ])
    const root = r1.tree as { flow: Cast[] }
    expect((root.flow[0] as { mark?: string }).mark).toBe('Y')
  })
})
