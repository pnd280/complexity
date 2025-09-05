export function setupBackgroundWorkers() {
  const entries = import.meta.glob("@/**/*.bg-worker.ts", {
    eager: true,
  }) as Record<string, { default: () => void }>;

  for (const [path, module] of Object.entries(entries)) {
    const worker = module.default;

    invariant(
      typeof worker == "function",
      `listener is not a function in ${path}`,
    );

    try {
      worker();
    } catch (error) {
      console.error(`[BG-WORKER MODULE REGISTRATION ERROR] ${path}:`, error);
    }
  }
}
