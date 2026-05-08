import {
  FfmpegStrictOption,
  LanguageFlowVariantConcreteness,
  LanguageFlowVariantContinuity,
  LanguageFlowVariantRelativity,
  LanguageFlowVariantRole,
  LanguageFlowVariantStructure,
  LanguageFlowVariantTense,
} from '~/test/hold'

export const FFMPEG_STRICT_OPTION: ReadonlyArray<FfmpegStrictOption> = [
  'very',
  'strict',
  'normal',
  'unofficial',
  'experimental',
]
export const LANGUAGE_FLOW_VARIANT_CONCRETENESS: ReadonlyArray<LanguageFlowVariantConcreteness> =
  ['abstract', 'concrete']
export const LANGUAGE_FLOW_VARIANT_CONTINUITY: ReadonlyArray<LanguageFlowVariantContinuity> =
  [
    'bounded',
    'ongoing',
    'repetitive',
    'continuous',
    'fixed',
    'evolving',
  ]
export const LANGUAGE_FLOW_VARIANT_RELATIVITY: ReadonlyArray<LanguageFlowVariantRelativity> =
  ['relative', 'absolute']
export const LANGUAGE_FLOW_VARIANT_ROLE: ReadonlyArray<LanguageFlowVariantRole> =
  [
    'noun',
    'verb',
    'coverb',
    'adjective',
    'pronoun',
    'preposition',
    'suffix',
    'infix',
    'prefix',
    'adverb',
    'participle',
    'particle',
    'article',
    'determiner',
    'numeral',
    'conjunction',
    'interjection',
    'auxiliary_verb',
    'clitic',
    'marker',
    'copula',
    'gerund',
    'acronym',
    'demonstrative',
  ]
export const LANGUAGE_FLOW_VARIANT_STRUCTURE: ReadonlyArray<LanguageFlowVariantStructure> =
  ['task', 'object', 'design', 'other', 'unknown']
export const LANGUAGE_FLOW_VARIANT_TENSE: ReadonlyArray<LanguageFlowVariantTense> =
  ['past', 'present', 'future', 'nonpast', 'nonfuture']
