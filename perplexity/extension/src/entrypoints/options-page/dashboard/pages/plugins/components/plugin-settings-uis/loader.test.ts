import fs from "node:fs";
import path from "node:path";

import { expect, it } from "vitest";
import { describe } from "vitest";

import type { PluginId } from "@/data/plugin-registry/types";
import type { DefinePluginParams } from "@/data/plugin-registry/utils";

describe("Plugin Settings UI Loader", () => {
  it("should all settings-ui.tsx export the correct pluginId", async () => {
    const manifestEntries = import.meta.glob("@/plugins/!(_core)/index.ts", {
      eager: true,
    }) as Record<
      string,
      {
        default: DefinePluginParams<PluginId>;
      }
    >;

    for (const [filePath, module] of Object.entries(manifestEntries)) {
      const pluginId = module.default.manifest.id;

      expect(pluginId).toBeDefined();

      const settingsUiPath = filePath.replace("index.ts", "settings-ui.tsx");
      const settingsUiIndexPath = filePath.replace(
        "index.ts",
        "settings-ui/index.tsx",
      );

      const fsPath = path.join(process.cwd(), settingsUiPath);

      if (!fs.existsSync(fsPath) && !fs.existsSync(settingsUiIndexPath)) {
        continue;
      }

      // read the file as literal string to avoid triggering browser APIs
      const content = fs.readFileSync(fsPath, "utf-8");
      const pluginIdFromUi = content.match(
        /export const pluginId: PluginId = "([^"]+)"/,
      )?.[1];

      expect(pluginIdFromUi).toBe(pluginId);
    }
  });
});
