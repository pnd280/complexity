import { InstantCssService } from "@/services/features/instant-css";
import { InstantCssInjector } from "@/services/features/instant-css/injector.proxy-service";

export default function listener() {
  hanlder();
  chrome.permissions.onAdded.addListener(hanlder);
  chrome.permissions.onRemoved.addListener(hanlder);
}

async function hanlder() {
  if (await InstantCssService.hasPermissions()) {
    InstantCssInjector.registerListeners();
  } else {
    InstantCssInjector.removeListeners();
  }
}
