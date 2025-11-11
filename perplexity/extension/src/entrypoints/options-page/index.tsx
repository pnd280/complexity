(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).isOptionsPage = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).isCometBrowser = await isCometBrowser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).isCsInjectable = await isCsInjectable();
})();

import "@/assets/index.css";
import "@/assets/extension.css";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import {
  commonLocalesLazyGlob,
  dashboardLocalesLazyGlob,
} from "@/__registries__/i18n";
import { Toaster } from "@/components/Toaster";
import { persistentQueryClient } from "@/entrypoints/options-page/persistent-query-client";
import { extensionSettingsQueries } from "@/services/infra/extension-api-wrappers/extension-settings/query-keys";
import { initializeDayjsLocale, initializeI18n } from "@/services/infra/i18n";
import { isCometBrowser, isCsInjectable } from "@/utils/wrappers/comet";

(async () => {
  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  $("html").attr("data-color-scheme", theme);

  await Promise.all([
    initializeI18n({
      lazyGlobs: [commonLocalesLazyGlob, dashboardLocalesLazyGlob],
    }),
    initializeDayjsLocale(),
    persistentQueryClient.queryClient.prefetchQuery(
      extensionSettingsQueries.detail(),
    ),
  ]);

  const [{ router }] = await Promise.all([
    import("@/entrypoints/options-page/router"),
  ]);

  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <QueryClientProvider client={persistentQueryClient.queryClient}>
      <RouterProvider router={router} />
      <Toaster />
      <TanStackDevtools
        plugins={[
          {
            name: "Tanstack Query",
            render: <ReactQueryDevtoolsPanel />,
          },
          formDevtoolsPlugin(),
        ]}
      />
    </QueryClientProvider>,
  );
})();
