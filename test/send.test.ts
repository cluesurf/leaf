import { describe, it, expect } from 'vitest'
import { readTour } from '../code/tour'
import type { Form, Send } from '../code/form'

/**
 * `send` declares every way a call can answer.
 *
 * IT IS INERT, like `note`, `tour` and `mark` before it. A Form
 * carrying a full `send` list must render exactly what the same Form
 * without one renders, because the whole point of the documentation
 * layer is that it can be added to a live schema a field at a time
 * without anything downstream changing.
 *
 * There is no `readSend`. The list needs no composing: a consumer
 * reads `form.send` and looks each `case` up in the exception
 * registry, which is where the sample body lives. Tested here for the
 * property that matters — that declaring it costs nothing — and for
 * the shape being what a docs page can walk.
 */

const bare = {
  form: 'form',
  name: 'select_font_request',
  like: {
    key: { like: 'string' },
  },
} satisfies Form

const sent = {
  form: 'form',
  name: 'select_font_request',
  like: {
    key: { like: 'string' },
  },
  send: [
    { code: 200, note: 'The font, with its variants.' },
    {
      code: 404,
      note: 'No font has that key.',
      case: 'absence',
    },
    {
      code: 400,
      note: 'The key is not a key.',
      case: 'defect',
    },
  ],
} satisfies Form

describe('send', () => {
  it('changes nothing about what a Form composes', () => {
    // THE INERTNESS PROPERTY, checked by comparing the composed output
    // rather than by reading the code. `readTour` is the only thing
    // that walks a Form for documentation, so if `send` were to leak
    // into anything it would leak into this.
    expect(readTour(sent)).toEqual(readTour(bare))
  })

  it('carries a status, a sentence and an exception name', () => {
    const list = sent.send as Send[]

    expect(list.map(one => one.code)).toEqual([200, 404, 400])

    // A SUCCESS TAKES NO `case`, which is what makes the list "every
    // way this stops" rather than "the failures". A 200 with an
    // exception name would be a contradiction.
    expect(list[0]?.case).toBeUndefined()

    // A REFUSAL NAMES ITS EXCEPTION rather than restating it. The name
    // is the lookup key into the registry, whose own `tour` carries a
    // filled-in sample body, so the docs and the thrown error cannot
    // disagree about the shape.
    expect(list[1]?.case).toBe('absence')
    expect(list[2]?.case).toBe('defect')
  })

  it('is optional, so no existing Form has to declare one', () => {
    expect(bare).not.toHaveProperty('send')
  })
})
