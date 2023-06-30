/// <reference types="vitest" />
import {defineConfig} from 'vitest/config'
export default defineConfig({
  resolve: {
  },
  test: {
    coverage: {
      provider: "c8",
      reportsDirectory: "coverage",
      reporter: ["json", "lcov"]
    }
  }
});
