import {
  initBackgroundWatchdog as initInstantCssBackgroundWatchdog,
  removeBackgroundWatchdog as removeInstantCssBackgroundWatchdog,
} from "@/plugins/_core/custom-theme/instant-css-background-watchdog";
import { InstantCssService } from "@/services/features/instant-css";

export default function listener() {
  hanlder();
  chrome.permissions.onAdded.addListener(hanlder);
  chrome.permissions.onRemoved.addListener(hanlder);
}

async function hanlder() {
  if (await InstantCssService.hasPermissions()) {
    initInstantCssBackgroundWatchdog();
  } else {
    removeInstantCssBackgroundWatchdog();
  }
}
