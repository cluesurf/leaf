import { FocusEvent, useEffect, useRef } from 'react'
import { useInteractionManager } from '~/hook/useInteractionManager'
import NativeSelect, { NativeSelectInput } from '../NativeSelect'

export default function ISelectInput<T extends string>({
  onFocus,
  onBlur,
  onChange,
  id,
  ...input
}: NativeSelectInput<T> & { id: string }) {
  const manager = useInteractionManager()
  const ref = useRef<HTMLSelectElement>(null)
  const handleFocus = (e: FocusEvent<HTMLSelectElement>) => {
    manager.setMode('delegate')
    onFocus?.(e)
  }
  const handleBlur = (e: FocusEvent<HTMLSelectElement>) => {
    manager.setMode('default')
    onBlur?.(e)
  }

  useEffect(() => {
    const undo = (value: T) => {
      ref.current!.value = String(value)
      const event = new Event('change')
      ref.current!.dispatchEvent(event)
      // onChange?.(value)
    }

    const redo = (value: T) => {
      ref.current!.value = String(value)
      const event = new Event('change')
      ref.current!.dispatchEvent(event)
      // onChange?.(value)
    }

    const capture = () => parseInt(ref.current!.value)

    manager.attach(id, { undo, redo, capture })

    return () => {
      manager.detach(id)
    }
  }, [ref])

  const handleChange = (n: T) => {
    manager.push({ [id]: n })
    onChange?.(n)
  }

  return (
    <NativeSelect<T>
      ref={ref}
      id={id}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...input}
    />
  )
}
