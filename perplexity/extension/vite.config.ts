/// <reference types="vitest" />

import * as path from "path";
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import Unimport from "unimport/unplugin";

import chromeManifest from "./src/manifest.chrome";
import firefoxManifest from "./src/manifest.firefox";
import { APP_CONFIG } from "./src/app.config";
import unimportConfig from "./src/types/unimport.config";
import tailwindcss from "@tailwindcss/vite";

import vitePluginForceRestartOnChanges from "./vite-plugins/vite-plugin-force-restart-on-changes";
import vitePluginReloadOnDynamicallyInjectedStyleChanges from "./vite-plugins/vite-plugin-reload-on-dynamically-injected-style-changes";
import vitePluginTouchOnChange from "./vite-plugins/vite-plugin-touch-on-change";
import vitePluginMoveHtml from "./vite-plugins/vite-plugin-move-html";
import vitePluginTailwindCustomPrefixes from "./vite-plugins/vite-plugin-tailwind-custom-prefixes";
// import vitePluginRemoveStaticCssFromManifest from "./vite-plugins/vite-plugin-remove-static-css-from-manifest";

export default defineConfig(() => ({
  base: "./",

  build: {
    target: ["chrome89", "edge89", "firefox109"],
    emptyOutDir: true,
    outDir: `dist/${APP_CONFIG.BROWSER}`,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/cplx-chunk-[hash].js",
        assetFileNames: "assets/cplx-assets-[hash][extname]",
        entryFileNames: "assets/cplx-entry-[name]-[hash].js",
      },
    },
  },

  plugins: [
    crx({
      manifest:
        APP_CONFIG.BROWSER === "chrome" ? chromeManifest : firefoxManifest,
      browser: APP_CONFIG.BROWSER,
    }),
    react(),
    tailwindcss(),
    vitePluginTailwindCustomPrefixes(),
    Unimport.vite(unimportConfig),

    // dev
    vitePluginTouchOnChange({
      watch: ["src/assets/index.css"],
      globs: [
        "src/**/*",
        "public/**/*",
        "!src/entrypoints/options-page/**/*",
        "!src/plugins/**/settings-ui.tsx",
        "!src/plugins/**/settings-ui/**/*",
      ],
    }),
    vitePluginReloadOnDynamicallyInjectedStyleChanges({
      excludeString: ["@/assets/index.css", "@/assets/cs.css"],
    }),
    vitePluginForceRestartOnChanges({
      folders: ["public"],
    }),

    // build
    vitePluginMoveHtml([
      {
        src: "src/entrypoints/options-page/options.html",
        dest: "options.html",
      },
    ]),
    // viteRemoveStaticCssFromManifest(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./"),
    },
  },

  server: {
    // enable this if hmr doesn't work
    // port: 8811,
    // hmr: {
    //   host: "localhost",
    //   protocol: "ws",
    // },
    warmup: {
      clientFiles: [
        "src/entrypoints/content-scripts/index.ts",
        "src/entrypoints/options-page/options.html",
      ],
    },
  },

  test: {
    exclude: ["node_modules", "e2e/**", "dist/**", "release/**"],
    setupFiles: ["./tests/vitest.setup.ts"],
  },
}));
