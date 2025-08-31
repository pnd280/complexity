import { HotkeyRecorderUi } from "@/components/hotkey-recorder/components/HotkeyRecorderUi";
import type {
  UseHotkeyRecorderProps,
  HotkeyRecorderReturn,
} from "@/components/hotkey-recorder/types";
import {
  MODIFIER_KEYS,
  isValidKeyCombination,
  orderKeys,
  normalizeKeyName,
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

  useEffect(() => {
    setSavedKeys(defaultKeys);
  }, [defaultKeys]);

  const displayKeys = isRecording
    ? recordedKeys?.size
      ? orderKeys(Array.from(recordedKeys))
      : []
    : orderKeys(savedKeys);

  const resetKeys = useCallback(() => {
    setRecordedKeys(new Set());
    activeKeysRef.current = new Set();
    setShowError(false);
  }, []);

  const keydownHandler = useEvent((e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const keyName = normalizeKeyName(e.key);

    const isWindows = getPlatform() === "windows";
    if (isWindows && keyName === "Meta") {
      return;
    }

    activeKeysRef.current.add(keyName);
    setRecordedKeys(new Set(activeKeysRef.current));
  });

  const keyupHandler = useEvent((e: KeyboardEvent) => {
    const keyName = normalizeKeyName(e.key);
    activeKeysRef.current.delete(keyName);

    if (activeKeysRef.current.size === 0 && recordedKeys.size > 0) {
      const isValid = isValidKeyCombination(recordedKeys);
      setShowError(!isValid);
    }
  });

  const stop = useCallback(() => {
    setIsRecording(false);
    window.removeEventListener("keydown", keydownHandler, {
      capture: true,
    });
    window.removeEventListener("keyup", keyupHandler, {
      capture: true,
    });
    activeKeysRef.current = new Set();
  }, [keydownHandler, keyupHandler]);

  const start = useCallback(() => {
    setIsRecording(true);
    resetKeys();
    window.addEventListener("keydown", keydownHandler, {
      capture: true,
    });
    window.addEventListener("keyup", keyupHandler, {
      capture: true,
    });
  }, [resetKeys, keydownHandler, keyupHandler]);

  const handleEscape = useEvent((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      stop();
    }
  });

  useEffect(() => {
    if (isRecording) {
      window.addEventListener("keydown", handleEscape);
    } else {
      window.removeEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isRecording, stop, handleEscape]);

  useEffect(() => {
    if (!recordedKeys?.size) return;
    const nonModifierKeys = Array.from(recordedKeys)
      .map((k) => k.toLowerCase())
      .filter((k) => !MODIFIER_KEYS.has(k));
    if (nonModifierKeys.length > 1) {
      resetKeys();
      stop();
    }
  }, [recordedKeys, resetKeys, stop]);

  const handleStartRecording = () => {
    if (!isRecording) {
      resetKeys();
      start();
    }
  };

  const handleStopRecording = () => {
    if (!isValidKeyCombination(recordedKeys)) {
      resetKeys();
    } else if (onSave && recordedKeys != null) {
      const orderedKeys = orderKeys(Array.from(recordedKeys));
      setSavedKeys(orderedKeys);
      onSave(orderedKeys);
    }
    stop();
  };

  const isValidCombination =
    recordedKeys != null ? isValidKeyCombination(recordedKeys) : true;

  useEffect(() => {
    return () => {
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keyup", keyupHandler);
    };
  }, [keydownHandler, keyupHandler]);

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
    keys: recordedKeys != null ? orderKeys(Array.from(recordedKeys)) : [],
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
    isValidCombination,
  };
}
