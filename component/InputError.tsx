import React, { MutableRefObject } from 'react'

export default function InputError({
  children,
  errorRef,
}: {
  children: React.ReactNode
  errorRef?: MutableRefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={errorRef}
      className="rounded-b-sm bg-rose-400 px-16 py-8 text-zinc-50 whitespace-pre-wrap"
    >
      {children}
    </div>
  )
}
