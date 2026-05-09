import prettier from 'prettier'
import { Project } from 'ts-morph'

/**
 * Format generated TypeScript content the same way "Save" in
 * VS Code would, against the host project's configs:
 *
 *   1. Organize imports (`source.organizeImports`)
 *   2. ESLint auto-fix (`source.fixAll.eslint`)
 *   3. Prettier format
 *
 * ESLint and Prettier each only run when the host project has
 * a real config for the file. With no configs, the only pass
 * is organize-imports.
 */

const project = new Project({
  useInMemoryFileSystem: true,
  compilerOptions: { allowJs: false, skipLibCheck: true },
})

type EslintLike = {
  lintText(
    text: string,
    options: { filePath: string },
  ): Promise<{ output?: string }[]>
  calculateConfigForFile(filePath: string): Promise<unknown>
}

let eslintPromise:
  | Promise<EslintLike | undefined>
  | undefined

async function loadEslint(): Promise<EslintLike | undefined> {
  if (eslintPromise) return eslintPromise
  eslintPromise = (async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = (await import('eslint')) as any
      const ESLintCtor = mod.ESLint ?? mod.default?.ESLint
      if (typeof ESLintCtor !== 'function') return undefined
      return new ESLintCtor({ fix: true }) as EslintLike
    } catch {
      return undefined
    }
  })()
  return eslintPromise
}

const prettierConfigCache = new Map<
  string,
  prettier.Options | null
>()

async function resolvePrettierConfig(
  filePath: string,
): Promise<prettier.Options | null> {
  const slash = filePath.lastIndexOf('/')
  const dir = slash > -1 ? filePath.slice(0, slash) : '.'
  if (prettierConfigCache.has(dir)) {
    return prettierConfigCache.get(dir) ?? null
  }
  const config = await prettier.resolveConfig(filePath)
  prettierConfigCache.set(dir, config)
  return config
}

const eslintConfigCache = new Map<string, boolean>()

async function hasEslintConfig(
  eslint: EslintLike,
  filePath: string,
): Promise<boolean> {
  const slash = filePath.lastIndexOf('/')
  const dir = slash > -1 ? filePath.slice(0, slash) : '.'
  if (eslintConfigCache.has(dir)) return eslintConfigCache.get(dir)!
  let ok = true
  try {
    await eslint.calculateConfigForFile(filePath)
  } catch {
    ok = false
  }
  eslintConfigCache.set(dir, ok)
  return ok
}

/**
 * Format one generated file. Returns the formatted text.
 *
 * Mirrors VS Code "Save" with `formatOnSave` + standard
 * `codeActionsOnSave` (`source.organizeImports`,
 * `source.fixAll.eslint`).
 */
export async function wash(
  filePath: string,
  text: string,
): Promise<string> {
  const sourceFile = project.createSourceFile(filePath, text, {
    overwrite: true,
  })
  sourceFile.organizeImports()
  let next = sourceFile.getFullText()

  const eslint = await loadEslint()
  if (eslint && (await hasEslintConfig(eslint, filePath))) {
    try {
      const results = await eslint.lintText(next, { filePath })
      next = results[0]?.output ?? next
    } catch {
      // Lint failure shouldn't block codegen output.
    }
  }

  const prettierConfig = await resolvePrettierConfig(filePath)
  if (prettierConfig != null) {
    next = await prettier.format(next, {
      ...prettierConfig,
      parser: 'typescript',
    })
  }

  return next
}
