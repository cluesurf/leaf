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

export const LABEL_COLOR: Record<LabelColor, string> = {
  purple: 'bg-violet-200 dark:bg-violet-800 dark:text-violet-200',
  'dark-purple': 'bg-violet-300',
  blue: 'bg-blue-200 dark:bg-blue-800 dark:text-blue-200',
  'dark-blue': 'bg-blue-300',
  green: 'bg-emerald-200 dark:bg-emerald-800 dark:text-emerald-200',
  'dark-green': 'bg-emerald-300',
  red: 'bg-rose-200 dark:bg-rose-800 dark:text-rose-200',
  'dark-red': 'bg-rose-300',
  neutral: 'bg-gray-200 dark:bg-gray-800 dark:text-gray-400',
  base: 'bg-white dark:bg-gray-700 dark:text-gray-400',
}

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
  const colorClass = color && LABEL_COLOR[color]

  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        className,
        colorClass,
        disabled ? `text-gray-300` : `text-gray-600`,
        'lowercase flex text-xs py-4 px-16 items-center justify-between',
        bottomless ? `rounded-sm` : 'rounded-t-sm',
      )}
    >
      {children}
    </label>
  )
}
