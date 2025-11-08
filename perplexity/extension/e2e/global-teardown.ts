import fs from "fs";

import { E2E_CONFIG } from "~/e2e/config";

async function globalTeardown() {
  // console.log(E2E_CONFIG.TEMP_CHROME_INSTANCES_DIR);

  // if (fs.existsSync(E2E_CONFIG.TEMP_CHROME_INSTANCES_DIR)) {
  //   fs.rmSync(E2E_CONFIG.TEMP_CHROME_INSTANCES_DIR, { recursive: true });
  // }
}

export default globalTeardown;
