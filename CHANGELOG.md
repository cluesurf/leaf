# Changelog

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
