import { z } from "zod";

import { EXTENSION_ICON_ACTIONS } from "@/data/dashboard/extension-storage";
import { PluginManifestsRegistry } from "@/data/registries/plugins";
import type { PluginsSettingsSchema } from "@/data/registries/plugins/meta.types";

export const ExtensionSettingsSchema = z.object({
  plugins:
    PluginManifestsRegistry.settingsZodSchema as unknown as z.ZodType<PluginsSettingsSchema>,
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
