import React, { CSSProperties } from 'react'
import clsx from 'clsx'

type SpacingType = string | number
type FlexType = 1 | 'auto' | 'initial' | 'none' | string | number
type Overflow = 'auto' | 'hidden' | 'visible' | 'scroll'
type Position = 'static' | 'fixed' | 'absolute' | 'relative' | 'sticky'
type Opacity = number
type Rounded =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full'

interface BoxProps {
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

  // Flexbox
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  flex?: FlexType
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: SpacingType

  // Spacing
  p?: SpacingType
  px?: SpacingType
  py?: SpacingType
  pt?: SpacingType
  pr?: SpacingType
  pb?: SpacingType
  pl?: SpacingType
  m?: SpacingType
  mx?: SpacingType
  my?: SpacingType
  mt?: SpacingType
  mr?: SpacingType
  mb?: SpacingType
  ml?: SpacingType

  // Sizing
  w?: SpacingType
  h?: SpacingType
  minW?: SpacingType
  minH?: SpacingType
  maxW?: SpacingType
  maxH?: SpacingType

  // Visual
  bg?: string
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

  // Misc
  className?: string
  style?: CSSProperties
}

const Box: React.FC<BoxProps> = ({
  children,
  display,
  position,
  zIndex,
  direction,
  justify,
  items,
  flex,
  wrap,
  gap,
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  bg,
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
}) => {
  const numericStyle: CSSProperties = {
    width: typeof w === 'number' ? w : undefined,
    height: typeof h === 'number' ? h : undefined,
    minWidth: typeof minW === 'number' ? minW : undefined,
    minHeight: typeof minH === 'number' ? minH : undefined,
    maxWidth: typeof maxW === 'number' ? maxW : undefined,
    maxHeight: typeof maxH === 'number' ? maxH : undefined,
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

        // Flexbox
        direction && `flex-${direction}`,
        justify && `justify-${justify}`,
        items && `items-${items}`,
        flex !== undefined && `flex-${flex}`,
        wrap && `flex-${wrap}`,
        gap !== undefined && `gap-${gap}`,

        // Spacing
        p !== undefined && `p-${p}`,
        px !== undefined && `px-${px}`,
        py !== undefined && `py-${py}`,
        pt !== undefined && `pt-${pt}`,
        pr !== undefined && `pr-${pr}`,
        pb !== undefined && `pb-${pb}`,
        pl !== undefined && `pl-${pl}`,
        m !== undefined && `m-${m}`,
        mx !== undefined && `mx-${mx}`,
        my !== undefined && `my-${my}`,
        mt !== undefined && `mt-${mt}`,
        mr !== undefined && `mr-${mr}`,
        mb !== undefined && `mb-${mb}`,
        ml !== undefined && `ml-${ml}`,

        // Sizing
        typeof w === 'string' && `w-${w}`,
        typeof h === 'string' && `h-${h}`,
        typeof minW === 'string' && `min-w-${minW}`,
        typeof minH === 'string' && `min-h-${minH}`,
        typeof maxW === 'string' && `max-w-${maxW}`,
        typeof maxH === 'string' && `max-h-${maxH}`,

        // Visual
        bg && `bg-${bg}`,
        opacity !== undefined && `opacity-${opacity}`,
        rounded && `rounded-${rounded}`,
        shadow && `shadow-${shadow}`,
        border &&
          (typeof border === 'string' ? `border-${border}` : 'border'),
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
