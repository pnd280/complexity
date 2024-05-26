import chalk from 'chalk';
import * as fs from 'fs';
import { Plugin } from 'vite';

function touchFile(filePath: string): void {
  const time = new Date();
  fs.utimesSync(filePath, time, time);
}

type TouchGlobalCSSPluginOptions = {
  cssFilePath: string;
  watchFiles: string[];
};

export default function touchGlobalCSSPlugin({
  cssFilePath,
  watchFiles,
}: TouchGlobalCSSPluginOptions): Plugin {
  return {
    name: 'touch-global-css',
    configureServer(server) {
      server.watcher.on('change', (file) => {
        if (watchFiles.some((watchFile) => file.includes(watchFile))) {
          touchFile(cssFilePath);
          console.log(
            `${chalk.blue(`\n[touch-global-css]`)} ${chalk.green(`Touched ${chalk.yellow(cssFilePath)} due to change in ${chalk.yellow(file)}`)}`
          );
        }
      });
    },
  };
}
