/**
 * Hook implementations for the `if` verb.
 *
 * Eager-arg form: caller has already evaluated both `then`
 * and `else` and passes the resolved values. Use `make.fork`
 * (AST-side) for short-circuiting.
 */

export const fork = ({
  test,
  then,
  else: elseValue,
}: {
  test: boolean
  then: unknown
  else?: unknown
}): unknown => {
  return test ? then : (elseValue ?? null)
}
