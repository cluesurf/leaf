import React from 'react'
import { H1, P } from '~/component/Content'
import useScripts from '~/hook/useScripts'

export default function NotFoundPage({
  children,
}: {
  children?: React.ReactNode
}) {
  useScripts(['code'])

  return (
    <div className="relative mt-64">
      <H1>Not Found</H1>
      {children}
    </div>
  )
}
