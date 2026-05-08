/**
 * Smoke test that the existing fold/render React surface
 * still works alongside the new `Base<Code>` catalog runtime.
 *
 * The two systems live in parallel today:
 *   - `flow.*` builders + `renderText` / `renderElement` for
 *     authored render trees (the FOLD AST)
 *   - `Base<Code>` + `base.call(...)` for the catalog runtime
 *     (Form / Flow declarations)
 *
 * They share vocabulary (`form` discriminant, `hook` registry
 * shape) but operate on different inputs. This test pins both
 * paths to a single fixture.
 */

import { describe, it, expect } from 'vitest'
import { createElement, Fragment } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { flow, renderElement } from '../code'

const { renderText } = flow
import { Base } from '../code'
import standard, { hooks, CodeLink, type Code } from '../code/base'

describe('fold + Base catalog: parallel runtimes', () => {
  it('renders a flow text tree with locale + scope', () => {
    const tree = flow.weave(
      flow.text('Hello, '),
      flow.path('user', 'name'),
      flow.text('!'),
    )

    const out = renderText(tree, {
      scope: flow.scope({ user: { name: 'Lance' } }),
    })

    expect(out).toBe('Hello, Lance!')
  })

  it('renders a flow element tree through React', () => {
    const tree = flow.view('section', { className: 'greeting' }, [
      flow.view('p', {}, [flow.text('hi')]),
    ])

    const element = renderElement(tree, {
      scope: flow.scope(),
      builder: createElement,
      fragment: Fragment,
      component: {},
    })

    const html = renderToStaticMarkup(element as React.ReactElement)
    expect(html).toBe(
      '<section class="greeting"><p>hi</p></section>',
    )
  })

  it('Base catalog runs in parallel with the fold renderer', () => {
    // Set up the catalog runtime.
    const base = new Base<Code>()
    base.bind(standard, hooks, CodeLink)

    // Use a catalog flow to derive a value.
    const upper = base.call('format', {
      base: 'capitalized',
      text: 'hello',
    })

    // Then render that value through the fold tree.
    const tree = flow.weave(flow.text('Greeting: '), flow.text(upper))

    expect(renderText(tree, { scope: flow.scope() })).toBe(
      'Greeting: Hello',
    )
  })

  it('a fold call node can dispatch to a Base hook via context.hook', () => {
    // The fold renderer accepts a `hook` map for resolving
    // `flow.call(name, args)` operators. Wiring catalog hooks
    // into that map lets fold trees invoke catalog flows
    // directly (with the args passed positionally as one
    // record).
    const tree = flow.call('format_capitalized', { text: 'world' })

    const out = renderText(tree, {
      scope: flow.scope(),
      hook: { format_capitalized: hooks.format_capitalized },
    })

    expect(out).toBe('World')
  })
})
