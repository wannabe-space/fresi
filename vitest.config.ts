import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['docs/**', 'node_modules/**'],
  },
})
