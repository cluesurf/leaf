/**
 * Hook implementations for the `make` verb's Flow declarations.
 */

// ─── String transforms ────────────────────────────────────

export const makeLowercase = ({ text }: { text: string }): string =>
  text.toLowerCase()

export const makeUppercase = ({ text }: { text: string }): string =>
  text.toUpperCase()

export const makeTrimmed = ({ text }: { text: string }): string =>
  text.trim()

// ─── Numeric transforms ───────────────────────────────────

export const makeSum = ({ a, b }: { a: number; b: number }): number =>
  a + b

export const makeDifference = ({
  a,
  b,
}: {
  a: number
  b: number
}): number => a - b

export const makeProduct = ({
  a,
  b,
}: {
  a: number
  b: number
}): number => a * b

export const makeQuotient = ({
  a,
  b,
}: {
  a: number
  b: number
}): number => a / b
