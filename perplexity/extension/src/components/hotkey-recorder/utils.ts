export const MODIFIER_KEYS = new Set(
  [Key.Meta, Key.Control, Key.Alt, Key.Shift, "ctrl"].map((k) =>
    k.toLowerCase(),
  ),
);

export function orderKeys(keys: string[]): string[] {
  const modifierOrder: Record<string, number> = {
    control: 1,
    ctrl: 1,
    meta: 1,
    shift: 2,
    alt: 3,
  };

  return [...keys].sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const aIsModifier = MODIFIER_KEYS.has(aLower);
    const bIsModifier = MODIFIER_KEYS.has(bLower);

    if (aIsModifier && bIsModifier) {
      const aOrder = modifierOrder[aLower] ?? 0;
      const bOrder = modifierOrder[bLower] ?? 0;
      return aOrder - bOrder;
    }
    if (aIsModifier) return -1;
    if (bIsModifier) return 1;
    return 0;
  });
}

export function isValidKeyCombination(keys: Set<string>): boolean {
  if (!keys.size) return false;

  const keyArray = Array.from(keys).map((k) => k.toLowerCase());
  const hasModifier = keyArray.some((k) => MODIFIER_KEYS.has(k));
  const nonModifierKeys = keyArray.filter((k) => !MODIFIER_KEYS.has(k));

  return hasModifier && nonModifierKeys.length === 1;
}
export function formatKeys(keys: string[]): string[] {
  return keys.map((key) => key.charAt(0).toUpperCase() + key.slice(1));
}

export function normalizeKeyName(keyName: string): string {
  if (keyName === " ") return "Space";
  if (keyName === "Control") return "Ctrl";
  if (keyName === "Unidentified") return "";
  return keyName;
}

function getAltCodeFallback(code: string): string {
  const key = /^Key([A-Z])$/.exec(code)?.[1];
  if (key != null) {
    return key.toLowerCase();
  }

  const digit = /^Digit([0-9])$/.exec(code)?.[1];
  if (digit != null) {
    return digit;
  }

  return "";
}

export function normalizeEventKeyName(event: KeyboardEvent): string {
  const normalizedKeyName = normalizeKeyName(event.key);

  if (!normalizedKeyName) {
    return "";
  }

  if (event.altKey) {
    const altCodeFallback = getAltCodeFallback(event.code);
    if (altCodeFallback) {
      return altCodeFallback;
    }
  }

  return normalizedKeyName;
}
