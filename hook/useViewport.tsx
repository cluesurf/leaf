import React, { useState, useLayoutEffect, createContext } from 'react'

function getViewport() {
  const { innerWidth: width, innerHeight: height } =
    typeof window === 'undefined'
      ? { innerHeight: 0, innerWidth: 0 }
      : window

  return {
    height,
    width,
  }
}

export const ViewportContext = createContext({
  width: 0,
  height: 0,
  print: false,
})

export function Viewport({ children }: { children: React.ReactNode }) {
  const dimensions = useViewport()

  return (
    <ViewportContext.Provider value={dimensions}>
      {children}
    </ViewportContext.Provider>
  )
}

export default function useViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
  })
  const [print, setPrint] = useState(false)

  useLayoutEffect(() => {
    function handleResize() {
      setViewport(getViewport())
    }

    handleResize()

    window.addEventListener('beforeprint', () => {
      document.body?.classList.add('print-mode')
      setPrint(true)
    })

    window.addEventListener('afterprint', () => {
      document.body?.classList.remove('print-mode')
      setPrint(false)
    })

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { ...viewport, print }
}
