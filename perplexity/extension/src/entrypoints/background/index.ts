import { setupBackgroundWorkers } from "@/data/registries/bg-workers";

(globalThis as any).isBackgroundScript = true;

setupBackgroundWorkers();

(function keepAlive() {
  setInterval(async () => {
    void chrome.runtime.getPlatformInfo();
  }, 25000);
})();
