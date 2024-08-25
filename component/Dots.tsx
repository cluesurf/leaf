import React from 'react'
import cx from 'classnames'

export default function Dots({ className }: { className?: string }) {
  return (
    <div className={cx(className, 'lds-ellipsis')}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
