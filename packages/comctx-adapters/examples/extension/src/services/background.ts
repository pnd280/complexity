import { BackgroundConsumer } from "@comctx-adapters/core/content-script/consumers/bg";
import defineProxy from "comctx";

import type { CounterService } from "@/services/counter";

export class BackgroundService {
  async getTabId() {
    return chrome.tabs.query({});
  }

  async broadcast({
    message,
    tabIds,
  }: {
    message: any;
    tabIds: number[] | "all";
  }) {
    chrome.tabs.query({}).then((tabs) => {
      tabs.forEach(async (tab) => {
        if (tab.id == null || (tabIds !== "all" && !tabIds.includes(tab.id)))
          return;

        if ((await chrome.tabs.get(tab.id)).url == null) return;

        const [, getService] = defineProxy(() => ({}) as CounterService, {
          namespace: "counter",
        });

        getService(new BackgroundConsumer({ tabId: tab.id })).increment();
      });
    });
  }
}
