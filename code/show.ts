/**
 * Named examples, composed from the shape that declares them.
 *
 * A field carries `show: { by_weight: 800 }`, and every field
 * mentioning `by_weight` contributes its value to an example of that
 * name. The example lives BESIDE THE FIELD IT VARIES rather than as
 * one blob at the top of the declaration, which is the same argument
 * that puts `note` there: a shape and its documentation move together
 * or they drift apart.
 *
 * ## Composition, and why `base` is doing the real work
 *
 * A per-field example on its own produces a FRAGMENT. If only
 * `weight` declares `by_weight`, the naive answer is `{ weight: 800 }`
 * — not a request anybody can paste, because every required field is
 * missing.
 *
 * So each field resolves in order:
 *
 *   show[name]  ??  base  ??  a value synthesised from like / take
 *
 * `base` is "what this field usually is" and `show` is "what it is in
 * this scenario", so every named example comes out COMPLETE with the
 * interesting field standing out. That is the difference between an
 * example somebody pastes and one they have to finish.
 *
 * ## Lists
 *
 * On a `list: true` field, `show` gives ONE ELEMENT and the walker
 * wraps it. An array passes through untouched, which is how a caller
 * says "these exact elements". Without the rule, a single value and a
 * one-element array would be indistinguishable and half the examples
 * would come out double-wrapped.
 *
 * ## Unions
 *
 * `like: [A, B, C]` is a union of shapes, which is how a `mutate`
 * request models its create / update / remove call. A named example
 * SELECTS THE MEMBER WHOSE FIELDS DECLARE THAT NAME, so annotating
 * the fields under `create` is all it takes to document a create.
 * Nothing declares it, so member 0. More than one member declares it,
 * and that is reported rather than guessed at: picking silently would
 * make an example that is right about its values and wrong about its
 * shape.
 *
 * A discriminant needs no annotation at all. `form: { take:
 * ['create'] }` has a single-value `take`, so synthesis emits
 * `'create'` on its own and the union member labels itself.
 *
 * ## What is NOT here
 *
 * No Form-level `show`. Every leaf of every shape is a `Link`,
 * including the ones inside a union member, so per-field annotation
 * reaches everywhere and a wholesale override would only be a second
 * way to say the same thing.
 */

import type { Form, Link, LinkMesh, Mark } from '@/form'

/** A named example, and the fields that had a hand in it. */
export type ShowCase = {
  /** The example name, as written in a `show` key. */
  name: string
  /** The composed value. Complete, not a fragment. */
  base: unknown
  /**
   * Dotted paths of the fields that declared this name. The count is
   * what makes a typo visible: `by_weight` with three contributors
   * beside `byWeight` with one is a misspelling, not two examples.
   */
  from: string[]
}

export type ShowMiss = {
  /** Dotted path of the field, or `''` for the shape itself. */
  path: string
  /** What is wrong, in one sentence. */
  note: string
  /** The example name, when the fault belongs to one. */
  name?: string
}

export type ShowRead = {
  case: ShowCase[]
  /**
   * Everything wrong, rather than the first thing wrong. A generator
   * reports the list and a caller fixes them in one pass.
   */
  miss: ShowMiss[]
}

/** Is this shape a union of meshes rather than one mesh? */
function isUnion(like: Form['like']): like is LinkMesh[] {
  return Array.isArray(like)
}

/** Every example name any field in a mesh declares, in first-seen order. */
function readNames(mesh: LinkMesh, into: string[] = []): string[] {
  for (const link of Object.values(mesh)) {
    for (const name of Object.keys(link.show ?? {})) {
      if (!into.includes(name)) {
        into.push(name)
      }
    }

    const nested = link.like

    if (nested && typeof nested === 'object') {
      for (const one of Array.isArray(nested) ? nested : [nested]) {
        if (typeof one === 'object') {
          readNames(one as LinkMesh, into)
        }
      }
    }
  }

  return into
}

/** Does any field in this mesh declare the name, at any depth? */
function declares(mesh: LinkMesh, name: string): boolean {
  return readNames(mesh).includes(name)
}

/** Is this mark present? */
function marked(mark: Mark[] | undefined, form: Mark['form']): boolean {
  return Boolean(mark?.some(one => one.form === form))
}

/**
 * A value for a field nobody gave one for.
 *
 * DELIBERATELY DULL, and never `'string'`. A placeholder that looks
 * like a type name teaches a reader nothing and is the reason so many
 * generated references read as unfinished. A single-value `take` is
 * the best case and needs no help: it IS the answer.
 */
function guess(link: Link): unknown {
  if (Array.isArray(link.take) && link.take.length) {
    return link.take[0]
  }

  const like = link.like

  if (typeof like === 'string') {
    switch (like) {
      case 'boolean':
        return false
      case 'number':
      case 'integer':
      case 'natural_number':
      case 'decimal':
        return 0
      default:
        return null
    }
  }

  // A nested shape with nothing declared under it is an empty object
  // rather than null, so the example keeps the shape's structure.
  if (like && typeof like === 'object') {
    return {}
  }

  return null
}

/**
 * Does a value agree with what the field says it is?
 *
 * The point of the whole validator: an example that disagrees with
 * its own schema is worse than no example, because a reader builds
 * against it and finds out at runtime.
 */
function refuse({
  link,
  value,
  path,
  name,
}: {
  link: Link
  value: unknown
  path: string
  name?: string
}): ShowMiss[] {
  const miss: ShowMiss[] = []

  // A list takes one element or an array of them, and either is fine.
  // Unwrap before checking the element type.
  const one =
    link.list && Array.isArray(value) ? (value[0] ?? null) : value

  if (link.list === undefined && Array.isArray(value)) {
    miss.push({
      path,
      name,
      note: 'an array on a field that is not a list',
    })
  }

  if (Array.isArray(link.take) && link.take.length) {
    const held = link.list && Array.isArray(value) ? value : [one]

    for (const each of held) {
      if (!link.take.includes(each as never)) {
        miss.push({
          path,
          name,
          note: `${JSON.stringify(each)} is not one of ${link.take
            .map(x => JSON.stringify(x))
            .join(', ')}`,
        })
      }
    }

    return miss
  }

  if (typeof link.like === 'string' && one !== null) {
    const want = link.like
    const got = typeof one

    const agrees =
      (want === 'string' && got === 'string') ||
      (want === 'boolean' && got === 'boolean') ||
      ((want === 'number' ||
        want === 'integer' ||
        want === 'decimal' ||
        want === 'natural_number') &&
        got === 'number')

    // Only the primitives are checked. `like: 'other_form'` is a
    // reference this module cannot resolve, and refusing what it
    // cannot check would fail every legitimate nested example.
    const known = [
      'string',
      'boolean',
      'number',
      'integer',
      'decimal',
      'natural_number',
    ].includes(want)

    if (known && !agrees) {
      miss.push({
        path,
        name,
        note: `${JSON.stringify(one)} is a ${got} on a field declared ${want}`,
      })
    }
  }

  return miss
}

/** Compose one mesh for one example name. */
function walk({
  mesh,
  name,
  path,
  miss,
  from,
}: {
  mesh: LinkMesh
  name: string
  path: string
  miss: ShowMiss[]
  from: string[]
}): Record<string, unknown> {
  const out: Record<string, unknown> = {}

  for (const [key, link] of Object.entries(mesh)) {
    const here = path ? `${path}.${key}` : key

    // AN INTERNAL FIELD IS NOT IN THE EXAMPLE, for the same reason it
    // is not in the reference: an example is a promise about the
    // shape, and showing a field nobody may rely on makes a promise
    // nobody meant.
    if (marked(link.mark, 'internal')) {
      continue
    }

    const told = Object.prototype.hasOwnProperty.call(
      link.show ?? {},
      name,
    )

    if (told) {
      from.push(here)

      const value = link.show![name]

      miss.push(...refuse({ link, value, path: here, name }))

      out[key] = link.list && !Array.isArray(value) ? [value] : value
      continue
    }

    // Not told, so fall back. A nested shape recurses first, because
    // a field deeper down may have been told even when this one was
    // not.
    const like = link.like

    if (like && typeof like === 'object') {
      const member = isUnion(like as Form['like'])
        ? pick({ union: like as LinkMesh[], name, path: here, miss })
        : (like as LinkMesh)

      const inner = walk({ mesh: member, name, path: here, miss, from })

      out[key] = link.list ? [inner] : inner
      continue
    }

    if (link.base !== undefined) {
      miss.push(
        ...refuse({ link, value: link.base, path: here, name: undefined }),
      )

      out[key] =
        link.list && !Array.isArray(link.base) ? [link.base] : link.base
      continue
    }

    /*
     * AN OPTIONAL FIELD WITH NO DEFAULT IS LEFT OUT, not emitted as
     * null.
     *
     * Found by running this over real Forms: a font search came out
     * as `{"test":{"weight":700},"sample":null,"page":1,"size":100,
     * "cursor":null}`, and nobody would paste that. `sample` and
     * `cursor` are optional and undefaulted, so the honest example of
     * a request that does not use them is a request that does not
     * mention them.
     *
     * COMPLETE STILL MEANS COMPLETE. Every field a caller MUST send
     * is present, and so is every optional field carrying a default,
     * because `page: 1` and `size: 100` are what the server will use
     * and a reader wants to see them. What goes is the noise.
     */
    if (link.need === false) {
      continue
    }

    const made = guess(link)

    out[key] = link.list ? [made] : made
  }

  return out
}

/**
 * Which union member a named example means.
 *
 * The one that declares the name. Nothing declares it, member 0.
 * Several declare it, and that is a fault rather than a coin toss:
 * the example would be right about its values and wrong about its
 * shape, which is the hardest kind of wrong to spot in a document.
 */
function pick({
  union,
  name,
  path,
  miss,
}: {
  union: LinkMesh[]
  name: string
  path: string
  miss: ShowMiss[]
}): LinkMesh {
  const held = union
    .map((mesh, at) => ({ mesh, at }))
    .filter(one => declares(one.mesh, name))

  if (held.length > 1) {
    miss.push({
      path,
      name,
      note: `declared in ${held.length} union members (${held
        .map(one => one.at)
        .join(', ')}), so the shape is ambiguous`,
    })
  }

  return held[0]?.mesh ?? union[0]!
}

/**
 * Every named example a Form declares, composed and checked.
 *
 * Returns the cases AND everything wrong with them, rather than
 * throwing on the first fault: a generator wants to report the whole
 * list so a caller fixes them in one pass.
 */
export function readShow(form: Form): ShowRead {
  const miss: ShowMiss[] = []

  if (marked(form.mark, 'internal')) {
    return { case: [], miss }
  }

  const union = isUnion(form.like)
  const meshes = union ? (form.like as LinkMesh[]) : [form.like as LinkMesh]

  const names: string[] = []

  for (const mesh of meshes) {
    readNames(mesh, names)
  }

  const out: ShowCase[] = []

  for (const name of names) {
    const from: string[] = []

    const mesh = union
      ? pick({ union: meshes, name, path: '', miss })
      : meshes[0]!

    out.push({
      name,
      base: walk({ mesh, name, path: '', miss, from }),
      from,
    })
  }

  return { case: out, miss }
}

/**
 * Every mark of one kind on a Form and its fields, by dotted path.
 *
 * What a reference reads to put a badge beside a field, and what a
 * release check reads to answer "what is deprecated right now".
 */
export function readMark(
  form: Form,
  kind: Mark['form'],
): { path: string; note?: string }[] {
  const out: { path: string; note?: string }[] = []

  for (const one of form.mark ?? []) {
    if (one.form === kind) {
      out.push({ path: '', note: one.note })
    }
  }

  const seen = (mesh: LinkMesh, path: string): void => {
    for (const [key, link] of Object.entries(mesh)) {
      const here = path ? `${path}.${key}` : key

      for (const one of link.mark ?? []) {
        if (one.form === kind) {
          out.push({ path: here, note: one.note })
        }
      }

      const like = link.like

      if (like && typeof like === 'object') {
        for (const each of Array.isArray(like) ? like : [like]) {
          if (typeof each === 'object') {
            seen(each as LinkMesh, here)
          }
        }
      }
    }
  }

  for (const mesh of isUnion(form.like)
    ? (form.like as LinkMesh[])
    : [form.like as LinkMesh]) {
    seen(mesh, '')
  }

  return out
}
