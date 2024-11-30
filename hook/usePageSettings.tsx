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
import omit from 'lodash/omit'

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

function updateQueryParams(base: Base, queryResolvers: QueryResolvers) {
  const query: Array<string> = []

  let hasKey = false
  for (const name in base) {
    hasKey = true

    const resolver = queryResolvers[name]!

    if (base[name] != null) {
      const value = resolver.to(base[name])
      if (value != null) {
        // If no default is defined,
        // or the default is not the current value,
        // then make it visible in the query param.
        if (
          !('default' in resolver) ||
          resolver.default !== base[name]
        ) {
          query.push(
            `${queryResolvers[name]?.key ?? kebabCase(name)}=${value}`,
          )
        }
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
  } else if (window.location.search) {
    window.history.replaceState({}, '', window.location.pathname)
  }
}

function getQueryParams(
  base: Base,
  queryResolvers: QueryResolvers,
  query: URLSearchParams,
) {
  const queried: Record<string, string> = {}

  for (const name in base) {
    const resolver = queryResolvers[name]

    if (resolver) {
      const value = resolver.from(
        query.get(queryResolvers[name]?.key ?? kebabCase(name)),
      )

      if (value != null) {
        if (!('default' in resolver) || resolver.default !== value) {
          queried[name] = value
        }
      }
    }
  }

  return queried
}

export type QueryResolvers = Record<
  string,
  {
    key?: string
    store?: boolean
    default?: any
    to: (val?: any | null) => string | undefined
    from: (val?: string | null) => any
  }
>

export const QueryResolver: QueryResolvers = {
  boolean: {
    from: (val?: string | null) => val === 'yes',
    to: (val?: boolean | null) => (val === true ? 'yes' : 'no'),
  },
  integer: {
    from: (val?: string | null) => parseInt(String(val ?? 0), 10),
    to: (val?: number | null) => (val ? String(val) : undefined),
  },
  decimal: {
    from: (val?: string | null) => parseFloat(String(val ?? 0)),
    to: (val?: number | null) => (val ? String(val) : undefined),
  },
  array: {
    from: (val?: string | null) => parseInt(String(val ?? 0), 10),
    to: (val?: Array<string> | null) => val?.join(','),
  },
  text: {
    from: (val?: string | null) => val?.replace(/\s+/g, '+'),
    to: (val?: string | null) => val?.replace(/\+/g, ' '),
  },
}

export type PageSettingsInput = {
  path: string
  base?: Base
  cached?: Base
  queryResolvers?: QueryResolvers
}

export function PageSettings({
  path,
  base,
  cached: c = {},
  children,
  queryResolvers = {},
}: {
  children: React.ReactNode
} & PageSettingsInput) {
  const [stored, _setStored] = useState<Base>({})
  const query = useSearchParams()
  const [cached, _setCached] = useState<Base>(c)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = get(path)
    const queried = getQueryParams(base ?? {}, queryResolvers, query)
    const queryResolversKeys = Object.keys(queryResolvers)
    const omittedQueryResolversKeys = queryResolversKeys.filter(
      key => queryResolvers[key].store !== true,
    )
    const omittedQueried = omit(queried, omittedQueryResolversKeys)
    const storedQueried = omit(
      queried,
      queryResolversKeys.filter(
        key => queryResolvers[key].store === true,
      ),
    )
    const nextQueried = defaults({}, queried, stored, base) as Base
    const nextStored = defaults({}, storedQueried, stored, base) as Base
    updateQueryParams(nextQueried, queryResolvers)
    _setStored(nextStored)
    if (omittedQueryResolversKeys.length) {
      _setCached(c => ({ ...c, ...omittedQueried }))
    }
    setIsLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setStored = useCallback(
    (stored: Base) => {
      set(path, stored)
      const next = defaults({}, stored, base)
      updateQueryParams(next, queryResolvers)
      _setStored(stored)
    },
    [path, base, queryResolvers],
  )

  const setCached = useCallback(
    (cached: Base) => {
      const next = defaults({}, cached, stored, base)
      updateQueryParams(next, queryResolvers)
      _setCached(next)
    },
    [path, base, stored, queryResolvers],
  )

  return (
    <PageSettingsContext.Provider
      value={{ stored, setStored, cached, setCached, isLoaded }}
    >
      {children}
    </PageSettingsContext.Provider>
  )
}
