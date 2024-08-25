import React, { useState, useLayoutEffect, createContext } from 'react'

function getViewportDimensions() {
  const { innerWidth: width, innerHeight: height } =
    typeof window === 'undefined'
      ? { innerHeight: 0, innerWidth: 0 }
      : window

  return {
    height,
    width,
  }
}

export const ViewportDimensionsContext = createContext({
  width: 0,
  height: 0,
})

export function ViewportDimensions({
  children,
}: {
  children: React.ReactNode
}) {
  const dimensions = useViewportDimensions()

  return (
    <ViewportDimensionsContext.Provider value={dimensions}>
      {children}
    </ViewportDimensionsContext.Provider>
  )
}

export default function useViewportDimensions() {
  const [windowDimensions, setViewportDimensions] = useState({
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    function handleResize() {
      setViewportDimensions(getViewportDimensions())
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowDimensions
}
