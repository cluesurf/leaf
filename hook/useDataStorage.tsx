/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import * as storage from '~/utility/storage'

export type DataStorageContextInput = {
  get: (key: string, isTemporary?: boolean) => object
  set: (key: string, value: object, isTemporary?: boolean) => void
}

export const DataStorageContext =
  createContext<DataStorageContextInput>({
    get: () => {
      return {}
    },
    set: () => {},
  })

export type DataStorageContextProviderInput = {
  children: React.ReactNode
}

const DEFAULT: Record<string, any> = {}

const STORED: [any, any] = [undefined, undefined]

export function useDataStorage<T>(key: string, def: any) {
  const stored = useContext(DataStorageContext)
  const [state, setState] = useState<T>(def)

  useLayoutEffect(() => {
    const saved = stored.get(key)
    if (saved) {
      setState(saved as T)
    }
  }, [stored])

  STORED[0] = stored
  STORED[1] = state

  return STORED
}

export function DataStorageContextProvider({
  children,
}: DataStorageContextProviderInput) {
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

  const set = useCallback(
    (key: string, data: object) => {
      storage.set(key, data)
      setStored(s => ({ ...s, [key]: data }))
    },
    [stored],
  )

  const state = useMemo(
    () => ({
      get: get,
      set: set,
    }),
    [set, get],
  )

  return (
    <DataStorageContext.Provider value={state}>
      {children}
    </DataStorageContext.Provider>
  )
}
