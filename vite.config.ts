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
        cssFilePath: path.resolve(__dirname, 'src/assets/global.css'),
        watchFiles: [path.resolve(__dirname, 'src/')],
      }),
      vitePluginRunCommandOnDemand({
        beforeServerStart:
          os.platform() === 'win32' ? 'mkdir build' : 'mkdir -p build',
      }),
      vitePluginRunCommandOnDemand({
        afterServerStart: 'cp -f ./src/content-script/base.css ./build/',
        onHotUpdate: 'cp -f ./src/content-script/base.css ./build/',
        closeBundle: 'cp -f ./src/content-script/base.css ./build/',
      }),
      vitePluginRunCommandOnDemand({
        closeBundle:
          'tsc --outDir ./build/inject -p tsconfig.webpage.json && uglifyjs ./build/inject/content-script/webpage/messenger.js ./build/inject/content-script/webpage/ws-hook.js -o ./build/assets/chunk-webpage.min.js -c -m && rm -rf ./build/inject',
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
