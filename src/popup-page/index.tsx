import "@@/public/global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import DiscordCallout from "@/popup-page/components/DiscordCallout";
import Footer from "@/popup-page/components/Footer";
import { PopupSettings } from "@/popup-page/components/PopupSettings";
import UntrustedBuildWarning from "@/popup-page/components/UntrustedBuildWarning";
import { Separator } from "@/shared/components/shadcn/ui/separator";
import { queryClient } from "@/utils/ts-query-query-client";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <div className="tw-font-sans">
      <DiscordCallout />
      <Separator />
      <div className="tw-h-[250px] tw-w-[350px]">
        <PopupSettings context="popup" />
      </div>
      <Footer />
      {chrome.runtime.id !== "ffppmilmeaekegkpckebkeahjgmhggpj" &&
        !import.meta.env.DEV && <UntrustedBuildWarning />}
    </div>
  </QueryClientProvider>,
);