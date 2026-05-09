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

## What is leaf

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

One coherent example touching every feature.

```ts
// code/book/blog/make.ts
import type {
  Flow,
  Form,
  Fold,
  Hash,
  List,
  Norm,
  Test,
} from '@cluesurf/leaf'
import { cast } from '@cluesurf/leaf'

// Norm: trim. Test: non-empty. Compose into a per-field pipeline.
const trim: Norm = {
  form: 'norm',
  hook: cast.call('make:trimmed', { text: cast.read('self') }),
}
const present: Test = {
  form: 'test',
  hook: cast.call('is:present', { thing: cast.read('self') }),
  miss: 'value must be present',
}

// List: enum source.
export const status: List = {
  form: 'list',
  name: 'status',
  like: { take: ['draft', 'live'] },
  save: 'blog',
}

// Hash: dynamic-key map of one shape.
export const tags: Hash = {
  form: 'hash',
  name: 'tags',
  like: { like: 'string' },
  save: 'blog',
}

// Form: data shape with per-field + form-level Mold.
export const post: Form = {
  form: 'form',
  name: 'post',
  like: {
    title: { like: 'string', mold: [trim, present] },
    body: { like: 'string', mold: trim },
    status: { like: 'status' },
    tags: { like: 'string', list: true },
  },
  mold: {
    form: 'test',
    hook: cast.call('is:any', {
      things: [
        cast.call('is:present', { thing: cast.read('self', 'title') }),
        cast.call('is:present', { thing: cast.read('self', 'body') }),
      ],
    }),
    miss: 'need a title or body',
  },
  save: 'blog',
}

// Flow: function signature. Handler lives in flow.ts.
export const slugify: Flow = {
  form: 'flow',
  call: 'slugify',
  take: { text: { like: 'string' } },
  make: 'string',
  save: 'blog',
}

// Fold: renderable tree exercising the AST primitives.
export const postCard: Fold = {
  form: 'fold',
  case: 'post:card',
  take: { post: { like: 'post' } },
  save: 'blog',
  cast: [
    cast.text(
      cast.read('post', 'title'),
      ' (',
      // fork: binary branch on a test
      cast.fork(
        cast.eq(cast.read('post', 'status'), 'live'),
        'live',
        'draft',
      ),
      ') — ',
      // walk: iterate. join: separator over walk results.
      cast.join(', ', [
        cast.walk({
          list: cast.read('post', 'tags'),
          item: 'tag',
          hook: cast.call('format:capitalized', {
            text: cast.read('tag'),
          }),
        }),
      ]),
      ' · slug=',
      cast.call('slugify', { text: cast.read('post', 'title') }),
    ),
    // match: pattern dispatch. otherwise = case-default.
    cast.match([
      cast.case(
        cast.gt(
          cast.call('get:length', {
            value: cast.read('post', 'body'),
          }),
          200,
        ),
        ' [long read]',
      ),
      cast.otherwise(''),
    ]),
  ],
}
```

```ts
// code/book/blog/flow.ts
const slugify = ({ text }: { text: string }): string =>
  text.toLowerCase().replace(/\s+/g, '-')

const flow = { slugify }
export default flow
```

```ts
// code/book/index.ts
import type { Book } from '@cluesurf/leaf'
import * as blogFlows from './blog/make'
import blogFlow from './blog/flow'
import { CodeLink } from '<link>/code' // generated

export default {
  host: 'app',
  name: 'blog',
  make: Object.values(blogFlows),
  flow: blogFlow,
  code: CodeLink,
} satisfies Book
```

```ts
// app entry
import { Base } from '@cluesurf/leaf'
import leafBook, { type Code } from '@cluesurf/leaf/book'
import blogBook from './book'

const base = new Base<Code>()
base.load(leafBook)
base.load(blogBook)

// mold: validate + normalize. Throws on Test failure.
const post = base.mold('post', {
  title: '  Hello  ',
  body: 'Long enough body, please trust me, more than two hundred chars …',
  status: 'live',
  tags: ['intro', 'demo'],
})
// → { title: 'Hello', body: '…', status: 'live', tags: [...] }

// cast: render a Fold. Text mode (default).
base.cast('post:card', { post })
// → 'Hello (live) — Intro, Demo · slug=hello [long read]'

// call: invoke a Flow directly.
base.call('slugify', { text: 'Some Title' })
// → 'some-title'

// React mode: register createElement + Fragment, then re-cast.
import { createElement, Fragment } from 'react'
base.load({
  flow: { 'create:element': createElement },
  view: { fragment: Fragment },
})
base.cast('post:card', { post })
// → vdom (cast.view nodes pass through createElement;
//          everything else returns native JS values)
```

```ts
// codegen — emits Code aggregate + per-`save:` TS types.
import save from '@cluesurf/leaf/save'

await save({ link: './host', book: blogBook })
```

## The model

The whole library reduces to one root concept (`make`) that branches two
ways:

```
make
├── flow → call
└── form → cast
```

`flow` is a function. You invoke an instance with `call`. `form` is a
data shape. You instantiate one with `cast`. Folds, hashes, lists, and
views all sit on top of these two.

Read the full reference at [`note/spec.md`](./note/spec.md).

## License

MIT

## ClueSurf

Made by [ClueSurf](https://clue.surf), meditating on the universe ¤.
Follow the work on [YouTube](https://youtube.com/@cluesurf),
[X](https://x.com/cluesurf),
[Instagram](https://instagram.com/cluesurf),
[Substack](https://cluesurf.substack.com),
[Facebook](https://facebook.com/cluesurf), and
[LinkedIn](https://linkedin.com/company/cluesurf), and browse more of
our open-source work here on [GitHub](https://github.com/cluesurf).
