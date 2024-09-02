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
