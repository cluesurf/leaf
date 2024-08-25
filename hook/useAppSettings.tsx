import { createContext, useContext } from 'react'

export const AppSettingsContext = createContext<AppSettings>({
  MIME_TYPE: {},
  FONT: {},
})

export type AppSettings = {
  MIME_TYPE?: any
  FONT?: any
}

export function useAppSettings() {
  return useContext(AppSettingsContext)
}
