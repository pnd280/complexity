(globalThis as any).isBackgroundScript = true;

import { setupBackgroundWorkers } from "@/entrypoints/background/setup-bg-workers";

setupBackgroundWorkers();

(async () => {
  console.log(await chrome.tabs.query({}));
})();
