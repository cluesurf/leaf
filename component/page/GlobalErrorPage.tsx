import React from 'react'
import { ErrorPageInput } from '~/component/page/ErrorPage'
import { H1, P } from '~/component/Content'
import { Button } from '~/component/Button'

export default function GlobalErrorPage({
  error,
  reset,
  children,
}: ErrorPageInput) {
  return (
    <div className="relative">
      <H1 className="text-center">Error</H1>
      <P>Something went wrong!</P>
      <P className="whitespace-pre-wrap">{error.digest}</P>
      <div className="flex justify-center">
        <Button onClick={() => reset()}>Try again</Button>
      </div>
      {children}
    </div>
  )
}
