import React, { useMemo } from 'react'
import Masonry from './Masonry'
// import Figure, { ImageType } from './Figure'

type ImageGridInput = {
  // images: Array<ImageType>
  ordered?: boolean
}

export const breakpoints = {
  1024: 5,
  600: 3,
  default: 7,
}

export default function ImageGrid({
  // images,
  ordered = false,
}: ImageGridInput) {
  return null
  // const elements = useMemo(() => {
  //   if (!ordered) {
  //     shuffleArray(images)
  //   }

  //   return images.map(img => ({
  //     element: (
  //       <Figure
  //         key={img.sizes[256].src}
  //         small
  //         overlay
  //         {...img}
  //       />
  //     ),
  //     h: img.sizes[256].h,
  //     w: img.sizes[256].w,
  //   }))
  // }, [ordered, images])

  // return (
  //   <Masonry
  //     columnBreakpoints={breakpoints}
  //     gap={8}
  //     items={elements}
  //   />
  // )
}
