import * as os from 'os';
import * as path from 'path';
import { defineConfig } from 'vite';

// @ts-ignore
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';

// @ts-ignore
import manifest from './src/manifest';
import vitePluginRunCommandOnDemand
  from './vite-plugins/vite-plugin-run-command-on-demand';
import viteTouchGlobalCss from './vite-plugins/vite-plugin-touch-global-css';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: './',
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },

    plugins: [
      crx({ manifest }),
      react(),
      viteTouchGlobalCss({
        cssFilePath: path.resolve(__dirname, 'public/global.css'),
        watchFiles: [path.resolve(__dirname, 'src/')],
      }),
      vitePluginRunCommandOnDemand({
        beforeServerStart:
          os.platform() === 'win32' ? 'mkdir build' : 'mkdir -p build',
      }),
      vitePluginRunCommandOnDemand({
        afterServerStart: 'cp -f ./public/base.css ./build/',
        onHotUpdate: 'cp -f ./public/base.css ./build/',
      }),
    ],

    server: {
      port: 5174,
      hmr: {
        host: 'localhost',
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
