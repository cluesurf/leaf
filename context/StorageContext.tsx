import { createContext } from 'react'

export type StorageContextInput = {
  get: (key: string, isTemporary?: boolean) => object
  set: (key: string, value: object, isTemporary?: boolean) => void
}

const StorageContext = createContext<StorageContextInput>({
  get: () => {
    return {}
  },
  set: () => {},
})

export default StorageContext
