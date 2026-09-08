# Changelog

## 0.11.0

### Breaking

**`show` is `tour`.** The field on a `Link`, the module, the reader and
the types:

```
show           ->  tour
Show           ->  TourMesh
readShow       ->  readTour
ShowCase       ->  TourCase
ShowMiss       ->  TourMiss
ShowRead       ->  TourRead
code/show.ts   ->  code/tour.ts
```

A tour is a walk through the shape with real values in it, which is
what the reader gets: `readTour` fills every field, so one annotated
field yields a complete object rather than a fragment. "Show" named the
rendering, and the rendering belongs to whoever draws the page rather
than to the schema.

**One word for a sample, across both systems.** The exception registry
in `@cluesurf/belt` carries a `tour` on each error definition, meaning
the same thing: one filled-in body a docs page can print. A reader who
learns the word on a field already knows it on an error.

**It also clears a collision.** That registry has its own `Show`,
meaning "may this error be shown to whoever caused it", and two `Show`
types across one codebase with unrelated meanings is a trap for
whoever reads the second one.

The type is `TourMesh` rather than `Tour`, following `LinkMesh`: `Mesh`
is this file's suffix for a keyed record.

### Added

**`send` on a `Form`**: every status a call can answer with, and the
exception behind each refusal.

```ts
send: [
  { code: 200, note: 'The font, with its variants.' },
  { code: 404, note: 'No font has that key.', case: 'absence' },
  { code: 400, note: 'The key is not a key.', case: 'defect' },
]
```

A field table says what a caller sends and what a success holds, and
says nothing about the four ways the call can fail, which is most of
what integrating against it costs.

- **`case` names an exception rather than restating it**, and it is
  `case` because that is what an exception already calls its own name
  on the wire: `{ form: 'exception', case: 'absence', … }`. The
  exception's definition carries its fields and a filled-in sample, so
  a docs page renders a real refusal body by looking the name up.
  Duplicating the body here would let the two disagree.
- **A success is a `send` too**, which is why it is `send` and not
  `halt`, as it was first written. `halt` fits a refusal and fights a
  200: a success is not the call stopping, it is the call answering.
  Leaving the successes out would make the list read as "the failures"
  and leave nowhere to say what a 201 or a 301 means.
- **On the Form, not on a field**, because a status is a fact about the
  call. Two fields cannot each own the 404.

**Inert, like the rest of the documentation layer.** `test/send.test.ts`
asserts that a Form with a full `send` list composes byte-identically
to the same Form without one, so it can be added to a live schema a
field at a time.

## 0.10.2

### Fixed

An optional field with no default is now LEFT OUT of a composed
example rather than emitted as `null`.

Found by running `readShow` over the real Forms in `@cluesurf/base`
rather than over test shapes. A font search composed to:

```json
{"test":{"weight":700},"sample":null,"page":1,"size":100,"cursor":null}
```

Nobody would paste that. `sample` and `cursor` are optional and
undefaulted, so the honest example of a request that does not use them
is one that does not mention them:

```json
{"test":{"weight":700},"page":1,"size":100}
```

COMPLETE STILL MEANS COMPLETE. Every field a caller must send is
present, and so is every optional field carrying a default, because
`page: 1` and `size: 100` are what the server will actually use and a
reader wants to see them. What goes is the noise.

## 0.10.0

### Added

The documentation layer. Three optional fields, all additive, none of
which reach the codegen path: a Form annotated to the hilt emits
byte-identical TypeScript to the same Form with nothing on it, which
is what makes annotating an existing schema safe to do a field at a
time.

- **`note`** on `Form`, `Link`, `Flow`, `Fold`, `Hash`, `List` and
  `Seed`. Markdown, rendered beside the thing it describes. It lives
  next to the shape so a change meets its own documentation in the
  same diff; prose kept in another file goes stale without anybody
  noticing.

- **`show`** on `Link`. Example values keyed by example NAME. Every
  field mentioning a name contributes to that example and every other
  field falls back to `base`, so each named example composes into a
  COMPLETE object rather than a fragment. `readShow(form)` does the
  composing and returns the cases together with everything wrong with
  them.

  Four rules, each pinned by a test:

  - `show[name] ?? base ?? a value synthesised from like / take`
  - on `list: true`, `show` is ONE ELEMENT and the walker wraps it; an
    array passes through, which is how a caller says "these exact
    elements"
  - a union selects the member whose fields declare the name;
    declaring it in several is reported rather than guessed at, since
    picking silently makes an example right about its values and wrong
    about its shape
  - a value that disagrees with its own `like`, `take` or `list` is
    reported, because an example that contradicts its schema is worse
    than none

  A discriminant needs no annotation: `form: { take: ['create'] }` has
  a single-value `take`, so synthesis emits `'create'` and the union
  member labels itself.

- **`mark`** on `Form` and `Link`. A list of tagged annotations, so a
  field can be deprecated AND experimental without either knowing
  about the other. A closed vocabulary — `deprecated`, `experimental`,
  `internal`, `since` — because an open `form: string` lets anybody
  write a mark nothing renders, which is a comment with extra syntax.
  `readMark(form, kind)` returns every one of a kind by dotted path.

  `internal` is load bearing rather than decorative: a field carrying
  it is omitted from composed examples entirely, so the examples and
  the public promise stay the same thing.

  `Seed` keeps its existing `mark?: string`, which is the render cache
  key and unrelated. Seeds take `note` only.

Verified against 1,997 real Forms in `@cluesurf/base`: no throws, no
faults, and a single grafted `show` composes a complete object from
its siblings' defaults.

## 0.9.0

### Breaking

- `Test` Mold variant renamed to `Rule`. The discriminant
  changes from `form: 'test'` to `form: 'rule'`, and `Rule`
  carries a new required `name:` field used by UI tooling
  to look up contextual hints / autocomplete / inline help
  per field (e.g. `name: 'is:slug'`, `name: 'is:present'`,
  `name: 'is:integer-range'`).

### Compat

- The legacy `form: 'test'` discriminant is still accepted
  at runtime in 0.9.x. A deprecation warning is emitted in
  development (`process.env.NODE_ENV !== 'production'`) when
  a Mold with `form: 'test'` runs through the validator.
- `type Test = Rule` is exported as a deprecated alias so
  existing imports keep typechecking.
- Both will be removed in 0.10. Migrate consumers to write
  `form: 'rule'` with a `name:` field during the 0.9
  window.

### Background

The rename makes `Rule` parallel to `Norm` and the new
`name:` field unlocks a downstream UI direction where
schemas describe both shape and per-field UX hints. See
`note/platform/site/word.surf/plan/leaf-rule-rename.md`
for the full spec.
