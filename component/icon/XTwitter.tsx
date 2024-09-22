import React from 'react'

export type XTwitterIconInput = {
  colorClassName?: string
}

export default function XTwitterIcon({
  colorClassName = 'fill-gray-800 dark:fill-gray-400',
}: XTwitterIconInput) {
  return (
    <svg
      className={colorClassName}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="100%"
      height="100%"
      viewBox="0 0 1080 1080"
      xmlSpace="preserve"
    >
      <g transform="matrix(3.47 0 0 3.47 540 540)">
        <path
          vectorEffect="non-scaling-stroke"
          transform=" translate(-148.95, -135.5)"
          d="M 236 0 L 282 0 L 181 115 L 299 271 L 206.4 271 L 133.9 176.2 L 50.900000000000006 271 L 4.900000000000006 271 L 111.9 148 L -1.0999999999999943 0 L 93.80000000000001 0 L 159.3 86.6 z M 219.9 244 L 245.4 244 L 80.4 26 L 53.00000000000001 26 z"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
