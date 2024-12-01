import { useMemo } from 'react'
import { getScriptFont } from '~/utility/font'
import useSettings from './useSettings'
import { ScriptFonts } from '~/constant/script'
import useFonts from './useFonts'

export default function useScripts(names: Array<string>) {
  const scripts = useSettings('scripts') as ScriptFonts
  const string = names.sort().join(':')
  const fonts = useMemo(
    () =>
      scripts
        ? names.map(name => getScriptFont(scripts, name)).filter(x => x)
        : [],
    [scripts, string],
  )
  return useFonts(fonts)
}
