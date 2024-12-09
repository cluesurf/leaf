import React from 'react'
import NextImage from 'next/image'

export type ImageInput = {
  alt?: string
  h: number
  host?: string
  onClick?: () => void
  preview: string
  src: string
  w: number
  fill?: boolean
}

export default function Image({
  src,
  preview,
  w,
  h,
  alt = '',
  onClick,
  fill,
}: ImageInput) {
  return (
    <NextImage
      onClick={onClick}
      fill={fill}
      style={{
        borderRadius: 4,
        lineHeight: '1.7',
        // boxShadow: theme.shadows.thick,
        height: 'auto',
        width: '100%',
        fontFamily: 'Noto Sans Mono',
      }}
      alt={alt}
      placeholder="blur"
      blurDataURL={preview}
      width={w}
      height={h}
      src={src}
      unoptimized
    />
  )
}
