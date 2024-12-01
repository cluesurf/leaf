import clsx from 'clsx'
import React from 'react'

export type PencilIconInput = {
  colorClassName?: string
  hoverable?: boolean
}

export default function PencilIcon({
  colorClassName = 'fill-gray-800 dark:fill-gray-400',
  hoverable,
}: PencilIconInput) {
  return (
    <svg
      className={clsx(
        colorClassName,
        hoverable && `hover:fill-violet-600`,
        `transition-colors`,
      )}
      width="100%"
      height="100%"
      viewBox="0 0 36 36"
      version="1.1"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path d="M4.22,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13,32,28.84,16.22,20,7.4Z"></path>
      <path d="M33.82,8.32l-5.9-5.9a2.07,2.07,0,0,0-2.92,0L21.72,5.7l8.83,8.83,3.28-3.28A2.07,2.07,0,0,0,33.82,8.32Z"></path>
      <rect
        x="0"
        y="0"
        width="36"
        height="36"
        fillOpacity="0"
      />
    </svg>
  )
}
