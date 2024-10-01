import React from 'react'
import clsx from 'clsx'
import T from '~/component/Text'

export const TAG_COLOR = {
  blue: 'bg-blue-500 text-white dark:bg-blue-800 dark:text-blue-200',
  green:
    'bg-emerald-500 text-white dark:bg-emerald-800 dark:text-emerald-200',
  gray: 'bg-gray-500 text-white dark:bg-gray-800 dark:text-gray-200',
}

export type TagColor = keyof typeof TAG_COLOR

type TagInput = {
  className?: string
  color?: TagColor
  children: React.ReactNode
}

export default function Tag({ children, className, color }: TagInput) {
  return (
    <T
      leading="heading"
      className={clsx(
        className,
        color && TAG_COLOR[color],
        'relative inline-block text-xs rounded-large-circle py-2 px-8 h-fit font-normal text-nowrap',
      )}
    >
      {children}
    </T>
  )
}
