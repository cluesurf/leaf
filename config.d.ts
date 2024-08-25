import '~/context/SettingsContext'
import { Fonts } from '~/constant/font'
import { ScriptFonts } from './constant/script'

declare module '@lancejpollard/react-virtualized/dist/commonjs/List'
declare module '@lancejpollard/react-virtualized/dist/commonjs/AutoSizer'
declare module '@lancejpollard/clear-diacritics.js'
declare module 'swipe-listener'
declare module 'react/jsx-runtime' {
  const Fragment: any
  const jsx: any
  const jsxs: any

  export { Fragment }
  export { jsx }
  export { jsxs }
} // Import the module

declare module '~/context/SettingsContext' {
  export interface Settings {
    fonts?: Fonts | undefined
    scripts?: ScriptFonts | undefined
  }
}
