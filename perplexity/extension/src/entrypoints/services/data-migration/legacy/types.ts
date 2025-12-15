import z from "zod";

export const LegacyExtensionSettingsSchema = z
  .object({
    plugins: z.record(z.string(), z.unknown()),
    theme: z.string(),
    extensionIconAction: z.string(),
    isPostUpdateReleaseNotesPopupDismissed: z.boolean(),
    devMode: z.boolean(),
    devTools: z.record(z.string(), z.unknown()).optional(),
  })
  .loose();

export type LegacyExtensionSettings = z.infer<
  typeof LegacyExtensionSettingsSchema
>;

export const LegacyExtensionDataSchema = z
  .object({
    settings: z.object({
      settings: LegacyExtensionSettingsSchema,
    }),
    db: z.record(z.string(), z.unknown()),
  })
  .loose();

export type LegacyExtensionData = z.infer<typeof LegacyExtensionDataSchema>;
