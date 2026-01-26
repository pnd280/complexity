import { formatKeys } from "@/components/hotkey-recorder/utils";
import KeyCombo from "@/components/KeyCombo";
import { Button } from "@/components/ui/button";

import TablerCheck from "~icons/tabler/check";
import TablerX from "~icons/tabler/x";

type HotkeyRecorderUiProps = {
  isRecording: boolean;
  recordedKeys: Set<string> | null;
  savedKeys: string[];
  displayKeys: string[];
  isValidCombination: boolean;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  resetKeys: () => void;
  stop: () => void;
  showError?: boolean;
};

export function HotkeyRecorderUi({
  isRecording,
  recordedKeys,
  savedKeys,
  displayKeys,
  isValidCombination,
  handleStartRecording,
  handleStopRecording,
  resetKeys,
  stop,
  showError = false,
}: HotkeyRecorderUiProps) {
  const renderHotkeyDisplay = () => {
    if (isRecording && recordedKeys != null && !recordedKeys.size) {
      return (
        <div className="x:flex x:items-center x:gap-2">
          {savedKeys.length > 0 ? (
            <>
              <KeyCombo
                keys={formatKeys(savedKeys)}
                keyClassName="x:bg-secondary"
              />
              <span className="x:text-xs x:text-muted-foreground">
                Press new keys to change...
              </span>
            </>
          ) : (
            <div className="x:flex x:items-center x:gap-2 x:text-muted-foreground">
              <div className="x:h-1.5 x:w-1.5 x:animate-pulse x:rounded-full x:bg-primary" />
              Press any key...
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="x:flex x:items-center x:gap-2">
          <KeyCombo
            keys={formatKeys(displayKeys)}
            keyClassName="x:bg-secondary"
          />
          {!isRecording && (
            <span
              className={cn(
                "x:font-medium x:text-muted-foreground",
                savedKeys.length > 0 && "x:text-xs",
              )}
            >
              {savedKeys.length > 0 ? "Click to edit" : "Set new keys"}
            </span>
          )}
        </div>
      );
    }
  };

  return (
    <div className="x:flex x:flex-col x:gap-3">
      <div className="x:flex x:items-center x:gap-3">
        {isRecording && (
          <>
            <Button
              size="icon"
              onClick={() => {
                resetKeys();
                stop();
              }}
            >
              <TablerX />
            </Button>
            <Button
              disabled={!isValidCombination}
              size="icon"
              onClick={handleStopRecording}
            >
              <TablerCheck />
            </Button>
          </>
        )}
        <div
          className={cn(
            "x:flex x:items-center x:rounded-md",
            isRecording
              ? "x:border x:border-border/50 x:bg-secondary x:px-3 x:py-1.5"
              : "x:cursor-pointer x:border-2 x:border-dashed x:border-border/50 x:px-3 x:py-1.5 x:transition-all x:hover:border-primary x:hover:bg-secondary",
          )}
          onClick={isRecording ? undefined : handleStartRecording}
        >
          {renderHotkeyDisplay()}
        </div>
      </div>
      {isRecording &&
        showError &&
        recordedKeys != null &&
        recordedKeys.size > 0 && (
          <div className="x:flex x:items-center x:gap-2 x:text-sm x:font-medium x:text-caution">
            Invalid combination - use at least one modifier key combined with
            one regular key.
          </div>
        )}
    </div>
  );
}
