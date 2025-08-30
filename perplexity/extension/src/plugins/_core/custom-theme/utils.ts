import { BUILTIN_THEME_REGISTRY } from "@/data/dashboard/themes/built-in-themes";
import type { Theme } from "@/data/dashboard/themes/theme.types";
import { getLocalThemesProxyService } from "@/plugins/_core/custom-theme/indexed-db/proxy";
import { getLocalThemesService } from "@/plugins/_core/custom-theme/indexed-db/proxy-register.background-listener";
import { isBackgroundScript } from "@/utils/utils";

export async function getThemeCss(themeId: Theme["id"]) {
  return getBuiltInThemeCss(themeId) || (await getLocalThemeCss(themeId)) || "";
}

export function getBuiltInThemeCss(themeId: Theme["id"]) {
  return (
    BUILTIN_THEME_REGISTRY.find((theme) => theme.id === themeId)?.css ?? ""
  );
}

export async function getLocalThemeCss(themeId: Theme["id"]) {
  const getService = isBackgroundScript()
    ? getLocalThemesService
    : getLocalThemesProxyService;

  return (await getService().get(themeId))?.css ?? "";
}
