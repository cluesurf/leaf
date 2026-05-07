# Standard catalog

The seed Flow catalog that ships with `@cluesurf/book`. Nine
verbs cover everything the runtime needs as a baseline; hosts
extend with domain-specific flows via their own decks.

## The nine verbs

| verb | returns | purpose |
|---|---|---|
| `validate` | boolean | error-collecting wrapper around a test |
| `is` | boolean | predicates (the bulk of the catalog) |
| `has` | boolean | possession predicates (a list / map "has X") |
| `make` | varies | transformations (string ops, arithmetic, normalize) |
| `get` | varies | accessors and aggregates (length, count, sum, keys) |
| `find` | varies | async lookups (record fetch, enum members) |
| `if` | varies | conditional |
| `bind` | varies | let-bindings |
| `walk` | varies | non-boolean iteration (map / filter / reduce) |

Negation composes via `is.not(...)`. There is no parallel
`is-not-X` family. Anti-bloat is a design principle — keep the
catalog small enough to internalize.

## Verb-base-case shape

Every standard call follows the verb-base-case pattern:

```
<verb>(<base>: <args>, case?: <case>)
```

Examples:

```typescript
is(string: { thing: <X> })
is(integer: { thing: <X> })
is(equal: { this: <X>, that: <Y> })
is(above: { this: <X>, that: <Y> })
is(min: { this: <X>, that: <Y> })          // this >= that
is(max: { this: <X>, that: <Y> })          // this <= that
is(between: { thing, min, max })
is(among: { thing, choices })
is(all: { things: list<boolean> })
is(any: { things: list<boolean> })
is(one: { things: list<boolean> })          // exactly one true
is(not: { thing: boolean })
is(every: { items, as, test })              // every item passes
is(some: { items, as, test })
is(positive: { number })
is(negative: { number })
is(zero: { number })
is(finite: { number })
is(whole: { number })
is(multiple-of: { number, step })
is(fraction: { number })                    // 0 ≤ x ≤ 1
is(percent: { number })                     // 0 ≤ x ≤ 100
is(same-set: { a, b })
is(subset: { this, that })
is(disjoint: { a, b })
is(same-multiset: { a, b })
is(sorted: { items, direction? })
is(sorted-by: { items, as, key, direction? })
is(matches: { text, pattern, flags? })
is(starts-with: { text, prefix })
is(ends-with: { text, suffix })
is(contains: { text, substring })
is(trimmed: { text })
is(normalized: { text, kind })              // 'NFC' | 'NFD' | ...
is(cased: { text, case: 'lower' | 'upper' | ... })
is(slug: { text })
is(identifier: { text })
is(uuid: { text })
is(email: { text })
is(url: { text })
is(uri: { text })
is(hex-color: { text })
is(css-color: { text })
is(mime-type: { text })
is(phone-number: { text, region? })
is(iso: { text, case: 'date' | 'time' | 'datetime' | ... })
is(ipa: { text, case?: 'broad' | 'narrow' })
is(transliterated: { text, case: 'pinyin' | 'iast' | ... })
is(stage: { case: 'draft' | 'commit' | 'export' })
is(unique-in: { resource, field, value, host? })           // async
is(unique-among-siblings: { resource, field, value, parent, parent-field, exclude? })  // async
is(always: { case: 'true' | 'false' })
is(string|integer|decimal|boolean|list|map|null|blank|empty|truthy|missing|record: ...)
```

The same pattern with the other verbs:

```typescript
has(key: { thing: map, key })
has(keys-from: { thing, allowed })
has(keys-cover: { thing, required })
has(keys-match: { thing, pattern })
has(no-duplicates: { items })
has(no-duplicates-by: { items, as, key })

make(cased: { text, case })
make(trimmed: { text })
make(normalized: { text, kind })
make(replaced: { text, find, with, flags? })
make(slice: { text, from, to? })
make(floor: { number })
make(ceiling: { number })
make(round: { number })
make(absolute: { number })
make(negation: { number })
make(sum: { a, b })           // binary
make(difference: { a, b })
make(product: { a, b })
make(quotient: { a, b })
make(remainder: { a, b })

get(length: { text })
get(grapheme-count: { text })
get(word-count: { text })
get(line-count: { text })
get(count: { items })
get(count-where: { items, as, test })
get(sum: { numbers })          // n-ary
get(average: { numbers })
get(smallest: { numbers })
get(largest: { numbers })
get(first: { items })
get(last: { items })
get(at: { items, position })
get(keys: { thing: map })
get(values: { thing: map })
get(kind: { thing })
get(extract: { text, pattern, group?, flags? })

find(record: { reference })
find(enum-members: { enum })

if({ test, then, else? })

bind({ names, then })

walk(map: { items, as, yield })
walk(filter: { items, as, test })
walk(flat-map: { items, as, yield })
walk(reduce: { items, as, accumulator, initial, yield })

validate({ test, message?, slug?, text__id?, text_link?, suggest?, kind? })
```

## Engine-bound host variables

These names are pre-bound in host and read via `path`:

| name | type | meaning |
|---|---|---|
| `value` | unknown | per-cell call value |
| `record` | map | record-level call value |
| `now` | string | ISO 8601 UTC timestamp at evaluation start |
| `today` | string | YYYY-MM-DD UTC date at evaluation start |
| `locale` | string | BCP 47 |
| `stage` | string | `'draft' \| 'commit' \| 'export'` |
| `viewer` | string | optional, viewer's record id |
| `viewer_roles` | list<string> | optional, viewer's roles |

## Naming conventions

- **Boolean predicates** start with `is-`, `has-`, `starts-`,
  `ends-`, `contains`, `matches`. The verb tells you "this
  returns true/false."
- **Transforms** read as nouns: `lowercase`, `kebab-case`,
  `largest`, `length`, `count`, `keys-of`. The result *is* the
  named thing.
- **Iterators** (`every` / `some` / `count-where` /
  `has-no-duplicates-by` / `is-sorted-by`) take an `as:` arg
  whose value is the iterator-variable name (a literal string,
  not a Node).
- **Arg name = type** when the type is concrete: `text` for
  strings, `number` for numbers, `numbers` for numeric lists,
  `items` for collections.
- **Asymmetric comparisons** use `this` / `that`: reading is
  left-to-right ("is-above({ this: a, that: b })" reads "is a
  above b").
- **Symmetric arithmetic** uses `a` / `b`.
- **Generic single-arg predicates** (`is-string`, `is-empty`,
  etc.) use `thing`.
- **Negations compose**: `is(not: { thing: <X> })` instead of
  parallel `is-not-X` predicates.

## Where they live in code

```
deck/book/code/flow/
  validate/
    schema.ts
    handler.ts
  is/
    string/
      schema.ts
      handler.ts
    integer/
    equal/
    above/
    below/
    min/
    max/
    between/
    among/
    all/
    any/
    one/
    not/
    every/
    some/
    positive/
    negative/
    ...
    ipa/
      schema.ts          # bare is(ipa)
      handler.ts
      broad/
        schema.ts        # is(ipa, case: 'broad') — narrows
        handler.ts
      narrow/
        schema.ts
        handler.ts
    iso/
      schema.ts          # base schema with case: 'date' | 'time' | ...
      date/
        handler.ts       # case-specific implementation
      time/
        handler.ts
      ...
    cased/
      ...
    ...
  has/
    key/
    keys-from/
    ...
  make/
    cased/
    sum/
    ...
  get/
    length/
    count/
    ...
  find/
    record/              # async
      schema.ts
      handler.ts
    enum-members/
      ...
  if/
    schema.ts
    handler.ts
  bind/
    schema.ts
    handler.ts
  walk/
    map/
    filter/
    reduce/
    flat-map/
```

One folder per `(verb, base, case?)`. Each leaf carries
`schema.ts` (the Flow definition) and `handler.ts` (the
implementation). The file tree IS the API.

## Adding new flows

A new constraint, transform, or accessor is one new folder
under the right verb:

1. Create `code/flow/<verb>/<base>/[<case>/]`.
2. Write `schema.ts` declaring the Flow (`name`, `base`,
   `case?`, `like`, `take`).
3. Write `handler.ts` implementing the function.
4. Export from the parent `card.ts`.
5. Run codegen — TypeScript types, Zod parsers, JSON Schema,
   editor widgets all derive automatically.

The standard catalog grows by accretion. Verbs themselves are
fixed at nine; bases and cases are open.

## Adding new verbs

Don't, casually. Nine verbs exist because each represents a
distinct return-shape category. Adding a tenth should require
demonstrating that the new shape doesn't fit any existing verb.

If a real need surfaces, the addition is one new folder under
`code/flow/`, plus updates to the catalog doc and the Book
class's verb-aware machinery.

## Async flows

Flows declared with `async: true` (typically `find` and the
`is(unique-in)` / `is(unique-among-siblings)` family) are
batched by the pre-resolution pass. Hosts implementing async
flows should:

- Make their handler return a Promise.
- Use the `AbortSignal` if `cancelable: true`.
- Group their underlying queries when possible (the runtime
  batches calls to the same flow; the handler can further
  batch within itself).

The standard catalog ships `find(record)` and the `is(unique-*)`
family with reference implementations using a host-provided
data layer.

## Pure vs impure

Most flows are pure: same args, same output. The runtime
memoizes their results.

Impure flows must declare `pure: false`:

- Flows reading `now` / `today` indirectly (rare; the engine
  binds these into host so most flows don't need to know).
- Flows reading `viewer` (also bound in host).
- Async flows (typically `pure: true` from the runtime's POV
  because the resolved-args fingerprint covers the input
  space; the impurity is in the data source, not the flow).
- Flows the host adds with side effects (rare; constraint
  catalog has none).

Hosts adding impure flows should think hard about whether
they belong in book at all — the engine is for documents and
validations, not for triggering effects.
