import { FocusEvent, useEffect, useRef } from 'react'
import { useInteractionManager } from '~/hook/useInteractionManager'
import NumberInput, { NumberInputInput } from '../NumberInput'

export default function INumberInput({
  onChange,
  onFocus,
  onBlur,
  id,
  ...input
}: NumberInputInput & { id: string }) {
  const manager = useInteractionManager()
  const ref = useRef<HTMLInputElement>(null)
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    manager.setMode('delegate')
    onFocus?.(e)
  }
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    manager.setMode('default')
    onBlur?.(e)
  }

  useEffect(() => {
    const undo = (value: number) => {
      ref.current!.value = String(value)
      // const event = new Event('change')
      // ref.current!.dispatchEvent(event)
      onChange?.(value)
    }

    const redo = (value: number) => {
      ref.current!.value = String(value)
      // const event = new Event('change')
      // ref.current!.dispatchEvent(event)
      onChange?.(value)
    }

    const capture = () => parseInt(ref.current!.value)

    manager.attach(id, { undo, redo, capture })

    return () => {
      manager.detach(id)
    }
  }, [ref])

  const handleChange = (n: number) => {
    manager.push({ [id]: n })
    onChange?.(n)
  }

  return (
    <NumberInput
      inputRef={ref}
      id={id}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...input}
    />
  )
}
