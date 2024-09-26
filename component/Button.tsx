import Link, { LinkProps } from 'next/link'
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLProps,
} from 'react'
import cx from 'classnames'
import { useDarkMode } from '~/hook/useDarkMode'
import T from './Text'

export const COLOR: Record<string, string> = {
  purple:
    'bg-violet-500 text-gray-100 dark:bg-violet-900 dark:text-violet-200 hover:opacity-70',
  green:
    'bg-emerald-500 text-gray-100 dark:bg-emerald-900 dark:text-emerald-200 hover:opacity-70',
  red: 'bg-rose-500 text-gray-100 dark:bg-rose-900 dark:text-rose-200 hover:opacity-70',
  blue: 'bg-blue-500 dark:bg-blue-900 dark:text-blue-200 hover:opacity-70',
  black:
    'bg-gray-800 text-gray-100 dark:bg-gray-200 bg-gray-700 hover:opacity-70 hover:dark:bg-gray-300',
  black2:
    'bg-gray-800 text-gray-100 dark:bg-gray-200 bg-gray-700 hover:opacity-70 hover:dark:bg-gray-300',
  white:
    'bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:opacity-70 hover:dark:bg-gray-700',
  white2:
    'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:opacity-70 hover:dark:bg-gray-600',
}

export type ButtonColor = keyof typeof COLOR

export const TEXT_COLOR: Record<string, string> = {
  purple: 'text-gray-100',
  green: 'text-gray-800',
  red: 'text-gray-100',
  blue: 'text-gray-100',
  black: 'text-gray-100',
  white: 'text-gray-800',
}

export const GHOST_COLOR: Record<string, string> = {
  purple:
    'border-4 border-solid dark:border-violet-900 border-violet-400 dark:border-violet-900 text-violet-400 hover:opacity-70',
  green:
    'border-4 border-solid dark:border-emerald-900 border-emerald-400 dark:border-emerald-900 text-emerald-400 hover:opacity-70',
  blue: 'border-4 border-solid dark:border-blue-900 border-blue-400 dark:border-blue-900 text-blue-400 hover:opacity-70',
  red: 'border-4 border-solid border-rose-700 text-rose-700 hover:opacity-70',
  black:
    'border-4 border-solid border-gray-800 text-gray-800 hover:opacity-70',
  white:
    'border-4 border-solid border-gray-400 text-gray-400 hover:opacity-70',
}

export type ButtonInput = {
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  touching?: boolean
  children: React.ReactNode
  fill?: boolean
  align?: 'left' | 'right'
  color?: 'purple' | 'blue' | 'red' | 'contrast' | 'green'
  ghost?: boolean
  bold?: boolean
  variant?: 1 | 2
  font?: string | Array<string>
} & Omit<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  'value' | 'size'
>

function getColorClassName(
  color: string,
  isDark: boolean,
  ghost?: boolean,
  variant?: 1 | 2,
) {
  const name =
    color === 'contrast'
      ? isDark
        ? `white${variant === 1 ? '' : variant}`
        : `black${variant === 1 ? '' : variant}`
      : color
  const colorClassName = COLOR[name]
  const textColorClassName = TEXT_COLOR[name]
  const className = ghost
    ? GHOST_COLOR[name]
    : `${colorClassName} ${textColorClassName}`
  return className
}

function getSizeClassNames(
  size: 'small' | 'medium' | 'large',
  ghost?: boolean,
) {
  switch (size) {
    case 'small':
      return [
        'text-xs sm:text-xs-large h-24',
        ghost ? 'py-4' : 'py-2',
        ghost ? 'px-4' : 'px-8',
      ].join(' ')
    case 'medium':
      return [
        'text-sm sm:text-sm-large h-32 py-4',
        ghost ? 'px-8' : 'px-12',
      ].join(' ')
    case 'large':
      return [
        'font-bold text-base sm:text-base-large h-48',
        ghost ? 'px-16' : 'px-24',
      ].join(' ')
  }
}

export function Button({
  children,
  size = 'medium',
  touching = false,
  fill,
  className,
  align,
  color = 'contrast',
  ghost,
  font,
  bold,
  variant = 1,
  ...props
}: ButtonInput) {
  const isDark = useDarkMode() === 'dark'
  const colorClassName = getColorClassName(
    color,
    isDark,
    ghost,
    variant,
  )
  const sizeClassName = getSizeClassNames(size, ghost)

  return (
    <button
      className={cx(
        className,
        sizeClassName,
        colorClassName,
        'flex',
        bold ? 'font-bold' : undefined,
        'items-center',
        'gap-8',
        touching ? undefined : 'rounded-sm',
        'text-center',
        fill ? 'w-full' : 'w-fit',
        'transition-color',
        'cursor-pointer',
        'duration-200',
        align === 'right' ? 'justify-end' : undefined,
      )}
      {...props}
    >
      <T font={font}>{children}</T>
    </button>
  )
}

export default Button

export function IconButton({
  children,
  className,
  font,
  size,
  ...props
}: ButtonInput) {
  return (
    <button
      className={cx(
        className,
        'flex',
        'items-center',
        'text-center',
        'w-fit',
        'cursor-pointer',
        // fill ? C.flexAll : undefined,
        'transition-colors transition-color',
        'duration-200',
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export type LabelButtonInput = {
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  touching?: boolean
  fill?: boolean
  align?: 'left' | 'right'
  color?: 'purple' | 'green' | 'red' | 'contrast'
  ghost?: boolean
  font?: string | Array<string>
} & Omit<HTMLProps<HTMLLabelElement>, 'size' | 'value'>

export function LabelButton({
  children,
  size = 'medium',
  touching,
  className,
  fill,
  align,
  color = 'contrast',
  ghost,
  font,
  ...props
}: LabelButtonInput) {
  const sizeClassName = getSizeClassNames(size, ghost)
  const isDark = useDarkMode() === 'dark'
  const colorClassName = getColorClassName(color, isDark, ghost)
  return (
    <T
      tag="label"
      className={cx(
        className,
        colorClassName,
        sizeClassName,
        'flex',
        'items-center',
        'gap-8',
        touching ? undefined : 'rounded-sm',
        'text-center',
        fill ? 'w-full' : 'w-fit',
        'transition-colors transition-color',
        'duration-200',
        align === 'right' ? 'justify-end' : undefined,
      )}
      {...props}
      font={font}
    >
      {children}
    </T>
  )
}

export type LinkButtonInput = {
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  children?: React.ReactNode
  download?: boolean
  touching?: boolean
  fill?: boolean
  title?: string
  align?: 'left' | 'right'
  shadow?: boolean
  className?: string
  color?: 'purple' | 'green' | 'red' | 'contrast'
  ghost?: boolean
  target?: '_blank'
  font?: string | Array<string>
  variant?: 1 | 1
} & LinkProps

export function LinkButton({
  children,
  variant = 1,
  size = 'medium',
  touching,
  fill,
  title,
  shadow,
  align = 'left',
  className,
  color = 'contrast',
  ghost,
  target,
  font,
  ...props
}: LinkButtonInput) {
  const sizeClassName = getSizeClassNames(size, ghost)
  const isDark = useDarkMode() === 'dark'
  const colorClassName = getColorClassName(
    color,
    isDark,
    ghost,
    variant,
  )

  return (
    <Link
      {...props}
      title={title}
      scroll={false}
      target={target}
      className={cx(
        colorClassName,
        className,
        sizeClassName,
        'flex',
        'items-center',
        'gap-8',
        touching ? undefined : 'rounded-sm',
        'text-center',
        fill ? 'w-full' : 'w-fit',
        // fill ? C.flexAll : undefined,
        'transition-colors transition-color',
        'duration-200',
        align === 'right' ? 'justify-end' : undefined,
      )}
    >
      <T
        className="-top-1"
        font={font}
      >
        {children}
      </T>
    </Link>
  )
}
