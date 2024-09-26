import { useMemo } from 'react'
import { getScriptFont } from '~/utility/font'
import useSettings from './useSettings'
import { ScriptFonts } from '~/constant/script'
import useFonts from './useFonts'

export default function useScripts(names: Array<string>) {
  const scripts = useSettings('scripts') as ScriptFonts
  const fonts = useMemo(
    () =>
      scripts ? names.map(name => getScriptFont(scripts, name)) : [],
    [scripts, names],
  )
  return useFonts(fonts)
}
