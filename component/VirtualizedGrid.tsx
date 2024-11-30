import { VariableSizeList as List } from 'react-window'
import React, {
  CSSProperties,
  ReactNode,
  RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useResizeObserver } from 'usehooks-ts'
import chunk from 'lodash/chunk'
import clsx from 'clsx'

export type GridInput = {
  className?: string
  rowClassName?: string
  maxColumns: number
  minWidth: number
  maxWidth?: number
  maxRows?: number
  gap: number
  rowHeight: number | ((index: number) => number)
  records: Array<any>
  breakpoints?: Array<number>
  stretchLast?: boolean
  render: any
}

export default function VirtualizedGrid({
  className,
  rowClassName,
  rowHeight,
  maxColumns = 2,
  minWidth,
  gap,
  records,
  render,
  breakpoints = [],
}: GridInput) {
  // const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(
    null,
  ) as RefObject<HTMLDivElement>
  const [itemWidth, setItemWidth] = useState(0)
  const [rows, setRows] = useState<Array<Array<ReactNode>>>([])
  const { width: containerWidth = 16, height: containerHeight = 16 } =
    useResizeObserver({
      ref: containerRef,
    })

  useLayoutEffect(() => {
    const width = containerWidth ?? 1

    if (width <= 1) {
      return
    }

    let numColumns: number = maxColumns
    let newItemWidth = 0

    while (width && numColumns > 0) {
      const totalGap = gap * (numColumns - 1)
      const itemGap = totalGap / numColumns
      newItemWidth = width / numColumns - itemGap
      if (newItemWidth >= minWidth) {
        break
      }
      numColumns -= 1
      if (breakpoints?.length) {
        while (numColumns && !breakpoints.includes(numColumns)) {
          numColumns -= 1
        }
      }
    }

    numColumns = Math.max(1, numColumns)

    const totalGap = gap * (numColumns - 1)
    const itemGap = totalGap / numColumns

    setItemWidth(width / numColumns - itemGap)
    setRows(chunk(records, numColumns))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    containerRef,
    maxColumns,
    containerWidth,
    gap,
    records,
    minWidth,
    setItemWidth,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    breakpoints.join(':'),
  ])

  const ListItem = ({ index, style }) => {
    let iWidth = itemWidth
    const row = rows[index]
    const key = index

    const totalGap = gap * (row.length - 1)
    const gapSegmentCount = row.length * 2 - 2
    const gapSegment = gapSegmentCount ? totalGap / gapSegmentCount : 0
    const itemEls: Array<React.ReactElement> = []
    row.forEach((item, i) => {
      // const child = isNativeHtmlElement(baseChild)
      //   ? baseChild
      //   : React.cloneElement(baseChild, {
      //       rowIndex: index,
      //       columnIndex: i,
      //     })
      const child = render(item)

      if (i === 0) {
        const marginRight = gapSegment
        itemEls.push(
          <Item
            key={`${key}-${i}`}
            marginRight={marginRight}
            width={iWidth}
          >
            {child}
          </Item>,
        )
      } else if (i === row.length - 1) {
        const marginLeft = gapSegment
        itemEls.push(
          <Item
            key={`${key}-${i}`}
            marginLeft={marginLeft}
            width={iWidth}
          >
            {child}
          </Item>,
        )
      } else {
        const marginRight = gapSegment
        const marginLeft = gapSegment
        itemEls.push(
          <Item
            key={`${key}-${i}`}
            marginLeft={marginLeft}
            marginRight={marginRight}
            width={iWidth}
          >
            {child}
          </Item>,
        )
      }

      // key += 1
    })

    return (
      <Row
        gap={gap}
        key={key}
        className={rowClassName}
        style={style}
      >
        {itemEls}
      </Row>
    )
  }

  const getItemSize =
    typeof rowHeight === 'function'
      ? rowHeight
      : (index: number) => rowHeight

  return (
    <>
      <div
        className={clsx(className, 'w-full')}
        ref={containerRef}
      >
        <List
          className="w-full"
          height={containerHeight}
          itemCount={rows.length}
          itemSize={getItemSize}
          // scrollToIndex={scrollToIndex}
          width={containerWidth}
        >
          {({ index, style }) => (
            <ListItem
              style={style}
              index={index}
            />
          )}
        </List>
      </div>
    </>
  )
}

function isNativeHtmlElement(element: unknown) {
  return (
    React.isValidElement(element) && typeof element.type === 'string'
  )
}

type ContainerInput = {
  gap: number
  children: Array<ReactNode>
  className?: string
}

export function Row({
  gap,
  children,
  className,
  style,
}: ContainerInput & { style: CSSProperties }) {
  return (
    <div
      className={clsx(`flex items-stretch`, className)}
      style={{
        rowGap: gap,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

type ItemInput = {
  width: number
  marginLeft?: number
  marginRight?: number
  children: ReactNode
}

export function Item({
  width,
  marginLeft,
  marginRight,
  children,
}: ItemInput) {
  return (
    <div
      className="block"
      style={{
        width: width,
        marginLeft: marginLeft && `${marginLeft}px`,
        marginRight: marginRight && `${marginRight}px`,
      }}
    >
      {children}
    </div>
  )
}
