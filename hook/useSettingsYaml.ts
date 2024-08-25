import { useCallback, useEffect, useState } from 'react'
import pick from 'lodash/pick'
import { usePageSettings } from './usePageSettings'

export default function useSettingsYaml<T>(
  base: Record<string, any>,
): [string | undefined, (code?: string) => void] {
  const [YAML, setYAML] = useState<any>()
  const [code, setCode] = useState<string>()
  const [keys, setKeys] = useState<Array<string>>([])

  const { stored, setStored } = usePageSettings<T>()

  const onChange = useCallback(
    (code?: string) => {
      if (code) {
        setStored(pick(YAML.load(code), keys) as T)
      }
    },
    [YAML],
  )

  useEffect(() => {
    setKeys(Object.keys(base))
    import('js-yaml').then(mod => setYAML(mod.default))
  }, [])

  useEffect(() => {
    if (!YAML) {
      return
    }

    setCode(YAML.dump(pick(stored, keys)))
  }, [YAML, stored])

  return [code, onChange]
}
