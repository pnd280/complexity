import $ from 'jquery';
import { createRoot } from 'react-dom/client';

import { Commander } from '@/components/Commander';
import useRouter from '@/components/hooks/useRouter';
import MainPage from '@/components/MainPage';
import MarkdownBlockHeader
  from '@/components/MarkdownBlock/MarkdownBlockHeader';
import QueryBox from '@/components/QueryBox';
import ThreadExportButton from '@/components/ThreadExportButton';
import ThreadMessageStickyHeader
  from '@/components/ThreadMessageStickyToolbar/ThreadMessageStickyHeader';
import ThreadTOC from '@/components/ThreadTOC';
import { Toaster } from '@/components/ui/toaster';
import {
  popupSettingsStore,
} from '@/content-script/session-store/popup-settings';
import { whereAmI } from '@/utils/utils';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {
  IncompatibleInterfaceLanguageNotice,
} from '../components/IncompatibleInterfaceLanguageNotice';

export default function Root() {
  $('body').addClass('!tw-mr-0');

  const $root = $('<div>').attr('id', 'complexity-root').appendTo('body');

  const root = createRoot($root[0]);
  const queryClient = new QueryClient();

  root.render(
    <QueryClientProvider client={queryClient}>
      <ReactRoot />
    </QueryClientProvider>
  );
}

function ReactRoot() {
  const location = whereAmI(useRouter());

  return (
    <>
      <QueryBox />
      <Commander />

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
      {popupSettingsStore.getState().qolTweaks.threadMessageStickyHeader && (
        <ThreadMessageStickyHeader />
      )}
      {popupSettingsStore.getState().qolTweaks.markdownBlockToolbar && (
        <MarkdownBlockHeader />
      )}
    </>
  );
}
