'use client'

import React, { useEffect, useMemo, useState } from 'react'
import FontContext from '~/context/FontsContext'
import merge from 'lodash/merge'

let FONTS = {}

function updateGlobalFonts(fonts: Record<string, boolean>) {
  merge(FONTS, fonts)
}

export default function Fonts({
  children,
}: {
  children: React.ReactNode
}) {
  const [fonts, setFonts] = useState<Record<string, boolean>>(FONTS)

  const state = useMemo(
    () => ({
      fonts,
      update: setFonts,
    }),
    [fonts],
  )

  useEffect(() => {
    updateGlobalFonts(fonts)
  }, [fonts])

  return (
    <FontContext.Provider value={state}>
      {children}
    </FontContext.Provider>
  )
}
