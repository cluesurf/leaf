import { FontName } from './font'

export type ScriptFonts = {
  default: string
  font: string
  fonts: Record<string, FontName>
}

export const SCRIPT_NAME = [
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

export type ScriptName = (typeof SCRIPT_NAME)[number]

const SCRIPT: Record<ScriptName, ScriptFonts> = {
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

export default SCRIPT
