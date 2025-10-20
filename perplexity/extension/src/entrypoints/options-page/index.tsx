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

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { lazily } from "react-lazily";
import { RouterProvider } from "react-router-dom";

import {
  commonLocalesLazyGlob,
  dashboardLocalesLazyGlob,
} from "@/__registries__/i18n";
import { APP_CONFIG } from "@/app.config";
import { Toaster } from "@/components/Toaster";
import { persistentQueryClient } from "@/entrypoints/options-page/persistent-query-client";
import { extensionSettingsQueries } from "@/services/infra/extension-api-wrappers/extension-settings/query-keys";
import { initializeDayjsLocale, initializeI18n } from "@/services/infra/i18n";
import { isCometBrowser, isCsInjectable } from "@/utils/wrappers/comet";

const { PersistentQueryCacheInvalidator } = lazily(
  () =>
    import(
      "@/entrypoints/options-page/components/PersistentQueryCacheInvalidator"
    ),
);

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
      {APP_CONFIG.CPLX_CDN_URL != null && (
        <Suspense>
          <PersistentQueryCacheInvalidator />
        </Suspense>
      )}
      <ReactQueryDevtools />
    </QueryClientProvider>,
  );
})();
