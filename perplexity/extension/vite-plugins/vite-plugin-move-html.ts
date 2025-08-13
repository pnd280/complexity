import * as fs from "fs";
import * as path from "path";

import type { PluginOption, ResolvedConfig } from "vite";

import { Logger } from "@complexity/cli-logger";

interface MoveHtmlOptions {
  /** Path relative to the output directory (e.g., 'dist') */
  src: string;
  /** Path relative to the output directory (e.g., 'dist') */
  dest: string;
  /** Whether to enable verbose logging */
  verbose?: boolean;
}

function readHtmlContent(filePath: string, logger: any): string | null {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    logger.verbose(`Read source file: ${filePath}`);
    return content;
  } catch (error) {
    logger.error(`Error reading file ${path.basename(filePath)}: ${error}`);
    return null;
  }
}

/** Rewrites relative asset paths inside HTML content based on new location. */
function rewriteHtmlPaths(
  htmlContent: string,
  sourceHtmlDirAbs: string, // Absolute path to original HTML directory
  destHtmlDirAbs: string, // Absolute path to new HTML directory
  logger: any,
): { updatedHtml: string; replacementsMade: number } {
  logger.info(`Rewriting relative paths for HTML`);
  logger.verbose(`Original directory: ${sourceHtmlDirAbs}`);
  logger.verbose(`Destination directory: ${destHtmlDirAbs}`);

  // Regex to find src="..." or href="..." attributes that aren't absolute
  const regex =
    /(href|src)=(["'])(?!https?:\/\/|http?:\/\/|\/|#|data:|mailto:|tel:)([^"']+)\2/g;

  let replacementsMade = 0;

  const updatedHtml = htmlContent.replace(
    regex,
    (match, attr, quote, originalRelativePath) => {
      try {
        // 1. Resolve the absolute path of the asset based on the ORIGINAL HTML location
        const assetAbsPath = path.resolve(
          sourceHtmlDirAbs,
          originalRelativePath,
        );

        // 2. Calculate the new relative path from the NEW HTML location to the asset
        let newRelativePath = path.relative(destHtmlDirAbs, assetAbsPath);

        // 3. Normalize slashes for web
        newRelativePath = newRelativePath.replace(/\\/g, "/");

        // Optional: Add ./ if it doesn't start with . or / (good practice)
        if (
          !newRelativePath.startsWith(".") &&
          !newRelativePath.startsWith("/")
        ) {
          newRelativePath = "./" + newRelativePath;
        }

        logger.verbose(
          `Rewriting path: ${originalRelativePath} → ${newRelativePath}`,
        );
        replacementsMade++;
        return `${attr}=${quote}${newRelativePath}${quote}`;
      } catch (resolveError) {
        // Log error but keep original path if resolution fails
        logger.warn(
          `Could not rewrite path "${originalRelativePath}": ${resolveError}`,
        );
        return match; // Return the original full match (e.g., href="path")
      }
    },
  );

  logger.detail(`Made ${replacementsMade} path replacements`);
  return { updatedHtml, replacementsMade };
}

function writeModifiedHtml(
  filePath: string,
  content: string,
  pluginContext: any,
  logger: any,
): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.detail(`Created destination directory: ${dir}`);
    }
    fs.writeFileSync(filePath, content, "utf8");
    logger.success(`Wrote modified HTML to ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    logger.error(`Error writing file ${path.basename(filePath)}: ${error}`);
    pluginContext.error(`Error writing file ${filePath}: ${error}`);
    return false;
  }
}

function updateManifest(
  outDir: string,
  srcRelative: string,
  destRelative: string,
  pluginContext: any,
  logger: any,
): void {
  const manifestPath = path.resolve(outDir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    logger.warn(
      `manifest.json not found at ${manifestPath}. Skipping manifest update.`,
    );
    return;
  }

  logger.info(`Updating manifest references`);
  logger.verbose(`Manifest path: ${manifestPath}`);

  try {
    let manifestContent = fs.readFileSync(manifestPath, "utf8");

    // Escape special characters in the source path for regex
    const escapedSrc = srcRelative.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    // Create a regex to find the source path within quotes
    const searchRegex = new RegExp(`"${escapedSrc}"`, "g");
    const replacementValue = `"${destRelative}"`;

    let replacementsMade = 0;
    const updatedManifestContent = manifestContent.replace(searchRegex, () => {
      replacementsMade++;
      logger.verbose(`Replacing "${srcRelative}" with "${destRelative}"`);
      return replacementValue;
    });

    if (replacementsMade > 0) {
      fs.writeFileSync(manifestPath, updatedManifestContent, "utf8");
      logger.success(
        `Updated manifest.json with ${replacementsMade} replacement(s)`,
      );
    } else {
      logger.detail(`No matches found for "${srcRelative}" in manifest`);
    }
  } catch (manifestError) {
    logger.error(`Error updating manifest.json: ${manifestError}`);
    pluginContext.warn(`Failed to update manifest.json: ${manifestError}`);
  }
}

/** Attempts to remove the original file and empty parent directories. */
function cleanupSource(
  sourcePath: string,
  sourceDir: string,
  outDir: string,
  pluginContext: any,
  logger: any,
): void {
  try {
    // Delete the original source file
    fs.unlinkSync(sourcePath);
    logger.verbose(`Removed original source file: ${sourcePath}`);

    // Try to remove the now-empty source directory structure
    let currentPath = sourceDir;
    const resolvedOutDir = path.resolve(outDir);
    let directoriesRemoved = 0;

    while (
      currentPath !== resolvedOutDir &&
      fs.existsSync(currentPath) &&
      fs.readdirSync(currentPath).length === 0
    ) {
      fs.rmdirSync(currentPath);
      directoriesRemoved++;
      logger.verbose(`Removed empty directory: ${currentPath}`);
      currentPath = path.dirname(currentPath);
    }

    if (directoriesRemoved > 0) {
      logger.detail(
        `Cleaned up ${directoriesRemoved} empty director${directoriesRemoved === 1 ? "y" : "ies"}`,
      );
    }
  } catch (error) {
    logger.warn(
      `Could not fully remove source file/directory structure: ${error}`,
    );
    pluginContext.warn(
      `Could not fully remove source file/directory structure (${sourcePath}): ${error}`,
    );
  }
}

export default function vitePluginMoveHtml(
  entries: MoveHtmlOptions[],
  verbose?: boolean,
): PluginOption {
  const isVerbose = verbose ?? false;
  const logger = new Logger({
    name: "vite-plugin-move-html",
    isVerbose,
    printPrefix: true,
  });
  let config: ResolvedConfig;
  let outputDir: string;

  return {
    name: "vite-plugin-move-html",
    apply: "build",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outputDir = config.build.outDir || "dist";
    },

    writeBundle: {
      order: "post",
      sequential: true,
      async handler() {
        entries.forEach((options) => {
          const sourcePath = path.resolve(outputDir, options.src);
          const destinationPath = path.resolve(outputDir, options.dest);
          const sourceDir = path.dirname(sourcePath);

          logger.log(`Processing HTML file`);
          logger.detail(`From: ${path.relative(process.cwd(), sourcePath)}`);
          logger.detail(`To: ${path.relative(process.cwd(), destinationPath)}`);

          if (!fs.existsSync(sourcePath)) {
            logger.warn(`Source file not found: ${options.src}. Skipping.`);
            this.warn(`Source file not found: ${sourcePath}. Skipping.`);
            return;
          }

          // 1. Read HTML
          const initialHtmlContent = readHtmlContent(sourcePath, logger);
          if (initialHtmlContent === null) {
            this.error("Failed to read source HTML file.");
            return; // Stop processing if read failed
          }

          // 2. Rewrite internal paths
          const { updatedHtml } = rewriteHtmlPaths(
            initialHtmlContent,
            sourceDir, // Absolute dir of original HTML
            path.dirname(destinationPath), // Absolute dir of new HTML
            logger,
          );

          // 3. Write modified HTML to destination
          const writeSuccess = writeModifiedHtml(
            destinationPath,
            updatedHtml,
            this,
            logger,
          );
          if (!writeSuccess) {
            return; // Stop processing if write failed
          }

          // 4. Update manifest
          updateManifest(outputDir, options.src, options.dest, this, logger);

          // 5. Cleanup original file and directories
          cleanupSource(sourcePath, sourceDir, outputDir, this, logger);

          logger.success(
            `Successfully moved ${options.src} to ${options.dest}`,
          );
        });
      },
    },
  };
}
