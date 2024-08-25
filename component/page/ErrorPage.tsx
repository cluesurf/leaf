import React from 'react'
import { H1, P } from '~/component/Content'
import { Button } from '~/component/Button'

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
  return (
    <div className="relative">
      <div className="px-16 flex flex-col gap-16 items-center">
        <H1 className="text-center">Error</H1>
        <P>Something went wrong!</P>
        {error.stack && (
          <P className="whitespace-pre overflow-x-auto">
            {error.stack}
          </P>
        )}
        <div className="flex justify-center">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </div>
      {children}
    </div>
  )
}
