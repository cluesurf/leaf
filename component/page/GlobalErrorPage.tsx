import React from 'react'
import { ErrorPageInput } from '~/component/page/ErrorPage'
import { H1, P } from '~/component/Content'
import { Button } from '~/component/Button'
import useScripts from '~/hook/useScripts'

export default function GlobalErrorPage({
  error,
  reset,
  children,
}: ErrorPageInput) {
  useScripts(['code'])

  return (
    <div className="relative mt-64">
      <H1>Error</H1>
      <P>Something went wrong!</P>
      <P className="whitespace-pre-wrap">{error.digest}</P>
      <div className="flex justify-center">
        <Button onClick={() => reset()}>Try again</Button>
      </div>
      {children}
    </div>
  )
}
