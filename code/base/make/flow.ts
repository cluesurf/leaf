/**
 * Hook implementations for the `make` verb's Flow declarations.
 */

// ─── String transforms ────────────────────────────────────

export const make_lowercase = ({ text }: { text: string }): string =>
  text.toLowerCase()

export const make_uppercase = ({ text }: { text: string }): string =>
  text.toUpperCase()

export const make_trimmed = ({ text }: { text: string }): string =>
  text.trim()

// ─── Numeric transforms ───────────────────────────────────

export const make_sum = ({ a, b }: { a: number; b: number }): number =>
  a + b

export const make_difference = ({
  a,
  b,
}: {
  a: number
  b: number
}): number => a - b

export const make_product = ({
  a,
  b,
}: {
  a: number
  b: number
}): number => a * b

export const make_quotient = ({
  a,
  b,
}: {
  a: number
  b: number
}): number => a / b
