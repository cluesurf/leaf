import { useContext, useLayoutEffect, useState } from 'react'
import { FontName } from '~/constant/font'
import FontsContext from '~/context/FontsContext'
import { Font, loadFonts } from '~/utility/font'
import useSettings from './useSettings'

export default function useFonts(list: Array<FontName> = []) {
  const [isLoaded, setIsLoaded] = useState(false)
  const state = useContext(FontsContext)
  const FONT = useSettings('fonts')

  useLayoutEffect(() => {
    const fonts: Array<Font> = FONT
      ? list.map(family => FONT[family])
      : []
    loadFonts(fonts)
      .then(() => {
        setIsLoaded(true)

        const fonts = list.reduce<Record<string, boolean>>(
          (m, family) => {
            if (FONT && FONT[family]) {
              m[family] = true
            }
            return m
          },
          {},
        )

        state.update(f => ({ ...f, ...fonts }))
      })
      .catch(e => {
        console.error(e)
        setIsLoaded(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.join(':'), FONT])

  return isLoaded
}
