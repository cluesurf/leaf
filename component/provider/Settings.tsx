import React, { useEffect, useState } from 'react'
import {
  SettingsContext,
  Settings as SettingsType,
} from '~/context/SettingsContext'

export type Setting = keyof SettingsType

export type SettingsInput = Record<string, () => Promise<any>>

export default function Settings({
  value,
  children,
}: {
  value?: any
  children: React.ReactNode
}) {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
