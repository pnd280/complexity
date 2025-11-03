import PersistentQueryClient from "@/services/infra/query-client";

export default function () {
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

    console.log("Wiping query cache. REASON: UPDATE");

    void PersistentQueryClient.wipeQueryCache("contentScript");
    void PersistentQueryClient.wipeQueryCache("optionsPage");
  });
}
