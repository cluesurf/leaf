/**
 * Hook implementations for the `has` verb's Flow declarations.
 */

export const has_key = ({
  thing,
  key,
}: {
  thing: unknown
  key: string
}): boolean =>
  typeof thing === 'object' && thing !== null && key in thing

export const has_keys = ({
  thing,
  keys,
}: {
  thing: unknown
  keys: string[]
}): boolean =>
  typeof thing === 'object' &&
  thing !== null &&
  keys.every(k => k in thing)

export const has_value = ({
  thing,
  value,
}: {
  thing: unknown
  value: unknown
}): boolean => {
  if (typeof thing !== 'object' || thing === null) return false
  return Object.values(thing as Record<string, unknown>).some(v =>
    Object.is(v, value),
  )
}

export const has_item = ({
  items,
  item,
}: {
  items: unknown[]
  item: unknown
}): boolean => items.some(i => Object.is(i, item))

export const has_prefix = ({
  text,
  prefix,
}: {
  text: string
  prefix: string
}): boolean => text.startsWith(prefix)

export const has_suffix = ({
  text,
  suffix,
}: {
  text: string
  suffix: string
}): boolean => text.endsWith(suffix)

export const has_substring = ({
  text,
  substring,
}: {
  text: string
  substring: string
}): boolean => text.includes(substring)

export const has_pattern = ({
  text,
  pattern,
}: {
  text: string
  pattern: string
}): boolean => new RegExp(pattern).test(text)
