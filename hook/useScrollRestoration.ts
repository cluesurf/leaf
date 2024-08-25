import { useEffect } from 'react'
import SingletonRouter, { Router } from 'next/router'

type Point = {
  x: number
  y: number
}

function saveScrollPos(url: string) {
  const scrollPos = { x: window.scrollX, y: window.scrollY }
  sessionStorage.setItem(url, JSON.stringify(scrollPos))
}

function restoreScrollPos(url: string) {
  const scrollPos = JSON.parse(
    sessionStorage.getItem(url) ?? '{ "x": 0, "y": 0 }',
  ) as Point

  if (scrollPos) {
    window.scrollTo(scrollPos.x, scrollPos.y)
  }
}

export default function useScrollRestoration(router: Router) {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      let shouldScrollRestore = false
      window.history.scrollRestoration = 'manual'
      restoreScrollPos(router.asPath)

      const onRouteChangeStart = () => {
        saveScrollPos(router.asPath)
      }

      const onRouteChangeComplete = (url: string) => {
        if (shouldScrollRestore) {
          shouldScrollRestore = false
          restoreScrollPos(url)
        }
      }

      SingletonRouter.events.on('routeChangeStart', onRouteChangeStart)
      SingletonRouter.events.on(
        'routeChangeComplete',
        onRouteChangeComplete,
      )
      SingletonRouter.beforePopState(() => {
        shouldScrollRestore = true
        return true
      })

      return () => {
        SingletonRouter.events.off(
          'routeChangeStart',
          onRouteChangeStart,
        )
        SingletonRouter.events.off(
          'routeChangeComplete',
          onRouteChangeComplete,
        )
        SingletonRouter.beforePopState(() => true)
      }
    }
  }, [router])
}
