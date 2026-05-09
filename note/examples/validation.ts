/**
 * Validation trees with calm. Compose `is` predicates with
 * the `validate` envelope flow to collect typed failures.
 */

import { make, Base } from '@cluesurf/calm'
import standard, { type Code } from '@cluesurf/calm/book'

const base = new Base<Code>()
base.load(standard)

// Single-field rule.
base.call('validate', {
  test: base.call('is', { base: 'email', text: 'lance@elk.fm' }),
  message: 'Must be a valid email.',
  slug: 'invalid_email',
  kind: 'data',
})
// → { ok: true }

base.call('validate', {
  test: base.call('is', { base: 'email', text: 'not-an-email' }),
  message: 'Must be a valid email.',
  slug: 'invalid_email',
  kind: 'data',
})
// → { ok: false, message: 'Must be a valid email.', slug: 'invalid_email', kind: 'data' }

// Compose multiple checks via `is(all)` / `is(any)`.
const passwordValid = base.call('is', {
  base: 'all',
  things: [
    base.call('is', { base: 'string', thing: 'p4ssw0rd!' }),
    base.call('gt', { a: 'p4ssw0rd!'.length, b: 8 }),
    base.call('has', { base: 'pattern', text: 'p4ssw0rd!', pattern: '\\d' }),
  ],
})
// → true

// Tree-form rule (data, compilable, transportable).
const ruleTree = make.fork(
  make.gte(make.read('age'), 18),
  make.call('validate', {
    test: true,
  }),
  make.call('validate', {
    test: false,
    message: 'Must be at least 18.',
    slug: 'underage',
    kind: 'data',
  }),
)

base.cast(ruleTree, base.bind(ruleTree, undefined).scope.push({ age: 21 }))
// → { ok: true }

// Collect failures from a list of rules — typical form-validation pattern.
const rules = [
  { slug: 'required_name', test: base.call('is', { base: 'string', thing: 'Lance' }) },
  { slug: 'positive_count', test: base.call('gte', { a: 3, b: 0 }) },
  { slug: 'max_length', test: base.call('lt', { a: 'short'.length, b: 100 }) },
]

const failures = rules
  .map(r =>
    base.call('validate', {
      test: r.test,
      message: r.slug,
      slug: r.slug,
      kind: 'data',
    }),
  )
  .filter((r: unknown): r is { ok: false; slug: string } =>
    (r as { ok: boolean }).ok === false,
  )
// → []  (all pass)
