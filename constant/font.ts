import { Font } from '~/utility/font'

export const FONT_NAME = [
  'Noto Kufi Arabic',
  'Noto Sans',
  'Noto Sans Armenian',
  'Noto Sans Bengali',
  'Noto Sans Canadian',
  'Noto Sans Cuneiform',
  'Noto Sans Devanagari',
  'Noto Sans Egyptian',
  'Noto Sans Ethiopic',
  'Noto Sans Georgian',
  'Noto Sans Gujarati',
  'Noto Sans Gurmukhi',
  'Noto Sans Hebrew',
  'Noto Sans JP',
  'Noto Sans KR',
  'Noto Sans Kannada',
  'Noto Sans Khmer',
  'Noto Sans Malayalam',
  'Noto Sans Mono',
  'Noto Sans Oriya',
  'Noto Sans Runic',
  'Noto Sans SC',
  'Noto Sans Sinhala',
  'Noto Sans Syriac',
  'Noto Sans Tamil',
  'Noto Sans Telugu',
  'Noto Sans Thai',
  'Noto Serif Tibetan',
  'IMing',
  'Mizra',
  'Qahiri',
  'TWKai',
  'TWKaiExt',
  'Tone Etch',
  'YeZiGongChangChuanQiuShaXingKai',
]

export type FontName = (typeof FONT_NAME)[number]

export type Fonts = Record<string, Font>

const FONT: Fonts = {
  'Noto Sans Mono': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    family: 'Noto Sans Mono',
    test: '\u0128\u0300\u0301\u0329\u0308\u0303\u0323\u01AF\u0129\u1EA0',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans SC': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.2,
      base: 1,
    },
    family: 'Noto Sans SC',
    test: '类家庭',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Tibetan': {
    google: true,
    lineHeight: {
      heading: 1.7,
      body: 1.7,
      base: 1.5,
    },
    family: 'Noto Serif Tibetan',
    test: 'སེང',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Tone Etch': {
    family: 'Tone Etch',
    test: 'abc',
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
  },
  'Noto Color Emoji': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Color Emoji',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Emoji': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Emoji',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Kufi Arabic': {
    google: true,
    lineHeight: {
      heading: 1,
      body: 1.2,
      base: 1,
    },
    test: 'بتجخدرسص',
    family: 'Noto Kufi Arabic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Music': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Music',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Naskh Arabic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: 'بتجخدرسص',
    family: 'Noto Naskh Arabic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Nastaliq Urdu': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Nastaliq Urdu',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Rashi Hebrew': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Rashi Hebrew',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: 'abc',
    family: 'Noto Sans',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Adlam': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Adlam',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Adlam Unjoined': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Adlam Unjoined',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Anatolian Hieroglyphs': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Anatolian Hieroglyphs',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Arabic': {
    google: true,
    lineHeight: {
      heading: 1,
      body: 1.2,
      base: 1,
    },
    test: 'بتجخدرسص',
    family: 'Noto Sans Arabic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Armenian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Armenian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Avestan': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Avestan',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Balinese': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Balinese',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Bamum': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Bamum',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Bassa Vah': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Bassa Vah',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Batak': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Batak',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Bengali': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Bengali',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Bhaiksuki': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Bhaiksuki',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Brahmi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Brahmi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Buginese': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Buginese',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Buhid': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Buhid',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Canadian Aboriginal': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Canadian Aboriginal',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Carian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Carian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Caucasian Albanian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Caucasian Albanian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Chakma': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Chakma',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Cham': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Cham',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Cherokee': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Cherokee',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Chorasmian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Chorasmian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Coptic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Coptic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Cuneiform': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Cuneiform',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Cypriot': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Cypriot',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Cypro Minoan': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Cypro Minoan',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Deseret': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Deseret',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Devanagari': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Devanagari',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Display': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Display',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Duployan': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Duployan',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Egyptian Hieroglyphs': {
    google: true,
    lineHeight: {
      heading: 1,
      body: 1.2,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Egyptian Hieroglyphs',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Elbasan': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Elbasan',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Elymaic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Elymaic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Ethiopic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Ethiopic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Georgian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Georgian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Glagolitic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Glagolitic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Gothic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Gothic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Grantha': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Grantha',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Gujarati': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Gujarati',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Gunjala Gondi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Gunjala Gondi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Gurmukhi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Gurmukhi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Hanifi Rohingya': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Hanifi Rohingya',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Hanunoo': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Hanunoo',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Hatran': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Hatran',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Hebrew': {
    google: true,
    lineHeight: {
      heading: 1,
      body: 1.2,
      base: 1,
    },
    test: 'שתלמצחכע',
    family: 'Noto Sans Hebrew',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans HK': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans HK',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Imperial Aramaic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Imperial Aramaic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Indic Siyaq Numbers': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Indic Siyaq Numbers',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Inscriptional Pahlavi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Inscriptional Pahlavi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Inscriptional Parthian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Inscriptional Parthian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Javanese': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Javanese',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans JP': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans JP',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Kaithi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Kaithi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Kannada': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Kannada',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Kawi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Kawi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Kayah Li': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Kayah Li',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Kharoshthi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Kharoshthi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Khmer': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Khmer',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Khojki': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Khojki',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Khudawadi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Khudawadi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans KR': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans KR',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Lao': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Lao',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Lao Looped': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Lao Looped',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Lepcha': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Lepcha',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Limbu': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Limbu',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Linear A': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Linear A',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Linear B': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Linear B',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Lisu': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Lisu',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Lycian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Lycian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Lydian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Lydian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Mahajani': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Mahajani',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Malayalam': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Malayalam',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Mandaic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Mandaic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Manichaean': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Manichaean',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Marchen': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Marchen',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Masaram Gondi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Masaram Gondi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Math': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Math',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Mayan Numerals': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Mayan Numerals',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Medefaidrin': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Medefaidrin',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Meetei Mayek': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Meetei Mayek',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Mende Kikakui': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Mende Kikakui',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Meroitic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Meroitic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Miao': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Miao',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Modi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Modi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Mongolian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Mongolian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Mro': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Mro',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Multani': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Multani',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Myanmar': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Myanmar',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Nabataean': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Nabataean',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Nag Mundari': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Nag Mundari',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Nandinagari': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Nandinagari',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans New Tai Lue': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans New Tai Lue',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Newa': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Newa',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans NKo': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans NKo',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans NKo Unjoined': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans NKo Unjoined',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Nushu': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Nushu',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Ogham': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Ogham',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Ol Chiki': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Ol Chiki',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Old Hungarian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Old Hungarian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Old Italic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Old Italic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Old North Arabian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Old North Arabian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Old Permic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Old Permic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Old Persian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Old Persian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Old Sogdian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Old Sogdian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Old South Arabian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Old South Arabian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Old Turkic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Old Turkic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Oriya': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Oriya',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Osage': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Osage',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Osmanya': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Osmanya',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Pahawh Hmong': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Pahawh Hmong',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Palmyrene': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Palmyrene',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Pau Cin Hau': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Pau Cin Hau',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Phags Pa': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Phags Pa',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Phoenician': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Phoenician',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Psalter Pahlavi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Psalter Pahlavi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Rejang': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Rejang',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Runic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Runic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Samaritan': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Samaritan',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Saurashtra': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Saurashtra',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Sharada': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Sharada',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Shavian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Shavian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Siddham': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Siddham',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans SignWriting': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans SignWriting',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Sinhala': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Sinhala',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Sogdian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Sogdian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Sora Sompeng': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Sora Sompeng',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Soyombo': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Soyombo',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Sundanese': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Sundanese',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Syloti Nagri': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Syloti Nagri',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Symbols': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Symbols',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Symbols 2': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Symbols 2',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Syriac': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Syriac',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Syriac Eastern': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Syriac Eastern',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tagalog': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tagalog',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tagbanwa': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tagbanwa',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tai Le': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tai Le',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tai Tham': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tai Tham',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tai Viet': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tai Viet',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Takri': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Takri',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tamil': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tamil',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tamil Supplement': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tamil Supplement',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tangsa': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tangsa',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans TC': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans TC',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Telugu': {
    google: true,
    lineHeight: {
      heading: 1.1,
      body: 1.4,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Telugu',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Thaana': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Thaana',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Thai': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Thai',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Thai Looped': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Thai Looped',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tifinagh': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tifinagh',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Tirhuta': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Tirhuta',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Ugaritic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Ugaritic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Vai': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Vai',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Vithkuqi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Vithkuqi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Wancho': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Wancho',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Warang Citi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Warang Citi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Yi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Yi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Sans Zanabazar Square': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Sans Zanabazar Square',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Ahom': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Ahom',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Armenian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Armenian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Balinese': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Balinese',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Bengali': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Bengali',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Devanagari': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Devanagari',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Display': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Display',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Dogra': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Dogra',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Ethiopic': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Ethiopic',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Georgian': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Georgian',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Grantha': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Grantha',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Gujarati': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Gujarati',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Gurmukhi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Gurmukhi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Hebrew': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Hebrew',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif HK': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif HK',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif JP': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif JP',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Kannada': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Kannada',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Khitan Small Script': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Khitan Small Script',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Khmer': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Khmer',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Khojki': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Khojki',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif KR': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif KR',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Lao': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Lao',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Makasar': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Makasar',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Malayalam': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Malayalam',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Myanmar': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Myanmar',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif NP Hmong': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif NP Hmong',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Old Uyghur': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Old Uyghur',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Oriya': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Oriya',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Ottoman Siyaq': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Ottoman Siyaq',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif SC': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif SC',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Sinhala': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Sinhala',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Tamil': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Tamil',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Tangut': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Tangut',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif TC': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif TC',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Telugu': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Telugu',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Thai': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Thai',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Toto': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Toto',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Vithkuqi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Vithkuqi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Serif Yezidi': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Serif Yezidi',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
  'Noto Traditional Nushu': {
    google: true,
    lineHeight: {
      heading: 1.2,
      body: 1.7,
      base: 1,
    },
    test: '',
    family: 'Noto Traditional Nushu',
    styles: [
      {
        weight: 400,
      },
      {
        weight: 700,
      },
    ],
  },
}

// amharic: ['Noto Sans Ethiopic', 'ጥበብ'],
//   arabic: ['Noto Kufi Arabic', 'حديقة'],
//   armenian: ['Noto Sans Armenian'],
//   bengali: ['Noto Sans Bengali'],
//   canadian: ['Noto Sans Canadian Aboriginal', 'ᕿᓚᓗᒐᖅ'],
//   chinese: ['Noto Sans SC', '晓'],
//   cuneiform: ['Noto Sans Cuneiform'],
//   devanagari: ['Noto Sans Devanagari', 'टोकरी'],
//   egyptian: ['Noto Sans Egyptian Hieroglyphs'],
//   georgian: ['Noto Sans Georgian', 'ფრჩხილი'],
//   gujarati: ['Noto Sans Gujarati'],
//   gurmukhi: ['Noto Sans Gurmukhi'],
//   hebrew: ['Noto Sans Hebrew', 'אזהרה'],
//   hindi: ['Noto Sans Devanagari', 'टोकरी'],
//   inuktitut: ['Noto Sans Canadian Aboriginal', 'ᕿᓚᓗᒐᖅ'],
//   japanese: ['Noto Sans JP', 'ばった'],
//   kannada: ['Noto Sans Kannada'],
//   khmer: ['Noto Sans Khmer'],
//   korean: ['Noto Sans KR'],
//   latin: ['Noto Sans Mono', 'IEAOU'],
//   malayalam: ['Noto Sans Malayalam'],
//   oriya: ['Noto Sans Oriya'],
//   runic: ['Noto Sans Runic'],
//   sanskrit: ['Noto Sans Devanagari', 'टोकरी'],
//   sinhala: ['Noto Sans Sinhala'],
//   syriac: ['Noto Sans Syriac'],
//   tamil: ['Noto Sans Tamil', 'புஷ்பம்'],
//   telugu: ['Noto Sans Telugu'],
//   thai: ['Noto Sans Thai', 'บ้าน'],
//   tibetan: ['Noto Serif Tibetan', 'སེང'],

export default FONT
