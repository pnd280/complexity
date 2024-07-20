import '@@/public/global.css';

import $ from 'jquery';
import { lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import AlternateMarkdownBlock from '@/content-script/components/AlternateMarkdownBlock/AlternateMarkdownBlock';
import CanvasPanel from '@/content-script/components/Canvas/CanvasPanel';
import { IncompatibleInterfaceLanguageNotice } from '@/content-script/components/IncompatibleInterfaceLanguageNotice';
import MainPage from '@/content-script/components/MainPage';
import QueryBox from '@/content-script/components/QueryBox/QueryBox';
import ThreadExportButton from '@/content-script/components/ThreadExportButton';
import ThreadMessageStickyToolbar from '@/content-script/components/ThreadMessageStickyToolbar/ThreadMessageStickyToolbar';
import ThreadTOC from '@/content-script/components/ThreadTOC';
import useRouter from '@/content-script/hooks/useRouter';
import { popupSettingsStore } from '@/content-script/session-store/popup-settings';
import { Toaster } from '@/shared/components/shadcn/ui/toaster';
import { queryClient } from '@/utils/ts-query-query-client';
import { whereAmI } from '@/utils/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const Commander = lazy(() => import('@/content-script/components/Commander'));

export default function ReactRoot() {
  const $root = $('<div>')
    .attr('id', 'complexity-root')
    .appendTo(document.body);

  const root = createRoot($root[0]);

  root.render(
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  );
}

function Root() {
  const location = whereAmI(useRouter().url);

  useEffect(() => {
    return () => {
      queryClient.resetQueries({
        predicate(query) {
          return query.queryKey[0] === 'domNode';
        },
      });
    };
  });

  return (
    <>
      <QueryBox />
      {import.meta.env.DEV && <Commander />}

      {location === 'home' && <MainPageComponents />}

      {location === 'thread' && <ThreadComponents />}

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
  return (
    <>
      <ThreadExportButton />
      {popupSettingsStore.getState().qolTweaks.threadTOC && <ThreadTOC />}
      {popupSettingsStore.getState().qolTweaks.threadMessageStickyToolbar && (
        <ThreadMessageStickyToolbar />
      )}
      {popupSettingsStore.getState().qolTweaks.alternateMarkdownBlock && (
        <AlternateMarkdownBlock />
      )}
      <CanvasPanel />
    </>
  );
}
