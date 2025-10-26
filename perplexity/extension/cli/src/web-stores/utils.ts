import crypto from "crypto";
import fs from "fs";
import path from "path";
import process from "process";

import packageJson from "#/package.json" assert { type: "json" };
import { Logger } from "@complexity/cli-logger";
import chalk from "chalk";
import { Command } from "commander";

import { getRootPath } from "@/utils";

const logger = new Logger({
  name: packageJson.name,
  printPrefix: false,
});

export const CHANGELOG_DIR = path.resolve(getRootPath(), "changelogs");
export const ARTIFACTS_DIR = path.resolve(getRootPath(), "release");

type ExtensionVersionParams = {
  defaultVersion: {
    version: string;
    [key: string]: any;
  };
};

export function getExtensionVersion({
  defaultVersion,
}: ExtensionVersionParams): string {
  const program = new Command();

  program
    .option("-v, --ext-version <version>", "specify extension version")
    .parse(process.argv);

  const options: { extVersion?: string } = program.opts();
  const extVersion = options.extVersion || defaultVersion.version;

  logger.info(`Using extension version: ${chalk.green(extVersion)}`);

  return extVersion;
}
export function validateZipFile(extVersion: string, browser: string): string {
  const zipPath = path.join(ARTIFACTS_DIR, `${extVersion}-${browser}.zip`);

  try {
    if (!fs.existsSync(zipPath)) {
      logger.error(`Zip file not found: ${zipPath}`);
      process.exit(1);
    }
    logger.verbose(`Found zip file: ${zipPath}`);
    return zipPath;
  } catch (err) {
    logger.error(`Error checking zip file: ${(err as Error).message}`);
    process.exit(1);
  }
}

export function getHash(filePath: string): string {
  try {
    const hash = crypto.createHash("sha256");
    const data = fs.readFileSync(filePath);
    hash.update(data);
    return hash.digest("hex");
  } catch (error) {
    logger.error(
      `Failed to generate MD5 hash for ${filePath}: ${(error as Error).message}`,
    );
    return "hash-calculation-failed";
  }
}

/**
 * Get the file path for a browser extension artifact
 * @param browser - "chrome" or "firefox"
 * @param version - Extension version
 * @param customName - Optional custom filename prefix (defaults to version)
 */
export function getArtifactPath(
  browser: "chrome" | "firefox",
  version: string,
  customName?: string,
): string {
  const prefix = customName ?? version;
  return path.join(
    ARTIFACTS_DIR,
    `${prefix}-${browser}.${browser === "chrome" ? "crx" : "xpi"}`,
  );
}
