export function setupBackgroundWorkers() {
  const workers = import.meta.glob(
    [
      "@/{entrypoints,plugins}/**/bg-worker.ts",
      "@/{entrypoints,plugins}/**/*.bg-worker.ts",
    ],
    { eager: true },
  ) as Record<string, { default: () => void }>;

  for (const [path, module] of Object.entries(workers)) {
    const worker = module.default;

    try {
      worker();
    } catch (error) {
      console.error(`[BG-WORKER MODULE REGISTRATION ERROR] ${path}:`, error);
    }
  }
}
