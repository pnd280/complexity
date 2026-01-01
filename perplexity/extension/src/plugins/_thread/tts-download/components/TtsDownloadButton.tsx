import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useThreadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-index-context";
import useTtsDownloadRequest from "@/plugins/_thread/tts-download/hooks/useTtsDownloadRequest";
import { useSettings } from "@/plugins/_thread/tts-download/settings";
import { downloadWavFile } from "@/plugins/_thread/tts-download/utils/download-wav";

import TablerDownload from "~icons/tabler/download";
import TablerLoaderCircle from "~icons/tabler/loader-2";

export default function TtsDownloadButton() {
  const messageBlockIndex = useThreadMessageIndexContext();
  const { settings, update } = useSettings();
  const { toast } = useToast();

  const messageBlock = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex],
  );

  const backendUuid = messageBlock?.content.backendUuid;
  const isInFlight = messageBlock?.states.isInFlight;

  const { downloadTts, isPending } = useTtsDownloadRequest({
    onComplete: async (chunks) => {
      if (chunks.length === 0) {
        toast({
          title: "Download Failed",
          description: "No audio data received",
          variant: "caution",
        });
        return;
      }

      try {
        const filename = `message-${backendUuid?.slice(0, 8)}-${settings.defaultVoice}`;
        await downloadWavFile({
          chunks,
          filename,
        });

        toast({
          title: "Download Complete",
          description: "Audio file saved successfully",
        });
      } catch (error) {
        console.error("[TtsDownload] Download failed:", error);
        // Don't show error toast if user just cancelled the save dialog
        if (error instanceof Error && error.message === "Download cancelled") {
          return;
        }
        toast({
          title: "Download Failed",
          description: "Failed to save audio file",
          variant: "caution",
        });
      }
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Failed to generate audio",
        variant: "caution",
      });
    },
  });

  const handleDownload = async () => {
    if (!backendUuid) return;

    try {
      await downloadTts({
        voice: settings.defaultVoice,
        backendUuid,
      });

      // Update settings to remember last voice
      await update({
        updateFn(prev: typeof settings) {
          prev.defaultVoice = settings.defaultVoice;
        },
      });
    } catch (error) {
      console.error("[TtsDownload] Download error:", error);
    }
  };

  if (!backendUuid || isInFlight) {
    return null;
  }

  return (
    <Tooltip content="Download as audio">
      <Button
        onClick={handleDownload}
        disabled={isPending}
        variant="ghost"
        size="iconSm"
        className="x:text-muted-foreground"
      >
        {isPending ? (
          <TablerLoaderCircle className="x:size-4 x:animate-spin" />
        ) : (
          <TablerDownload className="x:size-4" />
        )}
      </Button>
    </Tooltip>
  );
}
