/**
 * Hook implementation for the `branch` verb.
 *
 * Eager value selector. Both `yes` and `no` are evaluated by
 * the caller; this picks one. For lazy / short-circuiting at
 * the AST level use `cast.fork(test, then, else)`.
 */

type BranchCase = {
  test: boolean
  yes?: unknown
  no?: unknown
}

type BranchInput = {
  test?: boolean
  yes?: unknown
  no?: unknown
  cases?: BranchCase[]
  fallback?: unknown
}

const branch = ({
  test,
  yes,
  no,
  cases,
  fallback,
}: BranchInput): unknown => {
  if (Array.isArray(cases) && cases.length > 0) {
    for (const arm of cases) {
      if (arm.test) return arm.yes ?? null
      if (arm.no !== undefined) return arm.no
    }
    return fallback ?? null
  }

  if (typeof test === 'boolean') {
    if (test) return yes ?? null
    return no ?? null
  }

  return null
}

const flow = {
  branch: branch,
}

export default flow
