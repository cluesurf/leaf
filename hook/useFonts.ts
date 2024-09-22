import { useContext, useLayoutEffect, useState } from 'react'
import { FontName } from '~/constant/font'
import FontsContext from '~/context/FontsContext'
import { Font, loadFonts } from '~/utility/font'
import useSettings from './useSettings'

export default function useFonts(list: Array<FontName> = []) {
  const state = useContext(FontsContext)
  const FONT = useSettings('fonts')

  useLayoutEffect(() => {
    const fonts: Array<Font> = FONT
      ? list.map(family => FONT[family])
      : []

    for (const font of fonts) {
      loadFonts([font])
        .then(() => {
          state.update(f => ({ ...f, [font.family]: true }))
        })
        .catch(e => {
          console.error(e)
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.join(':'), FONT])
}
