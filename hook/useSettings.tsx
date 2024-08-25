import { useContext } from 'react'
import type { Setting } from '~/component/provider/Settings'
import { SettingsContext } from '~/context/SettingsContext'

export default function useSettings<S extends Setting | string>(
  name: S,
) {
  const settings = useContext(SettingsContext) as any
  return settings[name]
}
