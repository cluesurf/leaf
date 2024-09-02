import React, {
  useRef,
  useState,
  useLayoutEffect,
  ReactElement,
} from 'react'
import classNames from 'classnames'
import chunk from 'lodash/chunk'
import isEqual from 'lodash/isEqual'
import { useSize } from '~/hook/useSize'

type Align = 'center' | 'left'

type ContainerInput = {
  gap: number
  align: Align
  children: Array<ReactElement<any>>
  className?: string
}

export function Container(
  { gap, align, children, className }: ContainerInput,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  return (
    <div
      ref={ref}
      className={classNames('flex flex-shrink flex-col', className)}
      style={{
        justifyContent: align,
        rowGap: gap,
      }}
    >
      {children}
    </div>
  )
}

export const ContainerWithRef = React.forwardRef(Container)

export function Row({
  gap,
  align,
  children,
  className,
}: ContainerInput) {
  return (
    <div
      className={classNames(`flex items-stretch`, className)}
      style={{
        justifyContent: align,
        rowGap: gap,
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
  children: ReactElement<any>
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

type GridInput = {
  className?: string
  rowClassName?: string
  maxColumns: number
  minWidth: number
  gap: number
  rowGap?: number
  children: React.ReactNode
  align?: Align
  breakpoints?: Array<number>
  stretchLast?: boolean
}

export default function Grid({
  className,
  rowClassName,
  maxColumns,
  minWidth,
  gap,
  children,
  rowGap,
  align = 'left',
  breakpoints,
  stretchLast = false,
}: GridInput) {
  // const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null)
  const [itemWidth, setItemWidth] = useState(0)
  const [lastItemWidth, setLastItemWidth] = useState(0)
  const [rows, setRows] = useState<Array<Array<ReactElement<any>>>>([])
  const { width: containerWidth = 1 } = useSize(containerRef)

  const elements = React.Children.toArray(children).filter(child => {
    return React.isValidElement(child)
  }) as Array<ReactElement<any>>

  useLayoutEffect(() => {
    const width = containerWidth ?? 1

    if (width <= 1) {
      return
    }

    let numColumns = Math.min(maxColumns, elements.length)
    let newItemWidth = 0

    while (width && numColumns > 0) {
      const totalGap = gap * (numColumns - 1)
      const itemGap = totalGap / numColumns
      newItemWidth = width / numColumns - itemGap
      if (newItemWidth >= minWidth) {
        break
      }
      numColumns -= 1
      if (breakpoints) {
        while (!breakpoints.includes(numColumns)) {
          numColumns -= 1
        }
      }
    }
    const newRows = chunk(elements, numColumns)

    if (newRows[0]) {
      const firstLength = newRows[0].length
      const lastLength = newRows[newRows.length - 1].length
      const numColumnsForLayout = firstLength

      if (numColumns > numColumnsForLayout) {
        const totalGap = gap * (numColumnsForLayout - 1)
        const itemGap = totalGap / numColumnsForLayout
        newItemWidth = width / numColumnsForLayout - itemGap
      }
      if (!isEqual(rows, newRows)) {
        setRows(newRows)
      }

      if (
        stretchLast &&
        newRows.length > 1 &&
        firstLength !== lastLength
      ) {
        const totalGap = gap * (lastLength - 1)
        const itemGap = totalGap / lastLength
        const lastItemWidth = containerWidth / lastLength - itemGap
        setLastItemWidth(lastItemWidth)
      } else {
        setLastItemWidth(newItemWidth)
      }

      setItemWidth(newItemWidth)
    }
  }, [
    containerRef,
    elements,
    maxColumns,
    containerWidth,
    gap,
    minWidth,
    setItemWidth,
    setRows,
    rows,
    breakpoints,
    stretchLast,
  ])

  if (!elements.length) {
    return null
  }

  let key = 0

  const rowEls = rows.map((row, ri) => {
    let iWidth = itemWidth
    if (
      stretchLast &&
      ri === rows.length - 1 &&
      lastItemWidth !== itemWidth
    ) {
      iWidth = lastItemWidth
    }

    const totalGap = gap * (row.length - 1)
    const gapSegmentCount = row.length * 2 - 2
    const gapSegment = gapSegmentCount ? totalGap / gapSegmentCount : 0
    const itemEls: Array<React.ReactElement> = []
    row.forEach((baseChild, i) => {
      const child = isNativeHtmlElement(baseChild)
        ? baseChild
        : React.cloneElement(baseChild, {
            rowIndex: ri,
            columnIndex: i,
          })

      if (i === 0) {
        const marginRight = gapSegment
        itemEls.push(
          <Item
            key={`${key}x`}
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
            key={`${key}x`}
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
            key={`${key}x`}
            marginLeft={marginLeft}
            marginRight={marginRight}
            width={iWidth}
          >
            {child}
          </Item>,
        )
      }

      key += 1
    })
    return (
      <Row
        align={align}
        gap={gap}
        key={ri}
        className={rowClassName}
      >
        {itemEls}
      </Row>
    )
  })

  return (
    <ContainerWithRef
      align={align}
      className={className}
      ref={containerRef}
      gap={rowGap ?? gap}
    >
      {rowEls}
    </ContainerWithRef>
  )
}

function isNativeHtmlElement(element: unknown) {
  return (
    React.isValidElement(element) && typeof element.type === 'string'
  )
}
