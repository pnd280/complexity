import fs from "fs";
import path from "path";

import type { RemoteResourceReturnType } from "#/src/services/externals/cplx-api/remote-resources/types";

import { logger } from "@/r2/config";
import {
  cdnResourcesDir,
  findRemoteResourceFiles,
  getResourceContent,
  isRemoteResource,
} from "@/r2/remote-resources/utils";
import { ensureDirectoryExists } from "@/r2/utils";

async function processAllRemoteResourceFiles(): Promise<void> {
  const resourceDefinitionFiles = findRemoteResourceFiles();

  if (resourceDefinitionFiles.length === 0) {
    logger.warn("No remote resource definition files found.");
    return;
  }

  for (const filePath of resourceDefinitionFiles) {
    await processSingleResourceFile({
      filePath,
    });
  }
}

async function processSingleResourceFile(params: {
  filePath: string;
}): Promise<void> {
  const { filePath } = params;

  if (fs.readFileSync(filePath, "utf8").startsWith("/* cli-ignore */")) {
    logger.verbose(`Skipping ignored file: ${filePath}`);
    return;
  }

  logger.verbose(`Processing ${filePath}`);
  try {
    const module = await import(filePath);
    const resources = Object.values(module) as unknown[];

    for (const resource of resources) {
      if (!isRemoteResource(resource)) continue;

      await registerResource({
        resource,
      });
    }
  } catch (error) {
    logger.error(
      `Error processing file ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return;
  }
}

async function registerResource(params: {
  resource: RemoteResourceReturnType<any>;
}): Promise<void> {
  const { resource } = params;
  const content = await getResourceContent({ resource });
  const resourceFilePath = path.resolve(cdnResourcesDir, resource.resourcePath);

  try {
    // 1. Ensure directories exist
    ensureDirectoryExists({
      dir: cdnResourcesDir,
      logger,
    });

    // 2. Write the actual resource file
    fs.writeFileSync(resourceFilePath, content);

    logger.success(`${resource.resourcePath} registered`);
  } catch (error) {
    logger.error(
      `Failed to register resource ${resource.resourcePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

if (require.main === module) {
  processAllRemoteResourceFiles().catch((error) => {
    logger.error(`An unexpected error occurred: ${error}`);
    process.exit(1);
  });
}
