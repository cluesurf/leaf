import React from 'react'

export type ListIconInput = {
  colorClassName?: string
}

export default function ListIcon({
  colorClassName = 'fill-zinc-800 dark:fill-zinc-500',
}: ListIconInput) {
  return (
    <svg
      className={colorClassName}
      width="100%"
      height="100%"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M76,64A12.00028,12.00028,0,0,1,88,52H216a12,12,0,0,1,0,24H88A12.00028,12.00028,0,0,1,76,64Zm140,52H88.00586a12,12,0,1,0,0,24H216a12,12,0,0,0,0-24Zm0,64H88.00586a12,12,0,1,0,0,24H216a12,12,0,0,0,0-24ZM44,112a16,16,0,1,0,16,16A16.00016,16.00016,0,0,0,44,112Zm0-64A16,16,0,1,0,60,64,16.00016,16.00016,0,0,0,44,48Zm0,128a16,16,0,1,0,16,16A16.00016,16.00016,0,0,0,44,176Z" />
    </svg>
  )
}
