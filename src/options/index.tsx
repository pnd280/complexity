import '@/assets/global.css';

import $ from 'jquery';
import ReactDOM from 'react-dom/client';

import CustomTheme from '@/components/CustomTheme';
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

const queryClient = new QueryClient();

const queryStr = new URLSearchParams(window.location.search);

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <>
    <QueryClientProvider client={queryClient}>
      <div className="tw-font-sans tw-w-[800px] tw-max-w-[90vw] tw-mx-auto tw-my-4">
        <Tabs
          defaultValue={queryStr.get('tab') || 'popupSettings'}
          className="w-[400px]"
        >
          <TabsList className="tw-grid w-full tw-grid-cols-2">
            <TabsTrigger value="popupSettings">Basic Settings</TabsTrigger>
            <TabsTrigger value="customTheme">Custom theme</TabsTrigger>
          </TabsList>
          <TabsContent value="popupSettings">
            <PopupSettings />
          </TabsContent>
          <TabsContent value="customTheme">
            <CustomTheme />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </QueryClientProvider>
  </>
);

$('html').toggleClass(
  'dark',
  window.matchMedia('(prefers-color-scheme: dark)').matches
);
