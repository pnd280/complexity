import { usePplxCookiesStore } from "@/entrypoints/contexts/content-scripts/stores/pplx-cookies-store";

export default function usePplxIncognitoMode(): boolean {
  const { cookies } = usePplxCookiesStore();

  const isIncognito =
    cookies.find((cookie) => cookie.name === "pplx.is-incognito")?.value ===
    "true";

  return isIncognito;
}
