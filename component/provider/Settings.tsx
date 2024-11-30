'use client'

import React, { useEffect, useState } from 'react'
import {
  SettingsContext,
  Settings as SettingsType,
} from '~/context/SettingsContext'

export type Setting = keyof SettingsType

export type SettingsInput = Record<string, any>

const DEFAULT_SETTINGS = {}

export default function Settings({
  value,
  children,
}: {
  value?: any
  children: React.ReactNode
}) {
  const [state, setState] = useState(value ?? DEFAULT_SETTINGS)

  useEffect(() => {
    setState(value ?? DEFAULT_SETTINGS)
  }, [value])

  return (
    <SettingsContext.Provider value={state}>
      {children}
    </SettingsContext.Provider>
  )
}
