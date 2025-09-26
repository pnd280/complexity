import { defineConfig } from "tsup";
import * as fs from "fs";

export default defineConfig({
  entry: ["src/main.ts"],
  format: ["esm", "cjs"],
  dts: true,
  minify: "terser",
  terserOptions: {
    mangle: {
      reserved: ["$"], // Reserve $ to avoid conflicts with jQuery
    },
  },
  clean: false,
  outDir: "dist",
});
