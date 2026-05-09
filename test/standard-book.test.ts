import { describe, it, expect } from 'vitest'
import { Make } from '../code/make'
import standard from '../code/book'

describe('standard catalog Book', () => {
  it('has a `host`, `name`, and a `cast` array of declarations', () => {
    expect(standard.host).toBe('cluesurf')
    expect(standard.name).toBe('bead')
    expect(Array.isArray(standard.cast)).toBe(true)
    expect((standard.cast ?? []).length).toBeGreaterThan(0)
  })

  it('every entry is a Form / Flow / Fold / Hash / List', () => {
    const allowed = new Set(['form', 'flow', 'make', 'hash', 'list'])
    for (const cast of standard.cast ?? []) {
      expect(allowed.has(cast.form)).toBe(true)
    }
  })

  it('Flow entries carry a (call, case?) identity', () => {
    const flows = (standard.cast ?? []).filter(c => c.form === 'flow')
    expect(flows.length).toBeGreaterThan(0)
    for (const flow of flows) {
      const f = flow as { call: string; case?: string }
      expect(typeof f.call).toBe('string')
      expect(f.call.length).toBeGreaterThan(0)
    }
  })

  it("includes `is_ipa_broad` as (call: 'is', case: 'ipa:broad')", () => {
    const flow = (standard.cast ?? []).find(
      c => c.form === 'flow' && c.call === 'is' && c.case === 'ipa:broad',
    )
    expect(flow).toBeDefined()
    if (flow?.form === 'flow') {
      expect(flow.make).toBe('boolean')
    }
  })
})

describe('Make.save() — Code aggregate generation', () => {
  it('emits a `Code` type with one colon-keyed entry per Flow', async () => {
    const make = new Make({ link: '.', dry: true })
    make.load(standard)

    const result = await make.save()

    expect(result.code).toContain('export type Code = {')
    expect(result.code).toContain("'flow:is:string'")
    expect(result.code).toContain("'flow:is:ipa:broad'")
    expect(result.code).toContain("'flow:make:sum'")
    expect(result.code).toContain("'flow:get:length'")
    expect(result.code).toContain('export default Code')
  })

  it('Flow take/make resolve via per-Flow type aliases in their save dirs', async () => {
    const make = new Make({ link: '.', dry: true })
    make.load(standard)

    const result = await make.save()

    // Per-Flow aliases land in their `save:` directory's
    // index.ts (e.g. is/index.ts, make/index.ts).
    expect(result.link.is).toContain(
      'export type IsIpaBroadTake = { text: string }',
    )
    expect(result.link.is).toContain('export type IsIpaBroad = boolean')

    expect(result.link.make).toContain(
      'export type MakeSumTake = { a: number; b: number }',
    )
    expect(result.link.make).toContain('export type MakeSum = number')

    expect(result.link.is).toContain(
      'export type IsStringTake = { thing: unknown }',
    )
    expect(result.link.is).toContain('export type IsString = boolean')

    // The bundled `code.ts` imports aliases from each save
    // directory and references them in the Code aggregate:
    expect(result.code).toContain("from './is'")
    expect(result.code).toContain("from './make'")
    expect(result.code).toContain(
      "'flow:is:ipa:broad': { take: IsIpaBroadTake; make: IsIpaBroad }",
    )
    expect(result.code).toContain(
      "'flow:make:sum': { take: MakeSumTake; make: MakeSum }",
    )
    expect(result.code).toContain(
      "'flow:is:string': { take: IsStringTake; make: IsString }",
    )
  })

  it('resolves string refs in Flow take/make to named Form types', async () => {
    // A Flow that references a Form by string in `take` and
    // `make` should generate code that uses the Form's
    // PascalCase TS type, not the raw string or `unknown`.
    const inline = {
      cast: [
        {
          form: 'form' as const,
          name: 'language_request',
          like: {
            id:     { like: 'string' },
            locale: { like: 'string', need: false },
          },
        },
        {
          form: 'form' as const,
          name: 'language',
          like: {
            id:        { like: 'string' },
            iso_639_3: { like: 'string' },
          },
        },
        {
          form: 'flow' as const,
          call: 'select',
          case: 'language',
          take: 'language_request',
          make: 'language',
        },
      ],
    }

    const make = new Make({ link: '.', dry: true })
    make.load(inline)

    const result = await make.save()

    // Forms get top-level type aliases in their save dir
    // (root `''` since the inline Book sets no `save:`).
    expect(result.link['']).toContain('export type LanguageRequest')
    expect(result.link['']).toContain('export type Language')

    // Flow's take/make resolve to those Form types via
    // per-Flow aliases:
    expect(result.link['']).toContain(
      'export type SelectLanguageTake = LanguageRequest',
    )
    expect(result.link['']).toContain(
      'export type SelectLanguage = Language',
    )

    // The Code aggregate references the per-Flow aliases:
    expect(result.code).toMatch(
      /'flow:select:language':\s*\{\s*take:\s*SelectLanguageTake;\s*make:\s*SelectLanguage\s*\}/,
    )
  })

  it('throws on identity-tuple collisions across registered Books', async () => {
    const bookA = {
      host: 'org',
      name: 'a',
      cast: [
        {
          form: 'flow' as const,
          call: 'is',
          base: 'string',
          take: { thing: { like: 'unknown' } },
          make: 'boolean',
        },
      ],
    }
    const bookB = {
      host: 'org',
      name: 'b',
      cast: [
        {
          form: 'flow' as const,
          call: 'is',
          base: 'string',
          take: { thing: { like: 'unknown' } },
          make: 'boolean',
        },
      ],
    }

    const make = new Make({ link: '.', dry: true })
    make.load(bookA)
    make.load(bookB)

    await expect(make.save()).rejects.toThrow(
      /identity-tuple collisions/,
    )
  })

  it('does not flag two Flows that differ in case as collisions', async () => {
    const inline = {
      cast: [
        {
          form: 'flow' as const,
          call: 'is',
          case: 'ipa:broad',
          take: { text: { like: 'string' } },
          make: 'boolean',
        },
        {
          form: 'flow' as const,
          call: 'is',
          case: 'ipa:narrow',
          take: { text: { like: 'string' } },
          make: 'boolean',
        },
      ],
    }
    const make = new Make({ link: '.', dry: true })
    make.load(inline)
    // Should NOT throw — different `case` distinguishes them.
    const result = await make.save()
    expect(result.code).toContain("'flow:is:ipa:broad'")
    expect(result.code).toContain("'flow:is:ipa:narrow'")
  })

  it('emits a CodeLink integer-id table inside code.ts', async () => {
    const make = new Make({ link: '.', dry: true })
    make.load(standard)

    const result = await make.save()

    expect(result.code).toContain('export const CodeLink = {')
    expect(result.code).toContain("'flow:is:ipa:broad':")
    expect(result.code).toContain("'flow:make:sum':")
    expect(result.code).toContain('export type CodeLink =')

    // Ids are stable across runs (sorted lex) — re-run and
    // compare:
    const second = await new Make({ link: '.', dry: true })
      .load(standard)
      .save()
    expect(second.code).toBe(result.code)
  })

  it('emits Form / Hash / List entries with their cast shapes', async () => {
    // The standard catalog ships only generic verb flows.
    // Form / Hash / List Code entries are exercised by
    // consumer Books in their own tests; this asserts that
    // makeCode emits the right *shape* for each kind by
    // running it against an inline Book.
    const inline = {
      cast: [
        {
          form: 'form' as const,
          name: 'sample_form',
          like: {
            id:   { like: 'string' },
            text: { like: 'string', need: false },
          },
        },
        {
          form: 'list' as const,
          name: 'sample_list',
          like: { like: 'string' },
        },
        {
          form: 'hash' as const,
          name: 'sample_hash',
          like: { like: 'string' },
        },
      ],
    }

    const make = new Make({ link: '.', dry: true })
    make.load(inline)

    const result = await make.save()

    // Type aliases live in dirs (root, since no `save:` set).
    expect(result.link['']).toContain(
      'export type SampleForm = { id: string; text?: string }',
    )
    expect(result.link['']).toContain(
      'export type SampleList = string[]',
    )
    expect(result.link['']).toContain(
      'export type SampleHash = Record<string, string>',
    )

    // The Code aggregate references those aliases:
    expect(result.code).toContain(
      "'form:sample_form': { cast: SampleForm }",
    )
    expect(result.code).toContain(
      "'list:sample_list': { cast: SampleList }",
    )
    expect(result.code).toContain(
      "'hash:sample_hash': { cast: SampleHash }",
    )
  })
})
