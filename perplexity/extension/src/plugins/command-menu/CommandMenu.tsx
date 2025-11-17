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
import { keysToString } from "@/utils/misc/utils";
import hotkeys from "@/utils/wrappers/hotkeys-js";

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

  const handleToggleMenu = useEffectEvent((e: KeyboardEvent) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    setOpen(!open);
  });

  useEffect(() => {
    const toggleKeyCombo = keysToString(settings.keybindings.toggle);
    hotkeys(toggleKeyCombo, handleToggleMenu);

    return () => {
      hotkeys.unbind(toggleKeyCombo, handleToggleMenu);
    };
  }, [settings.keybindings.toggle]);

  const handleToggleSidecar = useEffectEvent((e: KeyboardEvent) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    setSidecarOpen(!sidecarOpen);
  });

  useEffect(() => {
    if (!open) return;

    const sidecarKeyCombo = keysToString(settings.keybindings.toggleSidecar);
    hotkeys(sidecarKeyCombo, handleToggleSidecar);

    return () => {
      hotkeys.unbind(sidecarKeyCombo, handleToggleSidecar);
    };
  }, [open, settings.keybindings.toggleSidecar]);

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
