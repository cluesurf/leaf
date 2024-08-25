import React, {
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react'
import Cookies from 'js-cookie'

export const BaseCodeContext = createContext<string | undefined>(
  undefined,
)

export function BaseCodeProvider({
  path,
  children,
}: {
  path: string
  children: React.ReactNode
}) {
  const [code, setBaseCode] = useState<string | undefined>(
    Cookies.get('code'),
  )

  useEffect(() => {
    if (code) {
      return
    }

    fetch(path)
      .then(res => res.json())
      .then(json => {
        if (json.code) {
          setBaseCode(json.code)
        }
      })
  }, [path, code])

  return (
    <BaseCodeContext.Provider value={code}>
      {children}
    </BaseCodeContext.Provider>
  )
}

export function useBaseCode() {
  return useContext(BaseCodeContext)
}
