/// <reference types="vitest" />
import {defineConfig} from 'vitest/config'
export default defineConfig({
  resolve: {
  },
  test: {
    coverage: {
      provider: "c8",
      reportsDirectory: "build/coverage",
      reporter: ["json", "html"]
    }
  }
});
