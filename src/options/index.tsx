import '@@/public/global.css';

import $ from 'jquery';
import {
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import ReactDOM from 'react-dom/client';

import Changelog from '@/components/Changelog';
import CustomTheme from '@/components/CustomTheme';
import useExtensionUpdate from '@/components/hooks/useExtensionUpdate';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import PopupSettings from '@/popup/PopupSettings';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import packageData from '../../package.json';

const queryClient = new QueryClient();

const queryStr = new URLSearchParams(window.location.search);

const version = packageData.version;

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <>
    <QueryClientProvider client={queryClient}>
      <div className="tw-font-sans tw-w-[800px] tw-max-w-[90vw] tw-mx-auto tw-my-4">
        <Tabs defaultValue={queryStr.get('tab') || 'popupSettings'}>
          <TabsList className="tw-grid tw-grid-cols-3 tw-sticky tw-top-5 tw-mb-5 tw-shadow-lg">
            <TabsTrigger value="popupSettings">Basic Settings</TabsTrigger>
            <TabsTrigger value="customTheme">Custom theme</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
          </TabsList>
          <TabsContent value="popupSettings">
            <PopupSettings />
          </TabsContent>
          <TabsContent value="customTheme">
            <CustomTheme />
          </TabsContent>
          <TabsContent value="changelog">
            <Changelog />
          </TabsContent>
        </Tabs>
      </div>
      <NewVersionAvailable />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </>
);

function NewVersionAvailable() {
  const { newVersionAvailable, newVersion } = useExtensionUpdate({});

  if (!newVersionAvailable) return null;

  return (
    <div className="tw-fixed tw-bottom-10 tw-left-1/2 -tw-translate-x-1/2 tw-w-max">
      <div className="tw-font-sans tw-bg-background tw-text-foreground tw-p-2 tw-px-4 tw-rounded-md tw-border !tw-border-accent-foreground tw-animate-in tw-slide-in-from-bottom tw-transition-all hover:tw-scale-105 tw-shadow-2xl hover:tw-shadow-accent-foreground tw-text-center">
        <div className="tw-text-3xl tw-font-bold">
          A New Version is Available!
        </div>
        <div className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-font-mono">
          <div className="">{version}</div>
          <ArrowRight className="tw-w-4 tw-h-4" />
          <div className="tw-font-bold tw-text-lg tw-text-accent-foreground">
            {newVersion}
          </div>
        </div>
        <div className="tw-flex tw-items-center tw-gap-2 tw-justify-center">
          <div className="tw-flex tw-flex-col tw-gap-1 tw-justify-center tw-items-center">
            <div>Restart the browser to trigger the update.</div>
            <div className="tw-flex tw-gap-1 tw-items-center">
              Not working?{' '}
              <a
                className="tw-underline tw-flex tw-items-center tw-gap-1"
                href="https://chromewebstore.google.com/detail/complexity/ffppmilmeaekegkpckebkeahjgmhggpj"
                target="_blank"
              >
                Reinstall
                <ExternalLink className="tw-w-3 tw-h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

$('html').toggleClass(
  'dark',
  window.matchMedia('(prefers-color-scheme: dark)').matches
);
