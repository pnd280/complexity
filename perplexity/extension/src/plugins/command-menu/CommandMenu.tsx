import { useHotkey } from "@tanstack/react-hotkeys";

import { Command, CommandDialog, CommandList } from "@/components/ui/command";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import CommandFooter from "@/plugins/command-menu/components/CommandFooter";
import CommandInput from "@/plugins/command-menu/components/CommandInput";
import CommandSidecar from "@/plugins/command-menu/components/CommandSidecar";
import { ExternalPages } from "@/plugins/command-menu/pages/ExternalPages";
import IndexPage from "@/plugins/command-menu/pages/IndexPage";
import SpaceThreadsPage from "@/plugins/command-menu/pages/space-threads/Page";
import SpacesPage from "@/plugins/command-menu/pages/spaces/Page";
import ThreadsPage from "@/plugins/command-menu/pages/threads/Page";
import { useCommandMenuStore } from "@/plugins/command-menu/store";
import { normalizeCommandMenuKeybinding } from "@/plugins/command-menu/utils";
import { keysToString } from "@/utils/misc/utils";
import { parseHotkeyCombo } from "@/utils/wrappers/hotkeys-js";

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

  const settings =
    PluginsSettingSnapshotsService.getPluginSnapshot("commandMenu");

  useHotkey(
    parseHotkeyCombo(
      keysToString(normalizeCommandMenuKeybinding(settings.keybindings.toggle)),
    ),
    (e) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      setOpen(!open);
    },
    {
      preventDefault: false,
      stopPropagation: false,
      ignoreInputs: false,
    },
  );

  useHotkey(
    parseHotkeyCombo(
      keysToString(
        normalizeCommandMenuKeybinding(settings.keybindings.toggleSidecar),
      ),
    ),
    (e) => {
      e.stopImmediatePropagation();
      e.preventDefault();
      setSidecarOpen(!sidecarOpen);
    },
    {
      enabled: open,
      preventDefault: false,
      stopPropagation: false,
      ignoreInputs: false,
    },
  );

  return (
    <CommandDialog
      dialogContentProps={{
        className: cn({
          "x:max-w-250": sidecarOpen,
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
                "x:max-h-175 x:min-h-100 x:scroll-pt-32 x:scroll-pb-26",
                {
                  "x:h-125 x:max-h-125": sidecarOpen,
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
                "x:h-125 x:max-h-125 x:overflow-y-auto",
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
