import "@/assets/index.tw.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDom from "react-dom/client";

import { NewVersionDialog } from "@/options-page/components/NewVersionDialog";
import CplxUserSettings from "@/shared/components/CplxUserSettings";
import { Toaster } from "@/shared/components/Toaster";
import { queryClient } from "@/utils/ts-query-query-client";

ReactDom.createRoot(document.getElementById("app") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <div className="custom-scrollbar tw-mx-4 tw-mt-4 tw-flex tw-max-w-screen-lg tw-items-center tw-justify-center tw-font-sans lg:tw-mx-auto">
      <CplxUserSettings />
    </div>
    <NewVersionDialog />
    <Toaster />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
