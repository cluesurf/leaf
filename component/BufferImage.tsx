/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from 'react'

export const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

export type BufferImageInput = Omit<
  React.ComponentPropsWithoutRef<'img'>,
  'content'
> & {
  content: ArrayBuffer | Blob | undefined
  maxWidth?: number
  maxHeight?: number
  naturalWidth?: number
}

export default function BufferImage({
  content,
  maxWidth,
  maxHeight,
  naturalWidth,
  ...props
}: BufferImageInput) {
  const [string, setString] = useState(PIXEL)
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    if (naturalWidth) {
      ref.current.width = ref.current.naturalWidth * naturalWidth
    }
  }, [ref, naturalWidth])

  useEffect(() => {
    let blob

    const c: any = content

    if (c instanceof ArrayBuffer) {
      blob = new Blob([c])
    } else {
      blob = c
    }

    const r = new FileReader()
    r.onload = () => {
      setString(r.result as string)
    }
    if (blob) {
      r.readAsDataURL(blob)
    }

    // blob?.arrayBuffer().then(buffer => {
    //   const psdFile = Psd.parse(buffer)
    //   const context = canvasElement.getContext('2d')
    //   const compositeBuffer = await psdFile.composite()
    //   const imageData = new ImageData(
    //     compositeBuffer as Uint8ClampedArray,
    //     psdFile.width as number,
    //     psdFile.height as number,
    //   )
    //   setShowCanvas(true)

    //   canvasElement.width = psdFile.width
    //   canvasElement.height = psdFile.height

    //   context?.putImageData(imageData, 0, 0)
    // })
  }, [content])

  return (
    <img
      {...props}
      src={string}
      ref={ref}
    />
  )
}
