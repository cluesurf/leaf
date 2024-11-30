/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSize } from '~/hook/useSize'
import shuffle from 'lodash/shuffle'

type ItemType = { element: React.ReactElement; h: number; w: number }

type MasonryInput = {
  className?: string
  columnBreakpoints: {
    [key: number]: number
    default: number
  } // required, string

  // Custom attributes, however it is advised against
  // using these to prevent unintended issues and future conflicts
  // ...any other attribute, will be added to the container
  columnClassName?: string
  gap?: number
  // optional, string
  items: Array<ItemType>
  fixedAspectRatio?: boolean
}

export function Column({ children, gap, className }: ColumnInput) {
  const list = ['flex', 'flex-col', 'w-full', className].filter(x => x)
  return (
    <div
      style={{ gap }}
      className={list.join(' ')}
    >
      {children}
    </div>
  )
}

export type ColumnInput = {
  children: React.ReactNode
  className?: string
  gap: number
}

export const MasonryGrid = React.forwardRef(MasonryGridBase)

export function MasonryGridBase(
  { children, gap, className }: MasonryGridInput,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const list = ['flex', 'w-full', className].filter(x => x)
  return (
    <div
      style={{ gap, padding: gap }}
      className={list.join(' ')}
      ref={ref}
    >
      {children}
    </div>
  )
}

export type MasonryGridInput = {
  children: React.ReactNode
  className?: string
  gap: number
}

// Sort the images by aspect ratio descending.
function aspectRatioDescending(a: ItemType, b: ItemType) {
  return b.h / b.w - a.h / a.w
}

export default function Masonry({
  columnBreakpoints,
  columnClassName,
  items,
  className,
  gap = 0,
  fixedAspectRatio = false,
}: MasonryInput) {
  const [columnCount, setColumnCount] = useState(
    columnBreakpoints.default,
  )
  const grid = useRef(null)
  const size = useSize(grid)
  const [inputItems, setInputItems] = useState(items)

  useEffect(() => {
    if (!size) {
      return
    }

    let matchedBreakpoint = Infinity
    let newColumnCount = columnBreakpoints.default

    for (let breakpoint in columnBreakpoints) {
      const optBreakpoint = parseInt(breakpoint)
      const isCurrentBreakpoint =
        optBreakpoint > 0 && size.width <= optBreakpoint

      if (isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
        matchedBreakpoint = optBreakpoint
        newColumnCount = columnBreakpoints[breakpoint]
      }
    }

    newColumnCount = Math.max(1, newColumnCount ?? 1)

    setColumnCount(newColumnCount)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnCount, size?.width, columnBreakpoints])

  const columns: Array<Array<React.ReactNode>> = useMemo(() => {
    const columns: Array<Array<React.ReactNode>> = []

    if (!size) {
      return columns
    }

    let isSizing = false
    for (const item of inputItems) {
      if (!item.w || !item.h) {
        isSizing = true
        break
      }
    }

    if (isSizing) {
      const handleSizeReady = (i: number) => {
        return (el: HTMLElement | null) => {
          if (el) {
            const box = el.getBoundingClientRect()
            const items = [...inputItems]
            items[i].w = box.width
            items[i].h = box.height

            setInputItems(items)
          }
        }
      }

      let i = 0
      columns[0] = []
      for (const item of inputItems) {
        const newEl = React.cloneElement(item.element, {
          key: i,
          ref: handleSizeReady(i),
        } as React.Attributes)
        columns[0].push(newEl)
        i++
      }

      return columns
    }

    const currentColumnCount = columnCount
    const columnHeights: Array<number> = new Array<number>(
      currentColumnCount,
    ).fill(0)
    const thumbnailWidth = (size.width - gap) / currentColumnCount - gap

    inputItems.sort(aspectRatioDescending)

    // Assign each image to a column.
    for (const item of inputItems) {
      // Find the shortest column.
      let shortest = 0
      for (let j = 1; j < currentColumnCount; ++j) {
        if (columnHeights[j] < columnHeights[shortest]) {
          shortest = j
        }
      }
      // Put the image there.
      columnHeights[shortest] +=
        gap +
        (fixedAspectRatio ? thumbnailWidth * (item.h / item.w) : item.h)
      columns[shortest] = columns[shortest] ?? []
      columns[shortest].push(item.element)
    }

    columns.forEach(column => shuffle(column))

    shuffle(columns)

    return columns
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnCount, inputItems, gap, size?.width])

  return (
    <MasonryGrid
      gap={gap}
      ref={grid}
      className={className}
    >
      {columns.map((elements, i) => (
        <Column
          gap={gap}
          key={`${columnCount}-${i}`}
          className={columnClassName}
        >
          {elements}
        </Column>
      ))}
    </MasonryGrid>
  )
}
