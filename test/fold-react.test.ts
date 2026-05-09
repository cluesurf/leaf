/**
 * `Base` runs in two render modes from one API:
 *   - text mode (default): `base.cast(name, params)` returns a string
 *   - React mode: pass `createElement` to the `Base` constructor;
 *     `base.cast` returns vdom. `Fragment` and view components
 *     ride in via `book.view`.
 */

import { describe, it, expect } from 'vitest'
import { createElement, Fragment } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { make, Base } from '../code'
import standard, { type Code } from '../code/book'
import { castInline } from './helper'

describe('Base render modes', () => {
  it('text mode renders a tree against scope params', async () => {
    const tree = make.text('Hello, ', make.path('user', 'name'), '!')

    const base = new Base<Code>()
    base.load(standard)
    expect(
      castInline(base, tree, { user: { name: 'Lance' } }),
    ).toBe('Hello, Lance!')
  })

  it('React mode renders a view tree through createElement', async () => {
    const tree = make.view('section', { className: 'greeting' }, [
      make.view('p', {}, ['hi']),
    ])

    const base = new Base<Code>({ createElement })
    base.load({ ...standard, view: { fragment: Fragment } })

    const element = castInline(base, tree)
    const html = renderToStaticMarkup(element as React.ReactElement)
    expect(html).toBe(
      '<section class="greeting"><p>hi</p></section>',
    )
  })

  it('catalog flows compose with make.* builders inside the same Base', async () => {
    const base = new Base<Code>()
    base.load(standard)

    const upper = base.call('format:capitalized', { text: 'hello' })

    const tree = make.text('Greeting: ', upper as string)
    expect(castInline(base, tree)).toBe('Greeting: Hello')
  })

  it('a make call node dispatches via base.cast through (name, base) lookup', async () => {
    const base = new Base<Code>()
    base.load(standard)

    const tree = make.call('format', {
      base: 'capitalized',
      text: 'world',
    })
    expect(castInline(base, tree)).toBe('World')
  })
})
