/**
 * Hook implementations for the `get` verb's Flow declarations.
 */

// ─── Accessors ────────────────────────────────────────────

export const getLength = ({ text }: { text: string }): number =>
  text.length

export const getCount = ({ items }: { items: unknown[] }): number =>
  items.length

export const getFirst = ({ items }: { items: unknown[] }): unknown =>
  items[0]

export const getLast = ({ items }: { items: unknown[] }): unknown =>
  items[items.length - 1]

// ─── Aggregates ───────────────────────────────────────────

export const getSum = ({ numbers }: { numbers: number[] }): number =>
  numbers.reduce((a, b) => a + b, 0)

export const getAverage = ({
  numbers,
}: {
  numbers: number[]
}): number =>
  numbers.length === 0
    ? 0
    : numbers.reduce((a, b) => a + b, 0) / numbers.length

export const getSmallest = ({
  numbers,
}: {
  numbers: number[]
}): number => Math.min(...numbers)

export const getLargest = ({
  numbers,
}: {
  numbers: number[]
}): number => Math.max(...numbers)
