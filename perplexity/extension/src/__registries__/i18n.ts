export const commonLocalesLazyGlob = import.meta.glob("@/_locales/*.*.ts", {
  eager: false,
});

export const pluginLocalesLazyGlob = import.meta.glob(
  "@/plugins/*/_locales/*.*.ts",
  {
    eager: false,
  },
);

export const dashboardLocalesLazyGlob = import.meta.glob(
  "@/entrypoints/options-page/**/_locales/*.*.ts",
  {
    eager: false,
  },
);
