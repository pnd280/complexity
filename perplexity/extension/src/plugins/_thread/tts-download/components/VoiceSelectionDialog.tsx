import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RadioRoot,
  RadioItem,
  RadioItemControl,
  RadioItemHiddenInput,
  RadioItemText,
} from "@/components/ui/radio";
import {
  TTS_VOICES,
  type TtsVoice,
} from "@/plugins/_thread/tts-download/types";

import TablerDownload from "~icons/tabler/download";
import TablerLoaderCircle from "~icons/tabler/loader-2";

type VoiceSelectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (voice: TtsVoice) => void;
  isDownloading?: boolean;
  progress?: {
    current: number;
    total: number;
  };
};

export default function VoiceSelectionDialog({
  open,
  onOpenChange,
  onDownload,
  isDownloading = false,
  progress,
}: VoiceSelectionDialogProps) {
  const [selectedVoice, setSelectedVoice] = useState<TtsVoice>("Mike");

  const handleDownload = () => {
    onDownload(selectedVoice);
  };

  return (
    <Dialog open={open} onOpenChange={({ open }) => onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Conversation as Audio</DialogTitle>
        </DialogHeader>
        <div className="x:flex x:flex-col x:gap-4 x:p-6">
          {isDownloading && progress ? (
            <div className="x:flex x:flex-col x:items-center x:gap-3 x:py-4">
              <TablerLoaderCircle className="x:size-8 x:animate-spin x:text-primary" />
              <p className="x:text-sm x:text-muted-foreground">
                Downloading message {progress.current} of {progress.total}...
              </p>
            </div>
          ) : (
            <>
              <div className="x:space-y-3">
                <p className="x:text-sm x:font-medium">Select Voice:</p>
                <RadioRoot
                  value={selectedVoice}
                  onValueChange={({ value }) =>
                    setSelectedVoice(value as TtsVoice)
                  }
                >
                  {TTS_VOICES.map((voice) => (
                    <RadioItem key={voice} value={voice}>
                      <RadioItemControl />
                      <RadioItemText>{voice}</RadioItemText>
                      <RadioItemHiddenInput />
                    </RadioItem>
                  ))}
                </RadioRoot>
              </div>

              <div className="x:flex x:justify-end x:gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDownload}
                  className="x:flex x:items-center x:gap-2"
                >
                  <TablerDownload className="x:size-4" />
                  <span>Download</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
