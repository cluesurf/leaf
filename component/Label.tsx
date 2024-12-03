import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { InputColor } from './Input'
import { useText } from './Text'

export type LabelColor =
  | 'dark-purple'
  | 'dark-blue'
  | 'dark-green'
  | 'dark-red'
  | InputColor

export default function Label({
  children,
  className,
  htmlFor,
  color,
  bottomless,
  disabled,
}: {
  children: React.ReactNode
  className?: string
  htmlFor?: string
  color?: LabelColor
  bottomless?: boolean
  disabled?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        className,
        disabled
          ? `text-zinc-300 dark:text-zinc-700`
          : `text-zinc-600 dark:text-zinc-400`,
        'lowercase flex text-xs py-2 pr-16 items-center justify-between',
        bottomless ? `rounded-sm` : 'rounded-t-sm',
      )}
    >
      {children}
    </label>
  )
}
