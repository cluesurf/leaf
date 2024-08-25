import { useEffect, useLayoutEffect, useState } from 'react'

export type Mode = 'light' | 'dark'

export function useDarkMode() {
  const [mode, setMode] = useState<Mode>('light')

  useLayoutEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event: MediaQueryListEvent) => {
      const newColorScheme = event.matches ? 'dark' : 'light'

      setMode(newColorScheme)
    }

    media.addEventListener('change', handleChange)

    setMode(media.matches ? 'dark' : 'light')

    return () => media.removeEventListener('change', handleChange)
  }, [setMode])

  return mode
}
