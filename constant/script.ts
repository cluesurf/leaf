import { FontName } from './font'

export type ScriptFonts = {
  default: string
  selection: string
  fonts: Record<string, ScriptFontData>
}

export type ScriptFontData = {
  family: FontName
  lineHeight: {
    heading: number
    body: number
  }
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
  latin: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  cyrillic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  greek: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  adlam: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Adlam',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  anatolian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Anatolian Hieroglyphs',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  arabic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      ancient: {
        family: 'Qahiri',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
      modern: {
        family: 'Noto Kufi Arabic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
      traditional: {
        family: 'Mizra',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  armenian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Armenian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  avestan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Avestan',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  balinese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Balinese',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  bamum: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Bamum',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'bassa-vah': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Bassa Vah',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  batak: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Batak',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  bengali: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Bengali',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  bhaiksuki: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Bhaiksuki',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  brahmi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Brahmi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  lontara: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Buginese',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  buginese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Buginese',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  buhid: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Buhid',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  canadian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Canadian Aboriginal',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  carian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Carian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'caucasian-albanian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Caucasian Albanian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  chakma: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Chakma',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  cham: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Cham',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  cherokee: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Cherokee',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  chorasmian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Chorasmian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  coptic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Coptic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  cuneiform: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Cuneiform',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  cypriot: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Cypriot',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'cypro-minoan': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Cypro Minoan',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  deseret: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Deseret',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  devanagari: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Devanagari',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  duployan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Duployan',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  egyptian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Egyptian Hieroglyphs',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  elbasan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Elbasan',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  elymaic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Elymaic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  ethiopic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Ethiopic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  georgian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Georgian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  glagolitic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Glagolitic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  gothic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Gothic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  grantha: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Grantha',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  gujarati: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Gujarati',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'gunjala-gondi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Gunjala Gondi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  gurmukhi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Gurmukhi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'hanifi-rohingya': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Hanifi Rohingya',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  hanunoo: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Hanunoo',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  hatran: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Hatran',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  hebrew: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      // ancient: 'Local Hebrew Ancient',
      modern: {
        family: 'Noto Sans Hebrew',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
      // traditional: 'Local Hebrew Traditional',
    },
  },
  hk: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans HK',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'imperial-aramaic': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Imperial Aramaic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'indic-siyaq-numbers': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Indic Siyaq Numbers',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'inscriptional-pahlavi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Inscriptional Pahlavi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  parthian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Inscriptional Parthian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'inscriptional-parthian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Inscriptional Parthian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  javanese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Javanese',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  japanese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans JP',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  kana: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans JP',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  katakana: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans JP',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  hiragana: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans JP',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  kaithi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Kaithi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  kannada: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Kannada',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  kawi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Kawi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'kayah-li': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Kayah Li',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  kharoshthi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Kharoshthi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  khmer: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Khmer',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  khojki: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Khojki',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  khudawadi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Khudawadi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  korean: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans KR',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  lao: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Lao',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  lepcha: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Lepcha',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  limbu: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Limbu',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'linear-a': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Linear A',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'linear-b': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Linear B',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  lisu: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Lisu',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  lycian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Lycian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  lydian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Lydian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  mahajani: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Mahajani',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  malayalam: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Malayalam',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  mandaic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Mandaic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  manichaean: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Manichaean',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  marchen: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Marchen',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'masaram-gondi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Masaram Gondi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  medefaidrin: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Medefaidrin',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'meetei-mayek': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Meetei Mayek',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'mende-kikakui': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Mende Kikakui',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  meroitic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Meroitic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  miao: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Miao',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  modi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Modi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  mongolian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Mongolian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  mro: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Mro',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  multani: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Multani',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  myanmar: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Myanmar',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  nabataean: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Nabataean',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'nag-mundari': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Nag Mundari',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  nandinagari: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Nandinagari',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'new-tai-lue': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans New Tai Lue',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  newa: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Newa',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'n-ko': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans NKo',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  nushu: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Nushu',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  ogham: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Ogham',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'ol-chiki': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Ol Chiki',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'old-hungarian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Old Hungarian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'old-italic': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Old Italic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'old-north-arabian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Old North Arabian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'old-permic': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Old Permic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'old-persian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Old Persian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'old-sogdian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Old Sogdian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'old-south-arabian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Old South Arabian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'old-turkic': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Old Turkic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  oriya: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Oriya',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  osage: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Osage',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  osmanya: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Osmanya',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'pahawh-hmong': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Pahawh Hmong',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  palmyrene: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Palmyrene',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'pau-cin-hau': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Pau Cin Hau',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'phags-pa': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Phags Pa',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  phoenician: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Phoenician',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'psalter-pahlavi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Psalter Pahlavi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  rejang: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Rejang',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  runic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Runic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  samaritan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Samaritan',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  saurashtra: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Saurashtra',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  sharada: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Sharada',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  shavian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Shavian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  siddham: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Siddham',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  sinhala: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Sinhala',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  sogdian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Sogdian',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'sora-sompeng': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Sora Sompeng',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  soyombo: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Soyombo',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  sundanese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Sundanese',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'syloti-nagri': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Syloti Nagri',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  syriac: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Syriac',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  tagalog: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Tagalog',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  tagbanwa: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Tagbanwa',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'tai-le': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Tai Le',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'tai-tham': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Tai Tham',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'tai-viet': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Tai Viet',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  takri: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Takri',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  tamil: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Tamil',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  tangsa: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Tangsa',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  telugu: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Telugu',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  thaana: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Thaana',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  thai: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Thai',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  tifinagh: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Tifinagh',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  tirhuta: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Tirhuta',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  ugaritic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Ugaritic',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  vai: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Vai',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  vithkuqi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Vithkuqi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  wancho: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Wancho',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'warang-citi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Warang Citi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  yi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Yi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'zanabazar-square': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Sans Zanabazar Square',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  ahom: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Ahom',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  dogra: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Dogra',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  khitan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Khitan Small Script',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  makasar: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Makasar',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'old-uyghur': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Old Uyghur',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  'ottoman-siyaq': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Ottoman Siyaq',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  tangut: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Tangut',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  tibetan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Tibetan',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  toto: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Toto',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  yezidi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Noto Serif Yezidi',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
  chinese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      ancient: 'TWKai, TWKaiExt',
      modern: {
        family: 'Noto Sans Chinese',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
      traditional: 'IMing',
    },
  },
  tone: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: {
        family: 'Tone Etch',
        lineHeight: {
          heading: 1.2,
          body: 1.7,
        },
      },
    },
  },
}

export default SCRIPT
