import React, {
  ChangeEvent,
  ForwardedRef,
  MutableRefObject,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import { useText } from './Text'
import composeRefs from '@seznam/compose-react-refs'

export type InputColor =
  | 'purple'
  | 'blue'
  | 'base'
  | 'green'
  | 'red'
  | 'neutral'

export const INPUT_COLOR: Record<InputColor, string> = {
  purple:
    'bg-violet-100 text-violet-700 placeholder:text-violet-500 dark:bg-violet-950 dark:text-violet-300',
  blue: 'bg-blue-100 text-blue-700 placeholder:text-blue-400 dark:bg-blue-950 dark:text-blue-300',
  neutral:
    'disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-600 dark:disabled:text-gray-500 bg-gray-100 text-gray-950 placeholder:text-gray-600 dark:bg-gray-900 dark:text-gray-300',
  base: 'bg-white placeholder:text-gray-100 dark:bg-gray-950 placeholder:text-gray-700 dark:text-gray-300',
  green:
    'bg-emerald-100 text-emerald-700 placeholder:text-emerald-400 dark:bg-emerald-950 dark:text-emerald-300',
  red: 'bg-rose-100 text-rose-700 placeholder:text-rose-300 dark:bg-rose-950 dark:text-rose-300',
}

export const INPUT_WAITING: Record<InputColor, string> = {
  purple: 'font-loading-base-input',
  blue: 'font-loading-base-input',
  neutral: 'font-loading-base-input',
  base: 'font-loading-base-input',
  green: 'font-loading-base-input',
  red: 'font-loading-base-input',
}

export type InputInput = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'size'
> & {
  size?: 'large' | 'small'
  labelled?: boolean
  bottomed?: boolean
  inputRef?: React.MutableRefObject<HTMLInputElement | null>
  before?: string
  after?: string
  color?: InputColor
  font?: string | Array<string>
  script?: string
}

function Input(
  {
    className,
    labelled,
    bottomed,
    inputRef,
    autoComplete = 'off',
    spellCheck = false,
    before,
    after,
    disabled,
    color = 'neutral',
    size = 'small',
    font = 'Noto Sans Mono',
    script,
    ...props
  }: InputInput,
  passedRef?: ForwardedRef<HTMLInputElement>,
) {
  const { value, onChange, ...rest } = props
  const ref = useRef<HTMLInputElement>(null)
  const {
    lineHeights,
    handleTransitionOutEnd,
    fontClassName,
    transitionState,
  } = useText(font, script)
  const lineHeight = lineHeights?.body

  let inputClassName: string | undefined = undefined
  let transitionEnd
  switch (transitionState) {
    case 'base:hidden':
      inputClassName = `opacity-0 ${fontClassName}-fallback`
      break
    case 'base:visible':
      inputClassName = `opacity-1 transition-opacity duration-300 ${fontClassName}-fallback`
      break
    case 'base:exit':
      inputClassName = `opacity-0 transition-opacity duration-300 ${fontClassName}-fallback`
      transitionEnd = handleTransitionOutEnd
      break
    case 'head:enter':
      inputClassName = `opacity-1 transition-opacity duration-500 ${fontClassName}`
      break
    case 'head:visible':
      inputClassName = `opacity-1 transition-opacity duration-300 ${fontClassName}`
      break
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
  }

  const rounded = getRoundedClass(labelled, bottomed)

  const backgroundColorClass = color && INPUT_COLOR[color]

  return (
    <input
      ref={composeRefs(ref, inputRef, passedRef)}
      value={value == null ? '' : value}
      onChange={handleChange}
      autoComplete={autoComplete}
      spellCheck={spellCheck}
      onTransitionEnd={transitionEnd}
      style={{ lineHeight }}
      disabled={disabled}
      className={clsx(
        className,
        size === 'small' ? 'px-16 h-32' : 'px-16 h-48',
        'relative w-full',
        size === 'small' ? 'text-sm' : undefined,
        rounded,
        disabled && `!select-none`,
        backgroundColorClass,
        inputClassName,
        disabled && `select-none`,
        `font-semibold`,
        `focus-visible:ring dark:focus-visible:ring-opacity-30 focus-visible:ring-offset-0 focus-visible:ring-inset focus-visible:ring-blue-200 dark:focus-visible:ring-blue-600`,
        `shadow-small1`,
        `text-base sm:text-base-large`,
        size === 'small' ? 'h-32' : 'h-48',
        'block py-8',
      )}
      {...rest}
    />
  )
}

export default React.forwardRef(Input)

export function getRoundedClass(
  labelled?: boolean,
  bottomed?: boolean,
) {
  if (labelled && bottomed) {
    return
  } else if (labelled && !bottomed) {
    return `rounded-b-sm`
  } else if (bottomed && !labelled) {
    return `rounded-t-sm`
  } else {
    return `rounded-sm`
  }
}
