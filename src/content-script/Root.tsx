import $ from 'jquery';
import { createRoot } from 'react-dom/client';

import { Commander } from '@/components/Commander';
import MainPage from '@/components/MainPage';
import QueryBox from '@/components/QueryBox';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Root({ tabId }: { tabId?: number }) {
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
