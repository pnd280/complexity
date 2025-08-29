import { InstantCssService } from "@/services/features/instant-css";
import { InstantCssInjector } from "@/services/features/instant-css/injector.proxy-service";

export default async function listener() {
  chrome.runtime.onStartup.addListener(async () => {
    if (!(await InstantCssService.hasPermissions())) return;

    await InstantCssInjector.forceInjectAllPplxTabs();
  });
}
