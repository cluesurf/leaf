/**
 * Make ↔ Wake compile pass. Author trees in the make form
 * (human-readable); ship the compiled wake form (integer
 * dispatch, args under `bind`) to the runtime.
 */

import {
  make,
  makeScope,
  renderText,
  compile,
  decompile,
  buildDecodeTable,
} from '@cluesurf/calm'

// Hosts get this from their generated `code.ts`. Inlined here
// so the example stands alone.
const codeTable = {
  'flow:eq': 1,
  'flow:gt': 2,
  'flow:plural': 3,
  'flow:format:capitalized': 4,
}

const decodeTable = buildDecodeTable(codeTable)

// Author in make form.
const authored = make.fork(
  make.eq(make.read('status'), 'on'),
  'live',
  'offline',
)

// Compile to wake form for transport / fast dispatch.
const compiled = compile(authored, codeTable)
// → {
//     form: 'fork',
//     test: { form: 'call', code: 1, bind: { a: {…}, b: 'on' } },
//     then: 'live',
//     fall: 'offline',
//   }

// Round-trip back to make form (debugging, inspection).
const back = decompile(compiled, decodeTable)
// `back` is structurally equal to `authored`.

// Both flavors render identically.
renderText(authored, {
  scope: makeScope({ status: 'on' }),
  hook: { eq: ({ a, b }) => a === b },
})
renderText(compiled, {
  scope: makeScope({ status: 'on' }),
  // For wake form, supply a code-aware resolver.
  call: node => {
    if (node.code === 1)
      return ({ a, b }: { a: unknown; b: unknown }) => a === b
    return undefined
  },
})

// `mark` (UUID v7 recommended) survives compile + decompile.
const withMark = {
  form: 'call' as const,
  name: 'plural',
  mark: '01h-stable',
  value: 7,
}
const wake = compile(withMark, codeTable)
// → { form: 'call', code: 3, mark: '01h-stable', bind: { value: 7 } }

const restored = decompile(wake, decodeTable)
// → withMark (same mark, same args)
