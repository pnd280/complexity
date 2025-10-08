import { InstantCssService } from "@/services/features/instant-css";
import { InstantCssInjectorService } from "@/services/features/instant-css/injector/service-init.bg-worker";

export default function () {
  void hanlder();
  chrome.permissions.onAdded.addListener(hanlder);
  chrome.permissions.onRemoved.addListener(hanlder);
}

async function hanlder() {
  if (await InstantCssService.hasPermissions()) {
    void InstantCssInjectorService.Instance.registerListeners();
  } else {
    void InstantCssInjectorService.Instance.removeListeners();
  }
}
