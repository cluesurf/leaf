import React from 'react'
import clsx from 'clsx'

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
      className={clsx(className, 'relative flex flex-col')}
    >
      {children}
    </div>
  )
}
