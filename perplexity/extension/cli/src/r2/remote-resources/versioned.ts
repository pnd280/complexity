import fs from "fs";
import path from "path";

import rootPackageJson from "#/package.json";
import type { VersionedRemoteResourceReturnType } from "#/src/entrypoints/services/externals/cplx-api/versioned-remote-resources/types";
import chalk from "chalk";

import { logger } from "@/r2/config";
import {
  cdnVersionedResourcesDir,
  findRemoteResourceFiles,
  getResourceContent,
  isVersionedRemoteResource,
  readResourceListing,
  updateListingData,
  writeResourceListing,
} from "@/r2/remote-resources/utils";
import type { ResourceListing } from "@/r2/remote-resources/utils";
import { ensureDirectoryExists } from "@/r2/utils";

async function processAllRemoteResourceFiles(): Promise<void> {
  const resourceDefinitionFiles = findRemoteResourceFiles();

  if (resourceDefinitionFiles.length === 0) {
    logger.warn("No remote resource definition files found.");
    return;
  }

  let listing: ResourceListing;
  try {
    listing = readResourceListing();
  } catch (error: any) {
    logger.error(`Failed to read resource listing: ${error.message}`);
    process.exit(1);
  }

  let updatedListing = { ...listing };

  for (const filePath of resourceDefinitionFiles) {
    const result = await processSingleResourceFile({
      filePath,
      listing: updatedListing,
    });

    if (result) {
      updatedListing = result;
    }
  }

  try {
    writeResourceListing({ listing: updatedListing });
  } catch (error: any) {
    logger.error(`Failed to write updated resource listing: ${error.message}`);
    process.exit(1);
  }
}

async function processSingleResourceFile(params: {
  filePath: string;
  listing: ResourceListing;
}): Promise<ResourceListing | null> {
  const { filePath, listing } = params;

  if (fs.readFileSync(filePath, "utf8").startsWith("/* cli-ignore */")) {
    logger.verbose(`Skipping ignored file: ${filePath}`);
    return null;
  }

  logger.verbose(`Processing ${filePath}`);
  try {
    const module = await import(filePath);
    const resources = Object.values(module) as unknown[];

    let currentListing = { ...listing };

    for (const resource of resources) {
      if (!isVersionedRemoteResource(resource)) continue;

      const result = await registerVersionedResource({
        resource,
        listing: currentListing,
      });

      if (result) {
        currentListing = result;
      }
    }

    return currentListing;
  } catch (error: any) {
    logger.error(`Error processing file ${filePath}: ${error.message}`);
    return null;
  }
}

async function registerVersionedResource(params: {
  resource: VersionedRemoteResourceReturnType<any>;
  listing: ResourceListing;
}): Promise<ResourceListing | null> {
  const { resource, listing } = params;
  const content = await getResourceContent({ resource });
  const id = rootPackageJson.version;
  const range = `>=${rootPackageJson.version}`;
  const resourceFileName = `${id}.${resource.type}`;
  const resourceDir = path.resolve(cdnVersionedResourcesDir, resource.name);
  const resourceFile = path.resolve(resourceDir, resourceFileName);

  try {
    // 1. Ensure directories exist
    ensureDirectoryExists({
      dir: cdnVersionedResourcesDir,
      logger,
    });
    ensureDirectoryExists({
      dir: resourceDir,
      logger,
    });

    // Check if the content has changed compared to the top-most (most recent) entry (the listing array is always sorted by semantic version in descending order)
    const contentChanged = hasVersionedContentChanged({
      resourceDir,
      resourceName: resource.name,
      resourceType: resource.type,
      newContent: content,
      listing,
    });

    // If content hasn't changed, skip registration
    if (!contentChanged) {
      logger.info(
        `Content unchanged for ${chalk.yellow(
          `["${resource.name}/${resourceFileName}"]`,
        )}`,
      );
      return listing;
    }

    // 2. Update listing object
    const updatedListing = updateListingData({
      listing,
      name: resource.name,
      id,
      type: resource.type,
      range,
    });

    // 3. Write the actual resource file
    fs.writeFileSync(resourceFile, content);

    logger.success(
      `${chalk.green(`["${resource.name}/${resourceFileName}": "${range}"]`)}`,
    );

    return updatedListing;
  } catch (error: any) {
    logger.error(
      `Failed to register resource ${resource.name}/${resourceFileName}: ${error.message}`,
    );
    return null;
  }
}

function hasVersionedContentChanged(params: {
  resourceDir: string;
  resourceName: string;
  resourceType: string;
  newContent: string;
  listing: ResourceListing;
}): boolean {
  const { resourceDir, resourceName, newContent, listing } = params;

  // If we don't have any entries for this resource yet, content has changed
  if (
    !listing[resourceName] ||
    Object.keys(listing[resourceName]).length === 0
  ) {
    return true;
  }

  // Get the most recent file (first entry after sorting)
  const mostRecentFile = Object.keys(listing[resourceName])[0];

  if (!mostRecentFile) {
    return true;
  }

  const existingFilePath = path.resolve(resourceDir, mostRecentFile);

  // If the file doesn't exist, content has changed
  if (!fs.existsSync(existingFilePath)) {
    return true;
  }

  try {
    // Read the existing file and compare with new content
    const existingContent = fs.readFileSync(existingFilePath, "utf8");
    return existingContent !== newContent;
  } catch (error) {
    // If there's an error reading the file, assume content has changed
    logger.warn(`Error comparing file content for ${resourceName}: ${error}`);
    return true;
  }
}

if (require.main === module) {
  processAllRemoteResourceFiles().catch((error) => {
    logger.error(`An unexpected error occurred: ${error}`);
    process.exit(1);
  });
}
