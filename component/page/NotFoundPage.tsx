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
      <H1 className="font-bold text-center uppercase scale-y-80 tracking-wide-015">
        Not Found
      </H1>
      <P>
        Sorry but the page you are looking for doesn&apos;t seem to
        exist. More tools below or try searching again.
      </P>
      {children}
    </div>
  )
}
