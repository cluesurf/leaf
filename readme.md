<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<p align='center'>
  <img src='https://github.com/cluesurf/leaf/blob/make/view/leaf.svg?raw=true' height='192'/>
</p>

<h3 align='center'>@cluesurf/leaf</h3>
<p align='center'>
  A Template Language ᛉ
</p>

<br/>
<br/>
<br/>

## Introduction

Leaf is a **JSON system for app features**. Author rich documents or
rules. Save them as JSON. The runtime renders that JSON to text or vdom.

Trees are pure data. Same JSON renders many ways. Survives editor
patches. Travels over the wire. Typechecks against your catalog.

Not a templating mini-language. Not an interpreter for a custom DSL.
Just JSON.

## Why you need this

| building                                   | leaf gives you                                                                     |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| Notion-class doc editor                    | one tree shape for blocks / inline / embeds / database views                       |
| HTML + React + email + AMP from one source | author once. Text + element renderers share the tree                               |
| Localization                               | locale-aware `format(*)`, CLDR plurals, gender select, RTL                         |
| User- or AI-supplied logic, sandboxed      | rules + formulas run against a host scope. No `eval`, no DOM, no network           |
| Reusable fragments                         | `Fold` declarations registered in the Book                                         |
| Data-shape validation + normalization      | `Form` + `Mold` compile to per-field closures at load time. Fast under bulk import |

## Install

```sh
pnpm add @cluesurf/leaf
```

## Hello world

```ts
import { Base, cast } from '@cluesurf/leaf'
import leafBook, { type Code } from '@cluesurf/leaf/book'

const base = new Base<Code>()
base.load(leafBook)

base.load({
  make: [
    {
      form: 'fold',
      case: 'greeting',
      cast: [cast.text('Hello, ', cast.read('name'), '!')],
    },
  ],
})

base.cast('greeting', { name: 'Lance' })
// → 'Hello, Lance!'
```

## End-to-end

```ts
// code/book/email/make.ts
import type { Flow, Fold } from '@cluesurf/leaf'
import { cast } from '@cluesurf/leaf'

export const isEmail: Flow = {
  form: 'flow',
  call: 'is',
  case: 'email',
  take: { text: { like: 'string' } },
  make: 'boolean',
  save: 'email',
}

export const emailStatus: Fold = {
  form: 'fold',
  case: 'email:status',
  take: { input: { like: 'string' } },
  cast: [
    cast.text(
      'Mail to ',
      cast.read('input'),
      ' is ',
      cast.fork(
        cast.call('is:email', { text: cast.read('input') }),
        'valid',
        'invalid',
      ),
    ),
  ],
  save: 'email',
}
```

```ts
// code/book/email/flow.ts
const isEmail = ({ text }: { text: string }): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)

const flow = { 'is:email': isEmail }
export default flow
```

```ts
// code/book/index.ts
import type { Book } from '@cluesurf/leaf'
import * as emailFlows from './email/make'
import emailFlow from './email/flow'
import { CodeLink } from '<link>/code' // generated

export default {
  host: 'app',
  name: 'email',
  make: Object.values(emailFlows),
  flow: emailFlow,
  code: CodeLink,
} satisfies Book
```

```ts
// app entry
import { Base } from '@cluesurf/leaf'
import emailBook, { type Code } from './book'

const base = new Base<Code>()
base.load(emailBook)

base.cast('email:status', { input: 'hi@leaf.dev' })
// → 'Mail to hi@leaf.dev is valid'

base.call('is:email', { text: 'hi@leaf.dev' })
// → true (typed)
```
