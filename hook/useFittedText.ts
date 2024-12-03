import { useCallback, useEffect, useRef, useState } from 'react'

interface UseFitTextOptions {
  minFontSize?: number
  maxFontSize?: number
  fontFamily?: string
  fontWeight?: string | number
  onFitComplete?: (fontSize: number, isMultiLine: boolean) => void
  mode?: 'single-line' | 'multi-line' | 'adaptive'
  maxHeight?: number
  multiLineFontSizeThreshold?: number
}

interface UseFitTextReturn {
  fontSize: number
  ref: React.MutableRefObject<HTMLDivElement | null>
  isFitting: boolean
  isMultiLine: boolean
}

const useFittedText = ({
  minFontSize = 16,
  maxFontSize = 128,
  fontFamily = 'inherit',
  fontWeight = 'normal',
  onFitComplete,
  mode = 'adaptive',
  maxHeight,
  multiLineFontSizeThreshold = 32,
}: UseFitTextOptions = {}): UseFitTextReturn => {
  const [fontSize, setFontSize] = useState(maxFontSize)
  const [isFitting, setIsFitting] = useState(false)
  const [isMultiLine, setIsMultiLine] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLDivElement | null>(null)

  const measure = useCallback(
    (size: number, singleLine: boolean) => {
      const container = containerRef.current
      const parent = container?.parentElement
      if (!container || !parent) return false

      // Create or get measurement div
      if (!measureRef.current) {
        measureRef.current = document.createElement('div')
        document.body.appendChild(measureRef.current)
      }
      const measure = measureRef.current

      // Copy styles that affect size
      const computedStyle = window.getComputedStyle(container)
      measure.style.cssText = `
      position: absolute !important;
      visibility: hidden !important;
      pointer-events: none !important;
      contain: layout paint !important;
      font-family: ${computedStyle.fontFamily};
      font-weight: ${computedStyle.fontWeight};
      letter-spacing: ${computedStyle.letterSpacing};
      text-transform: ${computedStyle.textTransform};
      padding: ${computedStyle.padding};
      width: ${singleLine ? 'auto' : `${parent.clientWidth}px`};
      white-space: ${singleLine ? 'nowrap' : 'normal'};
      font-size: ${size}px;
    `
      measure.textContent = container.textContent

      // For single line, just check if the content width fits
      if (singleLine) {
        return measure.scrollWidth <= parent.clientWidth
      }

      // For multiline, check both width and height
      return (
        measure.scrollWidth <= parent.clientWidth &&
        measure.scrollHeight <= (maxHeight || parent.clientHeight)
      )
    },
    [maxHeight],
  )

  const fitText = useCallback(() => {
    const container = containerRef.current
    if (!container?.parentElement || !container.textContent?.trim())
      return

    // Binary search for single-line if not in multi-line mode
    if (mode !== 'multi-line') {
      let low = minFontSize
      let high = maxFontSize
      let bestSize = minFontSize

      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        if (measure(mid, true)) {
          bestSize = mid
          low = mid + 1 // Try bigger
        } else {
          high = mid - 1 // Try smaller
        }
      }

      // If we found a good single-line size, use it
      if (
        bestSize >= multiLineFontSizeThreshold ||
        mode === 'single-line'
      ) {
        container.style.fontSize = `${bestSize}px`
        container.style.whiteSpace = 'nowrap'
        setFontSize(bestSize)
        setIsMultiLine(false)
        return
      }
    }

    // If we get here, try multi-line
    let low = minFontSize
    let high = maxFontSize
    let bestSize = minFontSize

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      if (measure(mid, false)) {
        bestSize = mid
        low = mid + 1 // Try bigger
      } else {
        high = mid - 1 // Try smaller
      }
    }

    container.style.fontSize = `${bestSize}px`
    container.style.whiteSpace = 'normal'
    setFontSize(bestSize)
    setIsMultiLine(true)
  }, [
    measure,
    minFontSize,
    maxFontSize,
    mode,
    multiLineFontSizeThreshold,
  ])

  useEffect(() => {
    const container = containerRef.current
    if (!container?.parentElement) return

    const resizeObserver = new ResizeObserver(fitText)
    const mutationObserver = new MutationObserver(fitText)

    resizeObserver.observe(container.parentElement)
    mutationObserver.observe(container, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    fitText()

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      if (measureRef.current) {
        measureRef.current.remove()
        measureRef.current = null
      }
    }
  }, [fitText])

  return { fontSize, ref: containerRef, isFitting, isMultiLine }
}

export default useFittedText
