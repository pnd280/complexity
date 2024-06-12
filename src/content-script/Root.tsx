import $ from 'jquery';
import { createRoot } from 'react-dom/client';

import CodeBlockEnhancedToolbar from '@/components/CodeBlockHeader';
import { Commander } from '@/components/Commander';
import useElementObserver from '@/components/hooks/useElementObserver';
import MainPage from '@/components/MainPage';
import QueryBox from '@/components/QueryBox';
import ThreadAnchor from '@/components/ThreadAnchor';
import ThreadExportButton from '@/components/ThreadExportButton';
import ThreadQueryHeader from '@/components/ThreadQueryHeader';
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
        {popupSettingsStore.getState().qolTweaks.threadTOC && <ThreadAnchor />}
        {popupSettingsStore.getState().qolTweaks.threadQueryEnhancedToolbar && (
          <ThreadQueryHeader />
        )}
        {popupSettingsStore.getState().qolTweaks.codeBlockEnhancedToolbar && (
          <CodeBlockEnhancedToolbar />
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
