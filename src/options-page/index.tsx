import '@@/public/global.css';

import ReactDOM from 'react-dom/client';

import CanvasSettings from '@/options-page/components/CanvasSettings';
import Changelog from '@/options-page/components/Changelog';
import CustomTheme from '@/options-page/components/CustomTheme';
import { NewVersionDialog } from '@/options-page/components/NewVersionDialog';
import PopupSettings from '@/popup-page/components/PopupSettings';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/shadcn/ui/tabs';
import { Toaster } from '@/shared/components/shadcn/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const queryStr = new URLSearchParams(window.location.search);

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <>
    <QueryClientProvider client={queryClient}>
      <div className="tw-font-sans tw-w-[800px] tw-max-w-[90vw] tw-mx-auto tw-my-4">
        <Tabs defaultValue={queryStr.get('tab') || 'popupSettings'}>
          <TabsList className="tw-grid tw-grid-cols-4 tw-sticky tw-top-5 tw-mb-5 tw-shadow-lg tw-z-10">
            <TabsTrigger value="popupSettings">Basic Settings</TabsTrigger>
            <TabsTrigger value="canvas">✨ Canvas</TabsTrigger>
            <TabsTrigger value="customTheme">Custom theme</TabsTrigger>
            <TabsTrigger value="changelog">Changelog</TabsTrigger>
          </TabsList>
          <TabsContent value="popupSettings">
            <PopupSettings />
          </TabsContent>
          <TabsContent value="canvas">
            <CanvasSettings />
          </TabsContent>
          <TabsContent value="customTheme">
            <CustomTheme />
          </TabsContent>
          <TabsContent value="changelog">
            <Changelog />
          </TabsContent>
        </Tabs>
      </div>
      <NewVersionDialog />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </>
);
