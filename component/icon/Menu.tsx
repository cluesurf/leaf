import clsx from 'clsx'
import React from 'react'

export type MenuIconInput = {
  colorClassName?: string
  hoverable?: boolean
}

export default function MenuIcon({
  colorClassName = 'fill-gray-800 dark:fill-gray-500',
  hoverable,
}: MenuIconInput) {
  return (
    <svg
      className={clsx(
        colorClassName,
        hoverable && `hover:fill-violet-600`,
        `transition-colors`,
      )}
      width="100%"
      height="100%"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M228,128.00037a12.00028,12.00028,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12.00028,12.00028,0,0,1,228,128.00037Zm-188-52H216a12,12,0,0,0,0-24H40a12,12,0,1,0,0,24Zm176,104H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z" />
    </svg>
  )
}
