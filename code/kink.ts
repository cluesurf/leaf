/**
 * Parse-error definitions for the walker engine.
 *
 * Opt-in. Import this module from your app once at startup to
 * wire `@cluesurf/kink` as the error factory used by
 * `code/base/parse.ts`:
 *
 *   import '@cluesurf/bead/base/kink'
 *
 * Side effects:
 *   1. Registers each parse-error form with KinkBase.
 *   2. Calls `setKinkFactory(...)` so the walker throws Kink
 *      instances (with structured `link` data) instead of the
 *      plain `Error` fallback.
 *
 * Without this import, `base.mold(...)` still works — it just
 * throws plain `Error` objects with the same `path` / `form` /
 * `link` info attached as own-properties.
 */
// @ts-ignore - opt-in dependency; not in @cluesurf/bead's runtime deps

import { KinkBase } from '@cluesurf/kink'
import { setKinkFactory } from '@/bind'

const host = '@cluesurf/bead'

type ParseBase = {
  shape_object: { take: { path: string; got: string } }
  shape_string: { take: { path: string; got: string } }
  shape_number: { take: { path: string; got: string } }
  shape_integer: { take: { path: string; got: string } }
  shape_natural_number: { take: { path: string; got: string } }
  shape_boolean: { take: { path: string; got: string } }
  shape_date: { take: { path: string; got: string } }
  shape_uuid: { take: { path: string; got: unknown } }
  shape_array: { take: { path: string; got: string } }
  enum_invalid: {
    take: { path: string; got: unknown; expected: unknown[] }
  }
  field_missing: { take: { path: string } }
  union_tag: {
    take: {
      path: string
      tag_key: string
      got: unknown
      expected: string[]
    }
  }
  union_invalid: { take: { path: string } }
  schema_missing: { take: { path: string; name: string } }
  mold_failed: { take: { path: string; note: string } }
}

const base = new KinkBase<ParseBase>({
  host,
  makeCode: (code: number) => code.toString(16).padStart(4, '0'),
})

base.form('shape_object', take => ({
  link: take,
  note: `expected an object at \`${take?.path}\``,
}))
base.form('shape_string', take => ({
  link: take,
  note: `expected a string at \`${take?.path}\``,
}))
base.form('shape_number', take => ({
  link: take,
  note: `expected a number at \`${take?.path}\``,
}))
base.form('shape_integer', take => ({
  link: take,
  note: `expected an integer at \`${take?.path}\``,
}))
base.form('shape_natural_number', take => ({
  link: take,
  note: `expected a natural number at \`${take?.path}\``,
}))
base.form('shape_boolean', take => ({
  link: take,
  note: `expected a boolean at \`${take?.path}\``,
}))
base.form('shape_date', take => ({
  link: take,
  note: `expected a Date at \`${take?.path}\``,
}))
base.form('shape_uuid', take => ({
  link: take,
  note: `expected a UUID at \`${take?.path}\``,
}))
base.form('shape_array', take => ({
  link: take,
  note: `expected an array at \`${take?.path}\``,
}))
base.form('enum_invalid', take => ({
  link: take,
  note: `invalid enum value at \`${take?.path}\``,
}))
base.form('field_missing', take => ({
  link: take,
  note: `missing required field at \`${take?.path}\``,
}))
base.form('union_tag', take => ({
  link: take,
  note: `unknown union tag at \`${take?.path}\``,
}))
base.form('union_invalid', take => ({
  link: take,
  note: `value matched no union member at \`${take?.path}\``,
}))
base.form('schema_missing', take => ({
  link: take,
  note: `unregistered schema \`${take?.name}\` referenced at \`${take?.path}\``,
}))
base.form('mold_failed', take => ({
  link: take,
  note: `mold pipeline failed at \`${take?.path}\`: ${take?.note}`,
}))

const PARSE_ERROR = base.make()

// Wire into the walker as the default factory.
setKinkFactory((form, link) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return PARSE_ERROR(form as keyof ParseBase, link as any) as Error
})
