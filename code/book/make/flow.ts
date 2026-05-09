/**
 * Hook implementations for the `make` verb's Flow declarations.
 */

// ─── String transforms ────────────────────────────────────

const makeLowercase = ({ text }: { text: string }): string =>
  text.toLowerCase()

const makeUppercase = ({ text }: { text: string }): string =>
  text.toUpperCase()

const makeTrimmed = ({ text }: { text: string }): string =>
  text.trim()

// ─── Numeric transforms ───────────────────────────────────

const makeSum = ({ a, b }: { a: number; b: number }): number =>
  a + b

const makeDifference = ({
  a,
  b,
}: {
  a: number
  b: number
}): number => a - b

const makeProduct = ({
  a,
  b,
}: {
  a: number
  b: number
}): number => a * b

const makeQuotient = ({
  a,
  b,
}: {
  a: number
  b: number
}): number => a / b


// ─── Host primitives ──────────────────────────────────────

const makeNow = (): Date => new Date()

const makeUuid = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })


const flow = {
  'make:lowercase': makeLowercase,
  'make:uppercase': makeUppercase,
  'make:trimmed': makeTrimmed,
  'make:sum': makeSum,
  'make:difference': makeDifference,
  'make:product': makeProduct,
  'make:quotient': makeQuotient,
  'make:now': makeNow,
  'make:uuid': makeUuid,
}

export default flow
