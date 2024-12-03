import Link, { LinkProps } from 'next/link'
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLProps,
} from 'react'
import clsx from 'clsx'
import T from './Text'
import COLORS from '~/utility/colors'

const FOCUS_CLASS_NAME = `focus-visible:ring focus-visible:ring-offset-0 focus-visible:ring-blue-300`

export const COLOR: Record<ButtonColor, string> = {
  purple: `${COLORS.button.purple} ${FOCUS_CLASS_NAME}`,
  green: `${COLORS.button.green} ${FOCUS_CLASS_NAME}`,
  red: `${COLORS.button.red} ${FOCUS_CLASS_NAME}`,
  blue: `${COLORS.button.blue} ${FOCUS_CLASS_NAME}`,
  base: `${COLORS.button.base} ${FOCUS_CLASS_NAME}`,
  neutral: `${COLORS.button.neutral} ${FOCUS_CLASS_NAME}`,
}

export type ButtonColor =
  | 'purple'
  | 'green'
  | 'red'
  | 'blue'
  | 'base'
  | 'neutral'

export const GHOST_COLOR: Record<ButtonColor, string> = {
  purple: `${COLORS.border.purple} ${FOCUS_CLASS_NAME}`,
  green: `${COLORS.border.green} ${FOCUS_CLASS_NAME}`,
  red: `${COLORS.border.red} ${FOCUS_CLASS_NAME}`,
  blue: `${COLORS.border.blue} ${FOCUS_CLASS_NAME}`,
  base: `${COLORS.border.base} ${FOCUS_CLASS_NAME}`,
  neutral: `${COLORS.border.neutral} ${FOCUS_CLASS_NAME}`,
}

export type ButtonInput = {
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  touching?: boolean
  children: React.ReactNode
  fill?: boolean
  align?: 'left' | 'right' | 'center'
  color?: ButtonColor
  ghost?: boolean
  bold?: boolean
  font?: string | Array<string>
  width?: number
} & Omit<
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  'value' | 'size'
>

function getColorClassName(color: string, ghost?: boolean) {
  const className = ghost ? GHOST_COLOR[color] : COLOR[color]
  return className
}

function getSizeClassNames(
  size: 'small' | 'medium' | 'large',
  ghost?: boolean,
) {
  switch (size) {
    case 'small':
      return [
        'font-bold text-xs sm:text-xs-large h-24',
        ghost ? 'py-4' : 'py-2',
        ghost ? 'px-4' : 'px-8',
      ].join(' ')
    case 'medium':
      return [
        'font-bold text-sm sm:text-sm-large h-32 py-4',
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
  color = 'base',
  ghost,
  font,
  bold,
  width,
  ...props
}: ButtonInput) {
  const colorClassName = getColorClassName(color, ghost)
  const sizeClassName = getSizeClassNames(size, ghost)

  return (
    <button
      style={{ width }}
      className={clsx(
        className,
        sizeClassName,
        colorClassName,
        'flex',
        `min-w-1`,
        bold ? 'font-bold' : undefined,
        'items-center',
        'gap-8',
        touching ? undefined : 'rounded-sm',
        'text-center justify-center',
        fill ? 'w-full' : 'w-fit',
        'transition-all',
        'cursor-pointer',
        'duration-200',
        `shadow-small1 hover:shadow-small2`,
        align === 'right' ? 'justify-end' : undefined,
      )}
      {...props}
    >
      <T
        className="text-ellipsis overflow-hidden whitespace-nowrap"
        font={font}
      >
        {children}
      </T>
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
      className={clsx(
        className,
        'flex',
        'items-center',
        'text-center',
        'w-fit',
        'cursor-pointer',
        // fill ? C.flexAll : undefined,
        'transition-all',
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
  align?: 'left' | 'right' | 'center'
  color?: ButtonColor
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
  color = 'base',
  ghost,
  font,
  ...props
}: LabelButtonInput) {
  const sizeClassName = getSizeClassNames(size, ghost)
  const colorClassName = getColorClassName(color, ghost)
  return (
    <T
      tag="label"
      className={clsx(
        className,
        colorClassName,
        sizeClassName,
        'flex',
        'items-center',
        'gap-8',
        touching ? undefined : 'rounded-sm',
        'text-center justify-center',
        fill ? 'w-full' : 'w-fit',
        'transition-all',
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
  align?: 'left' | 'right' | 'center'
  shadow?: boolean
  className?: string
  color?: ButtonColor
  ghost?: boolean
  target?: '_blank'
  font?: string | Array<string>
  variant?: 1 | 1
  width?: number
} & LinkProps

export function LinkButton({
  children,
  size = 'medium',
  touching,
  fill,
  title,
  shadow,
  align = 'left',
  className,
  color = 'base',
  ghost,
  target,
  font,
  width,
  ...props
}: LinkButtonInput) {
  const sizeClassName = getSizeClassNames(size, ghost)
  const colorClassName = getColorClassName(color, ghost)

  return (
    <Link
      style={{ width }}
      {...props}
      title={title}
      scroll={false}
      target={target}
      className={clsx(
        colorClassName,
        className,
        sizeClassName,
        'flex',
        `min-w-1`,
        `shadow-small1 hover:shadow-small2`,
        'items-center justify-center',
        'gap-8',
        touching ? undefined : 'rounded-sm',
        'text-center',
        fill ? 'w-full' : 'w-fit',
        // fill ? C.flexAll : undefined,
        'transition-all',
        'duration-200',
        align === 'right' ? 'justify-end' : undefined,
      )}
    >
      <T
        className="-top-1 text-ellipsis overflow-hidden whitespace-nowrap"
        font={font}
      >
        {children}
      </T>
    </Link>
  )
}
