import { createRoot } from "react-dom/client";

import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import CsUiRoot from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "csui:root": void;
  }
}

export default function csUiRootLoader() {
  AsyncLoaderRegistry.register({
    id: "csui:root",
    dependencies: [
      "lib:i18n",
      "lib:dayjs",
      "cache:pluginsEnableStates",
      "cache:languageModels",
      "cache:domSelectors",
    ],
    loader: () => {
      const $root = $("<div>").attr("id", "complexity-root");

      $root.insertAfter($(DomSelectorsService.Root.cachedSync.ROOT));

      if ($root[0] == null) return;

      createRoot($root[0]).render(<CsUiRoot />);
    },
  });
}
