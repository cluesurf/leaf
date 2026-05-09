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
import { Base } from '.'
import { make, makeScope } from '@/fold'
import type { Cast } from '@/fold/types'

describe('base.bind — captures tree + output', () => {
  it('returns the tree, the rendered output, and the scope', () => {
    const base = new Base()
    const tree: Cast = make.templateString('hi ', make.reference('name'))
    const result = base.bind(tree, makeScope({ name: 'Lance' }))
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
    const r0 = base.bind(tree, makeScope({ name: 'A' }))
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
    const r0 = base.bind(tree, makeScope({ x: 'b' }))
    expect(r0.output).toBe('abc')
    const r1 = base.bindPatch(r0, [
      { op: 'remove', mark: 'M-x' },
    ])
    expect(r1.output).toBe('ac')
  })
})

describe('memoization — cache + dirty propagation', () => {
  it('reuses cached output for marked subtrees not on the dirty path', () => {
    const base = new Base()
    let evalCount = 0
    const tree: Cast = {
      form: 'template_string',
      flow: [
        {
          form: 'call',
          name: 'sideEffect',
          mark: 'M-side',
          tag: 'a',
        },
        {
          form: 'reference',
          name: 'x',
          mark: 'M-x',
        },
      ],
    }
    const ctx = {
      sideEffect: () => {
        evalCount += 1
        return 'A'
      },
    }
    // Wire the side-effect hook. Because catalog `sideEffect`
    // isn't registered, supply via base.flow. Use bare verb.
    base.flow('sideEffect', ctx.sideEffect)
    const r0 = base.bind(tree, makeScope({ x: '1' }))
    expect(r0.output).toBe('A1')
    expect(evalCount).toBe(1)

    // Patch only M-x. M-side should NOT re-evaluate (cached).
    const r1 = base.bindPatch(r0, [
      { op: 'replace', mark: 'M-x', value: '2' },
    ])
    expect(r1.output).toBe('A2')
    expect(evalCount).toBe(1) // cache hit on M-side
  })

  it('invalidates ancestor caches when a descendant is patched', () => {
    const base = new Base()
    let outerEvals = 0
    const tree: Cast = {
      form: 'call',
      name: 'wrap',
      mark: 'M-outer',
      inner: {
        form: 'reference',
        name: 'value',
        mark: 'M-inner',
      },
    }
    base.flow('wrap', ({ inner }: { inner: unknown }) => {
      outerEvals += 1
      return `<${inner}>`
    })
    const r0 = base.bind(tree, makeScope({ value: 'x' }))
    expect(r0.output).toBe('<x>')
    expect(outerEvals).toBe(1)

    // Patching the inner mark should bubble to M-outer, so
    // both re-evaluate.
    const r1 = base.bindPatch(r0, [
      { op: 'replace', mark: 'M-inner', value: 'y' },
    ])
    expect(r1.output).toBe('<y>')
    expect(outerEvals).toBe(2)
  })

  it('cache survives an unrelated patch elsewhere in the tree', () => {
    const base = new Base()
    let leftEvals = 0
    const tree: Cast = {
      form: 'template_string',
      flow: [
        {
          form: 'call',
          name: 'leftSide',
          mark: 'M-left',
        },
        ' / ',
        {
          form: 'reference',
          name: 'right',
          mark: 'M-right',
        },
      ],
    }
    base.flow('leftSide', () => {
      leftEvals += 1
      return 'L'
    })
    const r0 = base.bind(tree, makeScope({ right: 'R0' }))
    expect(r0.output).toBe('L / R0')
    expect(leftEvals).toBe(1)

    const r1 = base.bindPatch(r0, [
      { op: 'replace', mark: 'M-right', value: 'R1' },
    ])
    expect(r1.output).toBe('L / R1')
    expect(leftEvals).toBe(1) // cache hit
  })
})

describe('mark stays stable across patch + compile round-trip', () => {
  it('replace preserves the patched node\'s own mark', () => {
    const base = new Base()
    const tree: Cast = {
      form: 'template_string',
      flow: [{ form: 'reference', name: 'x', mark: 'X' }],
    }
    const r0 = base.bind(tree, makeScope({ x: 1 }))
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
