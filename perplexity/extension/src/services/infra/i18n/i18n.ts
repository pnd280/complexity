import { init, type LanguageMessages } from "@complexity/i18n";

import { type SupportedLangs } from "@/services/infra/i18n/consts";
import { getLanguage } from "@/services/infra/i18n/utils";

export async function initializeI18n({
  lazyGlobs,
}: {
  lazyGlobs: Array<Record<string, () => Promise<unknown>>>;
}) {
  const activeLanguage = await getLanguage();

  const localeEntries = lazyGlobs
    .map((glob) => Object.entries(glob))
    .flat()
    .filter(
      ([path]) =>
        path.endsWith(".en-US.ts") || path.endsWith(`.${activeLanguage}.ts`),
    );

  const namespaceResources = await Promise.all(
    localeEntries.map(async ([path, importFn]) => {
      const namespace = path.split("/").pop()?.split(".")[0];
      const locale = path.split("/").pop()?.split(".")[1] as SupportedLangs;

      invariant(locale, `${path} has no locale`);
      invariant(namespace, `${path} has no namespace`);

      const languageResources = (
        (await importFn()) as {
          default: LanguageMessages;
        }
      ).default as LanguageMessages;

      return {
        locale,
        namespace,
        languageResources,
      };
    }),
  );

  const translations = namespaceResources.reduce(
    (acc, { locale, namespace, languageResources }) => {
      const lowerCaseLocale = locale.toLocaleLowerCase() as Lowercase<
        typeof locale
      >;

      if (acc[lowerCaseLocale] == null) {
        acc[lowerCaseLocale] = {};
      }

      (acc[lowerCaseLocale] as Record<string, LanguageMessages>)[namespace] =
        languageResources;

      return acc;
    },
    {} as Parameters<typeof init>[0]["translations"],
  );

  await init({
    locale: activeLanguage,
    fallbackLocale: "en-US" satisfies SupportedLangs,
    translations,
  });
}
