import '@/assets/global.css';

import clsx from 'clsx';
import $ from 'jquery';
import {
  CircleAlert,
  Zap,
} from 'lucide-react';
import ReactDOM from 'react-dom/client';

import { Separator } from '@/components/ui/separator';
import { chromeStorage } from '@/utils/chrome-store';
import observer from '@/utils/observer';
import {
  compareVersions,
  detectConsecutiveClicks,
} from '@/utils/utils';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

import packageData from '../../package.json';
import { PopupSettings } from './PopupSettings';

const queryClient = new QueryClient();

const version = `beta-${packageData.version}`;

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <>
    <QueryClientProvider client={queryClient}>
      <div className="tw-w-[300px]">
        <div className="tw-mb-12 tw-h-[300px]">
          <PopupSettings />
        </div>
        <Footer />
      </div>
    </QueryClientProvider>
  </>
);

function Footer() {
  const { data: latestVersion } = useQuery({
    queryKey: ['latestVersion'],
    queryFn: () => chromeStorage.getStorageValue('latestVersion'),
  });

  const newVersionAvailable =
    compareVersions(latestVersion || '0', version) === 1;

  return (
    <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-bg-secondary tw-flex tw-flex-col tw-font-sans">
      <Separator />
      <div className="tw-flex">
        <div className="tw-px-2 tw-py-3 tw-font-bold tw-flex tw-items-center">
          <span>Complexity</span>
          <Zap className="tw-h-3 tw-w-3 tw-mx-1 tw-text-accent-foreground" />
          <div className="tw-text-secondary-foreground !tw-min-w-max tw-truncate">
            by pnd280
          </div>
        </div>
        <div
          id="complexity-version"
          title={newVersionAvailable ? 'New version available' : version}
          className={clsx(
            'tw-px-2 tw-py-1 tw-mr-2 tw-text-[.6rem] tw-font-bold tw-ml-auto tw-bg-background tw-text-foreground tw-rounded-md tw-font-mono tw-self-center tw-border tw-truncate',
            {
              'tw-bg-yellow-600 tw-flex tw-gap-1 tw-items-center':
                newVersionAvailable,
            }
          )}
        >
          {newVersionAvailable && (
            <CircleAlert className="tw-h-3 tw-w-3 tw-text-foreground" />
          )}
          {version}
        </div>
      </div>
    </div>
  );
}

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
