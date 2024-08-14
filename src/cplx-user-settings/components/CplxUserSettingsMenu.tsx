import { useToggle } from "@uidotdev/usehooks";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import CplxUserSettings from "@/cplx-user-settings/components/CplxUserSettings";
import FloatingTrigger from "@/cplx-user-settings/components/FloatingTrigger";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/Dialog";
import BackgroundScript from "@/utils/BackgroundScript";

export default function CplxUserSettingsMenu() {
  const [isOpen, toggleOpen] = useToggle(false);

  const [activeTab, setActiveTab] = useState<string>();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams.get("showReleaseNotes")) {
      setActiveTab("changelog");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (activeTab) {
      toggleOpen(true);
    }
  }, [activeTab, toggleOpen]);

  return (
    <Dialog
      lazyMount
      open={isOpen}
      closeOnInteractOutside={false}
      onOpenChange={({ open }) => {
        toggleOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <FloatingTrigger onClick={() => toggleOpen()} />
      </DialogTrigger>
      <DialogContent className="custom-scrollbar tw-h-[90dvh] tw-w-full tw-max-w-screen-lg tw-overflow-auto">
        <CplxUserSettings
          defaultValue="generalSettings"
          value={activeTab}
          onValueChange={({ value }) => setActiveTab(value)}
        />
        <div
          className="tw-absolute tw-right-10 tw-top-4"
          onClick={() => {
            BackgroundScript.sendMessage({
              action: "openExtensionPage",
              payload: "?tab=" + (activeTab ?? "generalSettings"),
            });
          }}
        >
          <ExternalLink className="tw-size-4 tw-cursor-pointer tw-text-muted tw-transition-colors hover:tw-text-muted-foreground" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
