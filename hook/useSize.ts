// import * as React from 'react'
// import useResizeObserver from '@react-hook/resize-observer'

// export default function useSize<T extends HTMLElement>(
//   target: React.RefObject<T>,
// ) {
//   const [size, setSize] = React.useState<DOMRect>()

//   React.useEffect(() => {
//     if (target.current) {
//       setSize(target.current.getBoundingClientRect())
//     }
//   }, [target])

//   // Where the magic happens
//   useResizeObserver(target, entry => setSize(entry.contentRect))
//   return size
// }
import { useLayoutEffect, useState } from 'react'

export function useSize(ref: React.RefObject<Element>) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }

    const rect = el.getBoundingClientRect()

    setWidth(rect.width)
    setHeight(rect.height)

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0]
      if (entry) {
        setWidth(entry.contentRect.width)
        setHeight(entry.contentRect.height)
      }
    })

    resizeObserver.observe(el)

    return () => {
      if (el) {
        resizeObserver.unobserve(el)
      }
    }
  }, [ref])

  return { width, height }
}
