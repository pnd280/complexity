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
import { detectConsecutiveClicks } from '@/utils/utils';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import packageData from '../../package.json';
import { PopupSettings } from './PopupSettings';

const queryClient = new QueryClient();

const version = `beta-${packageData.version}`;

console.log(chrome.runtime.id);

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <>
    <QueryClientProvider client={queryClient}>
      <div className="tw-font-sans">
        <DiscordCallout />
        <Separator />
        <div className="tw-w-[350px] tw-h-[250px]">
          <PopupSettings context="popup" />
        </div>
        <Footer />
        {chrome.runtime.id !== 'ffppmilmeaekegkpckebkeahjgmhggpj' &&
          !import.meta.env.DEV && <UntrustedBuildWarning />}
      </div>
    </QueryClientProvider>
  </>
);

function UntrustedBuildWarning() {
  return (
    <div className="tw-w-full tw-bg-secondary tw-flex tw-flex-col tw-font-sans">
      <Separator />
      <div className="tw-flex tw-px-2 tw-py-2 tw-text-sm tw-font-bold tw-gap-1 tw-bg-destructive tw-items-center">
        <CircleAlert className="tw-h-8 tw-w-8 tw-mr-1 tw-text-accent-foreground" />
        <span>This is an untrusted build. Use at your own risk.</span>
      </div>
    </div>
  );
}

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
          title={version}
          className={clsx(
            'tw-px-2 tw-py-1 tw-text-[.6rem] tw-font-bold tw-ml-auto tw-bg-background tw-text-foreground tw-rounded-md tw-font-mono tw-text-xs tw-self-center tw-border tw-truncate'
          )}
        >
          {version}
        </div>
      </div>
    </div>
  );
}

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
