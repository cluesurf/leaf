import React, {
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useLayoutEffect,
} from 'react'
import {
  FontDataType,
  GoogleFontDeclaration,
  loadFonts,
} from '~/constant/font'

export type FontContextInput = {
  fonts: Record<string, boolean>
  update: Dispatch<SetStateAction<Record<string, boolean>>>
}

export const FontContext = createContext<FontContextInput>({
  fonts: {},
  update: (fonts: SetStateAction<Record<string, boolean>>) => {},
})

export function FontProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [fonts, setFonts] = useState<Record<string, boolean>>({})

  const state = useMemo(
    () => ({
      fonts,
      update: setFonts,
    }),
    [fonts],
  )

  return (
    <FontContext.Provider value={state}>
      {children}
    </FontContext.Provider>
  )
}

export default function useFonts(
  list: Array<FontDataType | GoogleFontDeclaration> = [],
) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasWaited, setHasWaited] = useState(false)
  const state = useContext(FontContext)

  useLayoutEffect(() => {
    const fonts = list.reduce<Record<string, boolean>>((m, x) => {
      m[x.family] = false
      return m
    }, {})
    state.update(f => ({ ...f, ...fonts }))
    loadFonts(list)
      .then(() => {
        setIsLoaded(true)
        const fonts = list.reduce<Record<string, boolean>>((m, x) => {
          m[x.family] = true
          return m
        }, {})
        state.update(f => ({ ...f, ...fonts }))
      })
      .catch(e => {
        console.error(e)
        setIsLoaded(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.map(x => x.family).join(':')])

  return isLoaded
}
