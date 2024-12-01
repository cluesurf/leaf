import clsx from 'clsx'
import React from 'react'

export type TriangleDownIconInput = {
  colorClassName?: string
  hoverable?: boolean
}

export default function TriangleDownIcon({
  colorClassName = 'fill-gray-800 dark:fill-gray-400',
  hoverable,
}: TriangleDownIconInput) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.72798 15.795L3.72798 7.795C3.10356 6.79593 3.82183 5.5 4.99998 5.5L15 5.5C16.1781 5.5 16.8964 6.79593 16.272 7.795L11.272 15.795C10.6845 16.735 9.31549 16.735 8.72798 15.795Z"
        className={clsx(
          colorClassName,
          hoverable && `hover:fill-violet-600`,
          `transition-colors`,
        )}
      />
    </svg>
  )
}
