import { createContext, Dispatch, SetStateAction } from 'react'

export type FontsContextInput = {
  fonts: Record<string, boolean>
  update: Dispatch<SetStateAction<Record<string, boolean>>>
}

const FontsContext = createContext<FontsContextInput>({
  fonts: {},
  update: (fonts: SetStateAction<Record<string, boolean>>) => {},
})

export default FontsContext
