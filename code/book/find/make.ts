/**
 * Authored Flow declarations for the `find` verb.
 *
 * Async lookups: record fetch, enum members, page lookup,
 * etc. Hosts implement these by wiring their data layer into
 * the matching `flow.ts` handlers; the runtime batches by
 * Flow identity for round-trip efficiency.
 *
 * The AST-side `find` primitive (`make.find(resource, ...)`)
 * resolves through `context.find` separately — that's the
 * inline-tree variant.
 */

import type { Flow } from '@/form'

export const findRecord: Flow = {
  form: 'flow',
  save: 'find',
  call: 'find',
  case: 'record',
  take: {
    resource: { like: 'string' },
    id: { like: 'string' },
  },
  make: 'unknown',
}

export const findList: Flow = {
  form: 'flow',
  save: 'find',
  call: 'find',
  case: 'list',
  take: {
    resource: { like: 'string' },
    where: { like: 'unknown', need: false },
    limit: { like: 'natural_number', need: false },
    offset: { like: 'natural_number', need: false },
  },
  make: 'unknown',
}

export const findCount: Flow = {
  form: 'flow',
  save: 'find',
  call: 'find',
  case: 'count',
  take: {
    resource: { like: 'string' },
    where: { like: 'unknown', need: false },
  },
  make: 'natural_number',
}

export const findEnum: Flow = {
  form: 'flow',
  save: 'find',
  call: 'find',
  case: 'enum',
  take: {
    name: { like: 'string' },
  },
  make: 'unknown',
}
