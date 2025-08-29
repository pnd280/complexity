import { LuMaximize2, LuMinimize2 } from "react-icons/lu";

import KeyCombo from "@/components/KeyCombo";
import Tooltip from "@/components/Tooltip";
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/plugins/command-menu/store";
import { ExtensionSettingsService } from "@/services/infra/extension-settings";

export default function CommandFooter() {
  const settings = ExtensionSettingsService.cachedSync.plugins.commandMenu;

  const footerItems = useCommandMenuStore(
    (store) => store.footerItems,
    deepEqual,
  );

  const sidecarItems = useCommandMenuStore((store) => store.sidecarItems);
  const sidecarOpen = useCommandMenuStore((store) => store.sidecarOpen);

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
                    keyClassName="x:text-foreground"
                    keys={settings.keybindings.toggleSidecar}
                  />
                </div>
              }
            >
              <div
                role="button"
                className="x:m-0 x:flex x:items-center x:gap-2 x:rounded-lg x:px-2 x:py-1 x:text-xs x:text-foreground x:transition-all x:hover:bg-secondary"
                onClick={() => {
                  commandMenuStore.getState().setSidecarOpen(!sidecarOpen);
                }}
              >
                {sidecarOpen ? <LuMinimize2 /> : <LuMaximize2 />}
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
