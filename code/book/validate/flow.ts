/**
 * Hook implementation for the `validate` verb.
 */

export type ValidateResult = {
  ok: boolean
  message?: string
  slug?: string
  kind?: string
}

export const validate = ({
  test,
  message,
  slug,
  kind,
}: {
  test: boolean
  message?: string
  slug?: string
  kind?: string
}): ValidateResult => {
  if (test) return { ok: true }
  const out: ValidateResult = { ok: false }
  if (message != null) out.message = message
  if (slug != null) out.slug = slug
  if (kind != null) out.kind = kind
  return out
}
