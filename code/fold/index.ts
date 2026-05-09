/**
 * @cluesurf/bead fold tree — a unified AST for values,
 * computations, control flow, templates, and views.
 *
 * `make` is the **builder namespace**: every export is a pure
 * function that constructs a Cast (JSON node). It does not
 * include rendering, scope, or compile — those live as
 * standalone functions on the package root so the `make`
 * surface stays focused on data construction:
 *
 *   import { make, makeScope, renderText, compile } from '@cluesurf/bead'
 *
 *   const tree = make.fork(make.gt(make.read('count'), 0), 'on', 'off')
 *   const out  = renderText(tree, { scope: makeScope({ count: 5 }) })
 *   const wake = compile(tree, codeTable)
 */

import * as builders from './build'

export type {
  ForkPrimitive,
  Call,
  CaseArm,
  CaseDefaultArm,
  CasePrimitive,
  CaseTestArm,
  CaseValueArm,
  Cast,
  ControlFlow,
  FieldSeg,
  FindPrimitive,
  FoldPrimitive,
  HashPrimitive,
  IndexSeg,
  JoinPrimitive,
  ListPrimitive,
  Literal,
  MatchPrimitive,
  Meta,
  ReadPrimitive,
  ReadLink,
  PickPrimitive,
  Reference,
  SliceSeg,
  Structural,
  SwitchPrimitive,
  VariableSeg,
  ViewPrimitive,
  WalkPrimitive,
  TextPrimitive,
} from './types'

export { RESERVED_CAST_KEYS } from './types'

export type { Promotable } from './build'

export type {
  BaseContext,
  CallEntry,
  CallHandler,
} from './registry'
export { DEFAULT_HOOK, deepEq, getCall, isCast } from './registry'

export type { Scope } from './scope'
export { makeScope } from './scope'

export type { TextContext } from './text'
export { evaluateText, renderText } from './text'

export type { ElementBuilder, ElementContext } from './element'
export { renderElement } from './element'

export type { CodeTable, DecodeEntry, DecodeTable } from './compile'
export { compile, decompile, buildDecodeTable } from './compile'

export const make = {
  // promotion
  promote: builders.promote,

  // literals + structural
  integer: builders.integer,
  naturalNumber: builders.naturalNumber,
  number: builders.number,
  boolean: builders.boolean,
  date: builders.date,
  list: builders.list,
  text: builders.text,
  hash: builders.hash,
  join: builders.join,
  find: builders.find,
  fold: builders.fold,

  // reads
  reference: builders.reference,
  read: builders.read,
  path: builders.path, // back-compat alias of read
  variable: builders.variable,
  field: builders.field,
  idx: builders.idx,
  slice: builders.slice,

  // calls
  call: builders.call,
  eq: builders.eq,
  ne: builders.ne,
  gt: builders.gt,
  gte: builders.gte,
  lt: builders.lt,
  lte: builders.lte,
  in: builders.inOf,
  negate: builders.negate,
  and: builders.and,
  or: builders.or,
  isNull: builders.isNull,
  isEmpty: builders.isEmpty,
  count: builders.count,
  sum: builders.sum,
  mean: builders.mean,
  min: builders.min,
  max: builders.max,
  plural: builders.plural,
  length: builders.length,
  formatNumber: builders.formatNumber,
  currency: builders.currency,
  percent: builders.percent,
  formatDate: builders.formatDate,
  formatTime: builders.formatTime,
  relative: builders.relative,
  // back-compat aliases
  fmtNumber: builders.fmtNumber,
  fmtDate: builders.fmtDate,
  fmtTime: builders.fmtTime,

  // control flow
  fork: builders.fork,
  switch: builders.switchOn,
  match: builders.match,
  case: builders.caseOf,
  value: builders.valueArm,
  test: builders.testArm,
  otherwise: builders.otherwise,
  pick: builders.pick,
  walk: builders.walk,
  walkTest: builders.walkTest,
  walkSize: builders.walkSize,

  // views
  view: builders.view,

  // higher-order
  pluralCases: builders.pluralCases,
  selectCases: builders.selectCases,
} as const
