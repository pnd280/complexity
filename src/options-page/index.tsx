import "@@/public/global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";

import CanvasSettings from "@/options-page/components/CanvasSettings";
import Changelog from "@/options-page/components/Changelog";
import CustomTheme from "@/options-page/components/CustomTheme";
import { NewVersionDialog } from "@/options-page/components/NewVersionDialog";
import PopupSettings from "@/popup-page/components/PopupSettings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/shadcn/ui/tabs";
import { Toaster } from "@/shared/components/shadcn/ui/toaster";
import { queryClient } from "@/utils/ts-query-query-client";

const queryStr = new URLSearchParams(window.location.search);

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <div className="tw-mx-auto tw-my-4 tw-w-[800px] tw-max-w-[90vw] tw-font-sans">
      <Tabs defaultValue={queryStr.get("tab") || "popupSettings"}>
        <TabsList className="tw-sticky tw-top-5 tw-z-10 tw-mb-5 tw-grid tw-grid-cols-4 tw-shadow-lg">
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
  </QueryClientProvider>,
);
