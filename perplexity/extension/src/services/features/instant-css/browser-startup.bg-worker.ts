import { InstantCssService } from "@/services/features/instant-css";
import { InstantCssInjectorService } from "@/services/features/instant-css/injector/service-init.bg-worker";

export default async function () {
  chrome.runtime.onStartup.addListener(async () => {
    if (!(await InstantCssService.hasPermissions())) return;

    await InstantCssInjectorService.Instance.forceInjectAllPplxTabs();
  });
}
