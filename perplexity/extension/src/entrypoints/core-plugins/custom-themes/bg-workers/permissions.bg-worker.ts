import {
  initInstantCssBackgroundWatchdog,
  removeInstantCssBackgroundWatchdog,
} from "@/entrypoints/core-plugins/custom-themes/bg-workers/instant-css-background-watchdog";
import { InstantCssService } from "@/entrypoints/services/features/instant-css";

export default function () {
  void handler();
  chrome.permissions.onAdded.addListener(handler);
  chrome.permissions.onRemoved.addListener(handler);
}

async function handler() {
  if (await InstantCssService.hasPermissions()) {
    void initInstantCssBackgroundWatchdog();
  } else {
    void removeInstantCssBackgroundWatchdog();
  }
}
