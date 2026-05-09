/**
 * Tests for the per-context extension system.
 *
 * The flow runtime has no module-level mutable registry —
 * every extension is passed in via the render context. The
 * `hook` map is the same `HookHash` used by `Base.hook` at
 * codegen time, so a single name → function table covers
 * built-in operators, task implementations, and ad-hoc
 * extensions.
 *
 * Custom transformations live as `cast.call(name, args)` in
 * the tree and resolve through `context.hook[name]`. Args are
 * pre-evaluated by the walker before the hook runs.
 */

import { describe, it, expect } from 'vitest'
import { cast, makeScope, renderText } from '.'

describe('hook (call operators)', () => {
  it('adds a new call operator via context.hook', () => {
    const tree = cast.call('reverse', { value: 'hello' })
    expect(
      renderText(tree, {
        scope: makeScope(),
        hook: {
          reverse: ({ value }) =>
            String(value).split('').reverse().join(''),
        },
      }),
    ).toBe('olleh')
  })

  it('hook receives args pre-evaluated from the tree', () => {
    // The `value` arg references a scope key. The walker
    // resolves it before passing into the hook — the hook sees
    // the resolved string, not the reference node.
    const tree = cast.call('shout', {
      value: cast.reference('msg'),
    })
    expect(
      renderText(tree, {
        scope: makeScope({ msg: 'hi' }),
        hook: {
          shout: ({ value }) => `${String(value).toUpperCase()}!`,
        },
      }),
    ).toBe('HI!')
  })

  it('overrides built-ins via context.hook', () => {
    const tree = cast.count(cast.list(['a', 'b']))
    expect(
      renderText(tree, {
        scope: makeScope(),
        hook: { count: () => 999 },
      }),
    ).toBe('999')
  })

  it('hook with a record arg whose entries are flow nodes', () => {
    // `upper` is what the user originally proposed as a
    // form-level extension; it works fine as a `call` with a
    // pre-evaluated `text` arg.
    const tree = cast.call('upper', {
      text: cast.reference('greeting'),
    })
    expect(
      renderText(tree, {
        scope: makeScope({ greeting: 'good morning' }),
        hook: {
          upper: ({ text }: { text: string }) =>
            text.toLocaleUpperCase(),
        },
      }),
    ).toBe('GOOD MORNING')
  })
})
