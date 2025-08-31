import { z } from "zod";

import { EXTENSION_ICON_ACTIONS } from "@/data/dashboard/extension-storage";
import { PluginRegistry } from "@/data/plugin-registry/index";
import type { PluginsSettingsSchema } from "@/data/plugin-registry/types";

export const ExtensionSettingsSchema = z.object({
  plugins:
    PluginRegistry.zodSchema as unknown as z.ZodType<PluginsSettingsSchema>,
  theme: z.string(),
  energySavingMode: z.boolean(),
  extensionIconAction: z.enum(EXTENSION_ICON_ACTIONS),
  showPostUpdateReleaseNotesPopup: z.boolean(),
  isPostUpdateReleaseNotesPopupDismissed: z.boolean(),
  devMode: z.boolean(),
  devTools: z
    .object({
      overrideSubscriptionTier: z.enum(["pro", "max"]).optional(),
    })
    .optional(),
});

export type ExtensionSettings = z.infer<typeof ExtensionSettingsSchema>;
