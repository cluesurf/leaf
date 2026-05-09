import type { Book, Flow, Form, Fold, Hash, List } from '@/form'

/**
 * Walk every registered Book's `cast` array and find any
 * identity-tuple collisions. Two declarations with the same
 * identity are duplicates. Returns one human-readable
 * description per duplicated tuple, empty when none.
 *
 * Identity:
 *   Form  → (name, flow?, case?)
 *   Flow  → (call, case?, take, make)
 *   Fold  → (case)
 *   Hash  → (name)
 *   List  → (name)
 */
export function collectCollisions(books: Book[]): string[] {
  const seen = new Map<string, { count: number; from: string[] }>()

  const bookLabel = (b: Book) =>
    b.host && b.name
      ? `${b.host}:${b.name}`
      : (b.host ?? b.name ?? '<anonymous>')

  for (const book of books) {
    const label = bookLabel(book)
    for (const cast of book.make ?? []) {
      let key: string
      switch (cast.form) {
        case 'form': {
          const c = cast
          key = `form:(name=${c.name}, flow=${c.flow ?? ''}, case=${c.case ?? ''})`
          break
        }
        case 'flow': {
          const f = cast
          const takeSig = JSON.stringify(f.take ?? null)
          const makeSig = JSON.stringify(f.make ?? null)
          key = `flow:(call=${f.call}, case=${f.case ?? ''}, take=${takeSig}, make=${makeSig})`
          break
        }
        case 'fold':
          key = `fold:(name=${cast.case})`
          break
        case 'hash':
          key = `hash:(name=${cast.name})`
          break
        case 'list':
          key = `list:(name=${cast.name})`
          break
        case 'seed':
          // Seeds are anonymous instances; no identity tuple to
          // collide on. Skip.
          continue
      }
      const entry = seen.get(key) ?? { count: 0, from: [] }
      entry.count += 1
      entry.from.push(label)
      seen.set(key, entry)
    }
  }

  const out: string[] = []
  for (const [key, { count, from }] of seen) {
    if (count > 1) {
      out.push(`${key} — appears ${count}× across [${from.join(', ')}]`)
    }
  }
  return out
}
