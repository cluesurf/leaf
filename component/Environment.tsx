import React from 'react'
import { SettingsInput } from '~/component/provider/Settings'
import Provider from '~/component/provider'
import Layout, { LayoutInput } from '~/component/Layout'
import { Store, UnknownAction } from 'redux'

export default function Environment({
  children,
  settings,
  store,
  ...layout
}: {
  settings?: SettingsInput
  store: Store<any, UnknownAction, unknown>
  children: React.ReactNode
} & LayoutInput) {
  return (
    <Provider
      store={store}
      settings={settings}
    >
      <Layout {...layout}>{children}</Layout>
    </Provider>
  )
}
