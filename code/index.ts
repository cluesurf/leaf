export * from './form'
export * from './tool'
/**
 * Named examples and annotations, read off a Form's own `tour` and
 * `mark`. A documentation generator's entry point; nothing in the
 * codegen or runtime path reads these.
 */
export { readTour, readMark } from './tour'
export type { TourCase, TourMiss, TourRead } from './tour'
export { Base } from './base'
export type {
  BareFlowName,
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

// `cast` is the AST-builder namespace.
export { cast, RESERVED_CAST_KEYS } from './cast'

export type {
  Call,
  CaseArm,
  CaseDefaultArm,
  CaseTestArm,
  CaseValueArm,
  Cast,
  // `find` and `code` are primitives like the rest and were the two
  // missing from this list. A consumer resolving finds against its own
  // data hooks needs to name them, and with neither entry point
  // exposing them it had to derive them from the return type of
  // `extractFinds`.
  CodePrimitive,
  ControlFlow,
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
} from './cast'

export { Scope, makeScope } from './scope'
export {
  compile,
  compileFold,
  DEFAULT_HOOK,
  type BaseRenderContext,
  type CallHandler,
  type CompiledFold,
  type ElementBuilder,
  type FoldRender,
  type HandlerContext,
  type HookHash,
  type Mode,
  type Render,
} from './render'
