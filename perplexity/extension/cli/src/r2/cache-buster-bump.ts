import fs from "fs";
import path from "path";

import packageJson from "#ext/package.json";

import { getRootPath } from "@/utils";

if (require.main === module) {
  const cacheBusterFilePath = path.resolve(getRootPath(), "cdn/cache-buster");

  const newCacheBuster = packageJson.version + "-" + Date.now();

  fs.writeFileSync(cacheBusterFilePath, newCacheBuster);
}
