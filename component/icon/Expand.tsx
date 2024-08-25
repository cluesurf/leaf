import React from 'react'

export type ExpandIconInput = {
  colorClassName?: string
}

export default function ExpandIcon({
  colorClassName = 'fill-gray-800 dark:fill-gray-100',
}: ExpandIconInput) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.62132 14.5H7C7.8284 14.5 8.5 15.1716 8.5 16C8.5 16.8284 7.8284 17.5 7 17.5H2C1.17157 17.5 0.5 16.8284 0.5 16V11C0.5 10.1716 1.17157 9.5 2 9.5C2.82843 9.5 3.5 10.1716 3.5 11V12.3787L5.93934 9.9393C6.52513 9.3536 7.4749 9.3536 8.0607 9.9393C8.6464 10.5251 8.6464 11.4749 8.0607 12.0607L5.62132 14.5zM12.3787 3.5H11C10.1716 3.5 9.5 2.82843 9.5 2C9.5 1.17157 10.1716 0.5 11 0.5H16C16.8284 0.5 17.5 1.17157 17.5 2V7C17.5 7.8284 16.8284 8.5 16 8.5C15.1716 8.5 14.5 7.8284 14.5 7V5.62132L12.0607 8.0607C11.4749 8.6464 10.5251 8.6464 9.9393 8.0607C9.3536 7.4749 9.3536 6.52513 9.9393 5.93934L12.3787 3.5z"
        className={colorClassName}
      />
    </svg>
  )
}
