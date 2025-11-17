import { LocalThemesService } from "@/entrypoints/core-plugins/custom-themes/indexed-db/service-init.bg-worker";
import { generateThemeData } from "@/entrypoints/core-plugins/custom-themes/themes/utils";

export default function () {
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

    console.log("Rebuilding custom themes");

    const themes = await LocalThemesService.Instance.getAll();

    for (const theme of themes) {
      const config = theme.config;

      const newData = generateThemeData(config);

      await LocalThemesService.Instance.update({
        ...theme,
        ...newData,
      });
    }
  });
}
