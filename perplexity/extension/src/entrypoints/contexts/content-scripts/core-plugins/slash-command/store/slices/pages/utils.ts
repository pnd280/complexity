import type { SlashCommandPageId } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store/slices/pages/types";

const commandRegistry = new Map<string, SlashCommandPageId>();

export function registerPageCommand(
  command: string,
  pageId: SlashCommandPageId,
) {
  commandRegistry.set(command, pageId);
}

export function unregisterPageCommand(command: string) {
  commandRegistry.delete(command);
}

export function getMatchedPageCommand({
  wordAtCaret,
}: {
  wordAtCaret: string;
}): SlashCommandPageId | null {
  const match = wordAtCaret.match(/^\/\/(.+)$/);
  if (!match) return null;

  const command = match[1];
  if (!command) return null;

  return commandRegistry.get(command) ?? null;
}

export function isAllowedKey(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return false;

  const alphanumericRegex = /^[a-zA-Z0-9]$/;
  const specialCharsRegex = /^[-_./\\]$/;

  return alphanumericRegex.test(e.key) || specialCharsRegex.test(e.key);
}
