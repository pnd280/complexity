import {
  getHotkeyManager,
  getKeyStateTracker,
  normalizeHotkey,
  normalizeKeyName,
  parseHotkey,
  type ParsedHotkey,
  type HotkeyRegistrationHandle,
} from "@tanstack/hotkeys";

type HotkeysHandler = (event: KeyboardEvent) => void;
type HotkeysFilter = (event: KeyboardEvent) => boolean;

type HotkeysAdapter = {
  (combo: string, handler: HotkeysHandler): void;
  unbind: (combo: string, handler?: HotkeysHandler) => void;
  isPressed: (key: string) => boolean;
  filter: HotkeysFilter;
};

export function parseHotkeyCombo(combo: string): ParsedHotkey {
  return parseHotkey(normalizeCombo(combo));
}

const hotkeyManager = getHotkeyManager();
const keyStateTracker = getKeyStateTracker();

const registrations = new Map<
  string,
  Map<HotkeysHandler, Set<HotkeyRegistrationHandle>>
>();

const hotkeys = ((combo: string, handler: HotkeysHandler) => {
  const normalizedCombo = normalizeCombo(combo);
  const parsedCombo = parseHotkey(normalizedCombo);

  const registrationHandle = hotkeyManager.register(
    parsedCombo,
    (event) => {
      if (!hotkeys.filter(event)) {
        return;
      }

      handler(event);
    },
    {
      ignoreInputs: false,
      preventDefault: false,
      stopPropagation: false,
    },
  );

  const comboRegistrations = registrations.get(normalizedCombo) ?? new Map();
  const handlerRegistrations = comboRegistrations.get(handler) ?? new Set();

  handlerRegistrations.add(registrationHandle);
  comboRegistrations.set(handler, handlerRegistrations);
  registrations.set(normalizedCombo, comboRegistrations);
}) as HotkeysAdapter;

hotkeys.unbind = (combo: string, handler?: HotkeysHandler) => {
  const normalizedCombo = normalizeCombo(combo);
  const comboRegistrations = registrations.get(normalizedCombo);

  if (!comboRegistrations) {
    return;
  }

  if (handler) {
    const handlerRegistrations = comboRegistrations.get(handler);

    if (!handlerRegistrations) {
      return;
    }

    for (const registrationHandle of handlerRegistrations) {
      registrationHandle.unregister();
    }

    comboRegistrations.delete(handler);
  } else {
    for (const handlerRegistrations of comboRegistrations.values()) {
      for (const registrationHandle of handlerRegistrations) {
        registrationHandle.unregister();
      }
    }

    comboRegistrations.clear();
  }

  if (comboRegistrations.size === 0) {
    registrations.delete(normalizedCombo);
  }
};

hotkeys.isPressed = (key: string) => {
  return keyStateTracker.isKeyHeld(normalizePressedKey(key));
};

hotkeys.filter = (_event: KeyboardEvent) => {
  return true;
};

export default hotkeys;

export function isFormTag(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null;

  if (!target) {
    return false;
  }

  const tagName = target.tagName;

  return (
    target.isContentEditable ||
    tagName == "INPUT" ||
    tagName == "SELECT" ||
    tagName == "TEXTAREA"
  );
}

function normalizeCombo(combo: string) {
  try {
    return normalizeHotkey(combo);
  } catch (_error) {
    return combo;
  }
}

function normalizePressedKey(key: string) {
  const normalizedLowerKey = key.toLowerCase();

  if (normalizedLowerKey === "ctrl") {
    return "Control";
  }

  if (normalizedLowerKey === "cmd" || normalizedLowerKey === "command") {
    return "Meta";
  }

  if (normalizedLowerKey === "option") {
    return "Alt";
  }

  if (normalizedLowerKey === "esc") {
    return "Escape";
  }

  if (normalizedLowerKey.length === 1 && /^[a-z]$/.test(normalizedLowerKey)) {
    return normalizedLowerKey.toUpperCase();
  }

  return normalizeKeyName(key);
}
