import React from 'react'
import { SettingsInput } from '~/component/provider/Settings'
import Provider from '~/component/provider'
import Layout, { LayoutInput } from '~/component/Layout'
import { Store, UnknownAction } from 'redux'
import { Base, QueryResolvers } from '~/hook/usePageSettings'

export default function Environment({
  children,
  settings,
  store,
  path,
  base,
  cached,
  queryResolvers,
  ...layout
}: {
  settings?: SettingsInput
  store: Store<any, UnknownAction, unknown>
  children: React.ReactNode
  path?: string
  base?: Base
  cached?: Base
  queryResolvers?: QueryResolvers
} & LayoutInput) {
  return (
    <Provider
      store={store}
      settings={settings}
      path={path}
      base={base}
      cached={cached}
      queryResolvers={queryResolvers}
    >
      <Layout {...layout}>{children}</Layout>
    </Provider>
  )
}
