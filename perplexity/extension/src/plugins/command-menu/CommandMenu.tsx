import { useHotkeys } from "react-hotkeys-hook";

import { Command, CommandDialog, CommandList } from "@/components/ui/command";
import CommandFooter from "@/plugins/command-menu/components/CommandFooter";
import CommandInput from "@/plugins/command-menu/components/CommandInput";
import CommandSidecar from "@/plugins/command-menu/components/CommandSidecar";
import { ExternalPages } from "@/plugins/command-menu/pages/ExternalPages";
import IndexPage from "@/plugins/command-menu/pages/IndexPage";
import SpaceThreadsPage from "@/plugins/command-menu/pages/space-threads/Page";
import SpacesPage from "@/plugins/command-menu/pages/spaces/Page";
import ThreadsPage from "@/plugins/command-menu/pages/threads/Page";
import { useCommandMenuStore } from "@/plugins/command-menu/store";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { keysToString } from "@/utils/misc/utils";

export function CommandMenu() {
  const {
    selectingValue,
    setSelectingValue,
    shouldLocalFilter,
    open,
    setOpen,
  } = useCommandMenuStore((store) => store.states);

  const { open: sidecarOpen, setOpen: setSidecarOpen } = useCommandMenuStore(
    (store) => store.sidecar,
  );

  const settings = ExtensionSettingsService.cachedSync.plugins.commandMenu;

  useHotkeys(
    keysToString(settings.keybindings.toggle),
    (e) => {
      e.stopImmediatePropagation();
      setOpen(!open);
    },
    {
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );

  useHotkeys(
    keysToString(settings.keybindings.toggleSidecar),
    (e) => {
      e.stopImmediatePropagation();
      setSidecarOpen(!sidecarOpen);
    },
    {
      enabled: open,
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );

  return (
    <CommandDialog
      dialogContentProps={{
        className: cn({
          "x:max-w-[1000px]": sidecarOpen,
          "x:max-w-3xl": !sidecarOpen,
        }),
      }}
      open={open}
      unmountOnExit={false}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <Command
        value={selectingValue}
        shouldFilter={shouldLocalFilter}
        onValueChange={setSelectingValue}
      >
        <CommandInput />

        <div className="x:grid x:grid-cols-2">
          <div
            className={cn(
              "x:border-r x:border-border/50",
              !sidecarOpen && "x:col-span-2",
            )}
          >
            <CommandList
              className={cn(
                "x:max-h-[700px] x:min-h-[400px] x:scroll-pt-32 x:scroll-pb-26",
                {
                  "x:h-[500px] x:max-h-[500px]": sidecarOpen,
                },
              )}
            >
              <IndexPage />
              <ExternalPages />
              <SpacesPage />
              <ThreadsPage />
              <SpaceThreadsPage />
            </CommandList>
          </div>
          {sidecarOpen && (
            <div
              className={cn(
                "custom-scrollbar",
                "x:h-[500px] x:max-h-[500px] x:overflow-y-auto",
              )}
            >
              <CommandSidecar />
            </div>
          )}
        </div>
        <CommandFooter />
      </Command>
    </CommandDialog>
  );
}
