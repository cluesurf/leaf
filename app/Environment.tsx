'use client'

import LeafEnvironment from '~/component/Environment'
import { LayoutInput as LeafLayoutInput } from '~/component/Layout'
import { useLayoutEffect } from 'react'
import store, { Queries } from './redux'
import { FONT, SCRIPT } from '~/constant/settings'
import queries from './frontend/queries'

const settings = { fonts: FONT, scripts: SCRIPT }

export default function Environment({
  children,
  initializers,
  ...props
}: {
  children: React.ReactNode
  initializers?: Queries
} & LeafLayoutInput) {
  useLayoutEffect(() => {
    if (initializers) {
      for (const query in initializers) {
        const queryKey = query as keyof Queries
        const state = initializers[queryKey]

        if (state) {
          store.dispatch(
            queries.util.upsertQueryData(queryKey, undefined, state),
          )
        }
      }
    }
  }, [initializers])

  console.log('STORE', store)

  return (
    <LeafEnvironment
      store={store}
      settings={settings}
      {...props}
    >
      {children}
    </LeafEnvironment>
  )
}
