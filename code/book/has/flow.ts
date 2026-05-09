/**
 * Hook implementations for the `has` verb's Flow declarations.
 */

const hasKey = ({
  thing,
  key,
}: {
  thing: unknown
  key: string
}): boolean =>
  typeof thing === 'object' && thing !== null && key in thing

const hasKeys = ({
  thing,
  keys,
}: {
  thing: unknown
  keys: string[]
}): boolean =>
  typeof thing === 'object' &&
  thing !== null &&
  keys.every(k => k in thing)

const hasValue = ({
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

const hasItem = ({
  items,
  item,
}: {
  items: unknown[]
  item: unknown
}): boolean => items.some(i => Object.is(i, item))

const hasPrefix = ({
  text,
  prefix,
}: {
  text: string
  prefix: string
}): boolean => text.startsWith(prefix)

const hasSuffix = ({
  text,
  suffix,
}: {
  text: string
  suffix: string
}): boolean => text.endsWith(suffix)

const hasSubstring = ({
  text,
  substring,
}: {
  text: string
  substring: string
}): boolean => text.includes(substring)

const hasPattern = ({
  text,
  pattern,
}: {
  text: string
  pattern: string
}): boolean => new RegExp(pattern).test(text)


const flow = {
  'has:key': hasKey,
  'has:keys': hasKeys,
  'has:value': hasValue,
  'has:item': hasItem,
  'has:prefix': hasPrefix,
  'has:suffix': hasSuffix,
  'has:substring': hasSubstring,
  'has:pattern': hasPattern,
}

export default flow
