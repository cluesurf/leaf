import React from 'react'
import clsx from 'clsx'

export type FieldInput = React.ComponentPropsWithoutRef<'div'> & {
  children: React.ReactNode
  className?: string
}

export default function Field({ children, className }: FieldInput) {
  return (
    <div className={clsx(className, 'relative flex flex-col')}>
      {children}
    </div>
  )
}
