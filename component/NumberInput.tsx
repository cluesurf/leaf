import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import Input, { InputInput } from './Input'
import { useInteractionManager } from '~/hook/useInteractionManager'

export type NumberInputInput = Omit<
  InputInput,
  'onChange' | 'value'
> & {
  onChange?: (n: number) => void
  onFormat?: (n: number) => string
  value?: number
}

export default function NumberInput({
  min,
  max,
  step = 1,
  value,
  onChange,
  onFormat,
  ...props
}: NumberInputInput) {
  const minNumber = min != null ? parseFloat(min as string) : undefined
  const maxNumber = max != null ? parseFloat(max as string) : undefined
  const valueNumber = value != null ? value : undefined
  const inputRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState(
    value != null
      ? String(onFormat && value != null ? onFormat(value) : value)
      : '',
  )
  const [candidate, setCandidate] = useState(valueNumber)

  useEffect(() => {
    setText(valueNumber != null ? String(valueNumber) : '')
  }, [valueNumber, value])

  const handleKeyDown = (event: KeyboardEvent) => {
    // if (manager.mode !== 'delegate') {
    //   return
    // }

    let newN = valueNumber ? valueNumber : 0
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      event.stopPropagation()

      newN = newN - Number(step)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      event.stopPropagation()

      newN = newN + Number(step)
    } else if (event.key === 'a' && event.metaKey) {
      event.preventDefault()
      event.stopPropagation()

      document.execCommand('selectAll')
      return
    } else if (
      event.key === 'ArrowLeft' &&
      event.altKey &&
      event.shiftKey
    ) {
      event.preventDefault()
      event.stopPropagation()

      if (
        inputRef.current &&
        inputRef.current.selectionStart != null &&
        inputRef.current.selectionEnd != null &&
        inputRef.current.selectionDirection != null
      ) {
        createSelection(
          inputRef.current,
          inputRef.current.selectionStart - 1,
          inputRef.current.selectionEnd,
        )
      }

      // document.execCommand('selectAll')
      return
    } else if (
      event.key === 'ArrowRight' &&
      event.altKey &&
      event.shiftKey
    ) {
      event.preventDefault()
      event.stopPropagation()

      if (
        inputRef.current &&
        inputRef.current.selectionStart != null &&
        inputRef.current.selectionEnd != null &&
        inputRef.current.selectionDirection != null
      ) {
        createSelection(
          inputRef.current,
          inputRef.current.selectionStart - 1,
          inputRef.current.selectionEnd,
        )
      }

      // document.execCommand('selectAll')
      return
    } else if (
      event.key === 'ArrowLeft' &&
      event.metaKey &&
      event.shiftKey
    ) {
      event.preventDefault()
      event.stopPropagation()

      if (
        inputRef.current &&
        inputRef.current.selectionStart != null &&
        inputRef.current.selectionEnd != null &&
        inputRef.current.selectionDirection != null
      ) {
        createSelection(
          inputRef.current,
          0,
          inputRef.current.selectionEnd,
        )
      }

      // document.execCommand('selectAll')
      return
    } else if (
      event.key === 'ArrowRight' &&
      event.metaKey &&
      event.shiftKey
    ) {
      event.preventDefault()
      event.stopPropagation()

      if (
        inputRef.current &&
        inputRef.current.selectionStart != null &&
        inputRef.current.selectionEnd != null &&
        inputRef.current.selectionDirection != null
      ) {
        createSelection(
          inputRef.current,
          inputRef.current.selectionStart - 1,
          inputRef.current.value.length,
        )
      }

      // document.execCommand('selectAll')
      return
    } else if (event.key === 'ArrowLeft' && event.metaKey) {
      event.preventDefault()
      event.stopPropagation()

      if (
        inputRef.current &&
        inputRef.current.selectionStart != null &&
        inputRef.current.selectionEnd != null &&
        inputRef.current.selectionDirection != null
      ) {
        createSelection(inputRef.current, 0, 0)
      }

      // document.execCommand('selectAll')
      return
    } else if (event.key === 'ArrowRight' && event.metaKey) {
      event.preventDefault()
      event.stopPropagation()

      if (
        inputRef.current &&
        inputRef.current.selectionStart != null &&
        inputRef.current.selectionEnd != null &&
        inputRef.current.selectionDirection != null
      ) {
        createSelection(
          inputRef.current,
          inputRef.current.value.length,
          inputRef.current.value.length,
        )
      }

      // document.execCommand('selectAll')
      return
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()

      if (
        inputRef.current &&
        inputRef.current.selectionStart != null &&
        inputRef.current.selectionEnd != null &&
        inputRef.current.selectionDirection != null
      ) {
        createSelection(
          inputRef.current,
          Math.max(inputRef.current.selectionStart - 1, 0),
          Math.max(inputRef.current.selectionStart - 1, 0),
        )
      }

      // document.execCommand('selectAll')
      return
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()

      if (
        inputRef.current &&
        inputRef.current.selectionStart != null &&
        inputRef.current.selectionEnd != null &&
        inputRef.current.selectionDirection != null
      ) {
        createSelection(
          inputRef.current,
          Math.min(
            inputRef.current.selectionEnd + 1,
            inputRef.current.value.length,
          ),
          Math.min(
            inputRef.current.selectionEnd + 1,
            inputRef.current.value.length,
          ),
        )
      }

      // document.execCommand('selectAll')
      return
    } else if (
      !event.key.match(/^([-\.]|[0-9]|Tab|Escape|Backspace)$/)
    ) {
      event.preventDefault()
      event.stopPropagation()
      return
    } else {
      return
    }

    if (maxNumber != null && newN > maxNumber && newN !== valueNumber) {
      newN = maxNumber
    } else if (
      minNumber != null &&
      newN < minNumber &&
      newN !== valueNumber
    ) {
      newN = minNumber
    }

    if (newN !== valueNumber) {
      document.execCommand('selectAll')
      document.execCommand(
        'insertText',
        false,
        String(onFormat ? onFormat(newN) : newN),
      )
    }
  }

  const handleChange = (event: ChangeEvent) => {
    const input = (event.target as HTMLInputElement).value

    if (!input) {
      setText(input)
      if (minNumber != null) {
        setCandidate(minNumber)
      }
      return
    } else if (!input.match(/^-?\d+(.(?:\d+)?)?$/)) {
      return
    }

    let newN = roundToFractionOfPercent(
      parseFloat(input),
      parseFloat(String(step)),
    )

    if (maxNumber && newN > maxNumber && newN !== valueNumber) {
      // return
      newN = maxNumber
      setCandidate(newN)
      setText(input)
    } else if (minNumber && newN < minNumber && newN !== valueNumber) {
      // return
      newN = minNumber
      setCandidate(newN)
      setText(input)
    } else {
      setCandidate(undefined)
      setText(input)
      onChange?.(newN)
    }
  }

  const handleBlur = () => {
    const inputNumber = text ? parseFloat(text) : undefined
    if (candidate != null && inputNumber !== candidate) {
      onChange?.(candidate ?? 0)
      setText(String(candidate ?? 0))
    } else if (inputNumber !== valueNumber) {
      onChange?.(valueNumber ?? 0)
      setText(String(valueNumber ?? 0))
    } else if (onFormat && valueNumber != null) {
      const formatted = onFormat(valueNumber)
      const string = String(valueNumber)
      if (string !== formatted) {
        setText(formatted)
      }
    }
    setCandidate(undefined)
  }

  return (
    <Input
      value={text}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode="decimal"
      {...props}
      ref={inputRef}
    />
  )
}

function roundToFractionOfPercent(value: number, step: number) {
  const scalingFactor = 1e10 // 10 to the power of 10
  const scaledValue = value * scalingFactor
  const scaledStep = step * scalingFactor
  return (
    (Math.round(scaledValue / scaledStep) * scaledStep) / scalingFactor
  )
}

function createSelection(
  field: HTMLInputElement,
  start: number,
  end: number,
  direction: 'backward' | 'forward' | 'none' = 'none',
) {
  if (field.setSelectionRange) {
    field.focus()
    field.setSelectionRange(start, end, direction)
  } else if (typeof field.selectionStart != 'undefined') {
    field.selectionStart = start
    field.selectionEnd = end
    field.focus()
  }
}
