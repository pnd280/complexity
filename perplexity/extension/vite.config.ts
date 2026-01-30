/// <reference types="vitest" />

import * as path from "path";
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import Unimport from "unimport/unplugin";

import chromeManifest from "./src/manifest.chrome";
import firefoxManifest from "./src/manifest.firefox";
import { APP_CONFIG } from "./src/app.config";
import unimportConfig from "./src/auto-imports-config";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

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
    // minify: "esbuild",
    rollupOptions: {
      output: {
        chunkFileNames: "assets/cplx-chunk-[hash].js",
        assetFileNames: "assets/cplx-assets-[hash][extname]",
        entryFileNames: "assets/cplx-entry-[name]-[hash].js",
      },
    },
  },

  // esbuild: {
  //   minifyIdentifiers: false,
  //   keepNames: true,
  // },

  plugins: [
    crx({
      manifest:
        APP_CONFIG.BROWSER === "chrome" ? chromeManifest : firefoxManifest,
      browser: APP_CONFIG.BROWSER,
    }),
    react({
      include: [/\.ts$/, /\.tsx$/, /(?<!settings)\.ts$/],
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    vitePluginTailwindCustomPrefixes(),
    Unimport.vite(unimportConfig),
    Icons({
      compiler: "jsx",
      jsx: "react",
      autoInstall: true,
    }),

    // dev
    vitePluginTouchOnChange({
      watch: ["src/assets/index.css"],
      globs: [
        "src/**/*",
        "public/**/*",
        "!src/entrypoints/contexts/options-page/**/*",
        "!src/plugins/**/settings-ui.opt-loader.tsx",
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
        src: "src/entrypoints/contexts/options-page/options.html",
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
        "src/entrypoints/contexts/content-scripts/index.ts",
        "src/entrypoints/contexts/options-page/options.html",
      ],
    },
  },

  test: {
    exclude: ["node_modules", "e2e/**", "dist/**", "release/**", "temp/**"],
    setupFiles: ["./tests/vitest.setup.ts"],
  },
}));
