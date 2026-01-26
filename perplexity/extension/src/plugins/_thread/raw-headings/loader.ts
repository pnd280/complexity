import { spaRouteChangeCompleteSubscribe } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { threadRawHeadingsCssResourceConfig } from "@/plugins/_thread/raw-headings/index.remote-resources";
import { insertCss } from "@/utils/dom-utils/generics";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:thread:rawHeadings": void;
  }
}

let cleanup: (() => void) | null;

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:thread:rawHeadings",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["thread:rawHeadings"]) return;

      void rawHeadings(whereAmI());

      spaRouteChangeCompleteSubscribe((url) => {
        void rawHeadings(whereAmI(url));
      });
    },
  });
}

async function rawHeadings(location: ReturnType<typeof whereAmI>) {
  cleanup?.();

  if (location !== "thread") return;

  const removeCss = insertCss({
    css: await getVersionedRemoteResource(
      threadRawHeadingsCssResourceConfig,
      persistentQueryClient,
    ),
    id: "raw-headings",
  });

  cleanup = () => removeCss();
}
