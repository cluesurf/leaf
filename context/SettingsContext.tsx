import { createContext } from 'react'
import { Fonts } from '~/constant/font'
import { MimeTypes } from '~/constant/mime-type'
import { ScriptFonts } from '~/constant/script'

export interface Settings {
  fonts?: Fonts
  scripts?: ScriptFonts
  mimeTypes?: MimeTypes
  loaded: boolean
}

export const SettingsContext = createContext<Settings>({
  loaded: false,
})
