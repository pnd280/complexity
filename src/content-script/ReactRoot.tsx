import "@@/public/global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import $ from "jquery";
import { lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { IncompatibleInterfaceLanguageNotice } from "@/content-script/components/IncompatibleInterfaceLanguageNotice";
import MainPage from "@/content-script/components/MainPage";
import QueryBox from "@/content-script/components/QueryBox/QueryBox";
import ThreadExportButton from "@/content-script/components/ThreadExportButton";
import useRouter from "@/content-script/hooks/useRouter";
import CPLXUserSettings from "@/lib/CPLXUserSettings";
import { Toaster } from "@/shared/components/shadcn/ui/toaster";
import { queryClient } from "@/utils/ts-query-query-client";
import { whereAmI } from "@/utils/utils";

const Commander = lazy(() => import("@/content-script/components/Commander"));
const CanvasPanel = lazy(
  () => import("@/content-script/components/Canvas/CanvasPanel"),
);
const ThreadMessageStickyToolbar = lazy(
  () =>
    import(
      "@/content-script/components/ThreadMessageStickyToolbar/ThreadMessageStickyToolbar"
    ),
);
const AlternateMarkdownBlock = lazy(
  () =>
    import(
      "@/content-script/components/AlternateMarkdownBlock/AlternateMarkdownBlock"
    ),
);
const ThreadTOC = lazy(() => import("@/content-script/components/ThreadTOC"));

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
  const settings = CPLXUserSettings.get().popupSettings.qolTweaks;

  return (
    <>
      <ThreadExportButton />
      {settings.threadTOC && <ThreadTOC />}
      {settings.threadMessageStickyToolbar && <ThreadMessageStickyToolbar />}
      {settings.alternateMarkdownBlock && <AlternateMarkdownBlock />}
      {settings.canvas.enabled && <CanvasPanel />}
    </>
  );
}
