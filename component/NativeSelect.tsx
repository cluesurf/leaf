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
    color,
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

  const handleChange = (event: ChangeEvent) => {
    const value = (event.target as HTMLSelectElement).value

    if (onChangePossiblyUndefined) {
      onChangePossiblyUndefined?.(value ? (value as T) : undefined)
    } else if (value) {
      onChange?.(value as T)
    }
  }

  const rounded = getRoundedClass(topped, bottomed)
  let textColorClass = `placeholder:italic`

  return (
    <div
      className={clsx(
        className,
        rounded,
        size === 'small' ? 'h-32' : 'h-48',
        'relative w-full min-w-128',
        textColorClass,
      )}
    >
      <div
        className={clsx(
          size === 'small' ? `text-sm` : undefined,
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
            'appearance-none bg-transparent px-12 leading-content w-full',
            'overflow-hidden whitespace-nowrap text-ellipsis',
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
              'absolute p-8 right-16 top-0 bottom-0 pointer-events-none',
            )}
          >
            <span
              className={clsx(
                size === 'small' ? 'w-16 h-16' : 'w-24 h-24',
                'inline-block absolute',
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
