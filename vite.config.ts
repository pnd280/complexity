import * as path from "path";

import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// @ts-ignore
import manifest from "./src/manifest";

import Unimport from "unimport/unplugin";
import vitePluginRunCommandOnDemand from "./vite-plugins/vite-plugin-run-command-on-demand";
import viteTouchGlobalCss from "./vite-plugins/vite-plugin-touch-global-css";

export default defineConfig(() => {
  return {
    base: "./",
    build: {
      target: ["chrome88", "edge88", "firefox109"],
      outDir: "build",
      emptyOutDir: true,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/cplx-[hash].js",
          assetFileNames: "assets/cplx-[hash][extname]",
        },
      },
      reportCompressedSize: false,
    },

    plugins: [
      crx({ manifest }),
      react(),
      Unimport.vite({
        dts: true,
        presets: [
          "react",
          {
            from: "react",
            imports: [
              "lazy",
              "forwardRef",
              "createContext",
              "useDeferredValue",
            ],
          },
        ],
        imports: [
          {
            name: "default",
            as: "$",
            from: "jquery",
          },
          {
            name: "cn",
            from: path.posix.join(
              ...path.resolve(__dirname, "src/utils/cn.ts").split(path.sep),
            ),
          },
        ],
      }),
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
  };
});
