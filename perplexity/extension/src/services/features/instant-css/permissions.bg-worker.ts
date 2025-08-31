import { InstantCssService } from "@/services/features/instant-css";
import { getInstantCssInjectorService } from "@/services/features/instant-css/injector/proxy-register.bg-worker";

export default function () {
  hanlder();
  chrome.permissions.onAdded.addListener(hanlder);
  chrome.permissions.onRemoved.addListener(hanlder);
}

async function hanlder() {
  if (await InstantCssService.hasPermissions()) {
    getInstantCssInjectorService().registerListeners();
  } else {
    getInstantCssInjectorService().removeListeners();
  }
}
