import { init } from "@complexity/i18n";

import { type SupportedLangs } from "@/services/i18n/consts";
import { getTranslations, getLanguage } from "@/services/i18n/utils";

export async function initializeI18n({
  lazyGlobs,
}: {
  lazyGlobs: Array<Record<string, () => Promise<unknown>>>;
}) {
  const activeLanguage = await getLanguage();

  const translations = await getTranslations({
    imports: Object.assign({}, ...lazyGlobs),
    activeLanguage,
  });

  await init({
    locale: activeLanguage,
    fallbackLocale: "en-US" satisfies SupportedLangs,
    translations,
  });
}
