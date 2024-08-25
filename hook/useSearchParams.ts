import { createContext, useEffect, useMemo, useState } from 'react'

export const useSearchParams = () => {
  const [path, setPath] = useState(
    typeof window === 'undefined' ? 'http://n' : window.location.href,
  )
  const searchParams = useMemo(() => {
    const url = new URL(path)
    return url.searchParams
  }, [path])

  useEffect(() => {
    const handleChange = () => {
      setPath(window.location.href)
    }

    window.addEventListener('popstate', handleChange)
    window.addEventListener('pushstate', handleChange)

    return () => {
      window.removeEventListener('popstate', handleChange)
      window.removeEventListener('pushstate', handleChange)
    }
  }, [])

  return searchParams
}
