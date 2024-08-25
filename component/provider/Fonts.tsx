import React, { useMemo, useState } from 'react'
import FontContext from '~/context/FontsContext'

export default function Fonts({
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
