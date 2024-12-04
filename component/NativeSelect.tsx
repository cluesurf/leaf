import clsx from 'clsx'
import TriangleDownIcon from './icon/TriangleDown'
import React, { ChangeEvent, ForwardedRef } from 'react'
import { INPUT_COLOR, InputColor, getRoundedClass } from './Input'
import { useText } from './Text'

export type NativeSelectInput<T extends string> = Omit<
  React.ComponentPropsWithoutRef<'select'>,
  'onChange' | 'size'
> & {
  size?: 'large' | 'small'
  children: React.ReactNode
  className?: string
  topped?: boolean
  bottomed?: boolean
  onChangePossiblyUndefined?: (val?: T) => void
  onChange?: (val: T) => void
  color?: InputColor
  noArrow?: boolean
  font?: string | Array<string>
  script?: string
}

function NativeSelect<T extends string = string>(
  {
    children,
    className,
    onChange,
    onChangePossiblyUndefined,
    topped,
    bottomed,
    color = 'neutral',
    noArrow,
    size = 'small',
    font = 'Noto Sans Mono',
    script,
    ...props
  }: NativeSelectInput<T>,
  ref: ForwardedRef<HTMLSelectElement>,
) {
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
      inputClassName = `opacity-1 transition duration-300 ${fontClassName}-fallback`
      break
    case 'base:exit':
      inputClassName = `opacity-0 transition duration-300 ${fontClassName}-fallback`
      transitionEnd = handleTransitionOutEnd
      break
    case 'head:enter':
      inputClassName = `opacity-1 transition duration-500 ${fontClassName}`
      break
    case 'head:visible':
      inputClassName = `opacity-1 transition duration-300 ${fontClassName}`
      break
  }

  const handleChange = (event: ChangeEvent) => {
    const value = (event.target as HTMLSelectElement).value

    if (onChangePossiblyUndefined) {
      onChangePossiblyUndefined?.(value ? (value as T) : undefined)
    } else if (value) {
      onChange?.(value as T)
    }
  }

  const rounded = getRoundedClass(topped, bottomed)
  const backgroundColorClass = color && INPUT_COLOR[color]

  return (
    <div
      className={clsx(
        className,
        rounded,
        size === 'small' ? 'h-32' : 'h-48',
        'relative w-full min-w-128',
        backgroundColorClass,
        `shadow-small1 font-semibold`,
      )}
    >
      <div
        className={clsx(
          // size === 'small' ? `text-sm` : undefined,
          'absolute cursor-pointer left-0 right-0 top-0 bottom-0',
        )}
      >
        <select
          {...props}
          ref={ref}
          onTransitionEnd={transitionEnd}
          onChange={handleChange}
          className={clsx(
            size === 'small' ? 'text-sm h-32' : 'h-48',
            'appearance-none bg-transparent px-16 leading-content w-full',
            'overflow-hidden whitespace-nowrap text-ellipsis',
            'rounded-sm',
            `focus-visible:ring focus-visible:ring-offset-0 focus-visible:ring-inset focus-visible:ring-blue-200 dark:focus-visible:ring-opacity-30 dark:focus-visible:ring-blue-600`,
            inputClassName,
            'pr-24',
          )}
        >
          {children}
        </select>
        {!noArrow && (
          <div
            className={clsx(
              size === 'small' ? 'w-16' : 'w-24',
              'absolute right-8 top-0 bottom-0 pointer-events-none flex items-center',
            )}
          >
            <span
              className={clsx(
                size === 'small' ? 'w-16 h-16' : 'w-20 h-20',
                'block',
              )}
            >
              <TriangleDownIcon />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.forwardRef(NativeSelect) as <
  T extends string = string,
>(
  props: NativeSelectInput<T> & {
    ref?: ForwardedRef<HTMLSelectElement>
  },
) => ReturnType<typeof NativeSelect>
