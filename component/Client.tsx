import React from 'react'
import { AppSettings, AppSettingsContext } from '~/hook/useAppSettings'
import { DataStorageContextProvider } from '~/hook/useDataStorage'
import { FontProvider } from '~/hook/useConfiguration'

export default function Client({
  settings,
  children,
}: {
  children: React.ReactNode
  settings: AppSettings
}) {
  return (
    <AppSettingsContext.Provider value={settings}>
      <FontProvider>
        <DataStorageContextProvider>
          {children}
        </DataStorageContextProvider>
      </FontProvider>
    </AppSettingsContext.Provider>
  )
}
