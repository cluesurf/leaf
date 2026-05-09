/**
 * Lazy-arg semantics for catalog Calls.
 *
 * `make.call('if', ...)` only evaluates the selected branch.
 * `make.call('bind', ...)` evaluates `names` against the outer
 * scope, pushes them into a frame, then evaluates `then` under
 * the inner scope.
 *
 * Lazy verbs ride the AST walker directly — they don't go
 * through the catalog hook table, so eager-arg fallbacks in
 * `code/book/if/flow.ts` and `code/book/bind/flow.ts` are
 * never hit when calls reach the make-form walker.
 */

import { describe, expect, it } from 'vitest'
import { make, makeScope, renderText, evaluateText } from '.'

describe('lazy `if`', () => {
  it('evaluates only the selected branch', () => {
    let thenCalls = 0
    let elseCalls = 0
    const tree = make.call('if', {
      test: true,
      then: make.call('countThen', {}),
      else: make.call('countElse', {}),
    })
    const out = evaluateText(tree, {
      scope: makeScope(),
      hook: {
        countThen: () => {
          thenCalls += 1
          return 'then-value'
        },
        countElse: () => {
          elseCalls += 1
          return 'else-value'
        },
      },
    })
    expect(out).toBe('then-value')
    expect(thenCalls).toBe(1)
    expect(elseCalls).toBe(0)
  })

  it('falls back to else when test is false', () => {
    const out = evaluateText(
      make.call('if', { test: false, then: 'A', else: 'B' }),
      { scope: makeScope() },
    )
    expect(out).toBe('B')
  })

  it('returns null when else is omitted and test is false', () => {
    const out = evaluateText(make.call('if', { test: false, then: 'A' }), {
      scope: makeScope(),
    })
    expect(out).toBe(null)
  })

  it('test resolves through nested calls', () => {
    const tree = make.call('if', {
      test: make.gt(make.read('count'), 0),
      then: 'positive',
      else: 'zero or less',
    })
    expect(
      renderText(tree, { scope: makeScope({ count: 3 }) }),
    ).toBe('positive')
    expect(
      renderText(tree, { scope: makeScope({ count: 0 }) }),
    ).toBe('zero or less')
  })
})

describe('lazy `bind`', () => {
  it('pushes names into a scope frame visible inside `then`', () => {
    const tree = make.call('bind', {
      names: { greeting: 'Hello', subject: 'World' },
      then: make.text(
        make.read('greeting'),
        ', ',
        make.read('subject'),
        '!',
      ),
    })
    const out = renderText(tree, { scope: makeScope() })
    expect(out).toBe('Hello, World!')
  })

  it('values evaluate against the outer scope', () => {
    // `count` resolves from the outer scope; `doubled` then
    // computes against it before the body runs.
    const tree = make.call('bind', {
      names: {
        doubled: make.call('multiply', { value: make.read('count') }),
      },
      then: make.text('count×2 = ', make.read('doubled')),
    })
    const out = evaluateText(tree, {
      scope: makeScope({ count: 7 }),
      hook: {
        multiply: ({ value }: { value: unknown }) => (value as number) * 2,
      },
    })
    expect(out).toBe('count×2 = 14')
  })

  it('inner frame shadows outer bindings', () => {
    const tree = make.call('bind', {
      names: { x: 'inner' },
      then: make.read('x'),
    })
    const out = renderText(tree, { scope: makeScope({ x: 'outer' }) })
    expect(out).toBe('inner')
  })

  it('inner frame does NOT leak after `then` returns', () => {
    const tree = make.text(
      make.call('bind', {
        names: { x: 'temp' },
        then: make.read('x'),
      }),
      ' / outer-x: ',
      make.read('x'),
    )
    const out = renderText(tree, { scope: makeScope({ x: 'persistent' }) })
    expect(out).toBe('temp / outer-x: persistent')
  })

  it('passes through gracefully when `names` is missing', () => {
    const out = evaluateText(make.call('bind', { then: 'just-this' }), {
      scope: makeScope(),
    })
    expect(out).toBe('just-this')
  })
})
