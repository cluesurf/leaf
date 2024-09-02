import React from 'react'

export type MarkerIconInput = {
  colorClassName?: string
}

export default function MarkerIcon({
  colorClassName = 'color-gray-800 dark:color-gray-400',
}: MarkerIconInput) {
  return (
    <svg
      className={colorClassName}
      width="100%"
      height="100%"
      viewBox="-3 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m8.075 23.52c-6.811-9.878-8.075-10.891-8.075-14.52 0-4.971 4.029-9 9-9s9 4.029 9 9c0 3.629-1.264 4.64-8.075 14.516-.206.294-.543.484-.925.484s-.719-.19-.922-.48l-.002-.004zm.925-10.77c2.07 0 3.749-1.679 3.749-3.75s-1.679-3.75-3.75-3.75-3.75 1.679-3.75 3.75c0 2.071 1.679 3.75 3.75 3.75z" />
    </svg>
  )
}
