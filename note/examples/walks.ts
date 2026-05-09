/**
 * Walk variants — three case-discriminated iteration shapes,
 * wrapped in `make.join` when a separator is needed.
 */

import { make, makeScope, renderText } from '@cluesurf/bead'

// walk(list) — for-each over a collection.
const listLine = make.join(
  ' ',
  make.walk(
    make.read('items'),
    make.templateString(make.read('index'), ':', make.read('item')),
  ),
)

renderText(listLine, {
  scope: makeScope({ items: ['a', 'b', 'c'] }),
})
// → '0:a 1:b 2:c'

// walk(size) — counted range. `head` binding holds the
// current value, `index` the 0-based step counter.
const countdown = make.join(
  ', ',
  make.walkSize(10, 0, make.read('head'), { move: -1 }),
)

renderText(countdown, { scope: makeScope() })
// → '10, 9, 8, 7, 6, 5, 4, 3, 2, 1'

// walk(test) — while-style. Runs while `test` is truthy. Capped
// at 10,000 iterations to prevent runaway loops.
let counter = 0
const ticker = make.walkTest(
  make.lt(make.read('counter'), 5),
  make.templateString(make.read('counter'), '-'),
)

renderText(ticker, {
  scope: makeScope({
    get counter() {
      return counter
    },
  } as Record<string, unknown>),
  hook: {
    lt: ({ a, b }: { a: unknown; b: unknown }) => {
      const result = (a as number) < (b as number)
      if (result) counter += 1
      return result
    },
  },
})
// → '1-2-3-4-5-'

// Nested walks — frames stack independently. Outer scope
// remains visible inside the body. Inner walk wrapped in
// join for spaces; outer wrapped for newlines.
const matrix = make.join(
  '\n',
  make.walkSize(
    0,
    3,
    make.join(
      ' ',
      make.walkSize(
        0,
        3,
        make.templateString(make.read('row'), ',', make.read('col')),
        { item: 'col' },
      ),
    ),
    { item: 'row' },
  ),
)

renderText(matrix, { scope: makeScope() })
// → '0,0 0,1 0,2
//    1,0 1,1 1,2
//    2,0 2,1 2,2'

// Walk with an outer scope binding visible inside.
const labelled = make.join(
  ', ',
  make.walk(
    make.read('items'),
    make.templateString(
      make.read('prefix'), // outer
      ':',
      make.read('item'),    // inner
    ),
  ),
)

renderText(labelled, {
  scope: makeScope({ prefix: 'item', items: ['x', 'y', 'z'] }),
})
// → 'item:x, item:y, item:z'
