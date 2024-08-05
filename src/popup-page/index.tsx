import "@/assets/index.tw.css";

import { QueryClientProvider } from "@tanstack/react-query";
import ReactDom from "react-dom/client";

import DiscordCallout from "@/popup-page/components/DiscordCallout";
import Footer from "@/popup-page/components/Footer";
import PopupSettings from "@/popup-page/components/PopupSettings";
import UntrustedBuildWarning from "@/popup-page/components/UntrustedBuildWarning";
import Separator from "@/shared/components/Separator";
import { queryClient } from "@/utils/ts-query-query-client";

ReactDom.createRoot(document.getElementById("app") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <div className="tw-font-sans tw-w-[350px]">
      <DiscordCallout />
      <Separator />
      <div className="tw-h-[250px]">
        <PopupSettings context="popup" />
      </div>
      <Footer />
      {chrome.runtime.id !== "ffppmilmeaekegkpckebkeahjgmhggpj" &&
        !import.meta.env.DEV && <UntrustedBuildWarning />}
    </div>
  </QueryClientProvider>,
);
