import { FocusEvent, useEffect, useRef } from 'react'
import { useInteractionManager } from '~/hook/useInteractionManager'
import TextInput, { TextInputInput } from '../TextInput'

export default function ITextInput({
  onChange,
  onFocus,
  onBlur,
  id,
  ...input
}: TextInputInput & { id: string }) {
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
    const undo = (value?: string) => {
      ref.current!.value = value ?? ''
      // const event = new Event('change')
      // ref.current!.dispatchEvent(event)
      onChange?.(value)
    }

    const redo = (value?: string) => {
      ref.current!.value = value ?? ''
      // const event = new Event('change')
      // ref.current!.dispatchEvent(event)
      onChange?.(value)
    }

    const capture = () => ref.current!.value

    manager.attach(id, { undo, redo, capture })

    return () => {
      manager.detach(id)
    }
  }, [ref])

  const handleChange = (val?: string) => {
    manager.push({ [id]: val })
    onChange?.(val)
  }

  return (
    <TextInput
      inputRef={ref}
      id={id}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...input}
    />
  )
}
