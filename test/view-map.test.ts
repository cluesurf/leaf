/**
 * `book.view` — components keyed by name, wired through to the
 * element-mode renderer's component lookup. The reserved
 * `'fragment'` key supplies the fragment value the renderer
 * uses to wrap sibling lists.
 */

import { describe, it, expect } from 'vitest'
import { createElement, Fragment, type ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Base, cast } from '../code'
import type { Code } from '../code/book'
import { castInline } from './helper'

describe('Book.view drives element-mode component lookup', () => {
  it('maps a view-tag name to a registered component', () => {
    function Callout({ children }: { children?: unknown }) {
      return createElement('aside', { className: 'callout' }, children as ReactElement)
    }

    const base = new Base<Code>()
    base.load({ flow: { 'create:element': createElement } })
    base.load({ view: { fragment: Fragment, callout: Callout } })

    const tree = cast.view('callout', {}, ['hi'])
    const element = castInline(base, tree)
    const html = renderToStaticMarkup(element as ReactElement)
    expect(html).toBe('<aside class="callout">hi</aside>')
  })

  it('falls through to a string tag when no component is registered', () => {
    const base = new Base<Code>()
    base.load({ flow: { 'create:element': createElement } })
    base.load({ view: { fragment: Fragment } })

    const tree = cast.view('section', { className: 'x' }, ['hi'])
    const element = castInline(base, tree)
    const html = renderToStaticMarkup(element as ReactElement)
    expect(html).toBe('<section class="x">hi</section>')
  })

  it('uses the reserved `fragment` key to wrap sibling lists', () => {
    const base = new Base<Code>()
    base.load({ flow: { 'create:element': createElement } })
    base.load({ view: { fragment: Fragment } })

    // Multiple top-level children get wrapped in a Fragment.
    const tree = cast.text(
      cast.view('span', {}, ['a']),
      cast.view('span', {}, ['b']),
    )
    const element = castInline(base, tree)
    const html = renderToStaticMarkup(element as ReactElement)
    expect(html).toBe('<span>a</span><span>b</span>')
  })

  it('toss(book) removes a view component', () => {
    function Callout({ children }: { children?: unknown }) {
      return createElement('aside', { className: 'callout' }, children as ReactElement)
    }

    const base = new Base<Code>()
    base.load({ flow: { 'create:element': createElement } })
    const book = { view: { fragment: Fragment, callout: Callout } }
    base.load(book)
    base.toss(book)

    // After toss, `callout` is no longer a registered component;
    // the renderer should fall through to a literal `<callout>`
    // tag.
    base.load({ view: { fragment: Fragment } })
    const tree = cast.view('callout', {}, ['hi'])
    const element = castInline(base, tree)
    const html = renderToStaticMarkup(element as ReactElement)
    expect(html).toBe('<callout>hi</callout>')
  })
})
