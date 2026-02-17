import type { CommandItemProps } from "@/plugins/command-menu/types";

const LEGACY_ALT_GLYPH_TO_KEY: Record<string, string> = {
  "†": "t",
  "¥": "y",
};

export function normalizeCommandMenuKeybinding(keys: string[]): string[] {
  const hasAltModifier = keys.some((key) => key.toLowerCase() === "alt");

  if (!hasAltModifier) {
    return keys;
  }

  return keys.map((key) => LEGACY_ALT_GLYPH_TO_KEY[key] ?? key);
}

export const getItems = <T>({
  getter,
  params,
}: {
  getter: (params: T) => CommandItemProps[];
  params: T;
}): CommandItemProps[] => {
  const items = getter(params);
  return items.sort((a, b) => b.priority - a.priority);
};

export const getGroupedItems = <T, P extends CommandItemProps>({
  getter,
  params,
}: {
  getter: (params: T) => P[];
  params: T;
}): {
  groupName: string;
  items: P[];
}[] => {
  const items = getter(params);

  const groups: Record<string, P[]> = {};

  for (const item of items) {
    const group = item.group as string;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
  }

  for (const groupItems of Object.values(groups)) {
    groupItems.sort((a, b) => b.priority - a.priority);
  }

  return Object.entries(groups).map(([groupName, items]) => ({
    groupName,
    items,
  }));
};

export const createItemsMap = <T, P extends CommandItemProps>(
  groupedItems: ReturnType<typeof getGroupedItems<T, P>>,
): Map<string, P> => {
  const map = new Map<string, P>();
  for (const group of groupedItems) {
    for (const item of group.items) {
      map.set(item.value, item);
    }
  }
  return map;
};
