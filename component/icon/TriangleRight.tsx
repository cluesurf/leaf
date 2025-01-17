import clsx from 'clsx'
import React from 'react'

export type TriangleRightIconInput = {
  colorClassName?: string
  hoverable?: boolean
}

export default function TriangleRightIcon({
  colorClassName = 'fill-zinc-800 dark:fill-zinc-500',
  hoverable,
}: TriangleRightIconInput) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z"
        className={clsx(
          colorClassName,
          hoverable && `hover:fill-violet-600`,
          `transition-colors`,
        )}
      />
    </svg>
  )
}
