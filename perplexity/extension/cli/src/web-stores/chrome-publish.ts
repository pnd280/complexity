import fs from "fs";
import process from "process";

import packageJson from "#/package.json" assert { type: "json" };
import { Logger } from "@complexity/cli-logger";
import chalk from "chalk";
import chromeWebstoreUpload from "chrome-webstore-upload";
import inquirer from "inquirer";

import {
  getExtensionVersion,
  validateZipFile,
  getArtifactPath,
} from "@/web-stores/utils";

const logger = new Logger({
  name: packageJson.name,
  printPrefix: false,
});

async function main(): Promise<void> {
  verifyEnvVariables();

  const extVersion = getExtensionVersion({ defaultVersion: packageJson });
  const zipPath = validateZipFile(extVersion, "chrome");

  logger.info("Uploading the zip file to the Chrome Web Store...");

  const store = chromeWebstoreUpload({
    extensionId: process.env.EXTENSION_ID!,
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    refreshToken: process.env.REFRESH_TOKEN!,
  });

  const zip = fs.createReadStream(zipPath);
  const response = await store.uploadExisting(zip);

  if (response == null || response.uploadState !== "SUCCESS") {
    logger.error("Failed to upload the extension to the Chrome Web Store");
    console.log(response);
    process.exit(1);
  }

  if (
    (
      await inquirer.prompt({
        type: "confirm",
        name: "publish",
        message: "Do you want to submit the extension for review?",
        default: false,
      })
    ).publish === true
  ) {
    logger.detail("Publishing...");
    await store.publish();
    logger.success(
      "The extension has been submitted for review on the Chrome Web Store",
    );
  } else {
    logger.success(
      "The extension has been uploaded successfully to the Chrome Web Store",
    );
  }

  const placeholderPath = getArtifactPath("chrome", extVersion);
  fs.writeFileSync(placeholderPath, "");

  logger.detail(
    `Permalink to download the draft CRX file:
    ${chalk.yellowBright(
      `https://chrome.google.com/webstore/download/${process.env.EXTENSION_ID}/revision/__DRAFT/package/main/crx/3`,
    )}`,
  );
}

main().catch((err: Error) => {
  logger.error(`Unhandled error: ${err.message}`);
  process.exit(1);
});

function verifyEnvVariables(): void {
  if (
    !process.env.EXTENSION_ID ||
    !process.env.CLIENT_ID ||
    !process.env.CLIENT_SECRET ||
    !process.env.REFRESH_TOKEN
  ) {
    logger.error("Missing environment variables");
    process.exit(1);
  }
}
