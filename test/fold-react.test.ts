/**
 * Smoke test that the existing make/render React surface
 * still works alongside the new `Base<Code>` catalog runtime.
 *
 * The two systems live in parallel today:
 *   - `make.*` builders + `renderText` / `renderElement` for
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
import { make, renderElement } from '../code'

const { renderText } = make
import { Base } from '../code'
import standard, { hooks, CodeLink, type Code } from '../code/book'

describe('make + Base catalog: parallel runtimes', () => {
  it('renders a flow text tree with locale + scope', () => {
    const tree = make.templateString(
      make.text('Hello, '),
      make.path('user', 'name'),
      make.text('!'),
    )

    const out = renderText(tree, {
      scope: make.scope({ user: { name: 'Lance' } }),
    })

    expect(out).toBe('Hello, Lance!')
  })

  it('renders a flow element tree through React', () => {
    const tree = make.view('section', { className: 'greeting' }, [
      make.view('p', {}, [make.text('hi')]),
    ])

    const element = renderElement(tree, {
      scope: make.scope(),
      builder: createElement,
      fragment: Fragment,
      component: {},
    })

    const html = renderToStaticMarkup(element as React.ReactElement)
    expect(html).toBe(
      '<section class="greeting"><p>hi</p></section>',
    )
  })

  it('Base catalog runs in parallel with the make renderer', () => {
    // Set up the catalog runtime.
    const base = new Base<Code>()
    base.load(standard)

    // Use a catalog flow to derive a value.
    const upper = base.call('format', {
      base: 'capitalized',
      text: 'hello',
    })

    // Then render that value through the make tree.
    const tree = make.templateString(make.text('Greeting: '), make.text(upper))

    expect(renderText(tree, { scope: make.scope() })).toBe(
      'Greeting: Hello',
    )
  })

  it('a make call node dispatches via Base.cast through (name, base) lookup', () => {
    // The runtime resolves `make.call('format', { base: 'capitalized', text })`
    // against the catalog by building the colon-key from the
    // node's (name, base, case) and looking it up in the
    // registered hook map.
    const base = new Base<Code>()
    base.load(standard)

    const tree = make.call('format', {
      base: 'capitalized',
      text: 'world',
    })
    expect(base.cast(tree)).toBe('World')
  })
})
