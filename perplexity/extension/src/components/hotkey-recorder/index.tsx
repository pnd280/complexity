import { HotkeyRecorderUi } from "@/components/hotkey-recorder/components/HotkeyRecorderUi";
import type {
  UseHotkeyRecorderProps,
  HotkeyRecorderReturn,
} from "@/components/hotkey-recorder/types";
import {
  MODIFIER_KEYS,
  isValidKeyCombination,
  orderKeys,
  normalizeEventKeyName,
} from "@/components/hotkey-recorder/utils";
import { useEvent } from "@/hooks/useEvent";
import { getPlatform } from "@/hooks/usePlatformDetection";

export function useHotkeyRecorder({
  defaultKeys,
  onSave,
}: UseHotkeyRecorderProps): HotkeyRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedKeys, setRecordedKeys] = useState<Set<string>>(new Set());
  const [savedKeys, setSavedKeys] = useState<string[]>(defaultKeys);
  const [showError, setShowError] = useState(false);
  const activeKeysRef = useRef<Set<string>>(new Set());

  const displayKeys = isRecording
    ? recordedKeys.size
      ? orderKeys(Array.from(recordedKeys))
      : []
    : orderKeys(savedKeys);

  const resetKeys = () => {
    setRecordedKeys(new Set());
    activeKeysRef.current = new Set();
    setShowError(false);
  };

  const stop = useEvent(() => {
    setIsRecording(false);
    activeKeysRef.current = new Set();
  });

  const keydownHandler = useEvent((e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const keyName = normalizeEventKeyName(e);

    // Skip "Unidentified" keys (empty after normalization)
    if (!keyName) {
      return;
    }

    const isWindows = getPlatform() === "windows";
    if (isWindows && keyName === "Meta") {
      return;
    }

    activeKeysRef.current.add(keyName);

    // Check for multiple non-modifier keys immediately
    const nonModifierKeys = Array.from(activeKeysRef.current)
      .map((k) => k.toLowerCase())
      .filter((k) => !MODIFIER_KEYS.has(k));

    if (nonModifierKeys.length > 1) {
      resetKeys();
      stop();
      return;
    }

    setRecordedKeys(new Set(activeKeysRef.current));
  });

  const keyupHandler = useEvent((e: KeyboardEvent) => {
    const keyName = normalizeEventKeyName(e);
    activeKeysRef.current.delete(keyName);

    if (activeKeysRef.current.size === 0 && recordedKeys.size > 0) {
      const isValid = isValidKeyCombination(recordedKeys);
      setShowError(!isValid);
    }
  });

  const start = () => {
    setIsRecording(true);
    resetKeys();
  };

  const handleEscape = useEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      stop();
    }
  });

  // Manage keydown/keyup event listeners for recording
  useEffect(() => {
    if (!isRecording) return;

    window.addEventListener("keydown", keydownHandler, { capture: true });
    window.addEventListener("keyup", keyupHandler, { capture: true });

    return () => {
      window.removeEventListener("keydown", keydownHandler, { capture: true });
      window.removeEventListener("keyup", keyupHandler, { capture: true });
    };
  }, [isRecording, keydownHandler, keyupHandler]);

  // Manage Escape key listener
  useEffect(() => {
    if (!isRecording) return;

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isRecording, handleEscape]);

  const handleStartRecording = () => {
    if (!isRecording) {
      resetKeys();
      start();
    }
  };

  const handleStopRecording = () => {
    if (!isValidKeyCombination(recordedKeys)) {
      resetKeys();
    } else if (onSave) {
      const orderedKeys = orderKeys(Array.from(recordedKeys));
      setSavedKeys(orderedKeys);
      onSave(orderedKeys);
    }
    stop();
  };

  const isValidCombination = isValidKeyCombination(recordedKeys);

  const HotkeyRecorderComponent = () => (
    <HotkeyRecorderUi
      isRecording={isRecording}
      recordedKeys={recordedKeys}
      savedKeys={savedKeys}
      displayKeys={displayKeys}
      isValidCombination={isValidCombination}
      handleStartRecording={handleStartRecording}
      handleStopRecording={handleStopRecording}
      resetKeys={resetKeys}
      stop={stop}
      showError={showError}
    />
  );

  return {
    HotkeyRecorderUi: HotkeyRecorderComponent,
    isRecording,
    keys: orderKeys(Array.from(recordedKeys)),
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
    isValidCombination,
  };
}
