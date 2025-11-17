import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazily } from "react-lazily";

import { Toaster } from "@/components/Toaster";
import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";

const { ExtensionContextInvalidationWatchdog } = lazily(
  () => import("@/components/ExtensionContextInvalidationWatchdog"),
);

export default function Misc() {
  return (
    <>
      <CsUiGuard browser={["chrome"]}>
        <ExtensionContextInvalidationWatchdog />
      </CsUiGuard>

      <Toaster
        viewportProps={{
          className:
            "x:top-0 x:md:[:where(body:is([location=thread],[location=collection])_*)]:top-[var(--header-height,70px)]",
        }}
      />

      <ReactQueryDevtools />
    </>
  );
}
