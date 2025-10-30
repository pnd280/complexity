import fs from "fs";
import path from "path";
import process from "process";

import packageJson from "#/package.json" assert { type: "json" };
import { tryCatch } from "#/src/utils/wrappers/try-catch";
import { Logger } from "@complexity/cli-logger";

import { execAsync } from "@/utils";
import {
  getExtensionVersion,
  validateZipFile,
  getArtifactPath,
  ARTIFACTS_DIR,
  CHANGELOG_DIR,
} from "@/web-stores/utils";

const logger = new Logger({
  name: packageJson.name,
  printPrefix: false,
});

const extVersion = getExtensionVersion({ defaultVersion: packageJson });
const zipPath = validateZipFile(extVersion, "firefox");
const extractDir = path.join(ARTIFACTS_DIR, `${extVersion}-firefox`);

const AMO_VERSION_RELEASE_NOTES_PATH = path.resolve(
  __dirname,
  "./amo-version-release-notes.json",
);

async function main(): Promise<void> {
  verifyEnvVariables();

  if (fs.existsSync(extractDir)) {
    logger.verbose(`Removing existing ${extractDir}...`);
    fs.rmSync(extractDir, { recursive: true, force: true });
  }
  fs.mkdirSync(extractDir, { recursive: true });

  try {
    const [releaseNotes] = tryCatch(() =>
      fs.readFileSync(path.join(CHANGELOG_DIR, `${extVersion}.md`), "utf8"),
    );

    const metdataData = {
      version: {
        release_notes: {
          "en-US": releaseNotes ?? "No changelog for this version",
        },
      },
    };

    fs.writeFileSync(
      AMO_VERSION_RELEASE_NOTES_PATH,
      JSON.stringify(metdataData),
    );

    logger.verbose(`Extracting ${zipPath} to ${extractDir}...`);
    await execAsync(`unzip -o "${zipPath}" -d "${extractDir}"`);

    logger.info("Signing extension...");

    const { stdout } = await execAsync(
      `web-ext sign --channel listed --source-dir "${extractDir}" --artifacts-dir "${ARTIFACTS_DIR}" --amo-metadata "${AMO_VERSION_RELEASE_NOTES_PATH}"`,
    );
    console.log(stdout);

    logger.verbose("Renaming XPI file...");
    const xpiFile = path.join(ARTIFACTS_DIR, `complexity-${extVersion}.xpi`);

    if (!fs.existsSync(xpiFile)) {
      logger.error(`XPI file not found: ${xpiFile}`);
    } else {
      const newName = getArtifactPath("firefox", extVersion);
      fs.renameSync(xpiFile, newName);
      logger.verbose(`Renamed complexity-${extVersion}.xpi to ${newName}`);
    }

    cleanup();

    logger.success(
      "The add-on has been uploaded successfully to the Mozilla Add-ons Store",
    );
  } catch (err) {
    logger.error(`Error: ${(err as Error).message}`);
    cleanup();
    process.exit(1);
  }
}

function cleanup(): void {
  logger.verbose("Cleaning up...");
  fs.rmSync(extractDir, { recursive: true, force: true });
}

main().catch((err: Error) => {
  logger.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});

function verifyEnvVariables(): void {
  if (!process.env.WEB_EXT_API_KEY || !process.env.WEB_EXT_API_SECRET) {
    logger.error("Missing environment variables");
    process.exit(1);
  }
}
