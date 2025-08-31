import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/utils";
import { threadRawHeadingsCssResourceConfig } from "@/plugins/thread-raw-headings/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { insertCss, whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:thread:rawHeadings": void;
  }
}

let cleanup: () => void | null;

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:thread:rawHeadings",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["thread:rawHeadings"]) return;

      rawHeadings(whereAmI());

      spaRouteChangeCompleteSubscribe((url) => {
        rawHeadings(whereAmI(url));
      });
    },
  });
}

async function rawHeadings(location: ReturnType<typeof whereAmI>) {
  cleanup?.();

  if (location !== "thread") return;

  const removeCss = insertCss({
    css: await getVersionedRemoteResource(threadRawHeadingsCssResourceConfig),
    id: "raw-headings",
  });

  cleanup = () => removeCss();
}
