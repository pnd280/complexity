import KeyCombo from "@/components/KeyCombo";
import Tooltip from "@/components/Tooltip";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/plugins/command-menu/store";

import LuMaximize from "~icons/lucide/maximize-2";
import LuMinimize from "~icons/lucide/minimize-2";

export default function CommandFooter() {
  const settings =
    PluginsSettingSnapshotsService.getPluginSnapshot("commandMenu");

  const footerItems = useCommandMenuStore(
    (store) => store.footer.items,
    deepEqual,
  );

  const sidecarItems = useCommandMenuStore((store) => store.sidecar.items);
  const sidecarOpen = useCommandMenuStore((store) => store.sidecar.open);

  if (footerItems.length === 0) return null;

  return (
    <div className="x:flex x:items-center x:justify-end x:border-t x:border-border/50 x:p-2">
      <div className="x:w-full x:text-xs x:text-muted-foreground">
        <div className="x:flex x:w-full x:items-center x:gap-2">
          {sidecarItems != null && (
            <Tooltip
              content={
                <div>
                  <span>
                    {sidecarOpen
                      ? t("plugin-command-menu.sidecar.hidePreviews")
                      : t("plugin-command-menu.sidecar.showPreviews")}
                  </span>
                  <KeyCombo
                    className="x:ml-2"
                    keyClassName="x:bg-background"
                    keys={settings.keybindings.toggleSidecar}
                  />
                </div>
              }
            >
              <div
                role="button"
                className="x:m-0 x:flex x:items-center x:gap-2 x:rounded-lg x:px-2 x:py-1 x:text-xs x:text-foreground x:transition-all x:hover:bg-secondary"
                onClick={() => {
                  commandMenuStore.getState().sidecar.setOpen(!sidecarOpen);
                }}
              >
                {sidecarOpen ? <LuMinimize /> : <LuMaximize />}
              </div>
            </Tooltip>
          )}
          <div className="x:ml-auto x:flex x:items-center x:gap-2">
            {footerItems.map((item, idx) => (
              <div
                key={idx}
                role="button"
                className="x:m-0 x:flex x:items-center x:gap-2 x:rounded-lg x:px-2 x:py-1 x:text-xs x:text-foreground x:transition-all x:hover:bg-secondary"
                onClick={() => {
                  item.onSelect?.();
                }}
              >
                <span>{item.title}</span>{" "}
                {item.keybinding && <KeyCombo keys={item.keybinding} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
