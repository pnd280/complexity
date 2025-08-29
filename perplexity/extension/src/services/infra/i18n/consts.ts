export const supportedLangs = [
  "en-US",
  "fr-FR",
  "de-DE",
  "ja-JP",
  "ko-KR",
  "zh-CN",
  "zh-TW",
  "es-ES",
  "hi-IN",
  "it-IT",
  "pt-BR",
  "cs-CZ",
  "hr-HR",
  "hu-HU",
  "pl-PL",
  "pt-PT",
  "sk-SK",
  "sr-Cyrl-ME",
  "nl-NL",
  "el-GR",
  "ro-RO",
  "id-ID",
  "bn-BD",
  "ru-RU",
] as const;

export type SupportedLangs = (typeof supportedLangs)[number];

export const dayjsLocaleImportNamesMap = {
  "en-US": "en",
  "fr-FR": "fr",
  "de-DE": "de",
  "ja-JP": "ja",
  "ko-KR": "ko",
  "zh-CN": "zh-cn",
  "zh-TW": "zh-tw",
  "es-ES": "es",
  "hi-IN": "hi",
  "it-IT": "it",
  "pt-BR": "pt-br",
  "cs-CZ": "cs",
  "hr-HR": "hr",
  "hu-HU": "hu",
  "pl-PL": "pl",
  "pt-PT": "pt",
  "sk-SK": "sk",
  "sr-Cyrl-ME": "sr",
  "nl-NL": "nl",
  "el-GR": "el",
  "ro-RO": "ro",
  "id-ID": "id",
  "bn-BD": "bn",
  "ru-RU": "ru",
} as const satisfies Record<SupportedLangs, string>;

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
