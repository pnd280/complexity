import {
  globalCssStore,
  type GlobalCssStoreRegistry,
} from "@/plugins/__async-deps__/global-stores/global-css-store";

export default function () {
  globalCssStore.subscribe((store) => {
    const cssEntries = store.cssEntries;
    const addedToDom = store.addedToDom;

    for (const [key, cssEntry] of Object.entries(cssEntries) as [
      keyof GlobalCssStoreRegistry,
      { css: string; subscribers: Set<string> },
    ][]) {
      if (cssEntry.subscribers.size === 0) {
        if (addedToDom.has(key)) {
          $(`style#${key}`).remove();
          globalCssStore.getState().markRemovedFromDom(key);
        }
        continue;
      }

      if (addedToDom.has(key)) continue;

      $("<style>").attr("id", key).text(cssEntry.css).appendTo("head");
      globalCssStore.getState().markAddedToDom(key);
    }
  });
}
