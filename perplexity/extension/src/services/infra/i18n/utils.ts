import {
  supportedLangs,
  type SupportedLangs,
} from "@/services/infra/i18n/consts";

async function getCookieLocale(): Promise<string | undefined> {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("pplx.chosen-locale="))
    ?.split("=")[1];
}

export async function getLanguage() {
  const cookieLocale = await getCookieLocale();
  const pplxLang = cookieLocale || navigator.language || "en-US";

  const lang = supportedLangs.includes(pplxLang as SupportedLangs)
    ? pplxLang
    : "en-US";

  return lang;
}
