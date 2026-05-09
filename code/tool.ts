import {
  camelCase,
  isPlainObject,
  snakeCase,
  startCase,
} from 'lodash-es'
import { TestBack } from './form'
import { RefinementCtx } from 'zod'

export function toPascalCase(text: string) {
  return startCase(camelCase(text)).replace(/ /g, '')
}

const base: Record<string, unknown> = {}

export function save(name: string, bond: unknown) {
  base[name] = bond
}

export function LOAD(name: string): unknown {
  if (!(name in base)) {
    throw new Error(`No '${name}' found in @cluesurf/bead`)
  }
  return base[name]
}

export function MAKE(
  name: string,
  fn: (bond: unknown, context: RefinementCtx, name: string) => unknown,
): (bond: unknown, context: RefinementCtx) => unknown {
  return (bond: unknown, context: RefinementCtx): unknown => {
    return fn(bond, context, name)
  }
}

export function TEST(
  name: string,
  fn: (bond: unknown, name: string) => boolean | string | TestBack,
): (bond: unknown) => boolean | TestBack {
  return (bond: unknown): boolean | TestBack => {
    const back = fn(bond, name)
    if (typeof back === 'string') {
      return {
        message: back,
      }
    } else if (typeof back === 'boolean' || back == null) {
      return !!back
    } else {
      return back
    }
  }
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
