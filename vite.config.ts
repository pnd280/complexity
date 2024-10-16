/// <reference types="vitest" />

import * as path from "path";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Unimport from "unimport/unplugin";
import vitePluginRunCommandOnDemand from "./vite-plugins/vite-plugin-run-command-on-demand";
import viteTouchGlobalCss from "./vite-plugins/vite-plugin-touch-global-css";
import unimportConfig from "./src/types/unimport.config";
import manifest from "./src/manifest";
import appConfig from "./src/app.config";

export default defineConfig(() => ({
  base: "./",
  build: {
    target: ["chrome88", "edge88", "firefox109"],
    emptyOutDir: true,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/cplx-[hash].js",
        assetFileNames: "assets/cplx-[hash][extname]",
      },
    },
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: ["lodash"],
  },
  plugins: [
    crx({ manifest, browser: appConfig.BROWSER }),
    react(),
    Unimport.vite(unimportConfig),
    viteTouchGlobalCss({
      cssFilePath: path.resolve(__dirname, "src/assets/index.tw.css"),
      watchFiles: [
        path.resolve(__dirname, "src/"),
        path.resolve(__dirname, "public/"),
      ],
    }),
    vitePluginRunCommandOnDemand({
      afterServerStart: "pnpm gulp forceDisableUseDynamicUrl",
      closeBundle: "pnpm gulp forceDisableUseDynamicUrl",
    }),
    vitePluginRunCommandOnDemand({
      closeBundle: "pnpm gulp rootifyOptionsPageHTMLEntries",
    }),
  ],

  server: {
    port: 5173,
    hmr: {
      host: "localhost",
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./"),
    },
  },

  test: {
    setupFiles: ["./tests/vitest.setup.ts"],
    server: {
      deps: {
        inline: ["@webext-core/messaging"],
      },
    },
  },
}));
