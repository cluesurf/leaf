export function findNextSize(
  inputNumber: number,
  sortedSizes: Array<number>,
) {
  // Find the first size that is larger than the input number
  for (let size of sortedSizes) {
    if (size >= inputNumber) {
      return size
    }
  }

  // If no size is found, return null or a default value
  return sortedSizes[sortedSizes.length - 1]!
}
