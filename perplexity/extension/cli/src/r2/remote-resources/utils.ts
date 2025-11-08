import fs from "fs";
import path from "path";

import type { RemoteResourceReturnType } from "#/src/services/externals/cplx-api/remote-resources/types";
import { remoteResourceTypes } from "#/src/services/externals/cplx-api/types";
import type {
  VersionedRemoteResourceListing,
  VersionedRemoteResourceReturnType,
} from "#/src/services/externals/cplx-api/versioned-remote-resources/types";
import { globSync } from "glob";
import semver from "semver";

import { logger } from "@/r2/config";
import { execAsync, getRootPath, invariant } from "@/utils";

export type RemoteResourceRegisterParams = {
  name: string;
  id: string;
  type: (typeof remoteResourceTypes)[number];
  content: string;
  range: string;
};

export type ResourceListing = VersionedRemoteResourceListing;

export const cdnResourcesDir = path.resolve(getRootPath(), "cdn/resources");

export const cdnVersionedResourcesDir = path.resolve(
  getRootPath(),
  "cdn/versioned-resources",
);
export const listingFilePath = path.resolve(
  cdnVersionedResourcesDir,
  "listing.json",
);

export function findRemoteResourceFiles(params?: { cwd?: string }): string[] {
  return globSync("src/**/*.remote-resources.ts", {
    absolute: true,
    cwd: params?.cwd ?? getRootPath(),
  });
}

export function readResourceListing(params?: {
  path?: string;
}): ResourceListing {
  const filePath = params?.path ?? listingFilePath;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Listing file not found at ${filePath}`);
  }

  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as ResourceListing;
  } catch (error) {
    throw new Error(
      `Failed to read or parse ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function writeResourceListing(params: {
  listing: ResourceListing;
  path?: string;
}): void {
  const { listing } = params;
  const filePath = params.path ?? listingFilePath;

  try {
    const content = JSON.stringify(listing, null, 2);
    fs.writeFileSync(filePath, content);
    logger.verbose("Updated resource listing");
  } catch (error) {
    throw new Error(
      `Failed to write updated listing to ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function updateListingData(params: {
  listing: ResourceListing;
  name: string;
  id: string;
  type: (typeof remoteResourceTypes)[number];
  range: string;
}): ResourceListing {
  const { listing, name, id, type, range } = params;
  const fileName = `${id}.${type}`;

  const newListing = { ...listing };

  newListing[name] = newListing[name] ? { ...newListing[name] } : {};
  newListing[name][fileName] = range;

  // Sort the entries for the specific resource name by semantic version in descending order
  const entries = Object.entries(newListing[name]).sort(([fileA], [fileB]) => {
    const versionA = semver.coerce(fileA.slice(0, -(type.length + 1)), {
      includePrerelease: true,
    });
    const versionB = semver.coerce(fileB.slice(0, -(type.length + 1)), {
      includePrerelease: true,
    });

    if (versionA && versionB) {
      return semver.compare(versionB, versionA);
    }

    return fileB.localeCompare(fileA);
  });

  newListing[name] = entries.reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {} as { [fileName: string]: string },
  );

  return newListing;
}

export async function getResourceContent(params: {
  resource:
    | VersionedRemoteResourceReturnType<unknown>
    | RemoteResourceReturnType<unknown>;
}): Promise<string> {
  const { resource } = params;

  invariant(
    remoteResourceTypes.includes(resource.type),
    `Invalid resource type: ${resource.type}`,
  );

  try {
    switch (resource.type as (typeof remoteResourceTypes)[number]) {
      case "css": {
        const { stdout: minifiedContent } = await execAsync(
          `pnpx @tailwindcss/cli --minify -i ${resource.fallback}`,
        );
        // Remove Tailwind CSS legal comments
        return minifiedContent.replace(
          /\/\*!\s*tailwindcss\s+v[\d.]+\s*\|\s*MIT License\s*\|\s*https:\/\/tailwindcss\.com\s*\*\/\s*/g,
          "",
        );
      }
      case "txt":
        // Assuming fallback is already a string for txt
        return resource.fallback as string;
      case "json":
        // Ensure fallback is stringified if it's an object
        return typeof resource.fallback === "string"
          ? resource.fallback
          : JSON.stringify(resource.fallback);
      default:
        // Assume string for unknown types, maybe add a warning?
        logger.warn(
          `Using raw fallback for unknown resource type: ${resource.type}`,
        );
        return resource.fallback as string;
    }
  } catch (error) {
    if (isVersionedRemoteResource(resource)) {
      logger.error(
        `Failed to get content for resource ${resource.name} (type: ${resource.type}): ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error(`Content generation failed for ${resource.name}`); // Re-throw to signal failure
    } else if (isRemoteResource(resource)) {
      logger.error(
        `Failed to get content for resource ${resource.resourcePath} (type: ${resource.type}): ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error(`Content generation failed for ${resource.resourcePath}`); // Re-throw to signal failure
    } else {
      throw new Error(`Invalid resource type: ${resource}`);
    }
  }
}

export function isVersionedRemoteResource(
  resourceConfig: unknown,
): resourceConfig is VersionedRemoteResourceReturnType<unknown> {
  return (
    typeof resourceConfig === "object" &&
    resourceConfig != null &&
    "isVersioned" in resourceConfig &&
    resourceConfig.isVersioned === true
  );
}

export function isRemoteResource(
  resourceConfig: unknown,
): resourceConfig is RemoteResourceReturnType<unknown> {
  return !isVersionedRemoteResource(resourceConfig);
}
