import { setupBackgroundWorkers } from "@/data/registries/bg-workers";

(globalThis as any).isBackgroundScript = true;

setupBackgroundWorkers();
