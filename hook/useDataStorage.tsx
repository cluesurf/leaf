import { useContext, useLayoutEffect, useState } from 'react'
import StorageContext from '~/context/StorageContext'

const STORED: [any, any] = [undefined, undefined]

export default function useStorage<T>(key: string, def: T) {
  const stored = useContext(StorageContext)
  const [state, setState] = useState<T>(def)

  useLayoutEffect(() => {
    const saved = stored.get(key)
    if (saved) {
      setState(saved as T)
    }
  }, [stored, key])

  STORED[0] = stored
  STORED[1] = state

  return STORED
}
