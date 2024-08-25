import React from 'react'

export type TriangleUpIconInput = {
  colorClassName?: string
}

export default function TriangleUpIcon({
  colorClassName = 'fill-gray-800 dark:fill-gray-400',
}: TriangleUpIconInput) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.272 5.205L16.272 13.205C16.8964 14.2041 16.1782 15.5 15 15.5H5.00002C3.82186 15.5 3.1036 14.2041 3.72802 13.205L8.72802 5.205C9.31552 4.265 10.6845 4.265 11.272 5.205Z"
        className={colorClassName}
      />
    </svg>
  )
}
