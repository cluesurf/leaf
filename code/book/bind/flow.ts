/**
 * Hook implementations for the `bind` verb.
 *
 * Eager-arg form: by the time the handler runs, `names` and
 * `then` have already been evaluated. The handler simply
 * passes `then` through. The actual scope-pushing work
 * happens in the renderer when it encounters a `bind` Call,
 * if a future renderer adds that special-form treatment.
 */

export const bind = ({
  then,
}: {
  names: Record<string, unknown>
  then: unknown
}): unknown => {
  return then
}
