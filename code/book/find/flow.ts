/**
 * Hook implementations for the `find` verb.
 *
 * Default implementations throw — these are placeholders.
 * Hosts override by registering their own handlers via
 * `base.flow('find', { base: 'record' }, async (...) => { ... })`
 * after the catalog book is loaded.
 */

const NOT_IMPLEMENTED = (verb: string) => () => {
  throw new Error(
    `find:${verb}: no handler registered. Override with ` +
      `base.flow('find', { base: '${verb}' }, ...) or supply ` +
      `a host-specific Book.`,
  )
}

export const findRecord = NOT_IMPLEMENTED('record')
export const findList = NOT_IMPLEMENTED('list')
export const findCount = NOT_IMPLEMENTED('count')
export const findEnum = NOT_IMPLEMENTED('enum')
