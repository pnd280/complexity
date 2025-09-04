import { usePplxCookiesStore } from "@/plugins/_core/global-stores/index.public";

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
