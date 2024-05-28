import '@/assets/global.css';

import $ from 'jquery';
import ReactDOM from 'react-dom/client';

import { chromeStorage } from '@/utils/chrome-store';
import { onElementExist } from '@/utils/observer';
import { detectConsecutiveClicks } from '@/utils/utils';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { Popup } from './Popup';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <>
    <QueryClientProvider client={queryClient}>
      <Popup />
    </QueryClientProvider>
  </>
);

$('html').toggleClass(
  'dark',
  window.matchMedia('(prefers-color-scheme: dark)').matches
);

onElementExist({
  selector: '#complexity-version',
  callback: ({ element }) => {
    detectConsecutiveClicks({
      element,
      requiredClicks: 7,
      clickInterval: 2000,
      callback() {
        chromeStorage.setStorageValue({
          key: 'secretMode',
          value: true,
        });
        $(element).text('🔓');
      },
    });
  },
});