import React from 'react'
import Settings, { SettingsInput } from '~/component/provider/Settings'
import Fonts from '~/component/provider/Fonts'
import { Storage } from '~/component/provider/Storage'

export default function Provider({
  children,
  settings,
}: {
  settings?: SettingsInput
  children: React.ReactNode
}) {
  return (
    <Settings value={settings}>
      <Fonts>
        <Storage>{children}</Storage>
      </Fonts>
    </Settings>
  )
}
