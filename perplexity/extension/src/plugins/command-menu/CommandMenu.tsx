import { useHotkeys } from "react-hotkeys-hook";

import {
  Command,
  CommandDialog,
  CommandList,
  useCommandListManualScroll,
} from "@/components/ui/command";
import CommandFooter from "@/plugins/command-menu/components/CommandFooter";
import CommandInput from "@/plugins/command-menu/components/CommandInput";
import CommandSidecar from "@/plugins/command-menu/components/CommandSidecar";
import IndexPage from "@/plugins/command-menu/pages/IndexPage";
import SpaceThreadsPage from "@/plugins/command-menu/pages/space-threads/Page";
import SpacesPage from "@/plugins/command-menu/pages/spaces/Page";
import ThreadsPage from "@/plugins/command-menu/pages/threads/Page";
import { useCommandMenuStore } from "@/plugins/command-menu/store";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";
import { keysToString } from "@/utils/utils";

export function CommandMenu() {
  const {
    selectingValue,
    setSelectingValue,
    shouldLocalFilter,
    open,
    setOpen,
    sidecarOpen,
    setSidecarOpen,
  } = useCommandMenuStore();

  const commandListRef = useRef<HTMLDivElement>(null);

  const settings = ExtensionSettingsService.cachedSync.plugins.commandMenu;

  useCommandListManualScroll({
    enabled: open,
    commandListRef,
    willUpdateValue: selectingValue,
  });

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
              ref={commandListRef}
              data-command-menu-list
              className={cn("x:min-h-[400px]", {
                "x:h-[500px] x:max-h-[500px]": sidecarOpen,
              })}
            >
              <IndexPage />
              <SpacesPage />
              <ThreadsPage />
              <SpaceThreadsPage />
            </CommandList>
          </div>
          {sidecarOpen && (
            <div
              className={cn(
                PPLX_SCROLLBAR_CLASSES,
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
