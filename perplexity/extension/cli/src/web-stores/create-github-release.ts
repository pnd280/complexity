import fs from "fs";
import path from "path";
import process from "process";

import packageJson from "#/package.json" assert { type: "json" };
import { Logger } from "@complexity/cli-logger";
import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";

import { execAsync } from "@/utils";
import {
  getExtensionVersion,
  getHash,
  getArtifactPath,
  CHANGELOG_DIR,
} from "@/web-stores/utils";

const LOGGER_NAME = packageJson.name;

const FOOTER_TEMPLATE_PATH = path.resolve(
  __dirname,
  "./release-note-footer-template.md",
);

const logger = new Logger({
  name: LOGGER_NAME,
  printPrefix: false,
});

const program = new Command();

program
  .name("create-github-release")
  .description("Create a new GitHub release for the extension")
  .version(packageJson.version)
  .action(main);

program.parse(process.argv);

async function main(): Promise<void> {
  const extVersion = getExtensionVersion({ defaultVersion: packageJson });
  const changelogFile = path.join(CHANGELOG_DIR, `${extVersion}.md`);

  if (fs.existsSync(changelogFile)) {
    logger.info(
      `Changelog file ${chalk.yellowBright(changelogFile)} already exists`,
    );
  } else {
    fs.writeFileSync(changelogFile, "");
    logger.success(
      `Created empty changelog file ${chalk.yellowBright(changelogFile)}`,
    );
  }

  const { createRelease } = await inquirer.prompt([
    {
      type: "confirm",
      name: "createRelease",
      message: `Create a new GitHub release for version ${extVersion}?`,
      default: false,
    },
  ]);

  if (createRelease === true) {
    const tagName = `${packageJson.name}@${extVersion}`;

    const crxPath = getArtifactPath("chrome", extVersion);
    const xpiPath = getArtifactPath("firefox", extVersion);

    const crxExists = fs.existsSync(crxPath);
    const xpiExists = fs.existsSync(xpiPath);

    let proceedWithRelease = true;

    if (!crxExists || !xpiExists) {
      const missingFiles: string[] = [];
      if (!crxExists) missingFiles.push(crxPath);
      if (!xpiExists) missingFiles.push(xpiPath);

      const { proceed } = await inquirer.prompt([
        {
          type: "confirm",
          name: "proceed",
          message: `The following files are missing: ${missingFiles.join(", ")}. Do you want to proceed with creating the release without them?`,
          default: false,
        },
      ]);

      proceedWithRelease = proceed;
    }

    if (proceedWithRelease) {
      const temptChangelogFile = `${changelogFile}.tmp`;
      const releaseNote = fs.readFileSync(changelogFile, "utf8");

      let footerContent: string;
      try {
        footerContent = generateFooter(extVersion, crxExists, xpiExists);
      } catch (error) {
        logger.error(`Failed to generate footer: ${(error as Error).message}`);
        return;
      }

      fs.writeFileSync(
        temptChangelogFile,
        releaseNote + "\n\n" + footerContent,
      );

      let command = `gh release create "${tagName}" -t "${tagName}" --notes-file ${temptChangelogFile}`;

      if (crxExists) {
        command += ` "${crxPath}"`;
      }

      if (xpiExists) {
        command += ` "${xpiPath}"`;
      }

      try {
        const { stdout } = await execAsync(command);
        console.log(stdout);

        logger.success(`Created release ${chalk.yellowBright(tagName)}`);
        logger.detail(
          `https://github.com/pnd280/complexity/releases/tag/${tagName}`,
        );
      } catch (error) {
        logger.error(
          `Failed to create GitHub release: ${(error as Error).message}`,
        );
        process.exit(1);
      } finally {
        fs.unlinkSync(temptChangelogFile);
      }
    } else {
      logger.info("Release creation cancelled.");
    }
  }
}

function generateFooter(
  version: string,
  crxExists = true,
  xpiExists = true,
): string {
  try {
    const footerTemplate = fs.readFileSync(FOOTER_TEMPLATE_PATH, "utf8");

    const crxHash = crxExists
      ? getHash(getArtifactPath("chrome", version))
      : "File not available";
    const xpiHash = xpiExists
      ? getHash(getArtifactPath("firefox", version))
      : "File not available";

    return footerTemplate
      .replace("$CRX_HASH", crxHash)
      .replace("$XPI_HASH", xpiHash);
  } catch (error) {
    logger.error(
      `Failed to generate release note: ${(error as Error).message}`,
    );
    throw error;
  }
}
