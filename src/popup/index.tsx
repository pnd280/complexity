import '@/assets/global.css';

import clsx from 'clsx';
import $ from 'jquery';
import {
  CircleAlert,
  Zap,
} from 'lucide-react';
import ReactDOM from 'react-dom/client';
import { FaDiscord } from 'react-icons/fa';

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
      <div className="tw-font-sans">
        <DiscordCallout />
        <Separator />
        <div className="tw-w-[350px] tw-h-[250px]">
          <PopupSettings />
        </div>
        <Footer />
      </div>
    </QueryClientProvider>
  </>
);

function DiscordCallout() {
  return (
    <div className="tw-px-4 tw-py-2 tw-text-lg tw-flex tw-flex-wrap tw-gap-1 tw-justify-center tw-text-center tw-items-center">
      <a
        href="https://discord.gg/fxzqdkwmWx"
        target="_blank"
        className="tw-text-accent-foreground tw-flex tw-items-center tw-gap-1 tw-max-w-max tw-justify-center tw-underline"
      >
        <FaDiscord /> Discord
      </a>{' '}
      <span className="tw-text-sm tw-max-h-max">
        join to get the latest updates and support!
      </span>
    </div>
  );
}

function Footer() {
  const { data: latestVersion } = useQuery({
    queryKey: ['latestVersion'],
    queryFn: () => chromeStorage.getStorageValue('latestVersion'),
  });

  const newVersionAvailable =
    compareVersions(latestVersion || '0', version) === 1;

  return (
    <div className="tw-w-full tw-bg-secondary tw-flex tw-flex-col tw-font-sans">
      <Separator />
      <div className="tw-flex tw-px-2">
        <div className="tw-py-2 tw-text-sm tw-font-bold tw-flex tw-items-center">
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
            'tw-px-2 tw-py-1 tw-text-[.6rem] tw-font-bold tw-ml-auto tw-bg-background tw-text-foreground tw-rounded-md tw-font-mono tw-text-xs tw-self-center tw-border tw-truncate',
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
