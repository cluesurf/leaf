import React, { useEffect, useState } from 'react'
import {
  SettingsContext,
  Settings as SettingsType,
} from '~/context/SettingsContext'

export type Setting = keyof SettingsType

export type SettingsInput = Record<Setting, () => Promise<any>>

export default function Settings({
  value = {},
  children,
}: {
  value?: object
  children: React.ReactNode
}) {
  const [state, setState] = useState<SettingsType>({})
  const keys = Object.keys(value)

  useEffect(() => {
    Promise.all(
      keys.map(key => {
        return value[key]().then(data => ({ key, data }))
      }),
    ).then(results => {
      const state = results.reduce((m, x) => {
        m[x.key] = x.data
        return m
      }, {} as SettingsInput)

      setState(state as SettingsType)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join(':')])

  return (
    <SettingsContext.Provider value={state}>
      {children}
    </SettingsContext.Provider>
  )
}
