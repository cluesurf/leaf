import { useContext, useLayoutEffect, useState } from 'react'
import { FontName } from '~/constant/font'
import FontsContext from '~/context/FontsContext'
import { Font, loadFonts } from '~/utility/font'
import useSettings from './useSettings'

const DEFAULT_FONT = {}

export default function useFonts(list: Array<FontName> = []) {
  const state = useContext(FontsContext)
  const FONT = useSettings('fonts') ?? DEFAULT_FONT

  useLayoutEffect(() => {
    const fonts: Array<Font> = FONT
      ? list.map(family => FONT[family]).filter(x => x)
      : []

    for (const font of fonts) {
      if (state.fonts[font.family]) {
        continue
      }

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
