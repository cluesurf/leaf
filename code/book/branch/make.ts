/**
 * Authored Flow declaration for the `branch` verb.
 *
 * `branch` is the eager value-selector. Two shapes:
 *
 *   - Single test: `{ test, yes?, no? }` — return `yes` when
 *     `test` is true, else `no`. (At least one of `yes` / `no`
 *     must be supplied.)
 *
 *   - Multi-case: `{ cases: [{ test, yes, no?, fallback? }],
 *     fallback? }` — first arm whose `test` is true wins; its
 *     `yes` is returned. If the arm carries `no` and `test` is
 *     false the arm produces `no` (still terminal). Otherwise
 *     evaluation continues to the next arm. After all arms,
 *     the outer `fallback` (or `null`) is returned.
 *
 * For lazy / short-circuiting at the AST level use
 * `cast.fork(test, then, else)` (a ForkPrimitive node, not a
 * Call). The walker evaluates only the selected branch.
 */

import type { Flow } from '@/form'

export const branch: Flow = {
  form: 'flow',
  save: 'branch',
  call: 'branch',
  take: {
    test: { like: 'boolean', need: false },
    yes: { like: 'unknown', need: false },
    no: { like: 'unknown', need: false },
    cases: { like: 'unknown', need: false, list: true },
    fallback: { like: 'unknown', need: false },
  },
  make: 'unknown',
}
