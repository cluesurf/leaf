import useViewportDimensions from './useViewportDimensions'

export default function usePortrait() {
  const viewport = useViewportDimensions()
  // const matchesViewport = typeof window !== 'undefined'
  //   ? window.matchMedia('screen and (max-device-width: 500px)')?.matches
  //   : false
  return viewport.width <= 500
}
