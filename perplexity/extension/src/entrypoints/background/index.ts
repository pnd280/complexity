import { setupBackgroundWorkers } from "@/__registries__/bg-workers";

(globalThis as any).isBackgroundScript = true;

setupBackgroundWorkers();

(function keepAlive() {
  setInterval(async () => {
    void chrome.runtime.getPlatformInfo();
  }, 25000);
})();
