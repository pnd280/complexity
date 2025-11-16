import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { createHashRouter } from "@/plugins/__core__/hash-router/router";
import Misc from "@/plugins/__ui-groups__/_root/Misc";
import { createUiGroupRegistry } from "@/plugins/__ui-groups__/registry-factory";
import HomepageComponents from "@/plugins/__ui-groups__/routes/Home";
import SettingsPageComponents from "@/plugins/__ui-groups__/routes/Settings";
import ThreadComponents from "@/plugins/__ui-groups__/routes/Thread";

// eslint-disable-next-line react-refresh/only-export-components
export const {
  registry: csUiRootComponentsRegistry,
  Components: CsUiRootComponents,
} = createUiGroupRegistry();

export default function CsUiRoot() {
  return (
    <QueryClientProvider client={persistentQueryClient.queryClient}>
      <CsUiRootComponents />

      <ThreadComponents />

      <HomepageComponents />

      <SettingsPageComponents />

      <RouterProvider router={createHashRouter()} />

      <Misc />
    </QueryClientProvider>
  );
}
