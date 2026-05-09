import { Flow, Form, Link, LinkMesh } from '@/form'

/** Render-time context shared between TS + Zod emitters. */
export type RenderContext = { forms: Map<string, Form> }

/** PascalCase an export name (handles snake_case / kebab-case). */
export function toPascalCase(s: string): string {
  return s
    .split(/[_-]/)
    .filter(Boolean)
    .map(w => w[0]!.toUpperCase() + w.slice(1))
    .join('')
}

/** PascalCase compound name for a Flow's per-take/make alias. */
export function flowTsBase(flow: Flow): string {
  const caseParts = flow.case ? flow.case.split(':') : []
  return (
    toPascalCase(flow.call) +
    caseParts.map(p => toPascalCase(p)).join('')
  )
}


/**
 * An "enum-style" nested link is one whose `link.link` holds only
 * shapeless children (no `like` / `link` / `case` / `take` / `fuse`
 * / `bind`). The author uses that pattern to declare a set of
 * allowed literal values. Codegen should render it as a string
 * literal union (in types) or `z.enum([...])` (in parsers),
 * rather than recursing into an empty object.
 */

export type EnumStyleResult = {
  isEnum: boolean
  keys: string[]
}

export function detectEnumStyleNesting(
  nested: LinkMesh | undefined,
): EnumStyleResult {
  if (!nested) return { isEnum: false, keys: [] }

  const entries = Object.entries(nested) as [string, Link | undefined][]
  if (entries.length === 0) return { isEnum: false, keys: [] }

  const allShapeless = entries.every(([, child]) => {
    if (!child) return false
    return (
      child.like == null &&
      child.link == null &&
      child.case == null &&
      child.take == null &&
      child.fuse == null &&
      child.bind == null
    )
  })

  return {
    isEnum: allShapeless,
    keys: entries.map(([key]) => key),
  }
}
