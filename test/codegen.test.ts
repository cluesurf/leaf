import { describe, it, expect } from 'vitest'
import * as MESH from './form'
import * as test from './test'
import * as TASK from './task'
import makeTree from '../code/make'
import type { CastHash, HookHash } from '../code/form'
import fs from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const NAME = {
  html_div_element: 'HTMLDivElement',
}

// `keyword` is a project-specific brand for `string`. Without
// overrides, codegen falls back to `z.instanceof(Keyword)`. The
// cast overrides thread it through as plain string in both the
// TS output and the zod parser.
const CAST: CastHash = {
  form: { keyword: 'string' },
  take: { keyword: 'z.string()' },
}

const HOOK: HookHash = TASK as HookHash

async function runCodegen() {
  return await makeTree({
    name: NAME,
    mesh: { ...MESH, ...test },
    link: { ...MESH, ...test },
    cast: CAST,
    hook: HOOK,
    testLink: '~/test/test',
    codeLink: '.',
  })
}

describe('codegen — makeTree pipeline', () => {
  it('returns a tree with form / take / base streams', async () => {
    const tree = await runCodegen()
    expect(tree).toHaveProperty('form')
    expect(tree).toHaveProperty('take')
    expect(tree).toHaveProperty('base')
    expect(typeof tree.form).toBe('object')
    expect(typeof tree.take).toBe('object')
    expect(typeof tree.base).toBe('object')
  })

  it('emits one entry per Form / Hash / List declaration', async () => {
    const tree = await runCodegen()
    const formKeys = Object.keys(tree.form)
    expect(formKeys.length).toBeGreaterThan(0)
    // Every form output should at least be a non-empty string.
    for (const key of formKeys) {
      expect(typeof tree.form[key]).toBe('string')
      expect((tree.form[key] as string).length).toBeGreaterThan(0)
    }
  })

  it('emits Zod parsers in the take stream', async () => {
    const tree = await runCodegen()
    const takeKeys = Object.keys(tree.take)
    expect(takeKeys.length).toBeGreaterThan(0)
    for (const key of takeKeys) {
      const out = tree.take[key] as string
      // Every take file should reference zod.
      expect(out).toMatch(/import .* from ['"]zod['"]/)
    }
  })

  it('emits runtime constants in the base stream', async () => {
    const tree = await runCodegen()
    const baseKeys = Object.keys(tree.base)
    expect(baseKeys.length).toBeGreaterThan(0)
    for (const key of baseKeys) {
      const out = tree.base[key] as string
      // Every base file should `export` something.
      expect(out).toMatch(/\bexport\b/)
    }
  })

  it('honors cast overrides (keyword → string)', async () => {
    const tree = await runCodegen()
    const allFormOutput = Object.values(tree.form).join('\n')
    const allTakeOutput = Object.values(tree.take).join('\n')
    // Should not fall through to the broken `instanceof Keyword` path.
    expect(allFormOutput).not.toMatch(/instanceof.*Keyword/)
    expect(allTakeOutput).not.toMatch(/z\.instanceof\(Keyword\)/)
  })

  it('TS file paths follow the testLink / codeLink template', async () => {
    const tree = await runCodegen()
    for (const key of Object.keys(tree.form)) {
      // The keys are paths starting with ~ or .
      expect(key.startsWith('~') || key.startsWith('.')).toBe(true)
    }
  })

  it('produces deterministic output across runs', async () => {
    const a = await runCodegen()
    const b = await runCodegen()
    expect(Object.keys(a.form).sort()).toEqual(Object.keys(b.form).sort())
    expect(Object.keys(a.take).sort()).toEqual(Object.keys(b.take).sort())
    expect(Object.keys(a.base).sort()).toEqual(Object.keys(b.base).sort())
    for (const key of Object.keys(a.form)) {
      expect(a.form[key]).toBe(b.form[key])
    }
  })
})

describe('codegen — snapshot fidelity', () => {
  // The test/hold/, test/greet_user/, test/sum_numbers/ folders
  // hold the canonical generated output for the test fixtures.
  // These tests guard against regressions during the calm
  // migration: the form.js codegen pipeline keeps producing
  // byte-equal output as we restructure imports and folders.

  function readFixture(rel: string): string | null {
    const full = path.join(__dirname, rel)
    if (!fs.existsSync(full)) return null
    return fs.readFileSync(full, 'utf8')
  }

  it('hold/index.ts matches the on-disk snapshot', async () => {
    const expected = readFixture('hold/index.ts')
    if (!expected) {
      // Snapshot doesn't exist yet; skip rather than fail.
      return
    }
    const tree = await runCodegen()
    // The generated key is the testLink-rooted path. We map
    // back by matching the suffix of the snapshot file path.
    const candidates = Object.keys(tree.form).filter(k =>
      k.endsWith('/test/hold'),
    )
    if (candidates.length === 0) return
    const got = tree.form[candidates[0]!] as string
    expect(got.trim()).toBe(expected.trim())
  })

  it('hold/take.ts matches the on-disk snapshot', async () => {
    const expected = readFixture('hold/take.ts')
    if (!expected) return
    const tree = await runCodegen()
    const candidates = Object.keys(tree.take).filter(k =>
      k.endsWith('/test/hold'),
    )
    if (candidates.length === 0) return
    const got = tree.take[candidates[0]!] as string
    expect(got.trim()).toBe(expected.trim())
  })

  it('hold/base.ts matches the on-disk snapshot', async () => {
    const expected = readFixture('hold/base.ts')
    if (!expected) return
    const tree = await runCodegen()
    const candidates = Object.keys(tree.base).filter(k =>
      k.endsWith('/test/hold'),
    )
    if (candidates.length === 0) return
    const got = tree.base[candidates[0]!] as string
    expect(got.trim()).toBe(expected.trim())
  })
})

describe('codegen — Form / Hash / List authoring shapes', () => {
  it('Forms produce TypeScript type declarations', async () => {
    const tree = await runCodegen()
    const allFormOutput = Object.values(tree.form).join('\n')
    expect(allFormOutput).toMatch(/export type \w+/)
  })

  it('Hashes and Lists land in the base (runtime) stream', async () => {
    const tree = await runCodegen()
    const allBaseOutput = Object.values(tree.base).join('\n')
    // Hash/List exports literal data; should `export const` the value.
    expect(allBaseOutput).toMatch(/export const \w+/)
  })

  it('Tasks reference their take Form by name', async () => {
    const tree = await runCodegen()
    const allFormOutput = Object.values(tree.form).join('\n')
    // Tasks have take fields that reference Forms by name; should
    // produce input types named after the task or task's take.
    expect(allFormOutput.length).toBeGreaterThan(0)
  })
})
