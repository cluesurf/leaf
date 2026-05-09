/**
 * Make ↔ Wake compile pass for `call` nodes.
 *
 * Per `note/ast.md`:
 *
 *  - **Make form** (authored, stored at rest):
 *
 *        { form: 'call', name, base?, case?, mark?, ...args }
 *
 *  - **Wake form** (compiled, runtime-ready):
 *
 *        { form: 'call', code, mark?, bind: { ...args } }
 *
 * `compile(tree, codeTable)` walks the tree, finds every Call
 * in make form, resolves `(name, base, case)` to its integer
 * `code` via the supplied table, and folds args into `bind`.
 *
 * `decompile(tree, decodeTable)` reverses it: look up
 * `(name, base, case)` from the integer id, lift `bind.*`
 * back to the top level.
 *
 * Both passes preserve `mark`. Both are pure (return new
 * tree; never mutate). Both descend through every Cast that
 * may contain nested Calls (path segments, fork branches,
 * walk hooks, view props/nests, weave flow, etc.).
 */

import type {
  Call,
  CaseArm,
  Cast,
  CasePrimitive,
  ForkPrimitive,
  HashPrimitive,
  ListPrimitive,
  MatchPrimitive,
  PickPrimitive,
  ReadPrimitive,
  ReadLink,
  Reference,
  SwitchPrimitive,
  TemplateStringPrimitive,
  ViewPrimitive,
  WalkPrimitive,
} from './types'

export type CodeTable = Record<string, number>

export type DecodeEntry = { name: string; base?: string; case?: string }

export type DecodeTable = Record<number, DecodeEntry>

/**
 * Build the colon-keyed lookup string for a make-form Call.
 * Mirrors `code/base/index.ts` `buildKey` so the runtime and
 * the compile pass agree byte-for-byte.
 */
function callKey(name: string, base?: string, caseValue?: string): string {
  if (base == null) return `flow:${name}`
  if (caseValue == null) return `flow:${name}:${base}`
  return `flow:${name}:${base}:${caseValue}`
}

// ---------------------------------------------------------------------------
// Compile (make → wake)
// ---------------------------------------------------------------------------

export function compile(tree: Cast, codeTable: CodeTable): Cast {
  return walk(tree, codeTable, /* decode */ undefined)
}

// ---------------------------------------------------------------------------
// Decompile (wake → make)
// ---------------------------------------------------------------------------

export function decompile(tree: Cast, decodeTable: DecodeTable): Cast {
  return walk(tree, /* code */ undefined, decodeTable)
}

// ---------------------------------------------------------------------------
// Walker — handles both directions in one pass
// ---------------------------------------------------------------------------

function walk(
  node: Cast,
  codeTable: CodeTable | undefined,
  decodeTable: DecodeTable | undefined,
): Cast {
  // Native leaves pass through.
  if (node === null || node === undefined) return null
  if (typeof node === 'string') return node
  if (typeof node === 'number') return node
  if (typeof node === 'boolean') return node
  if (node instanceof Date) return node

  switch (node.form) {
    case 'call':
      return walkCall(node, codeTable, decodeTable)

    case 'list':
      return {
        ...node,
        list: node.list.map(c => walk(c, codeTable, decodeTable)),
      } satisfies ListPrimitive

    case 'template_string':
      return {
        ...node,
        flow: node.flow.map(c => walk(c, codeTable, decodeTable)),
      } satisfies TemplateStringPrimitive

    case 'hash': {
      const out: Record<string, Cast> = {}
      for (const [k, v] of Object.entries(node.base)) {
        out[k] = walk(v, codeTable, decodeTable)
      }
      return { ...node, base: out } satisfies HashPrimitive
    }

    case 'reference':
      return node satisfies Reference

    case 'read':
      return {
        ...node,
        link: node.link.map(seg => walkSeg(seg, codeTable, decodeTable)),
      } satisfies ReadPrimitive

    case 'fork':
      return {
        ...node,
        test: walk(node.test, codeTable, decodeTable),
        then: walk(node.then, codeTable, decodeTable),
        ...(node.fall !== undefined
          ? { fall: walk(node.fall, codeTable, decodeTable) }
          : {}),
      } satisfies ForkPrimitive

    case 'switch':
      return {
        ...node,
        value: walk(node.value, codeTable, decodeTable),
        cases: node.cases.map(c => ({
          when: walk(c.when, codeTable, decodeTable),
          then: walk(c.then, codeTable, decodeTable),
        })),
        ...(node.fall !== undefined
          ? { fall: walk(node.fall, codeTable, decodeTable) }
          : {}),
      } satisfies SwitchPrimitive

    case 'match':
      return {
        ...node,
        branches: node.branches.map(b => ({
          test: walk(b.test, codeTable, decodeTable),
          then: walk(b.then, codeTable, decodeTable),
        })),
        ...(node.fall !== undefined
          ? { fall: walk(node.fall, codeTable, decodeTable) }
          : {}),
      } satisfies MatchPrimitive

    case 'case':
      return {
        ...node,
        test: walk(node.test, codeTable, decodeTable),
        case: node.case.map(arm => walkCaseArm(arm, codeTable, decodeTable)),
      } satisfies CasePrimitive

    case 'pick':
      return {
        ...node,
        values: walk(node.values, codeTable, decodeTable),
      } satisfies PickPrimitive

    case 'walk':
      return walkWalk(node, codeTable, decodeTable)

    case 'view':
      return walkView(node, codeTable, decodeTable)

    default:
      return node
  }
}

function walkCall(
  node: Call,
  codeTable: CodeTable | undefined,
  decodeTable: DecodeTable | undefined,
): Call {
  // Wake → make
  if (decodeTable && typeof node.code === 'number') {
    const ident = decodeTable[node.code]
    if (!ident) {
      throw new Error(`compile.decompile: unknown code ${node.code}`)
    }
    const out: Call = { form: 'call', name: ident.name }
    if (ident.base !== undefined) out.base = ident.base
    if (ident.case !== undefined) out.case = ident.case
    if (node.mark !== undefined) out.mark = node.mark
    if (node.bind != null) {
      for (const [k, v] of Object.entries(node.bind)) {
        ;(out as Record<string, unknown>)[k] = walkUnknown(
          v,
          undefined,
          decodeTable,
        )
      }
    }
    return out
  }

  // Make → wake
  if (codeTable && typeof node.name === 'string') {
    const key = callKey(node.name, node.base, node.case)
    const code = codeTable[key]
    if (typeof code !== 'number') {
      throw new Error(`compile.compile: no code id for '${key}'`)
    }
    const bind: Record<string, unknown> = {}
    for (const k of Object.keys(node)) {
      if (
        k === 'form' ||
        k === 'name' ||
        k === 'base' ||
        k === 'case' ||
        k === 'code' ||
        k === 'mark' ||
        k === 'bind'
      ) {
        continue
      }
      const v = (node as Record<string, unknown>)[k]
      bind[k] = walkUnknown(v, codeTable, undefined)
    }
    const out: Call = { form: 'call', code, bind }
    if (node.mark !== undefined) out.mark = node.mark
    return out
  }

  // No table — already in the requested form. Recurse into
  // any nested Casts (flat args or `bind` values) so a
  // partial tree still walks.
  const out: Call = { form: 'call' } as Call
  for (const [k, v] of Object.entries(node)) {
    if (k === 'bind' && v != null && typeof v === 'object') {
      const inner: Record<string, unknown> = {}
      for (const [bk, bv] of Object.entries(v as Record<string, unknown>)) {
        inner[bk] = walkUnknown(bv, codeTable, decodeTable)
      }
      ;(out as Record<string, unknown>)[k] = inner
    } else {
      ;(out as Record<string, unknown>)[k] = walkUnknown(
        v,
        codeTable,
        decodeTable,
      )
    }
  }
  return out
}

function walkSeg(
  seg: ReadLink,
  codeTable: CodeTable | undefined,
  decodeTable: DecodeTable | undefined,
): ReadLink {
  if (seg.form === 'index') {
    const v =
      typeof seg.value === 'number' || typeof seg.value === 'string'
        ? seg.value
        : walk(seg.value as Cast, codeTable, decodeTable)
    return { ...seg, value: v as ReadLink extends { value: infer V }
      ? V
      : never }
  }
  if (seg.form === 'slice') {
    const out: ReadLink = { ...seg }
    if (seg.rise != null && typeof seg.rise === 'object') {
      ;(out as { rise: unknown }).rise = walk(
        seg.rise as Cast,
        codeTable,
        decodeTable,
      )
    }
    if (seg.fall != null && typeof seg.fall === 'object') {
      ;(out as { fall: unknown }).fall = walk(
        seg.fall as Cast,
        codeTable,
        decodeTable,
      )
    }
    return out
  }
  return seg
}

function walkCaseArm(
  arm: CaseArm,
  codeTable: CodeTable | undefined,
  decodeTable: DecodeTable | undefined,
): CaseArm {
  if (arm.form === 'case-test') {
    return {
      ...arm,
      test: walk(arm.test as Cast, codeTable, decodeTable) as Call,
      flow: arm.flow.map(c => walk(c, codeTable, decodeTable)),
    }
  }
  return {
    ...arm,
    flow: arm.flow.map(c => walk(c, codeTable, decodeTable)),
  }
}

function walkWalk(
  node: WalkPrimitive,
  codeTable: CodeTable | undefined,
  decodeTable: DecodeTable | undefined,
): WalkPrimitive {
  switch (node.case) {
    case 'list':
      return {
        ...node,
        list: walk(node.list, codeTable, decodeTable),
        hook: walk(node.hook, codeTable, decodeTable),
      }
    case 'test':
      return {
        ...node,
        test: walk(node.test, codeTable, decodeTable),
        hook: walk(node.hook, codeTable, decodeTable),
      }
    case 'size':
      return {
        ...node,
        base: walk(node.base, codeTable, decodeTable),
        head: walk(node.head, codeTable, decodeTable),
        hook: walk(node.hook, codeTable, decodeTable),
      }
  }
}

function walkView(
  node: ViewPrimitive,
  codeTable: CodeTable | undefined,
  decodeTable: DecodeTable | undefined,
): ViewPrimitive {
  const out: ViewPrimitive = { form: 'view', name: node.name }
  for (const k of Object.keys(node)) {
    if (k === 'form' || k === 'name') continue
    if (k === 'nest') {
      out.nest = (node.nest ?? []).map(c =>
        walk(c, codeTable, decodeTable),
      )
      continue
    }
    const v = (node as Record<string, unknown>)[k]
    ;(out as Record<string, unknown>)[k] = walkUnknown(
      v,
      codeTable,
      decodeTable,
    )
  }
  return out
}

/**
 * Walk an arbitrary value (prop, arg, index/slice operand).
 * Tagged Casts recurse; native values pass through; arrays
 * map element-wise.
 */
function walkUnknown(
  v: unknown,
  codeTable: CodeTable | undefined,
  decodeTable: DecodeTable | undefined,
): unknown {
  if (v === null || v === undefined) return v
  if (typeof v !== 'object') return v
  if (v instanceof Date) return v
  if (Array.isArray(v)) {
    return v.map(item => walkUnknown(item, codeTable, decodeTable))
  }
  if ('form' in (v as Record<string, unknown>)) {
    return walk(v as Cast, codeTable, decodeTable)
  }
  // Plain object — recurse into values (e.g. wake-form `bind` map).
  const out: Record<string, unknown> = {}
  for (const [k, vv] of Object.entries(v as Record<string, unknown>)) {
    out[k] = walkUnknown(vv, codeTable, decodeTable)
  }
  return out
}

// ---------------------------------------------------------------------------
// Inverse-table builder
// ---------------------------------------------------------------------------

/**
 * Build a `DecodeTable` (number → identity tuple) from a
 * `CodeTable` (colon-key → number). Used by `decompile`.
 */
export function buildDecodeTable(codeTable: CodeTable): DecodeTable {
  const out: DecodeTable = {}
  for (const [key, code] of Object.entries(codeTable)) {
    const segs = key.split(':')
    if (segs[0] !== 'flow') continue
    const entry: DecodeEntry = { name: segs[1] ?? '' }
    if (segs[2] != null) entry.base = segs[2]
    if (segs[3] != null) entry.case = segs[3]
    out[code] = entry
  }
  return out
}
