import { invariant } from "@/utils/utils";

export async function executeCsPluginLoaders() {
  const loaders = import.meta.glob(
    ["@/plugins/**/loader.{ts,tsx}", "@/plugins/**/*.loader.{ts,tsx}"],
    {
      eager: false,
    },
  ) as Record<string, () => Promise<Record<string, unknown>>>;

  const modulePromises = Object.entries(loaders).map(
    async ([path, importModule]) => {
      const startTime = performance.now();
      const module = await importModule();
      const loadTime = performance.now() - startTime;
      return { path, module, loadTime };
    },
  );

  const importedModules = await Promise.all(modulePromises);

  const executionPromises = importedModules.map(async ({ path, module }) => {
    invariant("default" in module, `Loader "${path}" has no default export`);

    try {
      await Promise.resolve((module.default as () => void | Promise<void>)());
    } catch (error) {
      console.error(`[CS-LOADER MODULE EXECUTION ERROR] ${path}:`, error);
    }
  });

  await Promise.all(executionPromises);
}
