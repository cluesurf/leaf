import { FontName } from './font'

export type ScriptFonts = {
  default: string
  selection: string
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
  latin: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans',
    },
  },
  cyrillic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans',
    },
  },
  greek: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans',
    },
  },
  adlam: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Adlam',
    },
  },
  anatolian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Anatolian Hieroglyphs',
    },
  },
  arabic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      ancient: 'Qahiri',
      modern: 'Noto Kufi Arabic',
      traditional: 'Mizra',
    },
  },
  armenian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Armenian',
    },
  },
  avestan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Avestan',
    },
  },
  code: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Mono',
    },
  },
  balinese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Balinese',
    },
  },
  bamum: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Bamum',
    },
  },
  'bassa-vah': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Bassa Vah',
    },
  },
  batak: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Batak',
    },
  },
  bengali: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Bengali',
    },
  },
  bhaiksuki: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Bhaiksuki',
    },
  },
  brahmi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Brahmi',
    },
  },
  lontara: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Buginese',
    },
  },
  buginese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Buginese',
    },
  },
  buhid: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Buhid',
    },
  },
  canadian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Canadian Aboriginal',
    },
  },
  carian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Carian',
    },
  },
  'caucasian-albanian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Caucasian Albanian',
    },
  },
  chakma: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Chakma',
    },
  },
  cham: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Cham',
    },
  },
  cherokee: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Cherokee',
    },
  },
  chorasmian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Chorasmian',
    },
  },
  coptic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Coptic',
    },
  },
  cuneiform: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Cuneiform',
    },
  },
  cypriot: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Cypriot',
    },
  },
  'cypro-minoan': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Cypro Minoan',
    },
  },
  deseret: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Deseret',
    },
  },
  devanagari: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Devanagari',
    },
  },
  duployan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Duployan',
    },
  },
  egyptian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Egyptian Hieroglyphs',
    },
  },
  elbasan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Elbasan',
    },
  },
  elymaic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Elymaic',
    },
  },
  ethiopic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Ethiopic',
    },
  },
  georgian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Georgian',
    },
  },
  glagolitic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Glagolitic',
    },
  },
  gothic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Gothic',
    },
  },
  grantha: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Grantha',
    },
  },
  gujarati: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Gujarati',
    },
  },
  'gunjala-gondi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Gunjala Gondi',
    },
  },
  gurmukhi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Gurmukhi',
    },
  },
  'hanifi-rohingya': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Hanifi Rohingya',
    },
  },
  hanunoo: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Hanunoo',
    },
  },
  hatran: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Hatran',
    },
  },
  hebrew: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      // ancient: 'Local Hebrew Ancient',
      modern: 'Noto Sans Hebrew',
      // traditional: 'Local Hebrew Traditional',
    },
  },
  hk: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans HK',
    },
  },
  'imperial-aramaic': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Imperial Aramaic',
    },
  },
  'indic-siyaq-numbers': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Indic Siyaq Numbers',
    },
  },
  'inscriptional-pahlavi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Inscriptional Pahlavi',
    },
  },
  parthian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Inscriptional Parthian',
    },
  },
  'inscriptional-parthian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Inscriptional Parthian',
    },
  },
  javanese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Javanese',
    },
  },
  japanese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans JP',
    },
  },
  kana: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans JP',
    },
  },
  katakana: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans JP',
    },
  },
  hiragana: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans JP',
    },
  },
  kaithi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Kaithi',
    },
  },
  kannada: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Kannada',
    },
  },
  kawi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Kawi',
    },
  },
  'kayah-li': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Kayah Li',
    },
  },
  kharoshthi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Kharoshthi',
    },
  },
  khmer: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Khmer',
    },
  },
  khojki: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Khojki',
    },
  },
  khudawadi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Khudawadi',
    },
  },
  korean: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans KR',
    },
  },
  lao: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Lao',
    },
  },
  lepcha: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Lepcha',
    },
  },
  limbu: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Limbu',
    },
  },
  'linear-a': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Linear A',
    },
  },
  'linear-b': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Linear B',
    },
  },
  lisu: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Lisu',
    },
  },
  lycian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Lycian',
    },
  },
  lydian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Lydian',
    },
  },
  mahajani: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Mahajani',
    },
  },
  malayalam: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Malayalam',
    },
  },
  mandaic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Mandaic',
    },
  },
  manichaean: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Manichaean',
    },
  },
  marchen: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Marchen',
    },
  },
  'masaram-gondi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Masaram Gondi',
    },
  },
  medefaidrin: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Medefaidrin',
    },
  },
  'meetei-mayek': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Meetei Mayek',
    },
  },
  'mende-kikakui': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Mende Kikakui',
    },
  },
  meroitic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Meroitic',
    },
  },
  miao: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Miao',
    },
  },
  modi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Modi',
    },
  },
  mongolian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Mongolian',
    },
  },
  mro: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Mro',
    },
  },
  multani: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Multani',
    },
  },
  myanmar: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Myanmar',
    },
  },
  nabataean: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Nabataean',
    },
  },
  'nag-mundari': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Nag Mundari',
    },
  },
  nandinagari: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Nandinagari',
    },
  },
  'new-tai-lue': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans New Tai Lue',
    },
  },
  newa: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Newa',
    },
  },
  'n-ko': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans NKo',
    },
  },
  nushu: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Nushu',
    },
  },
  ogham: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Ogham',
    },
  },
  'ol-chiki': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Ol Chiki',
    },
  },
  'old-hungarian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Old Hungarian',
    },
  },
  'old-italic': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Old Italic',
    },
  },
  'old-north-arabian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Old North Arabian',
    },
  },
  'old-permic': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Old Permic',
    },
  },
  'old-persian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Old Persian',
    },
  },
  'old-sogdian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Old Sogdian',
    },
  },
  'old-south-arabian': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Old South Arabian',
    },
  },
  'old-turkic': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Old Turkic',
    },
  },
  oriya: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Oriya',
    },
  },
  osage: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Osage',
    },
  },
  osmanya: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Osmanya',
    },
  },
  'pahawh-hmong': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Pahawh Hmong',
    },
  },
  palmyrene: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Palmyrene',
    },
  },
  'pau-cin-hau': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Pau Cin Hau',
    },
  },
  'phags-pa': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Phags Pa',
    },
  },
  phoenician: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Phoenician',
    },
  },
  'psalter-pahlavi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Psalter Pahlavi',
    },
  },
  rejang: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Rejang',
    },
  },
  runic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Runic',
    },
  },
  samaritan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Samaritan',
    },
  },
  saurashtra: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Saurashtra',
    },
  },
  sharada: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Sharada',
    },
  },
  shavian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Shavian',
    },
  },
  siddham: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Siddham',
    },
  },
  sinhala: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Sinhala',
    },
  },
  sogdian: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Sogdian',
    },
  },
  'sora-sompeng': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Sora Sompeng',
    },
  },
  soyombo: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Soyombo',
    },
  },
  sundanese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Sundanese',
    },
  },
  'syloti-nagri': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Syloti Nagri',
    },
  },
  syriac: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Syriac',
    },
  },
  tagalog: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Tagalog',
    },
  },
  tagbanwa: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Tagbanwa',
    },
  },
  'tai-le': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Tai Le',
    },
  },
  'tai-tham': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Tai Tham',
    },
  },
  'tai-viet': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Tai Viet',
    },
  },
  takri: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Takri',
    },
  },
  tamil: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Tamil',
    },
  },
  tangsa: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Tangsa',
    },
  },
  telugu: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Telugu',
    },
  },
  thaana: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Thaana',
    },
  },
  thai: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Thai',
    },
  },
  tifinagh: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Tifinagh',
    },
  },
  tirhuta: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Tirhuta',
    },
  },
  ugaritic: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Ugaritic',
    },
  },
  vai: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Vai',
    },
  },
  vithkuqi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Vithkuqi',
    },
  },
  wancho: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Wancho',
    },
  },
  'warang-citi': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Warang Citi',
    },
  },
  yi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Yi',
    },
  },
  'zanabazar-square': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Sans Zanabazar Square',
    },
  },
  ahom: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Ahom',
    },
  },
  dogra: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Dogra',
    },
  },
  khitan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Khitan Small Script',
    },
  },
  makasar: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Makasar',
    },
  },
  'old-uyghur': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Old Uyghur',
    },
  },
  'ottoman-siyaq': {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Ottoman Siyaq',
    },
  },
  tangut: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Tangut',
    },
  },
  tibetan: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Tibetan',
    },
  },
  toto: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Toto',
    },
  },
  yezidi: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Noto Serif Yezidi',
    },
  },
  chinese: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      ancient: 'TWKai, TWKaiExt',
      modern: 'Noto Sans Chinese',
      traditional: 'IMing',
    },
  },
  tone: {
    default: 'modern',
    selection: 'modern',
    fonts: {
      modern: 'Tone Etch',
    },
  },
}

export default SCRIPT
