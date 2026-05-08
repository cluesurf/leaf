import { TEST } from '@cluesurf/form'
import { z } from 'zod'
import * as code from '~/test/test'

import {
  FfmpegStrictOption,
  LanguageFlowVariantConcreteness,
  LanguageFlowVariantContinuity,
  LanguageFlowVariantRelativity,
  LanguageFlowVariantRole,
  LanguageFlowVariantStructure,
  LanguageFlowVariantTense,
} from '~/test/hold'
import {
  FFMPEG_STRICT_OPTION,
  LANGUAGE_FLOW_VARIANT_CONCRETENESS,
  LANGUAGE_FLOW_VARIANT_CONTINUITY,
  LANGUAGE_FLOW_VARIANT_RELATIVITY,
  LANGUAGE_FLOW_VARIANT_ROLE,
  LANGUAGE_FLOW_VARIANT_STRUCTURE,
  LANGUAGE_FLOW_VARIANT_TENSE,
} from '~/test/hold/base'
import {
  FfmpegAudioCodecParser,
  FfmpegSubtitleCodecParser,
  FfmpegVideoCodecParser,
} from '~/test/hold/ffmpeg/take'

export const AddAudioToVideoWithFfmpegParser = z.object({
  audioCodec: z.string(),
  fit: z.boolean(),
  inputAudio: z.string(),
  inputVideo: z.string(),
})

export type AddAudioToVideoWithFfmpegRecord = z.infer<
  typeof AddAudioToVideoWithFfmpegParser
>

export const AddAudioToVideoWithFfmpegUsingFilePathsParser = z.object({
  audioCodec: z.string(),
  fit: z.boolean(),
  inputAudioPath: z.string(),
  inputVideoPath: z.string(),
  outputPath: z.string(),
})

export type AddAudioToVideoWithFfmpegUsingFilePathsRecord = z.infer<
  typeof AddAudioToVideoWithFfmpegUsingFilePathsParser
>

export const AudioRecordingParser = z.object({
  citation: z.lazy(() => CitationParser),
  file: z.instanceof(AudioFile),
})

export type AudioRecordingRecord = z.infer<typeof AudioRecordingParser>

export const CitationParser = z.object({
  link: z.string(),
})

export type CitationRecord = z.infer<typeof CitationParser>

export const ConvertVideoToAudioWithFfmpegParser = z.object({
  inputPath: z.string(),
  outputPath: z.string(),
})

export type ConvertVideoToAudioWithFfmpegRecord = z.infer<
  typeof ConvertVideoToAudioWithFfmpegParser
>

export const ConvertVideoWithFfmpegParser = z.object({
  input: z.instanceof(ArrayBuffer),
  output: z.instanceof(ArrayBuffer),
  audioBitRate: z.number().int(),
  audioChannels: z.number().int(),
  audioCodec: z.lazy(() => FfmpegAudioCodecParser),
  audioSamplingFrequency: z.number(),
  duration: z.number().int(),
  endTime: z.union([
    z.number().refine(TEST('endTime', code.test_time_string.test)),
    z.string().refine(TEST('endTime', code.test_time_string.test)),
  ]),
  frameRate: z.number().int(),
  rotation: z.number(),
  scaleHeight: z.number().int(),
  scaleWidth: z.number().int(),
  startTime: z.number().int(),
  strict: z.boolean(),
  subtitleCodec: z.lazy(() => FfmpegSubtitleCodecParser),
  videoBitRate: z.number().int(),
  videoCodec: z.lazy(() => FfmpegVideoCodecParser),
})

export type ConvertVideoWithFfmpegRecord = z.infer<
  typeof ConvertVideoWithFfmpegParser
>

export const ConvertVideoWithFfmpegUsingFileNodePathsParser = z
  .object({
    inputPath: z.string(),
    outputPath: z.string(),
    audioBitRate: z.number().int(),
    audioChannels: z.number().int(),
    audioCodec: z.lazy(() => FfmpegAudioCodecParser),
    audioSamplingFrequency: z.number(),
    duration: z.number().int(),
    endTime: z.union([
      z.number().refine(TEST('endTime', code.test_time_string.test)),
      z.string().refine(TEST('endTime', code.test_time_string.test)),
    ]),
    frameRate: z.number().int(),
    rotation: z.number(),
    scaleHeight: z.number().int(),
    scaleWidth: z.number().int(),
    startTime: z.number().int(),
    strict: z.boolean(),
    subtitleCodec: z.lazy(() => FfmpegSubtitleCodecParser),
    videoBitRate: z.number().int(),
    videoCodec: z.lazy(() => FfmpegVideoCodecParser),
  })
  .passthrough()

export type ConvertVideoWithFfmpegUsingFileNodePathsRecord = z.infer<
  typeof ConvertVideoWithFfmpegUsingFileNodePathsParser
>

export const DataFormParser = z.object({
  intraFrameOnly: z.boolean(),
  label: z.string(),
  lossless: z.boolean(),
  lossy: z.boolean(),
  supportsDecoding: z.boolean(),
  supportsEncoding: z.boolean(),
  type: z.string(),
})

export type DataFormRecord = z.infer<typeof DataFormParser>

export const FfmpegStrictOptionParser = z.enum(
  FFMPEG_STRICT_OPTION as readonly [string, ...string[]],
) as z.ZodType<FfmpegStrictOption>

export const LanguageParser = z.object({
  id: z.string(),
  slug: z.string(),
  iso639_1: z.string(),
  iso639_2: z.string(),
  iso639_3: z.string(),
  category: z.string(),
  title: z.string(),
  flow_count: z.number().int().gte(1).lte(1000).default(0),
  flows: z.array(z.lazy(() => LanguageFlowParser)),
  is_natural: z.optional(z.boolean()),
  is_constructed: z.optional(z.boolean()),
})

export type LanguageRecord = z.infer<typeof LanguageParser>

export const LanguageFlowParser = z.object({
  id: z.string(),
  slug: z.string(),
  text: z.string(),
  language: z.lazy(() => LanguageParser),
  variants: z.array(z.lazy(() => LanguageFlowVariantParser)),
})

export type LanguageFlowRecord = z.infer<typeof LanguageFlowParser>

export const LanguageFlowDerivationParser = z.object({
  id: z.string(),
  base: z.lazy(() => LanguageFlowVariantParser),
  category: z.string(),
})

export type LanguageFlowDerivationRecord = z.infer<
  typeof LanguageFlowDerivationParser
>

export const LanguageFlowElementParser = z.object({
  id: z.string(),
  derivation: z.lazy(() => LanguageFlowDerivationParser),
  source: z.lazy(() => LanguageFlowVariantParser),
})

export type LanguageFlowElementRecord = z.infer<
  typeof LanguageFlowElementParser
>

export const LanguageFlowExampleParser = z.object({
  id: z.string(),
  sense: z.lazy(() => LanguageFlowSenseParser),
  sentence: z.lazy(() => LanguageHighlightedSentenceParser),
})

export type LanguageFlowExampleRecord = z.infer<
  typeof LanguageFlowExampleParser
>

export const LanguageFlowGlossParser = z.object({
  id: z.string(),
  variant: z.lazy(() => LanguageFlowVariantParser),
  fragments: z.array(z.lazy(() => LanguageFlowGlossFragmentParser)),
})

export type LanguageFlowGlossRecord = z.infer<
  typeof LanguageFlowGlossParser
>

export const LanguageFlowGlossFragmentParser = z.object({
  id: z.string(),
  text: z.string(),
  symbols: z.string(),
})

export type LanguageFlowGlossFragmentRecord = z.infer<
  typeof LanguageFlowGlossFragmentParser
>

export const LanguageFlowListParser = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  items: z.array(z.lazy(() => LanguageFlowParser)),
})

export type LanguageFlowListRecord = z.infer<
  typeof LanguageFlowListParser
>

export const LanguageFlowPronunciationParser = z.object({
  id: z.string(),
  script: z.lazy(() => ScriptParser),
  system: z.lazy(() => TransliterationSystemParser),
  variant: z.lazy(() => LanguageFlowVariantParser),
  text: z.lazy(() => LanguageFlowVariantParser),
  position: z.optional(z.number().int()).default(0),
  syllable: z.optional(
    z.object({
      count: z.optional(z.number().int()),
      mark: z.optional(z.object({}).passthrough()),
      is_exact: z.optional(z.boolean()),
    }),
  ),
  recordings: z.array(z.lazy(() => AudioRecordingParser)),
})

export type LanguageFlowPronunciationRecord = z.infer<
  typeof LanguageFlowPronunciationParser
>

export const LanguageFlowSenseParser = z.object({
  id: z.string(),
  variant: z.lazy(() => LanguageFlowVariantParser),
  parent: z.optional(z.lazy(() => LanguageFlowSenseParser)),
  position: z.optional(z.number().int()).default(0),
})

export type LanguageFlowSenseRecord = z.infer<
  typeof LanguageFlowSenseParser
>

export const LanguageFlowTranscriptionParser = z.object({
  id: z.string(),
  script: z.lazy(() => ScriptParser),
  system: z.lazy(() => TransliterationSystemParser),
  variant: z.lazy(() => LanguageFlowVariantParser),
  text: z.string(),
  position: z.optional(z.number().int()).default(0),
  is_phonetic: z.optional(z.boolean()).default(false),
  is_canonical: z.optional(z.boolean()),
})

export type LanguageFlowTranscriptionRecord = z.infer<
  typeof LanguageFlowTranscriptionParser
>

export const LanguageFlowTranslationParser = z.object({
  id: z.string(),
  source: z.lazy(() => LanguageFlowVariantParser),
  target: z.lazy(() => LanguageFlowVariantParser),
})

export type LanguageFlowTranslationRecord = z.infer<
  typeof LanguageFlowTranslationParser
>

export const LanguageFlowTranslationListParser = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  source: z.object({
    language: z.lazy(() => LanguageParser),
    script: z.lazy(() => LanguageParser),
  }),
  target: z.object({
    language: z.lazy(() => LanguageParser),
    script: z.lazy(() => LanguageParser),
  }),
  items: z.array(z.lazy(() => LanguageFlowTranslationListItemParser)),
})

export type LanguageFlowTranslationListRecord = z.infer<
  typeof LanguageFlowTranslationListParser
>

export const LanguageFlowTranslationListItemParser = z.object({
  id: z.string(),
  list: z.lazy(() => LanguageFlowTranslationListParser),
  translation: z.lazy(() => LanguageFlowTranslationParser),
  position: z.optional(
    z.object({
      row: z.optional(z.number().int()).default(0),
      column: z.optional(z.number().int()).default(0),
    }),
  ),
})

export type LanguageFlowTranslationListItemRecord = z.infer<
  typeof LanguageFlowTranslationListItemParser
>

export const LanguageFlowVariantParser = z.object({
  id: z.string(),
  flow: z.optional(z.lazy(() => LanguageFlowParser)),
  context: z.optional(z.number().int()),
  is_derived: z.optional(z.boolean()),
  is_compound: z.optional(z.boolean()),
  is_base: z.optional(z.boolean()),
  is_anchor: z.optional(z.boolean()),
  is_word: z.optional(z.boolean()),
  is_multi_word: z.optional(z.boolean()),
  is_affix: z.optional(z.boolean()),
  is_prefix: z.optional(z.boolean()),
  is_suffix: z.optional(z.boolean()),
  is_infix: z.optional(z.boolean()),
  is_circumfix: z.optional(z.boolean()),
  is_flow: z.optional(z.boolean()),
  is_punctuation: z.optional(z.boolean()),
  punctuation_type: z.optional(z.string()),
  is_function: z.optional(z.boolean()),
  is_content: z.optional(z.boolean()),
  is_reference: z.optional(z.boolean()),
  is_quantity: z.optional(z.boolean()),
  is_numeral: z.optional(z.boolean()),
  is_action: z.optional(z.boolean()),
  is_object: z.optional(z.boolean()),
  is_modifier: z.optional(z.boolean()),
  is_feature: z.optional(z.boolean()),
  modifies: z.optional(z.string()),
  is_sentence_subject: z.optional(z.boolean()),
  is_sentence_object: z.optional(z.boolean()),
  is_substitute: z.optional(z.boolean()),
  is_possessive: z.optional(z.boolean()),
  is_dependent: z.optional(z.boolean()),
  has_predictable_meaning: z.optional(z.boolean()),
  structure: z.optional(
    z.lazy(() => LanguageFlowVariantStructureParser),
  ),
  role: z.optional(z.lazy(() => LanguageFlowVariantRoleParser)),
  arity: z.optional(z.number().int()),
  tense: z.optional(z.lazy(() => LanguageFlowVariantTenseParser)),
  relativity: z.optional(
    z.lazy(() => LanguageFlowVariantRelativityParser),
  ),
  concreteness: z.optional(
    z.lazy(() => LanguageFlowVariantConcretenessParser),
  ),
  continuity: z.optional(
    z.lazy(() => LanguageFlowVariantContinuityParser),
  ),
})

export type LanguageFlowVariantRecord = z.infer<
  typeof LanguageFlowVariantParser
>

export const LanguageFlowVariantConcretenessParser = z.enum(
  LANGUAGE_FLOW_VARIANT_CONCRETENESS as readonly [string, ...string[]],
) as z.ZodType<LanguageFlowVariantConcreteness>

export const LanguageFlowVariantContinuityParser = z.enum(
  LANGUAGE_FLOW_VARIANT_CONTINUITY as readonly [string, ...string[]],
) as z.ZodType<LanguageFlowVariantContinuity>

export const LanguageFlowVariantRelativityParser = z.enum(
  LANGUAGE_FLOW_VARIANT_RELATIVITY as readonly [string, ...string[]],
) as z.ZodType<LanguageFlowVariantRelativity>

export const LanguageFlowVariantRoleParser = z.enum(
  LANGUAGE_FLOW_VARIANT_ROLE as readonly [string, ...string[]],
) as z.ZodType<LanguageFlowVariantRole>

export const LanguageFlowVariantStructureParser = z.enum(
  LANGUAGE_FLOW_VARIANT_STRUCTURE as readonly [string, ...string[]],
) as z.ZodType<LanguageFlowVariantStructure>

export const LanguageFlowVariantTenseParser = z.enum(
  LANGUAGE_FLOW_VARIANT_TENSE as readonly [string, ...string[]],
) as z.ZodType<LanguageFlowVariantTense>

export const LanguageHighlightedSentenceParser = z.object({
  id: z.string(),
  text: z.string(),
  highlighted_indices: z.object({}).passthrough(),
})

export type LanguageHighlightedSentenceRecord = z.infer<
  typeof LanguageHighlightedSentenceParser
>

export const RemoveAudioFromVideoWithFfmpegParser = z.object({
  input: z.string(),
})

export type RemoveAudioFromVideoWithFfmpegRecord = z.infer<
  typeof RemoveAudioFromVideoWithFfmpegParser
>

export const RemoveAudioFromVideoWithFfmpegUsingFilePathsParser =
  z.object({
    inputPath: z.string(),
    outputPath: z.string(),
    native: z.instanceof(HTMLDivElement),
  })

export type RemoveAudioFromVideoWithFfmpegUsingFilePathsRecord =
  z.infer<typeof RemoveAudioFromVideoWithFfmpegUsingFilePathsParser>

export const ScriptParser = z.object({
  title: z.string(),
  id: z.string(),
  slug: z.string(),
  code: z.optional(z.string()),
  is_rtl: z.optional(z.boolean()).default(false),
  is_vertical: z.optional(z.boolean()).default(false),
  category: z.enum(['alphabet', 'abugida', 'syllabary', 'logographic']),
})

export type ScriptRecord = z.infer<typeof ScriptParser>

export const SomethingWithEnumParser = z.object({
  list: z.array(z.enum(['foo', 'bar'])),
  item: z.literal('hello-world'),
})

export type SomethingWithEnumRecord = z.infer<
  typeof SomethingWithEnumParser
>

export const TestCaseParser = z.union([
  z.object({
    id: z.string(),
    slug: z.string(),
    text: z.string(),
    language: z.lazy(() => LanguageParser),
    variants: z.array(z.lazy(() => LanguageFlowVariantParser)),
  }),
  z.object({
    random: z.string(),
  }),
])

export type TestCaseRecord = z.infer<typeof TestCaseParser>

export const TestUnionParser = z.union([
  z.lazy(() => RemoveAudioFromVideoWithFfmpegParser),
  z.lazy(() => RemoveAudioFromVideoWithFfmpegUsingFilePathsParser),
])

export type TestUnionRecord = z.infer<typeof TestUnionParser>

export const TopParser = z.object({
  id: z.string(),
  subtitle_codec: z.lazy(() => FfmpegSubtitleCodecParser),
  children: z.array(z.lazy(() => TopParser)),
  parent: z.optional(z.lazy(() => TopParser)),
  nested: z.optional(z.lazy(() => TopNestedParser)),
  again: z.array(z.lazy(() => TopNestedParser)),
  leaf: z.optional(z.string()),
})

export type TopRecord = z.infer<typeof TopParser>

export const TopNestedParser = z.object({
  id: z.string(),
  bond: z.number().int(),
})

export type TopNestedRecord = z.infer<typeof TopNestedParser>

export const TransliterationSystemParser = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  source: z.object({
    language: z.lazy(() => LanguageParser),
    script: z.lazy(() => LanguageParser),
  }),
  target: z.object({
    language: z.lazy(() => LanguageParser),
    script: z.lazy(() => LanguageParser),
  }),
})

export type TransliterationSystemRecord = z.infer<
  typeof TransliterationSystemParser
>
