/// <reference types="vitest" />
import {defineConfig} from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
  },
  test: {
    coverage: {
      provider: "v8",
      reportsDirectory: resolve(__dirname, "coverage"),
      reporter: ["json", "lcov", "cobertura"],
      include: ["src/**/*.ts"],
    }
  }
});
