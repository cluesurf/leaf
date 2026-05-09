import * as MESH from './form'
import * as test from './test'
import * as TASK from './task'
import { Make } from '../code/make'
import type { Book, Cast, CastHash, HookHash } from '../code/form'

const NAME = {
  html_div_element: 'HTMLDivElement',
}

/**
 * Demonstrates `cast`: override the built-in `like` → output
 * mappings. `keyword` is a project-specific brand for `string`
 * — it has no built-in mapping, so without the override the
 * codegen falls back to `z.instanceof(Keyword)` (broken). The
 * override threads `keyword` through as plain string in both
 * the TS output and the zod parser.
 */
const CAST: CastHash = {
  form: { keyword: 'string' },
  take: { keyword: 'z.string()' },
}

/**
 * `hook`: per-flow implementations sourced from `task.ts`,
 * which re-exports every `<name>/task.ts` in this project.
 * Each function's input is typed with the codegen output for
 * the matching flow's `take` shape, so call sites are fully
 * type-checked against the schema.
 */
const HOOK: HookHash = TASK as HookHash

/**
 * The existing test fixtures (`./form`, `./test`) are
 * namespaced module exports. Wrap them in a single Book so
 * the new `Make` class can register them like any other
 * upstream Book.
 */
const TEST_BOOK: Book = {
  host: 'cluesurf',
  name: 'bead-test',
  base: [
    ...(Object.values(MESH) as Cast[]),
    ...(Object.values(test) as Cast[]),
  ],
}

new Make({
  link: '.',
  testLink: '~/test/test',
  name: NAME,
  cast: CAST,
  hook: HOOK,
})
  .load(TEST_BOOK)
  .save()
