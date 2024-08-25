import React from 'react'
import { H1, P } from '~/component/Content'

export default function NotFoundPage({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="px-16 flex flex-col gap-16 items-center">
        <H1 className="font-bold text-h1 text-center">Not Found</H1>
        <P>
          Sorry but the page you are looking for doesn&apos;t seem to
          exist. More tools below or try searching again.
        </P>
      </div>
      {children}
    </div>
  )
}
