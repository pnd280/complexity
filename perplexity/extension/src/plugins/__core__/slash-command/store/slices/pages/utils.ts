import type { SlashCommandPageId } from "@/plugins/__core__/slash-command/store/slices/pages/types";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

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
    ExtensionSettingsService.cachedSync.plugins["promptHistory"].shortcut;

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
