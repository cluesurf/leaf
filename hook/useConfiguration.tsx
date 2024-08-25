import React, {
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useLayoutEffect,
  useCallback,
  useEffect,
} from 'react'
import {
  FontDataType,
  GoogleFontDeclaration,
  loadFonts,
} from '~/constant/font'
import merge from 'lodash/merge'

export type NestedObjectType = {
  [key: string]: NestedObjectValueType
}

export type NestedObjectValueType =
  | NestedObjectType
  | string
  | boolean
  | number
  | null
  | undefined
  | Array<
      NestedObjectType | string | boolean | number | null | undefined
    >

type ConfigurationContextType = {
  data: AppConfiguration
  set: (updates: NestedObjectType) => void
}

export const ConfigurationContext = React.createContext<
  ConfigurationContextType | undefined
>(undefined)

export function ConfigurationProvider({ config, children }: PropsType) {
  const [data, setConfiguration] = useState(config)

  const set = useCallback((updates: NestedObjectType) => {
    setConfiguration(c => merge({}, c, updates) as AppConfiguration)
  }, [])

  const value = useMemo(
    () => ({
      data,
      set,
    }),
    [data, set],
  )

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  )
}

type PropsType = {
  children: React.ReactNode
  config: AppConfiguration
}

export function useConfiguration(): ConfigurationContextType {
  return useContext(ConfigurationContext) as ConfigurationContextType
}

export function useConfigurationScope(scope: string) {
  const updates = useMemo(() => ({ scope }), [scope])
  useConfigurationSettings(updates)
}

export function useConfigurationSettings(updates: NestedObjectType) {
  const config = useConfiguration()

  useEffect(() => {
    config.set(updates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updates])
}

export type FontContextInput = {
  fonts: Record<string, boolean>
  update: Dispatch<SetStateAction<Record<string, boolean>>>
}

export const FontContext = createContext<FontContextInput>({
  fonts: {},
  update: (fonts: SetStateAction<Record<string, boolean>>) => {},
})

export function FontProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [fonts, setFonts] = useState<Record<string, boolean>>({})

  const state = useMemo(
    () => ({
      fonts,
      update: setFonts,
    }),
    [fonts],
  )

  return (
    <FontContext.Provider value={state}>
      {children}
    </FontContext.Provider>
  )
}

export function useFonts(
  list: Array<FontDataType | GoogleFontDeclaration> = [],
) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasWaited, setHasWaited] = useState(false)
  const state = useContext(FontContext)

  useLayoutEffect(() => {
    const fonts = list.reduce<Record<string, boolean>>((m, x) => {
      m[x.family] = false
      return m
    }, {})
    state.update(f => ({ ...f, ...fonts }))
    loadFonts(list)
      .then(() => {
        setIsLoaded(true)
        const fonts = list.reduce<Record<string, boolean>>((m, x) => {
          m[x.family] = true
          return m
        }, {})
        state.update(f => ({ ...f, ...fonts }))
      })
      .catch(e => {
        console.error(e)
        setIsLoaded(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.map(x => x.family).join(':')])

  return isLoaded
}

export const SCRIPT = [
  'arabic',
  'armenian',
  'bengali',
  'canadian',
  'chinese',
  'cuneiform',
  'devanagari',
  'egyptian',
  'english',
  'ethiopic',
  'georgian',
  'gujarati',
  'gurmukhi',
  'hebrew',
  'hindi',
  'inuktitut',
  'japanese',
  'kannada',
  'khmer',
  'korean',
  'latin',
  'malayalam',
  'oriya',
  'runic',
  'sanskrit',
  'sinhala',
  'syriac',
  'tamil',
  'telugu',
  'thai',
  'tibetan',
  'tone',
]

export const remoteFonts = {
  'Noto Kufi Arabic': font(),
  'Noto Sans': font(),
  'Noto Sans Armenian': font(),
  'Noto Sans Bengali': font(),
  'Noto Sans Canadian': font(),
  'Noto Sans Cuneiform': font(),
  'Noto Sans Devanagari': font(),
  'Noto Sans Egyptian': font(),
  'Noto Sans Ethiopic': font(),
  'Noto Sans Georgian': font(),
  'Noto Sans Gujarati': font(),
  'Noto Sans Gurmukhi': font(),
  'Noto Sans Hebrew': font(),
  'Noto Sans JP': font(),
  'Noto Sans KR': font(),
  'Noto Sans Kannada': font(),
  'Noto Sans Khmer': font(),
  'Noto Sans Malayalam': font(),
  'Noto Sans Mono': font(),
  'Noto Sans Oriya': font(),
  'Noto Sans Runic': font(),
  'Noto Sans SC': font(),
  'Noto Sans Sinhala': font(),
  'Noto Sans Syriac': font(),
  'Noto Sans Tamil': font(),
  'Noto Sans Telugu': font(),
  'Noto Sans Thai': font(),
  'Noto Serif Tibetan': font(),
}

// Mirza-Bold.ttf
const localFonts = {
  IMing: font('/fonts/source/I.Ming-8.00.ttf'),
  'Local Hebrew Ancient': font('/fonts/source/hebrew-ancient.ttf'),
  'Local Hebrew Traditional': font(
    '/fonts/source/hebrew-traditional.ttf',
  ),
  Mizra: font('/fonts/source/Mirza-Regular.ttf'),
  Qahiri: font('/fonts/source/Qahiri-Regular.ttf'),
  'TWKai, TWKaiExt': font([
    '/fonts/source/chinese/TW-Kai-98_1.woff',
    '/fonts/source/chinese/TW-Kai-Ext-B-98_1.woff',
  ]),
  ToneEtch: font('/fonts/ToneEtch.3.otf'),
  YeZiGongChangChuanQiuShaXingKai: font(
    '/fonts/source/YeZiGongChangChuanQiuShaXingKai-2.ttf',
  ),
}

export const fonts: Record<string, FontLoadedType> = {
  ...remoteFonts,
  ...localFonts,
}

export const FONT = Object.keys(fonts)

export type FontNameType = keyof typeof fonts

export type FontLoadedType = {
  loaded: boolean
  path?: string | Array<string>
}

export type ScriptDataType = {
  [key: string]: NestedObjectValueType
  font: string
  fonts: Record<string, FontNameType>
}

export function getScriptFontData(
  theme: AppConfiguration,
  script: string,
) {
  const fontType =
    theme.scripts[script].font ?? theme.scripts[script].default
  const fontName = theme.scripts[script].fonts[fontType]
  const fontData = theme.fonts.families[fontName]
  return { ...fontData, name: fontName }
}

export function getScriptFont(
  theme: AppConfiguration,
  script: string,
  type: string,
) {
  const name =
    theme.scripts[script].fonts[type] ??
    theme.scripts[script].fonts.modern
  return name
}

const scripts: Record<ScriptNameType, ScriptDataType> = {
  arabic: {
    default: 'modern',
    font: 'modern',
    fonts: {
      ancient: 'Qahiri',
      modern: 'Noto Kufi Arabic',
      traditional: 'Mizra',
    },
  },
  armenian: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Armenian',
    },
  },
  bengali: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Bengali',
    },
  },
  canadian: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Canadian',
    },
  },
  chinese: {
    default: 'modern',
    font: 'modern',
    fonts: {
      ancient: 'TWKai, TWKaiExt',
      modern: 'Noto Sans SC',
      traditional: 'IMing',
    },
  },
  cuneiform: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Cuneiform',
    },
  },
  devanagari: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Devanagari',
    },
  },
  egyptian: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Egyptian',
    },
  },
  english: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans',
    },
  },
  ethiopic: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Ethiopic',
    },
  },
  georgian: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Georgian',
    },
  },
  gujarati: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Gujarati',
    },
  },
  gurmukhi: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Gurmukhi',
    },
  },
  hebrew: {
    default: 'modern',
    font: 'modern',
    fonts: {
      ancient: 'Local Hebrew Ancient',
      modern: 'Noto Sans Hebrew',
      traditional: 'Local Hebrew Traditional',
    },
  },
  hindi: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Devanagari',
    },
  },
  inuktitut: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Canadian',
    },
  },
  japanese: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans JP',
    },
  },
  kannada: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Kannada',
    },
  },
  khmer: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Khmer',
    },
  },
  korean: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans KR',
    },
  },
  latin: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans',
    },
  },
  malayalam: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Malayalam',
    },
  },
  oriya: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Oriya',
    },
  },
  runic: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Runic',
    },
  },
  sanskrit: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Devanagari',
    },
  },
  sinhala: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Sinhala',
    },
  },
  syriac: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Syriac',
    },
  },
  tamil: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Tamil',
    },
  },
  telugu: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Telugu',
    },
  },
  thai: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Sans Thai',
    },
  },
  tibetan: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'Noto Serif Tibetan',
    },
  },
  tone: {
    default: 'modern',
    font: 'modern',
    fonts: {
      modern: 'ToneEtch',
    },
  },
}

const config = {
  fonts: {
    families: fonts,
    scale: 16,
  },
  scripts,
}

export type ScriptNameType = (typeof SCRIPT)[number]

export { config }

function font(path?: string | Array<string>) {
  return { loaded: false, path }
}

export type AppConfiguration = typeof config
