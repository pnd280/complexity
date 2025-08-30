import { InstantCssService } from "@/services/features/instant-css";
import { getInstantCssInjectorService } from "@/services/features/instant-css/injector/proxy-register.background-listener";

export default async function listener() {
  chrome.runtime.onStartup.addListener(async () => {
    if (!(await InstantCssService.hasPermissions())) return;

    await getInstantCssInjectorService().forceInjectAllPplxTabs();
  });
}
