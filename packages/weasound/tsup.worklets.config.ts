import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "cap-awp": "src/cap-awp.ts",
    "cap-worker": "src/cap-worker.ts",
    "cap-worker-waiter": "src/cap-worker-waiter.ts",
    "play-awp": "src/play-awp.ts",
    "play-shared-awp": "src/play-shared-awp.ts",
  },
  format: ["esm"],
  minify: true,
  outDir: "dist/worklets",
  outExtension: () => ({ js: ".js" }),
});
