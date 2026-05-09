/**
 * Hook implementations for the `get` verb's Flow declarations.
 */

// ─── Accessors ────────────────────────────────────────────

export const get_length = ({ text }: { text: string }): number =>
  text.length

export const get_count = ({ items }: { items: unknown[] }): number =>
  items.length

export const get_first = ({ items }: { items: unknown[] }): unknown =>
  items[0]

export const get_last = ({ items }: { items: unknown[] }): unknown =>
  items[items.length - 1]

// ─── Aggregates ───────────────────────────────────────────

export const get_sum = ({ numbers }: { numbers: number[] }): number =>
  numbers.reduce((a, b) => a + b, 0)

export const get_average = ({
  numbers,
}: {
  numbers: number[]
}): number =>
  numbers.length === 0
    ? 0
    : numbers.reduce((a, b) => a + b, 0) / numbers.length

export const get_smallest = ({
  numbers,
}: {
  numbers: number[]
}): number => Math.min(...numbers)

export const get_largest = ({
  numbers,
}: {
  numbers: number[]
}): number => Math.max(...numbers)
