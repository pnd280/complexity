import type { SlashCommandPageId } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store/slices/pages/types";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";

export function getMatchedPageCommand({
  wordAtCaret,
}: {
  wordAtCaret: string;
}): SlashCommandPageId | null {
  const match = wordAtCaret.match(/^\/\/(.+)$/);
  if (!match) return null;

  const command = match[1];
  if (!command) return null;

  // TODO: Implement command registry

  const promptHistoryShortcut =
    PluginsSettingSnapshotsService.getPluginSnapshot("promptHistory").shortcut;

  if (
    promptHistoryShortcut.type === "command" &&
    promptHistoryShortcut.value === command
  ) {
    return "promptHistory";
  }

  return null;
}

export function isAllowedKey(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return false;

  const alphanumericRegex = /^[a-zA-Z0-9]$/;
  const specialCharsRegex = /^[-_./\\]$/;

  return alphanumericRegex.test(e.key) || specialCharsRegex.test(e.key);
}
