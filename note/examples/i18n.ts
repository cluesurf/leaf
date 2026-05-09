/**
 * Localization templates with calm.
 *
 * Per-locale trees, plural categories via the standard
 * catalog's `plural` flow, gender / select via `selectCases`.
 */

import {
  make,
  makeScope,
  renderText,
  Base,
  type Cast,
} from '@cluesurf/calm'
import standard, { type Code } from '@cluesurf/calm/book'

const base = new Base<Code>()
base.load(standard)

// Simple interpolation.
const greeting = make.templateString('Hello, ', make.read('name'), '!')

renderText(greeting, { scope: makeScope({ name: 'world' }) })
// → 'Hello, world!'

// Plural categories (CLDR `one` / `other` / `few` / `many`).
const inboxLabel = make.templateString(
  'You have ',
  make.read('count'),
  ' ',
  make.pluralCases('count', { one: 'message', other: 'messages' }),
  '.',
)

renderText(inboxLabel, {
  scope: makeScope({ count: 1, locale: 'en' }),
  hook: { plural: ({ value }) => (value === 1 ? 'one' : 'other') },
})
// → 'You have 1 message.'

// Select by literal value (gender, status, …).
const titleLine = make.templateString(
  make.selectCases('gender', {
    male: 'Mr.',
    female: 'Ms.',
    other: '',
  }),
  ' ',
  make.read('name'),
)

renderText(titleLine, {
  scope: makeScope({ gender: 'female', name: 'Park' }),
})
// → 'Ms. Park'

// Locale switch via match — pick the first locale-matching branch.
const localized = make.match(
  [
    { test: make.eq(make.read('locale'), 'en'), then: greeting },
    {
      test: make.eq(make.read('locale'), 'es'),
      then: make.templateString('¡Hola, ', make.read('name'), '!'),
    },
    {
      test: make.eq(make.read('locale'), 'ja'),
      then: make.templateString(make.read('name'), 'さん、こんにちは!'),
    },
  ],
  greeting,
)

renderText(localized, {
  scope: makeScope({ locale: 'es', name: 'Mundo' }),
})
// → '¡Hola, Mundo!'

// Ship templates as a Book — register once, reference by name.
const namedGreeting: Cast = make.templateString(
  'Hello, ',
  make.read('name'),
  '!',
)

base.load({
  cast: [{ form: 'fold', cast: 'greeting', tree: [namedGreeting] }],
})

base.cast(make.fold('greeting', { name: 'World' }))
// → 'Hello, World!'

// Walk a list with a join — render a list of items as comma-separated.
const listLine = make.templateString(
  'Items: ',
  make.walk(make.read('items'), make.read('item'), { join: ', ' }),
)

renderText(listLine, {
  scope: makeScope({ items: ['apple', 'banana', 'cherry'] }),
})
// → 'Items: apple, banana, cherry'
