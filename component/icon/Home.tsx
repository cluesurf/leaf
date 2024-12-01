import clsx from 'clsx'
import React from 'react'

export type HomeIconInput = {
  colorClassName?: string
  hoverable?: boolean
}

export default function HomeIcon({
  colorClassName = 'fill-gray-800 dark:fill-gray-400',
  hoverable,
}: HomeIconInput) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="primary"
        d="M21.71,11.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0,1.42,1.42l.29-.3V20.3A1.77,1.77,0,0,0,5.83,22H8.5a1,1,0,0,0,1-1V16.1a1,1,0,0,1,1-1h3a1,1,0,0,1,1,1V21a1,1,0,0,0,1,1h2.67A1.77,1.77,0,0,0,20,20.3V12.41l.29.3a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,11.29Z"
        className={clsx(
          colorClassName,
          hoverable && `hover:fill-violet-600`,
          `transition-colors`,
        )}
      />
    </svg>
  )
}
