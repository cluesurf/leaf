/**
 * Editor-style patching with `base.bind` + `base.bindPatch`.
 *
 * Patches address nodes by `mark` (UUID v7 recommended).
 * Three ops: `replace` / `remove` / `insert`.
 */

import { make, makeScope, Base } from '@cluesurf/bead'
import type { Cast } from '@cluesurf/bead'

const base = new Base()

// Author with stable marks — typically auto-assigned by an editor.
const tree: Cast = {
  form: 'text',
  flow: [
    'Hello, ',
    { form: 'reference', name: 'name', mark: 'M-name' },
    '!',
  ],
}

const r0 = base.bind(tree, makeScope({ name: 'A' }))
// r0.output → 'Hello, A!'

// Replace by mark — re-evaluation reuses the captured scope.
const r1 = base.bindPatch(r0, [
  { op: 'replace', mark: 'M-name', value: 'world' },
])
// r1.output → 'Hello, world!'
// r0.tree is untouched (BindResult is immutable).

// Insert into a list-shaped child.
const tree2: Cast = {
  form: 'text',
  mark: 'M-root',
  flow: ['a'],
}

const s0 = base.bind(tree2)
// s0.output → 'a'

const s1 = base.bindPatch(s0, [
  { op: 'insert', parent: 'M-root', key: 'flow', value: 'b' },
])
// s1.output → 'ab'

// Remove by mark — drops the node from its parent's list slot.
const tree3: Cast = {
  form: 'text',
  flow: ['a', { form: 'reference', name: 'x', mark: 'M-x' }, 'c'],
}

const t0 = base.bind(tree3, makeScope({ x: 'b' }))
// t0.output → 'abc'

const t1 = base.bindPatch(t0, [{ op: 'remove', mark: 'M-x' }])
// t1.output → 'ac'

// Patches batch — all applied in order, then re-evaluated once.
const u0 = base.bind(tree)
const u1 = base.bindPatch(u0, [
  { op: 'replace', mark: 'M-name', value: 'first' },
  { op: 'insert', parent: 'M-name', key: 'flow', value: '!!' }, // no-op (replaced node has no flow slot)
])
