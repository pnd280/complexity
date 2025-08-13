import * as path from "path";

import { manifest } from "./src/manifest";
import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig(() => ({
  base: "./",

  build: {
    target: ["chrome89", "edge89", "firefox109"],
    emptyOutDir: true,
    outDir: "dist",
    reportCompressedSize: false,
  },

  plugins: [crx({ manifest })],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./"),
    },
  },

  server: {
    port: 8811,
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },
}));
