/**
 * `Base` runs in two render modes from one API:
 *   - text mode (default): `base.cast(tree, params)` returns a string
 *   - React mode: pass `createElement` / `fragment` / `component` to
 *     the `Base` constructor; `base.cast` returns vdom
 */

import { describe, it, expect } from 'vitest'
import { createElement, Fragment } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { make, Base } from '../code'
import standard, { type Code } from '../code/book'

describe('Base render modes', () => {
  it('text mode renders a tree against scope params', () => {
    const tree = make.text(
      'Hello, ',
      make.path('user', 'name'),
      '!',
    )

    const base = new Base<Code>()
    base.load(standard)
    expect(base.cast(tree, { user: { name: 'Lance' } })).toBe(
      'Hello, Lance!',
    )
  })

  it('React mode renders a view tree through createElement', () => {
    const tree = make.view('section', { className: 'greeting' }, [
      make.view('p', {}, ['hi']),
    ])

    const base = new Base<Code>({
      createElement,
      fragment: Fragment,
    })
    base.load(standard)

    const element = base.cast(tree)
    const html = renderToStaticMarkup(element as React.ReactElement)
    expect(html).toBe('<section class="greeting"><p>hi</p></section>')
  })

  it('catalog flows compose with make.* builders inside the same Base', () => {
    const base = new Base<Code>()
    base.load(standard)

    // Use a catalog flow to derive a value.
    const upper = base.call('format:capitalized', { text: 'hello' })

    const tree = make.text('Greeting: ', upper as string)
    expect(base.cast(tree)).toBe('Greeting: Hello')
  })

  it('a make call node dispatches via base.cast through (name, base) lookup', () => {
    const base = new Base<Code>()
    base.load(standard)

    const tree = make.call('format', {
      base: 'capitalized',
      text: 'world',
    })
    expect(base.cast(tree)).toBe('World')
  })
})
