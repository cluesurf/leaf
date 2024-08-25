import React from 'react'
import cx from 'classnames'
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
  base: 'bg-gray-200 dark:bg-gray-800 dark:text-gray-400',
  base2: 'bg-gray-200 dark:bg-gray-700 dark:text-gray-400',
}

export default function Label({
  children,
  className,
  htmlFor,
  color,
  bottomless,
  font = 'Noto Sans Mono',
}: {
  children: React.ReactNode
  className?: string
  htmlFor?: string
  color?: LabelColor
  bottomless?: boolean
  font?: string | Array<string>
}) {
  const colorClass = color && LABEL_COLOR[color]
  const [isStarting, isFontReady, hasFontWaited, fontClassName] =
    useText(font)

  let textColorClass

  if (isStarting || (isFontReady && hasFontWaited)) {
    textColorClass = `${fontClassName}`
  } else if (hasFontWaited) {
    textColorClass = `text-transparent`
  } else {
    textColorClass = `text-transparent`
  }

  return (
    <label
      htmlFor={htmlFor}
      className={cx(
        className,
        colorClass,
        textColorClass,
        'flex font-bold text-xs py-4 px-16 items-center justify-between',
        bottomless ? `rounded-sm` : 'rounded-t-sm',
      )}
    >
      {children}
    </label>
  )
}
