import React from 'react'
import cx from 'classnames'

export type FieldInput = React.ComponentPropsWithoutRef<'div'> & {
  children: React.ReactNode
  className?: string
}

export default function Field({
  children,
  className,
  ...props
}: FieldInput) {
  return (
    <div
      {...props}
      className={cx(className, 'relative flex flex-col')}
    >
      {children}
    </div>
  )
}
