import clsx from 'clsx'
import React, {
  CSSProperties,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useResizeObserver } from 'usehooks-ts'

type ItemElement<T> = { style?: CSSProperties; record: T }

function FlowGridItem({
  children,
  style,
  index,
  onResize,
}: {
  children: React.ReactNode
  style?: CSSProperties
  index: number
  onResize?: (width: number, index: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { width = 0 } = useResizeObserver({
    ref,
  })

  useLayoutEffect(() => {
    if (width) {
      onResize?.(width, index)
    }
  }, [onResize, width, index])

  return (
    <div
      className="inline-block h-full"
      style={style}
      ref={ref} // Capture ref to measure width
    >
      {children}
    </div>
  )
}

export default function FlowGrid<T>({
  records,
  gap = 0,
  itemRenderer: ItemRenderer,
  className,
  more,
}: {
  className?: string
  records: Array<T>
  gap?: number
  more?: T
  itemRenderer: ({
    record,
    index,
  }: {
    record: T
    index: number
  }) => React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [itemWidths, setItemWidths] = useState<Record<number, number>>(
    {},
  )
  // const widthsRef = useRef<Array<number>>([])
  const { width: containerWidth } = useResizeObserver({
    ref: containerRef,
  })

  const [isMeasured, setIsMeasured] = useState(false)

  const handleResize = useCallback(
    (width: number, index: number) => {
      setItemWidths(prevWidths => {
        if (prevWidths[index] !== width) {
          return {
            ...prevWidths,
            [index]: width,
          }
        } else {
          return prevWidths
        }
      })

      if (index === records.length - 1) {
        setIsMeasured(true)
      }
    },
    [records],
  )

  const visibleItems = useMemo<Array<ItemElement<T>>>(() => {
    if (!isMeasured || !containerWidth) {
      const items = records.map(record => ({ record }))
      if (more) {
        // items.push({ record: more })
      }
      return items
    }

    const items: Array<ItemElement<T>> = []

    let totalWidth = 0

    const moreWidth = more && itemWidths[-1]

    let i = 0
    for (const record of records) {
      const width = itemWidths[i]

      if (i === 0) {
        if (totalWidth + width > containerWidth) {
          break
        } else {
          items.push({
            style: {},
            record,
          })
          totalWidth += width
        }
      } else {
        if (totalWidth + gap + width > containerWidth) {
          if (moreWidth) {
            while (totalWidth + gap + moreWidth > containerWidth) {
              items.pop()
              const lastWidth = itemWidths[i - 1]
              totalWidth -= gap + lastWidth
            }

            items.push({
              style: { marginLeft: gap },
              record: more,
            })

            totalWidth += gap + moreWidth
          }
          break
        } else {
          items.push({
            style: { marginLeft: gap },
            record,
          })
          totalWidth += gap + width
        }
      }
      i++
    }

    if (items.length < records.length && totalWidth < containerWidth) {
      const extraGapPerItem =
        (containerWidth - totalWidth) / (items.length - 1)

      let i = 1
      while (i < items.length) {
        const item = items[i++]
        if (item.style && typeof item.style.marginLeft === 'number') {
          item.style.marginLeft += extraGapPerItem
        }
      }
    }

    return items
  }, [containerWidth, records, more, isMeasured, itemWidths, gap])

  return (
    <div
      ref={containerRef}
      className={clsx(
        className,
        !isMeasured && 'opacity-0',
        'relative w-full',
      )}
    >
      <div className="whitespace-nowrap overflow-hidden opacity-0 absolute">
        {more && (
          <FlowGridItem
            index={-1}
            onResize={handleResize}
          >
            <ItemRenderer
              record={more}
              index={-1}
            />
          </FlowGridItem>
        )}
        {records.map((item, index) => (
          <FlowGridItem
            key={index}
            index={index}
            onResize={handleResize}
          >
            <ItemRenderer
              record={item}
              index={index}
            />
          </FlowGridItem>
        ))}
      </div>
      <div
        className={clsx(
          'whitespace-nowrap transition-opacity',
          isMeasured ? 'opacity-1' : 'opacity-0',
        )}
      >
        {visibleItems.map((item, index) => (
          <FlowGridItem
            key={index}
            style={item.style}
            index={index}
          >
            <ItemRenderer
              record={item.record}
              index={index}
            />
          </FlowGridItem>
        ))}
      </div>
    </div>
  )
}
