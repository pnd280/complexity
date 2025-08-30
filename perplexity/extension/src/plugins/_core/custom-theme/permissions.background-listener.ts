import {
  initBackgroundWatchdog as initInstantCssBackgroundWatchdog,
  removeBackgroundWatchdog as removeInstantCssBackgroundWatchdog,
} from "@/plugins/_core/custom-theme/instant-css-background-watchdog";
import { InstantCssService } from "@/services/features/instant-css";

export default function listener() {
  handler();
  chrome.permissions.onAdded.addListener(handler);
  chrome.permissions.onRemoved.addListener(handler);
}

async function handler() {
  if (await InstantCssService.hasPermissions()) {
    initInstantCssBackgroundWatchdog();
  } else {
    removeInstantCssBackgroundWatchdog();
  }
}
