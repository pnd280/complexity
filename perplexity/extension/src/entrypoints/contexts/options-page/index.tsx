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
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { APP_CONFIG } from "@/app.config";
import { Toaster } from "@/components/Toaster";
import { persistentQueryClient } from "@/entrypoints/contexts/options-page/services/persistent-query-client";
import { executeOptionsPageLoaders } from "@/entrypoints/registries/context-loaders/opt-loaders";
import {
  commonLocalesLazyImports,
  dashboardLocalesLazyImports,
} from "@/entrypoints/registries/i18n";
import { isCometBrowser, isCsInjectable } from "@/entrypoints/utils/comet";
import { initializeDayjsLocale, initializeI18n } from "@/services/i18n";

(async () => {
  void executeOptionsPageLoaders();

  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  $("html").attr("data-color-scheme", theme);

  await Promise.all([
    initializeI18n({
      lazyGlobs: [commonLocalesLazyImports, dashboardLocalesLazyImports],
    }),
    initializeDayjsLocale(),
  ]);

  const [{ router }] = await Promise.all([
    import("@/entrypoints/contexts/options-page/routes/router"),
  ]);

  const DevTools = APP_CONFIG.IS_DEV
    ? (await import("@/components/DevTools")).default
    : () => null;

  ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <QueryClientProvider client={persistentQueryClient.queryClient}>
      <RouterProvider router={router} />
      <Toaster />
      <DevTools />
    </QueryClientProvider>,
  );
})();
