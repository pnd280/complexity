import { InstantCssService } from "@/services/features/instant-css";
import { getInstantCssInjectorService } from "@/services/features/instant-css/injector/get-service";

export default async function () {
  chrome.runtime.onStartup.addListener(async () => {
    if (!(await InstantCssService.hasPermissions())) return;

    await getInstantCssInjectorService().forceInjectAllPplxTabs();
  });
}
