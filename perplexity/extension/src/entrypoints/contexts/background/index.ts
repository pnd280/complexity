import { setupBackgroundWorkers } from "@/entrypoints/registries/context-loaders/bg-workers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).isBackgroundScript = true;

setupBackgroundWorkers();

(function keepAlive() {
  setInterval(async () => {
    void chrome.runtime.getPlatformInfo();
  }, 25000);
})();
