import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    globals: false,
    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/out/**'],
    // `Make.save()` runs every emitted file through wash()
    // (ts-morph organize + Prettier). Comfortably under 10s,
    // but 5s default flakes locally.
    testTimeout: 15000,
  },
  resolve: {
    alias: [
      { find: /^@\/(.*)/, replacement: path.resolve(__dirname, 'code', '$1') },
    ],
  },
})
