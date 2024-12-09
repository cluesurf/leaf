import React, { CSSProperties } from 'react'
import clsx from 'clsx'

type SpacingType = string | number
type FlexType = 1 | 'auto' | 'initial' | 'none' | string | number
type Overflow = 'auto' | 'hidden' | 'visible' | 'scroll'
type Position = 'static' | 'fixed' | 'absolute' | 'relative' | 'sticky'
type Opacity = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100
type Rounded = 'none' | 'base' | 'circle'
type Transition = 'colors' | 'opacity' | 'all' | 'base'

export type BoxProps = {
  children: React.ReactNode
  // Display & Layout
  display?:
    | 'flex'
    | 'grid'
    | 'block'
    | 'inline'
    | 'inline-block'
    | 'inline-flex'
    | 'hidden'
  position?: Position
  zIndex?: number | 'auto'
  layout?: 'vertical' | 'horizontal'

  // Flexbox
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  flex?: FlexType
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: SpacingType
  transition?: Transition

  // Spacing
  padding?: SpacingType
  paddingX?: SpacingType
  paddingY?: SpacingType
  paddingTop?: SpacingType
  paddingRight?: SpacingType
  paddingBottom?: SpacingType
  paddingLeft?: SpacingType
  margin?: SpacingType
  marginX?: SpacingType
  marginY?: SpacingType
  marginTop?: SpacingType
  marginRight?: SpacingType
  marginBottom?: SpacingType
  marginLeft?: SpacingType

  // Sizing
  width?: SpacingType
  height?: SpacingType
  minWidth?: SpacingType
  minHeight?: SpacingType
  maxWidth?: SpacingType
  maxHeight?: SpacingType

  // Visual
  background?: string
  opacity?: Opacity
  rounded?: Rounded
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none'
  border?: boolean | string
  borderColor?: string

  // Overflow & Visibility
  overflow?: Overflow
  overflowX?: Overflow
  overflowY?: Overflow

  // Interactivity
  cursor?: 'pointer' | 'default' | 'not-allowed' | 'wait' | 'text'

  print?: 'hidden'

  // Misc
  className?: string
  style?: CSSProperties
}

const Box: React.FC<BoxProps> = ({
  children,
  display,
  print,
  position,
  zIndex,
  direction,
  justify,
  items,
  flex,
  wrap,
  gap,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  margin,
  marginX,
  marginY,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  background,
  opacity,
  rounded,
  shadow,
  border,
  borderColor,
  overflow,
  overflowX,
  overflowY,
  cursor,
  className,
  style,
  transition,
  layout,
}) => {
  const actualLayout =
    layout === 'vertical'
      ? 'flex flex-col'
      : layout === 'horizontal'
        ? 'flex'
        : undefined
  const numericStyle: CSSProperties = {
    width: typeof width === 'number' ? width : undefined,
    height: typeof height === 'number' ? height : undefined,
    minWidth: typeof minWidth === 'number' ? minWidth : undefined,
    minHeight: typeof minHeight === 'number' ? minHeight : undefined,
    maxWidth: typeof maxWidth === 'number' ? maxWidth : undefined,
    maxHeight: typeof maxHeight === 'number' ? maxHeight : undefined,
    zIndex: zIndex !== undefined ? zIndex : undefined,
    ...style,
  }

  return (
    <div
      style={numericStyle}
      className={clsx(
        // Display & Layout
        display && `${display}`,
        position && `${position}`,
        actualLayout,
        print && `print:hidden`,

        // Flexbox
        direction && `flex-${direction}`,
        justify && `justify-${justify}`,
        items && `items-${items}`,
        flex !== undefined && `flex-${flex}`,
        wrap && `flex-${wrap}`,
        gap !== undefined && `gap-${gap}`,
        transition !== undefined
          ? transition === 'base'
            ? 'transition'
            : `transition-${transition}`
          : undefined,

        // Spacing
        padding !== undefined && `p-${padding}`,
        paddingX !== undefined && `px-${paddingX}`,
        paddingY !== undefined && `py-${paddingY}`,
        paddingTop !== undefined && `pt-${paddingTop}`,
        paddingRight !== undefined && `pr-${paddingRight}`,
        paddingBottom !== undefined && `pb-${paddingBottom}`,
        paddingLeft !== undefined && `pl-${paddingLeft}`,
        margin !== undefined && `m-${margin}`,
        marginX !== undefined && `mx-${marginX}`,
        marginY !== undefined && `my-${marginY}`,
        marginTop !== undefined && `mt-${marginTop}`,
        marginRight !== undefined && `mr-${marginRight}`,
        marginBottom !== undefined && `mb-${marginBottom}`,
        marginLeft !== undefined && `ml-${marginLeft}`,

        // Sizing
        typeof width === 'string' && `w-${width}`,
        typeof height === 'string' && `h-${height}`,
        typeof minWidth === 'string' && `min-w-${minWidth}`,
        typeof minHeight === 'string' && `min-h-${minHeight}`,
        typeof maxWidth === 'string' && `max-w-${maxWidth}`,
        typeof maxHeight === 'string' && `max-h-${maxHeight}`,

        // Visual
        background && `bg-${background}`,
        opacity !== undefined && `opacity-${opacity}`,
        rounded && `rounded-${rounded}`,
        shadow && `shadow-${shadow}`,
        border &&
          (typeof border === 'string'
            ? `border-0 border-${border}`
            : 'border'),
        borderColor && `border-${borderColor}`,

        // Overflow
        overflow && `overflow-${overflow}`,
        overflowX && `overflow-x-${overflowX}`,
        overflowY && `overflow-y-${overflowY}`,

        // Interactivity
        cursor && `cursor-${cursor}`,

        className,
      )}
    >
      {children}
    </div>
  )
}

export default Box
