import { z } from "zod";

import { PluginManifestsRegistry } from "@/__registries__/plugins";
import type { PluginsSettingsRegistry } from "@/__registries__/plugins/meta.types";
import { EXTENSION_ICON_ACTIONS } from "@/data/dashboard/extension-storage";

export const ExtensionSettingsSchema = z.object({
  plugins:
    PluginManifestsRegistry.settingsZodSchema as unknown as z.ZodType<PluginsSettingsRegistry>,
  theme: z.string(),
  extensionIconAction: z.enum(EXTENSION_ICON_ACTIONS),
  isPostUpdateReleaseNotesPopupDismissed: z.boolean(),
  devMode: z.boolean(),
  devTools: z
    .object({
      overrideSubscriptionTier: z.enum(["pro", "max"]).optional(),
    })
    .optional(),
});

export type ExtensionSettings = z.infer<typeof ExtensionSettingsSchema>;
