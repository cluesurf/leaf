import { Flow, Form } from '@/form'

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
