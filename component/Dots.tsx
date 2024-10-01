import React from 'react'
import clsx from 'clsx'

export default function Dots({ className }: { className?: string }) {
  return (
    <div className={clsx(className, 'lds-ellipsis')}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
