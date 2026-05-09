/**
 * React rendering with calm. Same trees, vdom output instead
 * of strings. Works with any `createElement`-compatible
 * factory (Preact, h-script, etc.).
 */

import { createElement, Fragment, type ReactElement } from 'react'
import {
  make,
  makeScope,
  renderElement,
  type ElementBuilder,
} from '@cluesurf/calm'

const REACT = {
  builder: createElement as unknown as ElementBuilder<ReactElement>,
  fragment: Fragment,
}

// Simple paragraph with inline reference.
const paragraph = make.view('p', null, [
  'Hello, ',
  make.read('name'),
  '!',
])

renderElement(paragraph, {
  ...REACT,
  scope: makeScope({ name: 'Lance' }),
})
// → <p>Hello, Lance!</p>

// Component dispatch — view names map to React components.
const Callout = ({
  variant,
  children,
}: {
  variant: 'note' | 'warn'
  children: ReactElement
}) =>
  createElement('div', { className: `callout-${variant}` }, children)

const block = make.view('callout', { variant: 'note' }, [
  'No images yet.',
])

renderElement(block, {
  ...REACT,
  scope: makeScope(),
  component: { callout: Callout as never },
})
// → <div class="callout-note">No images yet.</div>

// Conditional render via fork.
const status = make.fork(
  make.eq(make.read('status'), 'on'),
  make.view('span', { className: 'on' }, ['live']),
  make.view('span', { className: 'off' }, ['offline']),
)

renderElement(status, {
  ...REACT,
  scope: makeScope({ status: 'on' }),
})
// → <span class="on">live</span>

// Iteration with `walk` — render a list of articles.
const ArticleList = make.view('ul', null, [
  make.walk(
    make.read('articles'),
    make.view('li', null, [
      make.view('h3', null, [make.read('article', 'title')]),
      make.view('p', null, [make.read('article', 'summary')]),
    ]),
    { item: 'article' },
  ),
])

renderElement(ArticleList, {
  ...REACT,
  scope: makeScope({
    articles: [
      { title: 'A', summary: 'first' },
      { title: 'B', summary: 'second' },
    ],
  }),
})
// → <ul><li><h3>A</h3><p>first</p></li><li><h3>B</h3><p>second</p></li></ul>

// Custom call hook — runtime-provided transformations show up
// in the tree as `make.call(name, args)`.
const reversed = make.view(
  'span',
  null,
  [make.call('reverse', { value: 'hello' })],
)

renderElement(reversed, {
  ...REACT,
  scope: makeScope(),
  hook: {
    reverse: ({ value }: { value: string }) =>
      value.split('').reverse().join(''),
  },
})
// → <span>olleh</span>

// Fragment-less builder — works without a Fragment marker by
// returning child arrays. Most vdoms accept arrays as a child.
type Tup = [unknown, Record<string, unknown> | null, unknown[]]
const tup = (
  type: unknown,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): Tup => [type, props, children]

renderElement<Tup>(make.templateString('a', 'b', 'c'), {
  scope: makeScope(),
  builder: tup,
})
// → ['a', 'b', 'c']
