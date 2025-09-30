export function setupBackgroundWorkers() {
  const workers = import.meta.glob(
    ["@/services/**/*.bg-worker.ts", "@/plugins/**/*.bg-worker.ts"],
    {
      eager: true,
    },
  ) as Record<string, { default: () => void }>;

  for (const [path, module] of Object.entries(workers)) {
    const worker = module.default;

    invariant(
      typeof worker == "function",
      `[BG-WORKER MODULE REGISTRATION ERROR] Default export is not a function in ${path}`,
    );

    try {
      worker();
    } catch (error) {
      console.error(`[BG-WORKER MODULE REGISTRATION ERROR] ${path}:`, error);
    }
  }
}
