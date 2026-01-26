import { QueryCacheService } from "@/entrypoints/core-plugins/persistent-query-client/service-init.bg-worker";
import PersistentQueryClient from "@/services/persistent-query-client";

export default function () {
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

    console.log("Wiping query cache. REASON: UPDATE");

    void PersistentQueryClient.wipeQueryCache({
      db: QueryCacheService.Instance,
      id: "contentScript",
    });
    void PersistentQueryClient.wipeQueryCache({
      db: QueryCacheService.Instance,
      id: "optionsPage",
    });
  });
}
