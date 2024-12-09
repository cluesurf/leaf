import React from 'react'
import { H1, P } from '~/component/Content'
import { Button } from '~/component/Button'
import useScripts from '~/hook/useScripts'

export type ErrorPageInput = {
  error: Error & { digest?: string }
  reset: () => void
  children?: React.ReactNode
}

export default function ErrorPage({
  error,
  reset,
  children,
}: ErrorPageInput) {
  useScripts(['code'])

  return (
    <div className="relative mt-64">
      <H1>Error</H1>
      <P>Something went wrong!</P>
      {error.stack && (
        <P className="whitespace-pre overflow-x-auto">{error.stack}</P>
      )}
      <div className="flex justify-center">
        <Button onClick={() => reset()}>Try again</Button>
      </div>
      {children}
    </div>
  )
}
