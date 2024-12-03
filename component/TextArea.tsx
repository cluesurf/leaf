import clsx from 'clsx'
import React, { ChangeEvent, useEffect, useRef } from 'react'
import { getRoundedClass } from './Input'

export default function TextArea({
  value,
  loading,
  labelled,
  className,
  onChange,
  autocomplete,
  autocorrect,
  spellCheck,
  bottomed,
  id,
  readOnly,
  autosize,
}: {
  autosize?: boolean
  id?: string
  readOnly?: boolean
  className?: string
  value?: string
  loading?: boolean
  labelled?: boolean
  onChange?: (e: ChangeEvent) => void
  autocomplete?: boolean
  autocorrect?: boolean
  spellCheck?: boolean
  bottomed?: boolean
}) {
  const rounded = getRoundedClass(labelled, bottomed)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    function textAreaAdjust(element: HTMLElement) {
      element.style.height = '1px'
      element.style.height = 16 + element.scrollHeight + 'px'
    }

    if (autosize && ref.current) {
      textAreaAdjust(ref.current)
    }
  }, [autosize, ref])

  return (
    <textarea
      id={id}
      ref={ref}
      readOnly={readOnly}
      autoComplete={autocomplete === false ? 'off' : undefined}
      autoCorrect="off"
      spellCheck={spellCheck === false ? false : undefined}
      onChange={onChange}
      className={clsx(
        className,
        rounded,
        'resize-none p-16 bg-zinc-50 h-20vh w-full',
        loading ? 'opacity-50' : undefined,
      )}
      value={value}
    />
  )
}
