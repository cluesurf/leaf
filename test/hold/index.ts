import {
  FfmpegAudioCodec,
  FfmpegSubtitleCodec,
  FfmpegVideoCodec,
} from '~/test/hold/ffmpeg'

export type AddAudioToVideoWithFfmpeg = {
  audioCodec: string
  fit: boolean
  inputAudio: string
  inputVideo: string
}
export type AddAudioToVideoWithFfmpegUsingFilePaths = {
  audioCodec: string
  fit: boolean
  inputAudioPath: string
  inputVideoPath: string
  outputPath: string
}
export type AudioRecording = {
  citation: Citation
  file: AudioFile
}
export type Citation = {
  link: string
}
export type ConvertVideoToAudioWithFfmpeg = {
  inputPath: string
  outputPath: string
}
export type ConvertVideoWithFfmpeg = {
  input: ArrayBuffer
  output: ArrayBuffer
  audioBitRate: number
  audioChannels: number
  audioCodec: FfmpegAudioCodec
  audioSamplingFrequency: number
  duration: number
  endTime: number | string
  frameRate: number
  rotation: number
  scaleHeight: number
  scaleWidth: number
  startTime: number
  strict: boolean
  subtitleCodec: FfmpegSubtitleCodec
  videoBitRate: number
  videoCodec: FfmpegVideoCodec
}
export type ConvertVideoWithFfmpegUsingFileNodePaths = {
  inputPath: string
  outputPath: string
  audioBitRate: number
  audioChannels: number
  audioCodec: FfmpegAudioCodec
  audioSamplingFrequency: number
  duration: number
  endTime: number | string
  frameRate: number
  rotation: number
  scaleHeight: number
  scaleWidth: number
  startTime: number
  strict: boolean
  subtitleCodec: FfmpegSubtitleCodec
  videoBitRate: number
  videoCodec: FfmpegVideoCodec
}
export type DataForm = {
  intraFrameOnly: boolean
  label: string
  lossless: boolean
  lossy: boolean
  supportsDecoding: boolean
  supportsEncoding: boolean
  type: string
}

export type FfmpegStrictOption =
  | 'very'
  | 'strict'
  | 'normal'
  | 'unofficial'
  | 'experimental'
export type Language = {
  id: string
  slug: string
  iso639_1: string
  iso639_2: string
  iso639_3: string
  category: string
  title: string
  flow_count: number
  flows: Array<LanguageFlow>
  is_natural?: boolean
  is_constructed?: boolean
}
export type LanguageFlow = {
  id: string
  slug: string
  text: string
  language: Language
  variants: Array<LanguageFlowVariant>
}
export type LanguageFlowDerivation = {
  id: string
  base: LanguageFlowVariant
  category: string
}
export type LanguageFlowElement = {
  id: string
  derivation: LanguageFlowDerivation
  source: LanguageFlowVariant
}
export type LanguageFlowExample = {
  id: string
  sense: LanguageFlowSense
  sentence: LanguageHighlightedSentence
}
export type LanguageFlowGloss = {
  id: string
  variant: LanguageFlowVariant
  fragments: Array<LanguageFlowGlossFragment>
}
export type LanguageFlowGlossFragment = {
  id: string
  text: string
  symbols: string
}
export type LanguageFlowList = {
  id: string
  slug: string
  title: string
  items: Array<LanguageFlow>
}
export type LanguageFlowPronunciation = {
  id: string
  script: Script
  system: TransliterationSystem
  variant: LanguageFlowVariant
  text: LanguageFlowVariant
  position?: number
  syllable?: {
    count?: number
    mark?: object
    is_exact?: boolean
  }
  recordings: Array<AudioRecording>
}
export type LanguageFlowSense = {
  id: string
  variant: LanguageFlowVariant
  parent?: LanguageFlowSense
  position?: number
}
export type LanguageFlowTranscription = {
  id: string
  script: Script
  system: TransliterationSystem
  variant: LanguageFlowVariant
  text: string
  position?: number
  is_phonetic?: boolean
  is_canonical?: boolean
}
export type LanguageFlowTranslation = {
  id: string
  source: LanguageFlowVariant
  target: LanguageFlowVariant
}
export type LanguageFlowTranslationList = {
  id: string
  slug: string
  title: string
  source: {
    language: Language
    script: Language
  }
  target: {
    language: Language
    script: Language
  }
  items: Array<LanguageFlowTranslationListItem>
}
export type LanguageFlowTranslationListItem = {
  id: string
  list: LanguageFlowTranslationList
  translation: LanguageFlowTranslation
  position?: {
    row?: number
    column?: number
  }
}
export type LanguageFlowVariant = {
  id: string
  flow?: LanguageFlow
  context?: number
  is_derived?: boolean
  is_compound?: boolean
  is_base?: boolean
  is_anchor?: boolean
  is_word?: boolean
  is_multi_word?: boolean
  is_affix?: boolean
  is_prefix?: boolean
  is_suffix?: boolean
  is_infix?: boolean
  is_circumfix?: boolean
  is_flow?: boolean
  is_punctuation?: boolean
  punctuation_type?: string
  is_function?: boolean
  is_content?: boolean
  is_reference?: boolean
  is_quantity?: boolean
  is_numeral?: boolean
  is_action?: boolean
  is_object?: boolean
  is_modifier?: boolean
  is_feature?: boolean
  modifies?: string
  is_sentence_subject?: boolean
  is_sentence_object?: boolean
  is_substitute?: boolean
  is_possessive?: boolean
  is_dependent?: boolean
  has_predictable_meaning?: boolean
  structure?: LanguageFlowVariantStructure
  role?: LanguageFlowVariantRole
  arity?: number
  tense?: LanguageFlowVariantTense
  relativity?: LanguageFlowVariantRelativity
  concreteness?: LanguageFlowVariantConcreteness
  continuity?: LanguageFlowVariantContinuity
}

export type LanguageFlowVariantConcreteness = 'abstract' | 'concrete'

export type LanguageFlowVariantContinuity =
  | 'bounded'
  | 'ongoing'
  | 'repetitive'
  | 'continuous'
  | 'fixed'
  | 'evolving'

export type LanguageFlowVariantRelativity = 'relative' | 'absolute'

export type LanguageFlowVariantRole =
  | 'noun'
  | 'verb'
  | 'coverb'
  | 'adjective'
  | 'pronoun'
  | 'preposition'
  | 'suffix'
  | 'infix'
  | 'prefix'
  | 'adverb'
  | 'participle'
  | 'particle'
  | 'article'
  | 'determiner'
  | 'numeral'
  | 'conjunction'
  | 'interjection'
  | 'auxiliary_verb'
  | 'clitic'
  | 'marker'
  | 'copula'
  | 'gerund'
  | 'acronym'
  | 'demonstrative'

export type LanguageFlowVariantStructure =
  | 'task'
  | 'object'
  | 'design'
  | 'other'
  | 'unknown'

export type LanguageFlowVariantTense =
  | 'past'
  | 'present'
  | 'future'
  | 'nonpast'
  | 'nonfuture'
export type LanguageHighlightedSentence = {
  id: string
  text: string
  highlighted_indices: object
}
export type RemoveAudioFromVideoWithFfmpeg = {
  input: string
}
export type RemoveAudioFromVideoWithFfmpegUsingFilePaths = {
  inputPath: string
  outputPath: string
  native: HTMLDivElement
}
export type Script = {
  title: string
  id: string
  slug: string
  code?: string
  is_rtl?: boolean
  is_vertical?: boolean
  category: string
}
export type SomethingWithEnum = {
  list: Array<'foo' | 'bar'>
  item: 'hello-world'
}
export type TestCase =
  | {
      id: string
      slug: string
      text: string
      language: Language
      variants: Array<LanguageFlowVariant>
    }
  | {
      random: string
    }
export type TestUnion =
  | RemoveAudioFromVideoWithFfmpeg
  | RemoveAudioFromVideoWithFfmpegUsingFilePaths
export type Top = {
  id: string
  subtitle_codec: FfmpegSubtitleCodec
  children: Array<Top>
  parent?: Top
  nested?: TopNested
  again: Array<TopNested>
  leaf?: string
}
export type TopNested = {
  id: string
  bond: number
}
export type TransliterationSystem = {
  id: string
  slug: string
  title: string
  source: {
    language: Language
    script: Language
  }
  target: {
    language: Language
    script: Language
  }
}
