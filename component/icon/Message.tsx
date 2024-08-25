import React from 'react'
import cx from 'classnames'

export type MessageIconInput = {
  colorClassName?: string
}

export default function MessageIcon({
  colorClassName = 'fill-gray-800 dark:fill-gray-400',
}: MessageIconInput) {
  return (
    <svg
      className={cx(
        colorClassName,
        'transform-gpu scale-x-[-1] transition-all',
      )}
      width="100%"
      height="100%"
      viewBox="-2 -2 24 24"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin"
    >
      <path d="M3 .565h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-6.958l-6.444 4.808A1 1 0 0 1 2 18.57v-4.006a2 2 0 0 1-2-2v-9a3 3 0 0 1 3-3z" />
    </svg>
  )
}
