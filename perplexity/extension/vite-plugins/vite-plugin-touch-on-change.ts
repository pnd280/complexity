import * as fs from "fs";
import * as path from "path";

import { minimatch } from "minimatch";
import type { Plugin } from "vite";

import { Logger } from "@complexity/cli-logger";

function touchFile(filePath: string): void {
  const time = new Date();
  fs.utimesSync(filePath, time, time);
}

function isFileMatched(file: string, globPatterns: string[]): boolean {
  const includes = globPatterns.filter((pattern) => !pattern.startsWith("!"));
  const excludes = globPatterns
    .filter((pattern) => pattern.startsWith("!"))
    .map((pattern) => pattern.slice(1));

  return (
    includes.some((pattern) => minimatch(file, pattern)) &&
    !excludes.some((pattern) => minimatch(file, pattern))
  );
}

type TouchOnChangePluginOptions = {
  watch: string | string[];
  globs: string[];
  verbose?: boolean;
};

export default function vitePluginTouchOnChange({
  watch,
  globs,
  verbose = false,
}: TouchOnChangePluginOptions): Plugin {
  const logger = new Logger({
    name: "vite-plugin-touch-on-change",
    isVerbose: verbose,
    printPrefix: true,
  });

  const watchPaths = Array.isArray(watch) ? watch : [watch];
  const absoluteWatchPaths = watchPaths.map((watchPath) =>
    path.resolve(process.cwd(), watchPath),
  );

  return {
    name: "touch-on-change",
    configureServer(server) {
      logger.verbose(
        `Plugin initialized, watching ${globs.length} glob patterns for ${watchPaths.length} file(s)`,
      );

      server.watcher.on("change", (file) => {
        const absoluteFile = path.resolve(file);

        // Prevent infinite loop: skip if the changed file is one we're watching
        if (
          absoluteWatchPaths.some((watchPath) => absoluteFile === watchPath)
        ) {
          logger.verbose(`Skipping ${file} (is a watched file)`);
          return;
        }

        const relativePath = path
          .relative(process.cwd(), file)
          .replace(/\\/g, "/");

        logger.verbose(`File changed: ${relativePath}`);

        if (isFileMatched(relativePath, globs)) {
          watchPaths.forEach((watchPath) => {
            touchFile(watchPath);
            logger.info(
              `Touched ${watchPath} due to change in ${relativePath}`,
            );
          });
        } else {
          logger.verbose(`File ${relativePath} does not match any patterns`);
        }
      });
    },
  };
}
