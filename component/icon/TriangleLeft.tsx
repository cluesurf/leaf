import clsx from 'clsx'
import React from 'react'

export type TriangleLeftIconInput = {
  colorClassName?: string
  hoverable?: boolean
}

export default function TriangleLeftIcon({
  colorClassName = 'fill-zinc-800 dark:fill-zinc-500',
  hoverable,
}: TriangleLeftIconInput) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.205 8.72805L12.205 3.72805C13.2041 3.10363 14.5 3.82189 14.5 5.00004V15C14.5 16.1782 13.2041 16.8965 12.205 16.272L4.205 11.272C3.265 10.6845 3.265 9.31555 4.205 8.72805Z"
        className={clsx(
          colorClassName,
          hoverable && `hover:fill-violet-600`,
          `transition-colors`,
        )}
      />
    </svg>
  )
}
