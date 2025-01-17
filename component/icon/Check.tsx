import React from 'react'

export type CheckIconInput = {
  colorClassName?: string
}

export default function CheckIcon({
  colorClassName = 'fill-zinc-800 dark:fill-zinc-500',
}: CheckIconInput) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox="0 0 415.582 415.582"
      xmlSpace="preserve"
    >
      <path
        className={colorClassName}
        d="M411.47,96.426l-46.319-46.32c-5.482-5.482-14.371-5.482-19.853,0L152.348,243.058l-82.066-82.064
		c-5.48-5.482-14.37-5.482-19.851,0l-46.319,46.32c-5.482,5.481-5.482,14.37,0,19.852l138.311,138.31
		c2.741,2.742,6.334,4.112,9.926,4.112c3.593,0,7.186-1.37,9.926-4.112L411.47,116.277c2.633-2.632,4.111-6.203,4.111-9.925
		C415.582,102.628,414.103,99.059,411.47,96.426z"
      />
    </svg>
  )
}
