import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { threadRawHeadingsCssResourceConfig } from "@/plugins/thread-raw-headings/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { insertCss } from "@/utils/dom-utils/generics";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
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
