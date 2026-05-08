# Schema vocabulary

The exact reserved props on every authored declaration, and
how to read / write them.

## What the consumer cares about

A document-builder consumer cares about four things:

1. **Request types** — what they send to call a Flow.
2. **Response types** — what comes back.
3. **Function APIs** — the Flow signatures themselves.
4. **Element props** — Forms used as renderable components.

Every reserved prop in the schema vocab exists to serve one
of those four. The vocab below is the smallest set that
covers all four.

## Forms

A `Form` declares the shape of data — a record schema. Pure
declaration, no execution.

```typescript
export const language = {
  form: 'form',
  cast: 'language',
  link: {
    id:        { like: 'string' },
    name:      { like: 'string' },
    iso_639_3: { like: 'string' },
    speakers:  { like: 'integer' },
  },
}
```

Reserved props on a Form:

| prop   | role                                          | required |
|--------|-----------------------------------------------|----------|
| `form` | kind discriminant (always `'form'`)           | yes      |
| `cast` | the resource the Form shapes                  | yes      |
| `link` | shape: a LinkMesh OR a LinkMesh[] (union)     | yes      |
| `call` | action context (e.g., the verb this Form is the input/output of) | optional |
| `case` | variant within an action context              | optional |
| `head` | generic type parameters                       | optional |

`cast: 'language'` reads as "this Form produces casts of
`language`." Instances of this Form carry `form: 'language'`
as their kind tag.

### `link` accepts an object or an array of objects

A Form's `link` can be:

1. **A `LinkMesh`** (a record of field declarations): a single
   shape.
2. **A `LinkMesh[]`** (array): a union of shapes — sum-type
   variants of the Form.

```typescript
// Single shape:
export const language = {
  form: 'form',
  cast: 'language',
  link: {
    id:        { like: 'string' },
    iso_639_3: { like: 'string' },
  },
}

// Union (sum type) — variants share `cast: 'bear'`:
export const bear = {
  form: 'form',
  cast: 'bear',
  link: [
    { like: 'black',   bind: { name: { like: 'string' }, climbing_skill: { like: 'integer' } } },
    { like: 'polar',   bind: { name: { like: 'string' }, swimming_km:    { like: 'number'  } } },
    { like: 'grizzly', bind: { name: { like: 'string' }, aggression:     { like: 'integer' } } },
  ],
}
```

Each union member uses `like` to name the variant and `bind`
to declare its fields. Same convention as union members on a
Flow's `take` / `make`.

A previous version of this spec used a separate `case:`
field for sum-type variants. That's gone — `link[]` covers
the same ground without a second prop.

### Identity and duplicate detection

A Form's identity tuple is `(cast, call, case)`. Two Forms
across all registered Books with the same triple are
duplicates; codegen errors at `make.save()` time and lists
every collision in one pass.

When a Form has no action context (just a record schema), it
has only `cast`. When it serves as a Flow's input/output
shape, `call` (and optionally `case`) scope it to a specific
action. See [`codegen.md`](./codegen.md) for full duplicate
detection semantics.

## Flows

A `Flow` declares a function. Verb, optional resource, optional
variant, optional input and output shapes.

```typescript
export const is_ipa_broad = {
  form: 'flow',
  name: 'is',
  base: 'ipa',
  case: 'broad',
  take: { text: { like: 'string' } },   // inline input shape
  make: 'boolean_result',                 // reference to a named Form
}
```

Reserved props on a Flow:

| prop   | role                                          | required |
|--------|-----------------------------------------------|----------|
| `form` | kind discriminant (always `'flow'`)           | yes      |
| `name` | the verb being declared                       | yes      |
| `base` | the resource the verb acts on                 | optional |
| `case` | a variant when the verb has multiple shapes   | optional |
| `take` | input shape: string \| LinkMesh \| string[] \| LinkMesh[] | optional |
| `make` | output shape: string \| LinkMesh \| string[] \| LinkMesh[] | optional |

`(name, base?, case?)` is the Flow's identity. The exported
`const` name (`is_ipa_broad`) is a convenient label; the
runtime triple is what the schema declares.

### Verb naming aligned with Calls

A Flow's verb prop is `name`, the same field name a Call
AST node uses for the verb. So:

```
Flow declaration: { form: 'flow', name: 'is', base: 'ipa', case: 'broad' }
Call AST node:    { form: 'call', name: 'is', base: 'ipa', case: 'broad', /* ...args */ }
```

Same verb field across both layers. The `form` discriminant
(`'flow'` vs `'call'`) is the only structural difference at
the head.

### `take` and `make`: inline, by-name, or union

Both `take` and `make` are optional. When present, each can
be one of four shapes:

1. **A string**: the name of a Form to use as the
   input/output shape. Reuses a published Form when the
   shape is shared across multiple Flows.
2. **A `LinkMesh`** (a record of field declarations): an
   inline shape unique to this Flow.
3. **A `string[]`**: a union of named Forms, equivalent to
   TypeScript's `FormA | FormB | FormC`. Useful for Flows
   that accept or return one of several known shapes.
4. **A `LinkMesh[]`**: a union of inline shapes. Same union
   semantics as `string[]`, but each member is anonymous.

```typescript
// Single named ref:
take: 'select_language_request',

// Single inline shape:
take: { id: { like: 'string' } },

// Union of named Forms (returns one of several response shapes):
make: ['language_okay_response', 'language_error_response'],

// Union of inline shapes:
make: [
  { like: 'okay',  bind: { value: { like: 'language' } } },
  { like: 'error', bind: { message: { like: 'string' } } },
],
```

Each union member uses `like` to name the variant and `bind`
to declare its fields. The `like` value is the variant's
tag; the `bind` map is its fields, in the same `link`-shaped
field DSL used everywhere else.

Mixing strings and LinkMeshes in the same array is allowed:

```typescript
make: ['language', { like: 'error', bind: { message: { like: 'string' } } }],
```

This handles the common case where one of the union members
is a published shape (the success type) and another is a
small inline error shape.

```typescript
// Inline take, named-reference make:
export const select_language = {
  form: 'flow',
  name: 'select',
  base: 'language',
  take: {
    id: { like: 'string' },
  },
  make: 'language',     // reuse the bare `language` Form's link
}

// Both inline:
export const make_sum = {
  form: 'flow',
  name: 'make',
  base: 'sum',
  take: {
    a: { like: 'integer' },
    b: { like: 'integer' },
  },
  make: { value: { like: 'integer' } },
}

// Both omitted (a Flow that takes nothing and returns nothing):
export const reset_cache = {
  form: 'flow',
  name: 'reset',
  base: 'cache',
}
```

When `take` or `make` is absent, the corresponding side is
typed as `unknown` (or `void` when the Flow's contract is
"no input" / "no output" — the runtime treats absence as
"don't care," not "must be empty").

When the value is a string, codegen resolves it against the
host bundle's named Forms. Unresolved string references
throw at `make.save()` check time.

### Why string-or-LinkMesh

The two forms cover both ends of a real spectrum:

- **Reuse**: when many Flows share an input or output shape
  (think `language_string` as the response of `get`, `find`,
  `recent`, `search`), the string form points each Flow at
  the same canonical Form.
- **One-off**: when the shape is unique to one Flow (think
  `make_sum`'s `{a, b}`), the inline LinkMesh keeps the
  shape next to the function declaration. No second
  declaration to look up.

A Form can be referenced by string from a Flow's `take` /
`make`, used directly as a record schema in storage, AND
rendered as a UI component's props — three jobs from one
declaration. That's the reuse path.

## Authoring naming convention

When a Flow's input or output is one-off, inline:

```typescript
export const make_sum = {
  form: 'flow',
  name: 'make',
  base: 'sum',
  take: { a: { like: 'integer' }, b: { like: 'integer' } },
  make: { value: { like: 'integer' } },
}
```

When the shape is shared, declare a named Form once and
reference it by string:

```typescript
export const language = {
  form: 'form',
  cast: 'language',
  link: { /* the canonical record */ },
}

export const select_language = {
  form: 'flow',
  name: 'select',
  base: 'language',
  take: { id: { like: 'string' } },
  make: 'language',     // string ref
}
```

Naming conventions for export consts:

| export name pattern         | what it declares                                |
|-----------------------------|-------------------------------------------------|
| `<noun>`                    | a bare Form (record schema)                     |
| `<verb>_<noun>`             | a Flow                                          |
| `<verb>_<noun>_<case>`      | a Flow variant (e.g., `is_ipa_broad`)           |
| `<verb>_<noun>_input`       | a Form intended as a Flow's `take` shape        |
| `<verb>_<noun>_output`      | a Form intended as a Flow's `make` shape        |

The `_input` / `_output` suffix is **a name convention only**.
It's a hint for the human reader; the runtime keys off the
Flow's `take` / `make` reference, not the Form's name.

## Type derivation

Codegen emits two TypeScript types per Flow, named after the
Flow's `(name, base, case)` triple in PascalCase:

- **`<Verb><Base><Case>Take`** — the input type (the Flow's
  take payload).
- **`<Verb><Base><Case>`** — the output type (the Flow's make
  payload value).

```typescript
// is_ipa_broad → IsIpaBroad + IsIpaBroadTake
export type IsIpaBroadTake = { text: string }
export type IsIpaBroad     = boolean

// make_sum → MakeSum + MakeSumTake
export type MakeSumTake = { a: number; b: number }
export type MakeSum     = { value: number }

// select_language → SelectLanguage + SelectLanguageTake
export type SelectLanguageTake = { id: string }
export type SelectLanguage     = Language       // string ref resolved
```

Forms emit one type, named after the Form's `cast` value in
PascalCase:

```typescript
// language Form → Language
export type Language = {
  id: string
  iso_639_3: string
}
```

When `take` or `make` is absent, the corresponding side is
typed as `unknown`:

```typescript
// reset_cache: form: 'flow', name: 'reset', base: 'cache' (no take, no make)
export type ResetCacheTake = unknown
export type ResetCache     = unknown
```

The naming is deliberately asymmetric: the **output** type
gets the bare `<Verb><Base><Case>` name because that's the
type consumers reach for most often (API response shapes,
function return values, render props). The **input** type
takes the `Take` suffix.

### Zod parser naming

Each generated TypeScript type gets a paired Zod parser
named `<TypeName>Form` — PascalCase + `Form` suffix. The
parser is locked to the type via `satisfies`:

```typescript
import { z } from 'zod'
import type { Language, SelectLanguageTake, SelectLanguage } from '.'

export const LanguageForm = z.object({
  id: z.string(),
  iso_639_3: z.string(),
}) satisfies z.ZodType<Language>

export const SelectLanguageTakeForm = z.object({
  id: z.string(),
}) satisfies z.ZodType<SelectLanguageTake>

export const SelectLanguageForm = LanguageForm   // re-uses the named ref
```

`<TypeName>Form` is the convention regardless of whether the
type came from a Form or a Flow's take/make. The "Form"
suffix means "the Zod parser for this TypeScript type" — it
parallels `@cluesurf/form`'s naming.

### What consumers reach for

The four things consumers care about are all reachable from
the generated `index.ts` and `form.ts` without reading the
schema sources:

- **Request type** → `<Verb><Base><Case>Take` (TS) +
  `<Verb><Base><Case>TakeForm` (Zod parser).
- **Response type** → `<Verb><Base><Case>` (TS) +
  `<Verb><Base><Case>Form` (Zod parser).
- **Function API** → an inferred call signature
  `(take: IsIpaBroadTake) => IsIpaBroad`.
- **Element props** → the bare Form's TS type (`Language`
  etc.) and Zod parser (`LanguageForm`).

## Element props

When a host renders a `cast: 'language'` Form as a UI
component, the `link` map is the prop list. The same Form
declaration that types the database row also types the
component's props. No second declaration.

```typescript
// element props are just the bare Form's link
type LanguageProps = Language
```

For Forms that are *only* renderable (no DB row, no flow
they back), `cast` is the component name. This is the
default path when a designer authors a Form purely for the
editor surface.

## Instances

Declarations describe shape. **Instances** are the runtime
values that flow through the system: a string in transit, a
language record on the wire, a compiled Call node. Instances
carry a much smaller reserved set than declarations.

### Reserved props on instances

| prop   | role                                               | when present                       |
|--------|----------------------------------------------------|------------------------------------|
| `form` | the kind tag                                       | always                             |
| `code` | compiled flat numeric id                           | post-compile only                  |
| `mark` | per-instance schema-version stamp (semver)         | post-compile only                  |

Everything else on the object is the user's own data — the
fields declared by the matching Form's `link`. Reserved props
never collide with user fields because the reserved set is
fixed and small.

### Authored instance

A user-authored or wire-format instance has only `form` plus
its user fields:

```typescript
{
  form: 'string',
  text: 'phonetic',
}

{
  form: 'language',
  id: 'lang_en',
  name: 'English',
  iso_639_3: 'eng',
  speakers: 1500000000,
}
```

The `form` value on an instance is the **kind tag**:
- For primitives, the primitive name (`'string'`, `'integer'`,
  `'boolean'`, `'list'`, etc.).
- For instances of a user-defined Form, the Form's `cast`
  value (`'language'`, `'language_string'`).

So `form: 'language'` on an instance means "this is a cast of
the `cast: 'language'` Form." The same `form` field links a
declaration to its instances structurally; no separate
"instance type" prop needed.

### Compiled instance

After codegen rewrites the source, instances carry `code` and
`mark` in addition to `form`:

```typescript
{
  form: 'language',
  code: 207,
  mark: '1.0.0',
  id: 'lang_en',
  name: 'English',
  // ...
}
```

`code` is the host bundle's numeric id for this instance's
declaring Form / Flow, assigned during `make.save()`. The
runtime dispatches by `code`, never by `form` string parsing.

`mark` is the schema-version stamp from the declaration's
package at compile time. The runtime uses it to detect stale
instances (data shaped against an older Form revision) and
route them through migration when needed.

### Why only one reserved prop on authored instances

Two big reasons:

1. **Wire-format minimalism.** A response from an API endpoint
   is a JSON instance. Adding metadata beyond `form` would
   bloat every payload. `code` and `mark` are added later, by
   the consumer's compiler, not by the author or the wire.

2. **Discoverable typing.** Given any instance, the only key
   you need to look at to know what it is is `form`. Tooling,
   debuggers, JSON viewers, and downstream pipelines all key
   off the same single field.

## Calls — instances of Flows

A **Call** is an AST node that invokes a Flow at runtime.
It's a kind of instance, but it carries more reserved props
than a data instance does because the runtime needs to
resolve the verb + resource at compile time.

```typescript
{
  form: 'call',
  name: 'is',
  base: 'ipa',
  case: 'broad',
  // ...user fields (the take args)
}
```

Reserved props on a Call:

| prop   | role                                  | required |
|--------|---------------------------------------|----------|
| `form` | discriminant (always `'call'`)        | yes      |
| `name` | the verb being invoked                | yes      |
| `base` | the resource the verb is acting on    | optional |
| `case` | a variant selector                    | optional |

User fields (the take args) fill the remaining keys. They
match the Flow's `take` shape (whether the Flow declared it
inline or as a string Form reference).

The connection rule:
```
Call { form: 'call', name: V, base: N, case: K }
   ↓ resolves to
Flow { form: 'flow', name: V, base: N, case: K }
```

Same field names across both layers (`name`, `base`, `case`).
The only structural difference is `form: 'call'` vs `form:
'flow'`.

### Compiled Call

After codegen, a Call carries `code` and `mark` plus its
take args repackaged under `bind`:

```typescript
{
  form: 'call',
  code: 103,
  mark: '1.0.0',
  bind: { /* the take args, moved here */ },
}
```

The `name` / `base` / `case` triple is gone after compile;
`code` is the dispatch key. The `bind` envelope keeps the
args separate from the (now-fewer) reserved keys.

### Reserved props summary

| layer                      | reserved props                                       |
|----------------------------|------------------------------------------------------|
| Form declaration           | `form`, `cast`, `link`, `call?`, `case?`, `head?`     |
| Flow declaration           | `form`, `name`, `base?`, `case?`, `take?`, `make?`    |
| Data instance (authored)   | `form`                                               |
| Data instance (compiled)   | `form`, `code`, `mark`                               |
| Call (authored)            | `form`, `name`, `base?`, `case?`                     |
| Call (compiled)            | `form`, `code`, `mark`, `bind`                       |

Everything else on a declaration object lives under `link`,
`take`, or `make`. Everything else on a data instance object
is user-field payload. On an authored Call, user fields
(take args) live at the top level alongside the reserved
keys; on a compiled Call, they live inside `bind`.

### Identity tuples for duplicate detection

| kind | identity tuple                              |
|------|---------------------------------------------|
| Form | `(cast, call, case)`                        |
| Flow | `(name, base, case, take, make)`            |

Codegen at `make.save()` time gathers every Form and Flow
across every registered Book and errors if two share the
same identity tuple. See [`codegen.md`](./codegen.md).

## Summary

Five reserved props on Form declarations (three required,
two optional). Six on Flow declarations (two required, four
optional). One on authored data instances. Three on compiled
data instances. Four on authored Calls.

If you're writing a new schema, start from these patterns:

```typescript
// A bare Form (data shape):
export const <noun> = {
  form: 'form',
  cast: <noun>,
  link: { /* fields */ },
}

// A Flow with inline take/make:
export const <verb>_<noun> = {
  form: 'flow',
  name: <verb>,
  base: <noun>,
  take: { /* inline input fields */ },
  make: { /* inline output fields */ },
}

// A Flow that reuses a named Form:
export const <verb>_<noun> = {
  form: 'flow',
  name: <verb>,
  base: <noun>,
  take: '<name_of_input_form>',
  make: '<name_of_output_form>',
}
```

Codegen handles type derivation. The runtime keys off
`(form, name, base?, case?)` for declarations, `(form,
code)` after compile.
