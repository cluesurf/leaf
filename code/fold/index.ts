/**
 * @cluesurf/flow — a unified AST for values, computations,
 * control flow, templates, and views.
 *
 * Spec: note/library/flow/.
 *
 * The `flow` namespace export bundles every builder helper
 * and renderer entry under one import:
 *
 *   import { make } from '@cluesurf/calm'
 *   const tree = make.branch(make.gt(make.path('count'), 0), ...)
 *   const out = make.renderText(tree, { scope: make.scope({ count: 5 }) })
 *
 * Extension via the render context:
 *
 *   make.renderText(tree, {
 *     scope: make.scope({ count: 5 }),
 *     hook: {
 *       reverse: ({ value }) =>
 *         String(value).split('').reverse().join(''),
 *     },
 *   })
 *
 * `hook` is the same `HookHash` used by `Base.hook` at codegen
 * time — one name → function table covers built-in operators,
 * custom call operators, and task implementations. Custom
 * transformations show up in the tree as `make.call('reverse',
 * { value: ... })` and resolve through the same dispatch path.
 */

import * as builders from './build'
import { evaluateText, makeScope, renderText } from './render'
import {
  buildDecodeTable as buildDecodeTableImpl,
  compile as compileImpl,
  decompile as decompileImpl,
} from './compile'

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
  HashPrimitive,
  IndexSeg,
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
  TemplateStringPrimitive,
} from './types'

export { RESERVED_CAST_KEYS } from './types'

export type { Promotable } from './build'

export type {
  BaseContext,
  CallEntry,
  CallHandler,
  Scope,
  TextContext,
} from './render'

export {
  DEFAULT_HOOK,
  deepEq,
  evaluateText,
  getCall,
  isCast,
  makeScope,
  renderText,
} from './render'

export type { ElementBuilder, ElementContext } from './render/element'
export { renderElement } from './render/element'

export type { CodeTable, DecodeEntry, DecodeTable } from './compile'
export { compile, decompile, buildDecodeTable } from './compile'

export const make = {
  // promotion
  promote: builders.promote,

  // literals
  text: builders.text,
  integer: builders.integer,
  naturalNumber: builders.naturalNumber,
  number: builders.number,
  boolean: builders.boolean,
  date: builders.date,
  list: builders.list,
  templateString: builders.templateString,
  hash: builders.hash,

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

  // evaluation
  scope: makeScope,
  renderText,
  evaluate: evaluateText,

  // make/wake compile pass
  compile: compileImpl,
  decompile: decompileImpl,
  buildDecodeTable: buildDecodeTableImpl,

  // back-compat alias
  render: renderText,
} as const
