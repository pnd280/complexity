import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import $ from "jquery";
import { lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { IncompatibleInterfaceLanguageNotice } from "@/content-script/components/IncompatibleInterfaceLanguageNotice";
import MainPage from "@/content-script/components/MainPage";
import QueryBox from "@/content-script/components/QueryBox/QueryBox";
import ThreadExportButton from "@/content-script/components/ThreadExportButton";
import useCloudflareTimeout from "@/content-script/hooks/useCloudflareTimeout";
import useRouter from "@/content-script/hooks/useRouter";
import CplxUserSettingsMenu from "@/cplx-user-settings/components/CplxUserSettingsMenu";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import { Toaster } from "@/shared/components/Toaster";
import { queryClient } from "@/utils/ts-query-query-client";
import { whereAmI } from "@/utils/utils";

const Commander = lazy(() => import("@/content-script/components/Commander"));
const CanvasPanel = lazy(
  () => import("@/content-script/components/Canvas/CanvasPanel"),
);
const ThreadMessageStickyToolbar = lazy(
  () => import("@/content-script/components/ThreadMessageStickyToolbar"),
);
const AlternateMarkdownBlock = lazy(
  () => import("@/content-script/components/AlternateMarkdownBlock"),
);
const ThreadToc = lazy(() => import("@/content-script/components/ThreadToc"));

export default function ReactRoot() {
  const $root = $("<div>")
    .attr("id", "complexity-root")
    .appendTo(document.body);

  const root = createRoot($root[0]);

  root.render(
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>,
  );
}

function Root() {
  const location = whereAmI(useRouter().url);

  useCloudflareTimeout({
    enabled:
      CplxUserSettings.get().generalSettings.qolTweaks
        .autoRefreshSessionTimeout && !$(document.body).hasClass("no-js"),
  });

  useEffect(() => {
    return () => {
      queryClient.resetQueries({
        predicate(query) {
          return query.queryKey[0] === "domNode";
        },
      });
    };
  });

  return (
    <>
      <QueryBox />
      {import.meta.env.DEV && <Commander />}

      {location === "home" && <MainPageComponents />}

      {location === "thread" && <ThreadComponents />}

      <Toaster />

      <CplxUserSettingsMenu />

      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

function MainPageComponents() {
  return (
    <>
      <MainPage />
      <IncompatibleInterfaceLanguageNotice />
    </>
  );
}

function ThreadComponents() {
  const settings = CplxUserSettings.get().generalSettings.qolTweaks;

  return (
    <>
      <ThreadExportButton />
      {settings.threadToc && <ThreadToc />}
      {settings.threadMessageStickyToolbar && <ThreadMessageStickyToolbar />}
      {settings.alternateMarkdownBlock && <AlternateMarkdownBlock />}
      {settings.canvas.enabled && <CanvasPanel />}
    </>
  );
}
