'use client'

import React, { useCallback, useMemo, useState } from 'react'
import StorageContext from '~/context/StorageContext'
import * as storage from '~/utility/storage'

export type StorageInput = {
  children: React.ReactNode
}

const DEFAULT: Record<string, any> = {}

export function Storage({ children }: StorageInput) {
  const [stored, setStored] = useState<Record<string, any>>(DEFAULT)

  const get = useCallback(
    (key: string) => {
      if (key in stored) {
        return stored[key]
      }

      return storage.get(key)
    },
    [stored],
  )

  const set = useCallback((key: string, data: object) => {
    storage.set(key, data)
    setStored(s => ({ ...s, [key]: data }))
  }, [])

  const state = useMemo(
    () => ({
      get: get,
      set: set,
    }),
    [set, get],
  )

  return (
    <StorageContext.Provider value={state}>
      {children}
    </StorageContext.Provider>
  )
}
