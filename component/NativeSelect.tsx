import cx from 'classnames'
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
    ...props
  }: NativeSelectInput<T>,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  const [isStarting, isFontReady, hasFontWaited, fontClassName] =
    useText(font)

  const handleChange = (event: ChangeEvent) => {
    const value = (event.target as HTMLSelectElement).value

    if (onChangePossiblyUndefined) {
      onChangePossiblyUndefined?.(value ? (value as T) : undefined)
    } else if (value) {
      onChange?.(value as T)
    }
  }

  const rounded = getRoundedClass(topped, bottomed)
  const waitingColorClass = color && INPUT_COLOR[color]

  let backgroundColorClass
  let textColorClass

  if (isStarting || (isFontReady && hasFontWaited)) {
    backgroundColorClass = waitingColorClass
    textColorClass = `text-gray-950 ${fontClassName} placeholder:text-gray-500 placeholder:italic`
  } else if (hasFontWaited) {
    backgroundColorClass = waitingColorClass
    textColorClass = `text-transparent placeholder:text-transparent`
  } else {
    textColorClass = `text-transparent placeholder:text-transparent`
  }

  return (
    <div
      className={cx(
        className,
        rounded,
        size === 'small' ? 'h-32' : 'h-48',
        'relative w-full min-w-128',
        backgroundColorClass,
        textColorClass,
      )}
    >
      <div
        className={cx(
          size === 'small' ? `text-sm` : undefined,
          'absolute cursor-pointer left-0 right-0 top-0 bottom-0',
        )}
      >
        <select
          {...props}
          ref={ref}
          onChange={handleChange}
          className={cx(
            size === 'small' ? 'text-sm h-32' : 'h-48',
            'appearance-none bg-transparent px-12 leading-content w-full',
            'overflow-hidden whitespace-nowrap text-ellipsis',
            'pr-24',
          )}
        >
          {children}
        </select>
        {!noArrow && (
          <div
            className={cx(
              size === 'small' ? 'w-16' : 'w-24',
              'absolute p-8 right-16 top-0 bottom-0 pointer-events-none',
            )}
          >
            <span
              className={cx(
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
