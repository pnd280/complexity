import { definePluginPermissions } from "@/entrypoints/services/plugins/defines";

export const permissions = definePluginPermissions({
  optionalPermissions: [
    {
      permissions: ["webNavigation"],
      rationale:
        "Uses a different strategy to apply styles to the page to prevent layout shift when the page loads. It does NOT use this permission to view your browsing history.",
    },
  ],
});
