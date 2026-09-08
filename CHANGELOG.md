# Changelog

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
