import React, { RefObject, useEffect, useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import SwipeListener from 'swipe-listener'

export default function SettingsOverlay({
  onHide,
  children,
}: {
  onHide?: () => void
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>

  const handleClickOutside = () => {
    onHide?.()
  }

  useEffect(() => {
    const closeOnEscapePressed = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onHide?.()
      }
    }

    window.addEventListener('keydown', closeOnEscapePressed)
    window.addEventListener('resize', handleClickOutside)

    return () => {
      window.removeEventListener('keydown', closeOnEscapePressed)
      window.removeEventListener('resize', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const handleSwipe = (e: any) => {
      const directions = e.detail.directions

      if (directions.bottom) {
        onHide?.()
      }
    }

    const swipe = SwipeListener(ref.current)
    const el = ref.current

    el.addEventListener('swipe', handleSwipe)

    return () => {
      el.removeEventListener('swipe', handleSwipe)
      swipe.off()
    }
  }, [])

  useOnClickOutside(ref, handleClickOutside)

  return (
    <div
      ref={ref}
      className="absolute shadow-3xl animate-fade-in-medium top-128 bottom-48 left-0 right-0"
    >
      <div className="absolute bg-white dark:bg-zinc-950 top-0 bottom-0 left-0 right-0"></div>
      <div className="h-full w-full overflow-y-auto pb-128">
        {children}
      </div>
    </div>
  )
}
