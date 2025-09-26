#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the compiled worklet files and convert them to data URLs
const workletFiles = [
  "cap-awp",
  "cap-worker",
  "cap-worker-waiter",
  "play-awp",
  "play-shared-awp",
];

const distDir = path.join(__dirname, "..", "dist", "worklets");
const srcDir = path.join(__dirname, "..", "src");

workletFiles.forEach((fileName) => {
  const workletPath = path.join(distDir, `${fileName}.js`);
  const outputPath = path.join(srcDir, `${fileName}-js.ts`);

  if (fs.existsSync(workletPath)) {
    const workletContent = fs.readFileSync(workletPath, "utf8");
    const dataUrl = `data:application/javascript,${encodeURIComponent(workletContent)}`;

    const tsContent = `// Auto-generated file - do not edit
export const js = ${JSON.stringify(dataUrl)};
`;

    fs.writeFileSync(outputPath, tsContent);
    console.log(`Generated ${outputPath}`);
  } else {
    console.warn(`Worklet file not found: ${workletPath}`);
  }
});
