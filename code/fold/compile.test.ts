/**
 * Compile pass tests — make ↔ wake conversion of `call`
 * nodes. Verifies:
 *
 *  - Make-form Call → Wake-form Call (`name/base/case` → `code`,
 *    flat args → `bind`)
 *  - Wake-form Call → Make-form Call (round-trip)
 *  - `mark` survives both directions (editor identity)
 *  - Nested Calls inside fork / walk / view / read indices
 *    are walked
 *  - Runtime renders both flavors equivalently
 */

import { describe, expect, it } from 'vitest'
import { make } from './index'
import type { Cast } from './types'

const codeTable = {
  'flow:eq': 1,
  'flow:gt': 2,
  'flow:format:capitalized': 3,
  'flow:plural': 4,
}

const decodeTable = make.buildDecodeTable(codeTable)

describe('compile — make → wake', () => {
  it('lifts flat args into bind, replaces (name, base, case) with code', () => {
    const tree = make.eq(make.reference('status'), 'on')
    const wake = make.compile(tree, codeTable)
    expect(wake).toEqual({
      form: 'call',
      code: 1,
      bind: {
        a: { form: 'reference', name: 'status' },
        b: 'on',
      },
    })
  })

  it('handles base + case identity tuples', () => {
    const tree = make.call('format', { base: 'capitalized', text: 'hi' })
    const wake = make.compile(tree, codeTable)
    expect(wake).toEqual({
      form: 'call',
      code: 3,
      bind: { text: 'hi' },
    })
  })

  it('preserves mark across compile', () => {
    const tree: Cast = {
      form: 'call',
      name: 'plural',
      mark: '01h-stable-id',
      value: 7,
    }
    const wake = make.compile(tree, codeTable)
    expect(wake).toEqual({
      form: 'call',
      code: 4,
      mark: '01h-stable-id',
      bind: { value: 7 },
    })
  })

  it('walks nested Calls inside fork branches', () => {
    const tree = make.fork(
      make.gt(make.reference('count'), 0),
      'positive',
      'zero or less',
    )
    const wake = make.compile(tree, codeTable) as {
      form: 'fork'
      test: { form: 'call'; code: number }
      then: string
      fall: string
    }
    expect(wake.form).toBe('fork')
    expect(wake.test).toEqual({
      form: 'call',
      code: 2,
      bind: {
        a: { form: 'reference', name: 'count' },
        b: 0,
      },
    })
    expect(wake.then).toBe('positive')
    expect(wake.fall).toBe('zero or less')
  })

  it('walks Calls inside template_string children', () => {
    const tree = make.templateString(
      'You have ',
      make.plural(make.reference('count')),
    )
    const wake = make.compile(tree, codeTable) as {
      form: 'template_string'
      flow: Cast[]
    }
    expect(wake.form).toBe('template_string')
    expect(wake.flow[1]).toEqual({
      form: 'call',
      code: 4,
      bind: { value: { form: 'reference', name: 'count' } },
    })
  })

  it('throws when an identity tuple has no code id', () => {
    const tree = make.call('unknown_verb', { x: 1 })
    expect(() => make.compile(tree, codeTable)).toThrow(/no code id/)
  })
})

describe('decompile — wake → make', () => {
  it('expands code → (name, base, case), lifts bind to flat args', () => {
    const wake: Cast = {
      form: 'call',
      code: 3,
      bind: { text: 'hi' },
    }
    const back = make.decompile(wake, decodeTable)
    expect(back).toEqual({
      form: 'call',
      name: 'format',
      base: 'capitalized',
      text: 'hi',
    })
  })

  it('preserves mark through decompile', () => {
    const wake: Cast = {
      form: 'call',
      code: 4,
      mark: '01h-stable-id',
      bind: { value: 7 },
    }
    const back = make.decompile(wake, decodeTable)
    expect(back).toEqual({
      form: 'call',
      name: 'plural',
      mark: '01h-stable-id',
      value: 7,
    })
  })

  it('throws on unknown code', () => {
    const wake: Cast = { form: 'call', code: 999, bind: {} }
    expect(() => make.decompile(wake, decodeTable)).toThrow(/unknown code/)
  })
})

describe('round-trip — compile then decompile', () => {
  it('returns the original tree for a complex shape', () => {
    const original = make.fork(
      make.eq(make.reference('status'), 'on'),
      make.templateString('on (', make.reference('user'), ')'),
      'off',
    )
    const wake = make.compile(original, codeTable)
    const back = make.decompile(wake, decodeTable)
    expect(back).toEqual(original)
  })

  it('preserves mark on every Call across the round-trip', () => {
    const original: Cast = {
      form: 'call',
      name: 'eq',
      mark: 'mark-A',
      a: {
        form: 'call',
        name: 'plural',
        mark: 'mark-B',
        value: 7,
      },
      b: 1,
    }
    const wake = make.compile(original, codeTable)
    const back = make.decompile(wake, decodeTable)
    expect(back).toEqual(original)
  })
})

describe('runtime accepts both flavors equivalently', () => {
  const scope = make.scope({ count: 5 })

  it('make form renders via name lookup', () => {
    const tree = make.gt(make.reference('count'), 3)
    expect(make.render(tree, { scope })).toBe('true')
  })

  it('wake form renders via code (when the resolver knows code → handler)', () => {
    // Compose a wake-form call without a runtime code resolver
    // — fall back to hook[name] still won't work because name
    // is gone. Instead, supply a context.call resolver that
    // honors `code`. This mirrors `Base.cast` behavior.
    const wake = make.compile(make.gt(make.reference('count'), 3), codeTable)
    const out = make.render(wake, {
      scope,
      call: node => {
        if (node.code === 2) {
          return ({ a, b }: { a: unknown; b: unknown }) =>
            (a as number) > (b as number)
        }
        return undefined
      },
    })
    expect(out).toBe('true')
  })
})
