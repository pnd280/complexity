import type { LanguageMessages } from "@complexity/i18n";

import { supportedLangs, type SupportedLangs } from "@/services/i18n/consts";

async function getCookieLocale(): Promise<string | undefined> {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("pplx.chosen-locale="))
    ?.split("=")[1];
}

export async function getLanguage() {
  const cookieLocale = await getCookieLocale();
  const pplxLang = cookieLocale || navigator.language || "en-US";

  const lang = isSupportedLanguage(pplxLang) ? pplxLang : "en-US";

  return lang;
}

export function isSupportedLanguage(
  language: string,
): language is SupportedLangs {
  return supportedLangs.includes(language as SupportedLangs);
}

export async function getTranslations({
  imports,
  activeLanguage,
}: {
  imports: Record<string, () => unknown>;
  activeLanguage: SupportedLangs;
}) {
  const manifests = Object.entries(imports).filter(([path]) =>
    path.endsWith("index.ts"),
  );

  invariant(
    manifests.length > 0,
    "[i18n] No manifests found. Make sure _locales/index.ts is present.",
  );

  const translations: Partial<
    Record<Lowercase<SupportedLangs>, LanguageMessages>
  > = {
    "en-us": {},
    [activeLanguage.toLocaleLowerCase()]: {},
  };

  for (const [path, importFn] of manifests) {
    const manifest = (await importFn()) as {
      namespace: string;
    };

    invariant(manifest.namespace, `[i18n] ${path} is missing a namespace`);

    const dirname = path.split("/").slice(0, -1).join("/");

    for (const [path, importFn] of Object.entries(imports)) {
      if (!path.startsWith(dirname) || path.endsWith("index.ts")) continue;

      const language = path.split("/").pop()?.split(".")[0];

      if (!language || !isSupportedLanguage(language)) continue;

      if (language !== "en-US" && language !== activeLanguage) continue;

      const languageTranslations = (await importFn()) as {
        default: LanguageMessages;
      };

      translations[language.toLocaleLowerCase() as Lowercase<SupportedLangs>]![
        manifest.namespace
      ] = languageTranslations.default;
    }
  }

  return translations;
}
