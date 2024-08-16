import { useToggle } from "@uidotdev/usehooks";
import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import CplxUserSettingsComp from "@/cplx-user-settings/components/CplxUserSettings";
import FloatingTrigger from "@/cplx-user-settings/components/FloatingTrigger";
import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shared/components/Dialog";
import BackgroundScript from "@/utils/BackgroundScript";

export default function CplxUserSettingsMenu() {
  const [isOpen, toggleOpen] = useToggle(false);

  const [activeTab, setActiveTab] = useState<string>();

  const prevSettings = useRef<CplxUserSettings | null>(null);

  const isSettingsChanged = () => {
    if (!prevSettings.current) return;

    const newSettings = CplxUserSettings.get();

    return JSON.stringify(prevSettings.current) !== JSON.stringify(newSettings);
  };

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

  useEffect(() => {
    if (isOpen) {
      prevSettings.current = CplxUserSettings.get();
    }
  }, [isOpen]);

  return (
    <Dialog
      lazyMount
      open={isOpen}
      closeOnInteractOutside={false}
      onExitComplete={() => isSettingsChanged() && window.location.reload()}
      onPointerDownOutside={() => !isSettingsChanged() && toggleOpen(false)}
      onOpenChange={({ open }) => {
        toggleOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <FloatingTrigger onClick={() => toggleOpen()} />
      </DialogTrigger>
      <DialogContent className="tw-h-[90dvh] tw-w-full tw-max-w-screen-lg">
        <CplxUserSettingsComp
          defaultValue="generalSettings"
          value={activeTab}
          className="custom-scrollbar tw-overflow-auto"
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
