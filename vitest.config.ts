import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["examples/**/*.ts"],
    testTimeout: 30000,
  },
});
