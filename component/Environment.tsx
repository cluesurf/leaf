import React from 'react'
import { SettingsInput } from '~/component/provider/Settings'
import Provider from '~/component/provider'
import Layout, { LayoutInput } from '~/component/Layout'

export default function Environment({
  children,
  settings,
  ...layout
}: {
  settings?: SettingsInput
  children: React.ReactNode
} & LayoutInput) {
  return (
    <Provider settings={settings}>
      <Layout {...layout}>{children}</Layout>
    </Provider>
  )
}
