import { useCallback, useEffect, useRef, useState } from 'react'

interface UseFitTextOptions {
  minFontSize?: number
  maxFontSize?: number
  resolution?: number
  fontFamily?: string
  fontWeight?: string | number
  onFitComplete?: (fontSize: number) => void
  mode?: 'single-line' | 'multi-line'
  maxHeight?: number
}

interface UseFitTextReturn {
  fontSize: number
  ref: React.MutableRefObject<HTMLDivElement | null>
  isFitting: boolean
}

const canvas =
  typeof window === 'undefined'
    ? undefined
    : document.createElement('canvas')

const useFittedText = ({
  minFontSize = 16,
  maxFontSize = 128,
  fontFamily = 'inherit',
  fontWeight = 'normal',
  onFitComplete,
  mode = 'single-line',
  maxHeight,
}: UseFitTextOptions = {}): UseFitTextReturn => {
  const [fontSize, setFontSize] = useState(maxFontSize)
  const [isFitting, setIsFitting] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousBestFit = useRef<number | null>(null)

  const getLineMetrics = useCallback(
    (text: string, fontSize: number, maxWidth: number) => {
      if (!canvas)
        return { lines: 1, maxLineWidth: 0, height: fontSize }

      const context = canvas.getContext('2d')
      if (!context)
        return { lines: 1, maxLineWidth: 0, height: fontSize }

      context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
      const lineHeight = fontSize * 1.2
      const words = text.trim().split(/\s+/)

      if (words.length === 0)
        return { lines: 1, maxLineWidth: 0, height: lineHeight }

      let lines = 1
      let currentLine = words[0]
      let maxLineWidth = context.measureText(currentLine).width

      for (let i = 1; i < words.length; i++) {
        const word = words[i]
        const testLine = `${currentLine} ${word}`
        const testWidth = context.measureText(testLine).width

        if (testWidth <= maxWidth) {
          currentLine = testLine
          maxLineWidth = Math.max(maxLineWidth, testWidth)
        } else {
          lines++
          currentLine = word
          maxLineWidth = Math.max(
            maxLineWidth,
            context.measureText(word).width,
          )
        }
      }

      return {
        lines,
        maxLineWidth,
        height: lines * lineHeight,
      }
    },
    [fontFamily, fontWeight],
  )

  const measureText = useCallback(
    (
      text: string,
      fontSize: number,
    ): { width: number; height: number } => {
      if (!canvas) return { width: 0, height: 0 }

      const context = canvas.getContext('2d')
      if (!context) return { width: 0, height: 0 }

      context.font = `${fontWeight} ${fontSize}px ${fontFamily}`

      if (mode === 'single-line') {
        const metrics = context.measureText(text)
        return { width: metrics.width, height: fontSize }
      }

      const containerWidth = containerRef.current?.clientWidth || 0
      if (containerWidth === 0) return { width: 0, height: 0 }

      const { maxLineWidth, height } = getLineMetrics(
        text,
        fontSize,
        containerWidth,
      )

      return {
        width: maxLineWidth,
        height,
      }
    },
    [fontFamily, fontWeight, mode, getLineMetrics],
  )

  const findFittingFontSize = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const text = container.textContent || ''
    if (!text.trim()) return

    const containerWidth = container.clientWidth
    const containerHeight = maxHeight || container.clientHeight

    // Start with previous best fit if available
    let low = minFontSize
    let high = previousBestFit.current || maxFontSize
    let bestFit = minFontSize

    // If previous best fit doesn't work, expand search range
    if (previousBestFit.current) {
      const prevMetrics = measureText(text, previousBestFit.current)
      if (
        prevMetrics.width > containerWidth ||
        prevMetrics.height > containerHeight
      ) {
        high = previousBestFit.current
      } else {
        low = previousBestFit.current
        high = maxFontSize
      }
    }

    // Binary search with dynamic adjustments
    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2)
      const { width, height } = measureText(text, mid)

      const fits =
        mode === 'single-line'
          ? width <= containerWidth
          : width <= containerWidth && height <= containerHeight

      if (fits) {
        bestFit = mid
        // Be more aggressive growing when we're far from maxFontSize
        const growthFactor = Math.max(
          1,
          Math.floor((maxFontSize - mid) / 10),
        )
        low = mid + growthFactor
      } else {
        // Be more conservative shrinking when we're close to minFontSize
        const shrinkFactor = Math.max(
          1,
          Math.floor((mid - minFontSize) / 10),
        )
        high = mid - shrinkFactor
      }
    }

    // Final validation and adjustment
    const finalMetrics = measureText(text, bestFit)
    if (
      finalMetrics.width > containerWidth ||
      finalMetrics.height > containerHeight
    ) {
      while (bestFit > minFontSize) {
        bestFit--
        const metrics = measureText(text, bestFit)
        if (
          metrics.width <= containerWidth &&
          metrics.height <= containerHeight
        ) {
          break
        }
      }
    } else {
      while (bestFit < maxFontSize) {
        const nextSize = bestFit + 1
        const metrics = measureText(text, nextSize)
        if (
          metrics.width > containerWidth ||
          metrics.height > containerHeight
        ) {
          break
        }
        bestFit = nextSize
      }
    }

    previousBestFit.current = bestFit
    setFontSize(bestFit)
    setIsFitting(false)
    onFitComplete?.(bestFit)
  }, [
    minFontSize,
    maxFontSize,
    measureText,
    onFitComplete,
    mode,
    maxHeight,
  ])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      setIsFitting(true)
      findFittingFontSize()
    })

    const mutationObserver = new MutationObserver(() => {
      setIsFitting(true)
      findFittingFontSize()
    })

    resizeObserver.observe(container)
    mutationObserver.observe(container, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    findFittingFontSize()

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [findFittingFontSize])

  return {
    fontSize,
    ref: containerRef,
    isFitting,
  } as const
}

export default useFittedText
