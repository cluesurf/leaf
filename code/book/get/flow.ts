/**
 * Hook implementations for the `get` verb's Flow declarations.
 */

// ─── Accessors ────────────────────────────────────────────

const getLength = ({ text }: { text: string }): number =>
  text.length

const getCount = ({ items }: { items: unknown[] }): number =>
  items.length

const getFirst = ({ items }: { items: unknown[] }): unknown =>
  items[0]

const getLast = ({ items }: { items: unknown[] }): unknown =>
  items[items.length - 1]

// ─── Aggregates ───────────────────────────────────────────

const getSum = ({ numbers }: { numbers: number[] }): number =>
  numbers.reduce((a, b) => a + b, 0)

const getAverage = ({
  numbers,
}: {
  numbers: number[]
}): number =>
  numbers.length === 0
    ? 0
    : numbers.reduce((a, b) => a + b, 0) / numbers.length

const getSmallest = ({
  numbers,
}: {
  numbers: number[]
}): number => Math.min(...numbers)

const getLargest = ({
  numbers,
}: {
  numbers: number[]
}): number => Math.max(...numbers)


const flow = {
  'get:length': getLength,
  'get:count': getCount,
  'get:first': getFirst,
  'get:last': getLast,
  'get:sum': getSum,
  'get:average': getAverage,
  'get:smallest': getSmallest,
  'get:largest': getLargest,
}

export default flow
