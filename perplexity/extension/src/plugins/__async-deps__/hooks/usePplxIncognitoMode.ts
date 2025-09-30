import { usePplxCookiesStore } from "@/plugins/__async-deps__/global-stores/pplx-cookies-store";

export default function usePplxIncognitoMode(): boolean {
  const { cookies } = usePplxCookiesStore();

  const isIncognito = useMemo(
    () =>
      cookies.find((cookie) => cookie.name === "pplx.is-incognito")?.value ===
      "true",
    [cookies],
  );

  return isIncognito;
}
