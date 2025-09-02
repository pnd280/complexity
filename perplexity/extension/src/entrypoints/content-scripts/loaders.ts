import { invariant } from "@/utils/utils";

export async function executeCsPluginLoaders() {
  const loaders = import.meta.glob(
    ["@/plugins/!(_core)/loader.{ts,tsx}", "@/plugins/**/*.loader.{ts,tsx}"],
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
    await Promise.resolve((module.default as () => void | Promise<void>)());
  });

  await Promise.all(executionPromises);
}
