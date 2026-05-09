import {
  camelCase,
  isPlainObject,
  snakeCase,
  startCase,
} from 'lodash-es'

export function toPascalCase(text: string) {
  return startCase(camelCase(text)).replace(/ /g, '')
}

export type StringCase = 'snakeCase' | 'camelCase' | 'pascalCase'

const STRING_CASE: Record<StringCase, (val: string) => string> = {
  snakeCase: snakeCase,
  camelCase: camelCase,
  pascalCase: toPascalCase,
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
        val = convertObjectKeyCase(val as Record<string, unknown>, to)
      } else if (Array.isArray(val)) {
        val = val.map(v => {
          if (isPlainObject(v)) {
            return convertObjectKeyCase(v as Record<string, unknown>, to)
          }

          return v as unknown
        })
      }
    }
    out[STRING_CASE[to](name)] = val
  }
  return out
}
