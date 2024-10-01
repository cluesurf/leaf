import React from 'react'
import clsx from 'clsx'

export type InputColor = 'purple' | 'blue' | 'base'

export const INPUT_COLOR: Record<InputColor, string> = {
  purple: 'bg-violet-50',
  blue: 'bg-blue-50',
  base: 'bg-gray-50',
}

export type ValueInput = React.ComponentPropsWithoutRef<'div'> & {
  labelled?: boolean
  bottomed?: boolean
  color?: InputColor
  value?: React.ReactNode
  children?: React.ReactNode
}

export default function Value({
  className,
  labelled,
  bottomed,
  color,
  ...props
}: ValueInput) {
  const { value, children, ...rest } = props

  const rounded = getRoundedClass(labelled, bottomed)
  const colorClass = color && INPUT_COLOR[color]

  return (
    <div
      className={clsx(
        className,
        'relative w-full px-16',
        rounded,
        colorClass,
      )}
      {...rest}
    >
      {value ?? children}
    </div>
  )
}

export function getRoundedClass(
  labelled?: boolean,
  bottomed?: boolean,
) {
  if (labelled && bottomed) {
    return
  } else if (labelled && !bottomed) {
    return `rounded-b-sm`
  } else if (bottomed && !labelled) {
    return `rounded-t-sm`
  } else {
    return `rounded-sm`
  }
}
