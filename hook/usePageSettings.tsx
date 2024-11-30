'use client'

import kebabCase from 'lodash/kebabCase'
import defaults from 'lodash/defaults'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { get, set } from '~/utility/storage'
import { useSearchParams } from './useSearchParams'

export type Base = Record<string, any>

export type PageSettingsContext<S = Base, C = Base> = {
  stored: S
  setStored: (stored: S) => void
  cached: C
  setCached: (cached: C) => void
  isLoaded: boolean
}

export const PageSettingsContext = createContext<PageSettingsContext>({
  stored: {},
  setStored: () => {},
  cached: {},
  setCached: () => {},
  isLoaded: false,
})

export function usePageSettings<S = Base, C = Base>() {
  return useContext(PageSettingsContext) as PageSettingsContext<S, C>
}

function updateQueryParams(stored: Base, queryMap: QueryMap) {
  const query: Array<string> = []
  let hasKey = false
  for (const name in stored) {
    hasKey = true
    const transform =
      queryMap[name]?.to ?? ((val?: any | null) => String(val))
    if (stored[name] != null) {
      const value = transform(stored[name])
      if (value != null) {
        query.push(`${queryMap[name]?.key ?? kebabCase(name)}=${value}`)
      }
    }
  }

  if (hasKey) {
    query.sort()

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${query.join('&')}`,
    )
  }
}

function getQueryParams(
  base: Base,
  queryMap: QueryMap,
  query: URLSearchParams,
) {
  const queried: Record<string, string> = {}
  for (const name in base) {
    const transform =
      queryMap[name]?.from ?? ((val?: string | null) => val)
    const value = transform(
      query.get(queryMap[name]?.key ?? kebabCase(name)),
    )
    if (value) {
      queried[name] = value
    }
  }
  return queried
}

export type QueryMap = Record<
  string,
  {
    key?: string
    to?: (val?: any | null) => string | undefined
    from?: (val?: string | null) => any
  }
>

export const QueryFunction = {
  Boolean: {
    from: (val?: string | null) => val === 'yes',
    to: (val?: boolean | null) => (val === true ? 'yes' : 'no'),
  },
  Integer: {
    from: (val?: string | null) => parseInt(String(val ?? 0), 10),
    to: (val?: number | null) => String(val),
  },
}

export type PageSettingsInput = {
  path: string
  base?: Base
  cached?: Base
  queryMap?: QueryMap
}

export function PageSettings({
  path,
  base,
  cached: c = {},
  children,
  queryMap = {},
}: {
  children: React.ReactNode
} & PageSettingsInput) {
  const [stored, _setStored] = useState<Base>({})
  const query = useSearchParams()
  const [cached, setCached] = useState<Base>(c)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = get(path)
    const queried = getQueryParams(base ?? {}, queryMap, query)
    const next = defaults({}, queried, stored, base) as Base
    updateQueryParams(next, queryMap)
    _setStored(next)
    setIsLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setStored = useCallback(
    (stored: Base) => {
      set(path, stored)
      const next = defaults({}, stored, base)
      updateQueryParams(next, queryMap)
      _setStored(stored)
    },
    [path, base, queryMap],
  )

  return (
    <PageSettingsContext.Provider
      value={{ stored, setStored, cached, setCached, isLoaded }}
    >
      {children}
    </PageSettingsContext.Provider>
  )
}
