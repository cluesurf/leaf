// https://www.30secondsofcode.org/js/s/element-is-visible-in-viewport/

export function isElementInViewport(
  el: Element,
  partiallyVisible = false,
) {
  const { top, left, right } = el.getBoundingClientRect()
  const { innerHeight, innerWidth } = window
  return partiallyVisible
    ? top > 0 &&
        top < innerHeight &&
        ((left > 0 && left < innerWidth) ||
          (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && right <= innerWidth
}
