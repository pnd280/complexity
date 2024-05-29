import '@/assets/global.css';

import $ from 'jquery';
import { Zap } from 'lucide-react';
import ReactDOM from 'react-dom/client';

import { Separator } from '@/components/ui/separator';
import { chromeStorage } from '@/utils/chrome-store';
import observer from '@/utils/observer';
import { detectConsecutiveClicks } from '@/utils/utils';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { PopupSettings } from './PopupSettings';

const queryClient = new QueryClient();

const displayVersion = 'beta-0.0.0.4';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <>
    <QueryClientProvider client={queryClient}>
      <div className="tw-w-[300px]">
        <div className="tw-mb-10 tw-h-[300px]">
          <PopupSettings />
        </div>
        <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-bg-secondary tw-flex tw-flex-col tw-font-sans">
          <Separator />
          <div className="tw-flex">
            <div className="tw-p-2 tw-font-bold tw-flex tw-items-center">
              <span>Complexity</span>
              <Zap className="tw-h-3 tw-w-3 tw-mx-1 tw-text-accent-foreground" />
              <div className="tw-text-secondary-foreground !tw-min-w-max tw-truncate">
                by pnd280
              </div>
            </div>
            <div
              id="complexity-version"
              title={displayVersion}
              className="tw-px-2 tw-py-1 tw-mr-2 tw-text-[.6rem] tw-font-bold tw-ml-auto tw-bg-background tw-text-foreground tw-rounded-md tw-font-mono tw-self-center tw-border tw-truncate"
            >
              {displayVersion}
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  </>
);

$('html').toggleClass(
  'dark',
  window.matchMedia('(prefers-color-scheme: dark)').matches
);

observer.onElementExist({
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
