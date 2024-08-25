import React, { ChangeEvent } from 'react'
import Input, { InputInput } from './Input'

export type TextInputInput = Omit<InputInput, 'onChange' | 'accept'> & {
  accept?: RegExp
  onChange?: (text?: string) => void
}

export default function TextInput({
  accept,
  onChange,
  ...props
}: TextInputInput) {
  const handleChange = (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value
    if (accept && value != null && !value.match(accept)) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      onChange?.(value)
    }
  }

  return (
    <Input
      onChange={handleChange}
      {...props}
    />
  )
}
