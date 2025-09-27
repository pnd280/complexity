import { InstantCssService } from "@/services/features/instant-css";
import { InstantCssInjectorService } from "@/services/features/instant-css/injector/service-init.bg-worker";

export default function () {
  hanlder();
  chrome.permissions.onAdded.addListener(hanlder);
  chrome.permissions.onRemoved.addListener(hanlder);
}

async function hanlder() {
  if (await InstantCssService.hasPermissions()) {
    InstantCssInjectorService.Instance.registerListeners();
  } else {
    InstantCssInjectorService.Instance.removeListeners();
  }
}
