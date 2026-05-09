/**
 * Small string-case + object utilities. Hand-rolled — no
 * lodash dep.
 */

/**
 * Split a token into its constituent words. Handles:
 *
 *   - separator-delimited: `kebab-case`, `snake_case`, `dot.notation`
 *   - camelCase / PascalCase: split on lowercase→uppercase
 *   - acronym runs: `XMLHttpRequest` → `XML`, `Http`, `Request`
 *   - digits: `version2Beta` → `version`, `2`, `Beta`
 *
 * Empty parts are dropped.
 */
function splitWords(text: string): string[] {
  if (!text) return []
  // Insert separator before uppercase that follows a lowercase or digit
  // and before uppercase that precedes a lowercase (acronym → word).
  const spaced = text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/[_\-.\s]+/g, ' ')
    .trim()
  return spaced.length === 0 ? [] : spaced.split(/\s+/)
}

export function camelCase(text: string): string {
  const words = splitWords(text)
  if (words.length === 0) return ''
  return words
    .map((w, i) =>
      i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join('')
}

export function snakeCase(text: string): string {
  return splitWords(text)
    .map(w => w.toLowerCase())
    .join('_')
}

export function kebabCase(text: string): string {
  return splitWords(text)
    .map(w => w.toLowerCase())
    .join('-')
}

export function toPascalCase(text: string): string {
  return splitWords(text)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}

/**
 * Plain-object check: object literals + `Object.create(null)`,
 * not arrays / Dates / Maps / Sets / class instances.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value == null || typeof value !== 'object') return false
  if (Array.isArray(value)) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

export type StringCase = 'snakeCase' | 'camelCase' | 'pascalCase' | 'kebabCase'

const STRING_CASE: Record<StringCase, (val: string) => string> = {
  snakeCase,
  camelCase,
  pascalCase: toPascalCase,
  kebabCase,
}

export function convertObjectKeyCase(
  input: Record<string, unknown>,
  to: StringCase,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const name in input) {
    let val: unknown = input[name]
    if (val) {
      if (isPlainObject(val)) {
        val = convertObjectKeyCase(val, to)
      } else if (Array.isArray(val)) {
        val = val.map(v => {
          if (isPlainObject(v)) {
            return convertObjectKeyCase(v, to)
          }
          return v as unknown
        })
      }
    }
    out[STRING_CASE[to](name)] = val
  }
  return out
}

// ─── AST helpers ───────────────────────────────────────────

import type { Cast } from '@/cast'

/** `Cast`-tagged-object check: rejects scalars, arrays, Dates. */
export function isCast(v: unknown): v is Cast {
  return (
    v !== null &&
    typeof v === 'object' &&
    !Array.isArray(v) &&
    'form' in (v as Record<string, unknown>)
  )
}

/** Deep equality for the `eq` / `switch` / `case-value` paths. */
export function deepEq(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((x, i) => deepEq(x, b[i]))
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ak = Object.keys(a as object)
    const bk = Object.keys(b as object)
    if (ak.length !== bk.length) return false
    return ak.every(k =>
      deepEq(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k],
      ),
    )
  }
  return false
}
