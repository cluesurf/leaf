export * from './form'
export * from './tool'
export { Base } from './base'
export type {
  BareFlowName,
  BaseConfig,
  Code,
  FlowBaseValue,
  FlowCaseValue,
  FlowHook,
  FlowLike,
  FlowName,
  FlowOptions,
  FlowResolve,
  FlowTake,
} from './base'
export type { BindResult, TreePatch } from './base'

// `make` is the AST-builder namespace. Compile is the only
// other public entry — used to bake authored trees into the
// integer-keyed wake form before shipping.
export {
  make,
  compile,
  decompile,
  buildDecodeTable,
  RESERVED_CAST_KEYS,
} from './fold'

export type {
  Call,
  CaseArm,
  CaseDefaultArm,
  CasePrimitive,
  CaseTestArm,
  CaseValueArm,
  Cast,
  CodeTable,
  ControlFlow,
  DecodeEntry,
  DecodeTable,
  FieldSeg,
  FindPrimitive,
  FoldPrimitive,
  ForkPrimitive,
  HashPrimitive,
  IndexSeg,
  JoinPrimitive,
  ListPrimitive,
  Literal,
  MatchPrimitive,
  Meta,
  PickPrimitive,
  Promotable,
  ReadLink,
  ReadPrimitive,
  Reference,
  SliceSeg,
  Structural,
  SwitchPrimitive,
  TextPrimitive,
  VariableSeg,
  ViewPrimitive,
  WalkPrimitive,
} from './fold'
