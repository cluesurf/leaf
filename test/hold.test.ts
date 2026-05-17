/**
 * Tests for the `Link.hold` field — runtime storage policy
 * metadata.
 *
 * `hold` is type-only at the schema layer. The persistence
 * engine in `@cluesurf/face` (`useRecord`) consumes it; Leaf
 * itself only needs to:
 *
 *   - accept the field on Link
 *   - round-trip it through `Base.load` (it survives ingestion
 *     and stays attached to its Link)
 *   - not leak into the rendered TypeScript / Zod output
 */

import { describe, it, expect } from 'vitest'
import save from '../code/save'
import type { Hold, Link, Form } from '../code/form'

describe('Link.hold — type acceptance', () => {
  it('accepts site: "url"', () => {
    const link: Link = { like: 'string', hold: { site: 'url' } }
    expect(link.hold?.site).toBe('url')
  })

  it('accepts site: "local" with a time TTL', () => {
    const link: Link = {
      like: 'string',
      hold: { site: 'local', time: '7d' },
    }
    expect(link.hold).toEqual({ site: 'local', time: '7d' })
  })

  it('accepts site: "session"', () => {
    const link: Link = { like: 'boolean', hold: { site: 'session' } }
    expect(link.hold?.site).toBe('session')
  })

  it('accepts site: "none"', () => {
    const link: Link = { like: 'string', hold: { site: 'none' } }
    expect(link.hold?.site).toBe('none')
  })

  it('coexists with mold, take, base, need on the same Link', () => {
    const link: Link = {
      like: 'string',
      need: false,
      base: 'draft',
      take: ['draft', 'published', 'archived'],
      hold: { site: 'url' },
    }
    expect(link.hold?.site).toBe('url')
    expect(link.take).toEqual(['draft', 'published', 'archived'])
    expect(link.base).toBe('draft')
    expect(link.need).toBe(false)
  })
})

describe('Hold — duration shorthand', () => {
  // Format is documented but not parsed by Leaf. The persistence
  // engine in @cluesurf/face owns parsing. These tests pin the
  // accepted shape at the type level.
  const shapes: Hold[] = [
    { site: 'local', time: '30s' },
    { site: 'local', time: '15m' },
    { site: 'local', time: '12h' },
    { site: 'local', time: '7d' },
    { site: 'local', time: '4w' },
    { site: 'session', time: '1h' },
  ]

  it('round-trips every documented duration shorthand', () => {
    for (const shape of shapes) {
      const link: Link = { like: 'string', hold: shape }
      expect(link.hold).toEqual(shape)
    }
  })
})

describe('Link.hold — codegen inertness', () => {
  // The TypeScript renderer should ignore `hold` entirely.
  // It must not appear in the generated alias output.
  const inline = {
    make: [
      {
        form: 'form' as const,
        name: 'settings',
        like: {
          density: {
            like: 'string',
            take: ['compact', 'comfortable'],
            hold: { site: 'url' } as Hold,
          },
          showDrafts: {
            like: 'boolean',
            base: false,
            hold: { site: 'local', time: '30d' } as Hold,
          },
          notes: {
            like: 'string',
            hold: { site: 'session' } as Hold,
          },
        },
      },
    ],
  }

  it('does not emit "hold" in the generated TS alias', async () => {
    const r = await save({ link: '.', fake: true, book: inline })
    const ts = r.link['']
    expect(ts).not.toContain('hold')
    expect(ts).not.toContain('site')
  })

  it('still emits the declared field shapes', async () => {
    const r = await save({ link: '.', fake: true, book: inline })
    const ts = r.link['']
    expect(ts).toContain("density: 'compact' | 'comfortable'")
    expect(ts).toContain('showDrafts: boolean')
    expect(ts).toContain('notes: string')
  })
})

describe('Link.hold — nested forms', () => {
  it('attaches to fields inside a nested LinkMesh', () => {
    const form: Form = {
      form: 'form',
      name: 'note_settings',
      like: {
        publication: {
          like: {
            status: {
              like: 'string',
              take: ['draft', 'published'],
              hold: { site: 'url' },
            },
          },
        },
        autosave: {
          like: 'boolean',
          base: true,
          hold: { site: 'local', time: '90d' },
        },
      },
    }
    const top = form.like as Record<string, Link>
    const publication = top.publication?.like as Record<string, Link>
    expect(publication.status?.hold).toEqual({
      site: 'url',
    })
    expect(top.autosave?.hold).toEqual({
      site: 'local',
      time: '90d',
    })
  })
})
