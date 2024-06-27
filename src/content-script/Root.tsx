import $ from 'jquery';
import { createRoot } from 'react-dom/client';

import { Commander } from '@/components/Commander';
import useElementObserver from '@/components/hooks/useElementObserver';
import MainPage from '@/components/MainPage';
import MarkdownBlockHeader
  from '@/components/MarkdownBlock/MarkdownBlockHeader';
import QueryBox from '@/components/QueryBox';
import ThreadExportButton from '@/components/ThreadExportButton';
import ThreadMessageStickyToolbar
  from '@/components/ThreadMessageStickyToolbar';
import ThreadTOC from '@/components/ThreadTOC';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { popupSettingsStore } from './session-store/popup-settings';

export default function Root() {
  $('body').addClass('!tw-mr-0');

  const $root = $('<div>').attr('id', 'complexity-root').appendTo('body');

  const root = createRoot($root[0]);

  const queryClient = new QueryClient();

  root.render(
    <>
      <QueryClientProvider client={queryClient}>
        <MainPage />
        <QueryBox />
        <Commander />
        {popupSettingsStore.getState().qolTweaks.threadTOC && <ThreadTOC />}
        {popupSettingsStore.getState().qolTweaks.threadMessageStickyToolbar && (
          <ThreadMessageStickyToolbar />
        )}
        {popupSettingsStore.getState().qolTweaks.MarkdownBlockToolbar && (
          <MarkdownBlockHeader />
        )}
        <ThreadExportButton />
        <Toaster />
        <IncompatibleInterfaceLanguageNotice />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

function IncompatibleInterfaceLanguageNotice() {
  const { toast } = useToast();

  useElementObserver({
    selector: '#interface-language-select',
    callback: ({ element }) => {
      if (!((element as HTMLSelectElement).value === 'en-US')) {
        toast({
          variant: 'destructive',
          title: '⚠️ Unsupported Language',
          description: (
            <span>
              The extension is only available in{' '}
              <span className="tw-font-bold">English.</span>
            </span>
          ),
        });
      }
    },
  });

  return null;
}
