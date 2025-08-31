import {
  generateThemeData,
  initialValues,
} from "@/data/dashboard/themes/utils";
import { getLocalThemesService } from "@/plugins/_core/custom-theme/indexed-db/get-service";

export default function () {
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details == null) return;

    if (details.reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

    console.log("Rebuilding custom themes");

    const themes = await getLocalThemesService().getAll();

    for (const theme of themes) {
      const config = theme.config;

      if (config == null) continue;

      const newData = generateThemeData(config, initialValues);

      await getLocalThemesService().update({
        ...theme,
        ...newData,
      });
    }
  });
}
