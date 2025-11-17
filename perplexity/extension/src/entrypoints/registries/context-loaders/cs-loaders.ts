export async function executeLibCsLoaders() {
  const loaders = import.meta.glob(
    [
      "@/{plugins,entrypoints}/**/lib-loader.ts",
      "@/{plugins,entrypoints}/**/*.lib-loader.ts",
    ],
    {
      eager: false,
    },
  );

  await Promise.all(
    Object.values(loaders).map((importModule) => importModule()),
  );
}

export async function executeCsLoaders() {
  const loaders = import.meta.glob(
    [
      "@/{plugins,entrypoints}/**/loader.*",
      "@/{plugins,entrypoints}/**/*.loader.*",
    ],
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
    try {
      await Promise.resolve((module.default as () => void | Promise<void>)());
    } catch (error) {
      console.error(`[CS-LOADER MODULE EXECUTION ERROR] ${path}:`, error);
    }
  });

  await Promise.all(executionPromises);
}
