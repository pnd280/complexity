export const pluginManifestsImports = import.meta.glob(
  "@/{entrypoints,plugins}/**/index.manifest.ts",
  {
    eager: true,
    import: "default",
  },
);
