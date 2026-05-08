import { describe, it, expect } from 'vitest'
import { Make } from '../code/make'
import standard from '../code/base'

describe('standard catalog Book', () => {
  it('has a `host`, `name`, and a `base` array of declarations', () => {
    expect(standard.host).toBe('cluesurf')
    expect(standard.name).toBe('calm')
    expect(Array.isArray(standard.base)).toBe(true)
    expect((standard.base ?? []).length).toBeGreaterThan(0)
  })

  it('every entry is a Form / Flow / Fold / Hash / List', () => {
    const allowed = new Set(['form', 'flow', 'fold', 'hash', 'list'])
    for (const cast of standard.base ?? []) {
      expect(allowed.has(cast.form)).toBe(true)
    }
  })

  it('Flow entries carry a (call, base?, case?) identity', () => {
    const flows = (standard.base ?? []).filter(c => c.form === 'flow')
    expect(flows.length).toBeGreaterThan(0)
    for (const flow of flows) {
      const f = flow as { call: string; base?: string; case?: string }
      expect(typeof f.call).toBe('string')
      expect(f.call.length).toBeGreaterThan(0)
    }
  })

  it("includes `is_ipa_broad` as (call: 'is', base: 'ipa', case: 'broad')", () => {
    const flow = (standard.base ?? []).find(
      c =>
        c.form === 'flow' &&
        (c as any).call === 'is' &&
        (c as any).base === 'ipa' &&
        (c as any).case === 'broad',
    )
    expect(flow).toBeDefined()
    expect((flow as any).make).toBe('boolean')
  })
})

describe('Make.save() — Code aggregate generation', () => {
  it('emits a `Code` type with one colon-keyed entry per Flow', async () => {
    const make = new Make({ link: '.', dry: true })
    make.book(standard)

    const result = await make.save()

    expect(result.code).toContain('export type Code = {')
    expect(result.code).toContain("'flow:is:string'")
    expect(result.code).toContain("'flow:is:ipa:broad'")
    expect(result.code).toContain("'flow:make:sum'")
    expect(result.code).toContain("'flow:get:length'")
    expect(result.code).toContain('export default Code')
  })

  it('Flow take/make types render as expected primitive aliases', async () => {
    const make = new Make({ link: '.', dry: true })
    make.book(standard)

    const result = await make.save()

    // is_ipa_broad: take is { text: string }, make is boolean
    expect(result.code).toMatch(
      /'flow:is:ipa:broad':\s*\{\s*take:\s*\{\s*text:\s*string\s*\};\s*make:\s*boolean\s*\}/,
    )

    // make_sum: take is { a: number; b: number }, make is number
    expect(result.code).toMatch(
      /'flow:make:sum':\s*\{\s*take:\s*\{\s*a:\s*number;\s*b:\s*number\s*\};\s*make:\s*number\s*\}/,
    )

    // is_string: take.thing is unknown
    expect(result.code).toMatch(
      /'flow:is:string':\s*\{\s*take:\s*\{\s*thing:\s*unknown\s*\};\s*make:\s*boolean\s*\}/,
    )
  })

  it('resolves string refs in Flow take/make to named Form types', async () => {
    // A Flow that references a Form by string in `take` and
    // `make` should generate code that uses the Form's
    // PascalCase TS type, not the raw string or `unknown`.
    const inline = {
      base: [
        {
          form: 'form' as const,
          cast: 'language_request',
          like: {
            id:     { like: 'string' },
            locale: { like: 'string', need: false },
          },
        },
        {
          form: 'form' as const,
          cast: 'language',
          like: {
            id:        { like: 'string' },
            iso_639_3: { like: 'string' },
          },
        },
        {
          form: 'flow' as const,
          call: 'select',
          base: 'language',
          take: 'language_request',
          make: 'language',
        },
      ],
    }

    const make = new Make({ link: '.', dry: true })
    make.book(inline)

    const result = await make.save()

    // Forms get top-level type aliases:
    expect(result.code).toContain('export type LanguageRequest')
    expect(result.code).toContain('export type Language')

    // Flow's take/make resolve to those type names:
    expect(result.code).toMatch(
      /'flow:select:language':\s*\{\s*take:\s*LanguageRequest;\s*make:\s*Language\s*\}/,
    )
  })

  it('emits a CodeLink integer-id table inside code.ts', async () => {
    const make = new Make({ link: '.', dry: true })
    make.book(standard)

    const result = await make.save()

    expect(result.code).toContain('export const CodeLink = {')
    expect(result.code).toContain("'flow:is:ipa:broad':")
    expect(result.code).toContain("'flow:make:sum':")
    expect(result.code).toContain('export type CodeLink =')

    // Ids are stable across runs (sorted lex) — re-run and
    // compare:
    const second = await new Make({ link: '.', dry: true })
      .book(standard)
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
      base: [
        {
          form: 'form' as const,
          cast: 'sample_form',
          like: {
            id:   { like: 'string' },
            text: { like: 'string', need: false },
          },
        },
        {
          form: 'list' as const,
          cast: 'sample_list',
          like: { like: 'string' },
        },
        {
          form: 'hash' as const,
          cast: 'sample_hash',
          like: { like: 'string' },
        },
      ],
    }

    const make = new Make({ link: '.', dry: true })
    make.book(inline)

    const result = await make.save()

    // Form gets a top-level TS type alias.
    expect(result.code).toContain(
      'export type SampleForm = { id: string; text?: string }',
    )
    // The Code entry references that alias.
    expect(result.code).toContain("'form:sample_form': { cast: SampleForm }")
    expect(result.code).toContain("'list:sample_list': { cast: string[] }")
    expect(result.code).toContain(
      "'hash:sample_hash': { cast: Record<string, string> }",
    )
  })
})
