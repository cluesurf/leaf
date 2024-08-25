import React, { useContext, useEffect, useState } from 'react'
import { AppSettings } from '~/hook/useAppSettings'
import Client from '~/component/Client'
import { BaseCodeProvider } from '~/hook/useBaseCode'
import { DEFAULT_SETTINGS } from '~/constant/setting'
import uniq from 'lodash/uniq'

export type Settings = AppSettings

export const SettingsContext = React.createContext<Settings>({
  FONT: {},
})

const SETTINGS = {
  FONT: async () => DEFAULT_SETTINGS.fonts,
}

export type Setting = keyof typeof SETTINGS

export function Settings({
  needs,
  children,
}: {
  needs: Array<Setting>
  children: React.ReactNode
}) {
  const [state, setState] = useState<Record<Setting, any>>({
    FONT: DEFAULT_SETTINGS.fonts,
  } as Record<Setting, any>)

  useEffect(() => {
    Promise.all(
      uniq(needs.concat(['FONT'])).map(need => {
        // console.log(need)
        return SETTINGS[need]().then(data => ({ need, data }))
      }),
    ).then(results => {
      const state = results.reduce(
        (m, x) => {
          m[x.need] = x.data
          return m
        },
        {} as Record<Setting, any>,
      )

      setState(state)
    })
  }, [needs.join(':')])

  return (
    <Client settings={state}>
      <SettingsContext.Provider value={state}>
        <BaseCodeProvider path="/base/code">
          {children}
        </BaseCodeProvider>
      </SettingsContext.Provider>
    </Client>
  )
}

export default function useSettings() {
  return useContext(SettingsContext)
}
