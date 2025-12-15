export const commonLocalesLazyImports = import.meta.glob(
  "@/entrypoints/_locales/*.ts",
  {
    eager: false,
  },
);

export const dashboardLocalesLazyImports = import.meta.glob(
  "@/entrypoints/contexts/options-page/**/_locales/*.ts",
  {
    eager: false,
  },
);

export const pluginLocalesLazyImports = import.meta.glob(
  "@/plugins/**/_locales/*.ts",
  {
    eager: false,
  },
);
