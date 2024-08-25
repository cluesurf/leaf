import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import {
  INPUT_COLOR,
  INPUT_WAITING,
  InputColor,
  getRoundedClass,
} from './Input'
import { useText } from './Text'
import { useAppSettings } from '~/hook/useAppSettings'

// https://react-dropzone.js.org/
export default function FileDropzone({
  color,
  children,
  className,
  accept,
  multiple,
  onDrop,
  topped,
  bottomed,
  borderClassName,
  font = 'Noto Sans Mono',
}: {
  font?: string | Array<string>
  color?: InputColor
  topped?: boolean
  bottomed?: boolean
  children: React.ReactNode
  className?: string
  accept?: Array<string>
  multiple?: boolean
  onDrop?: (files: Array<File>) => void
  borderClassName?: string
}) {
  const [isStarting, isFontReady, hasFontWaited, fontClassName] =
    useText(font)
  const { MIME_TYPE } = useAppSettings()

  const handleDrop = useCallback(
    (files: Array<File>) => {
      // Do something with the files
      onDrop?.(files)
    },
    [onDrop],
  )

  const acceptMap: Record<string, Array<string>> = {}

  if (accept?.length) {
    accept.forEach(key => {
      if (MIME_TYPE) {
        const data = MIME_TYPE[key]
        if (data) {
          acceptMap[data.mime] = data.extensions
        } else {
          throw new Error(key)
        }
      }
    })
  }

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: acceptMap,
    multiple,
  })

  const roundedClassName = getRoundedClass(topped, bottomed)

  const colorClass = color && INPUT_COLOR[color]
  const waitingColorClass = color && INPUT_WAITING[color]

  let backgroundColorClass
  let textColorClass

  if (isStarting || (isFontReady && hasFontWaited)) {
    backgroundColorClass = colorClass
    textColorClass = `text-gray-950 ${fontClassName}`
  } else if (hasFontWaited) {
    backgroundColorClass = waitingColorClass
    textColorClass = `text-transparent`
  } else {
    textColorClass = `text-transparent`
  }

  return (
    <div
      className={cx(
        className,
        roundedClassName,
        backgroundColorClass,
        textColorClass,
        'p-16 transition-all duration-200 relative cursor-pointer hover:opacity-70',
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div
        className={cx(
          'transition-all duration-200',
          'absolute top-0 bottom-0 right-0 left-0 border-4',
          isDragActive
            ? cx(borderClassName, roundedClassName, `border-dashed`)
            : undefined,
        )}
      />
      {children}
    </div>
  )
}
