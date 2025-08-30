import { InstantCssService } from "@/services/features/instant-css";
import { getInstantCssInjectorService } from "@/services/features/instant-css/injector/proxy-register.background-listener";

export default function listener() {
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
