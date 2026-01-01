import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useThreadDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/store";
import { useThreadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import useTtsDownloadRequest from "@/plugins/_thread/tts-download/hooks/useTtsDownloadRequest";
import type { TtsVoice } from "@/plugins/_thread/tts-download/types";
import { downloadWavFile } from "@/plugins/_thread/tts-download/utils/download-wav";

import TablerDownload from "~icons/tabler/download";
import TablerLoaderCircle from "~icons/tabler/loader-2";

import VoiceSelectionDialog from "./VoiceSelectionDialog";

export default function ThreadTtsDownloadButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  const isThreadInFlight = useThreadDomObserverStore(
    (store) => store.states.isInFlight,
  );

  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks,
  );

  const { downloadTts } = useTtsDownloadRequest({});

  const handleDownload = async (voice: TtsVoice) => {
    // Get all assistant messages (not in-flight, has answer content)
    const assistantMessages =
      messageBlocks?.filter(
        (block) =>
          !block.states.isInFlight &&
          block.content.answer &&
          block.content.backendUuid,
      ) ?? [];

    if (assistantMessages.length === 0) {
      toast({
        title: "No Messages",
        description: "No assistant messages to download",
        variant: "caution",
      });
      setDialogOpen(false);
      return;
    }

    if (assistantMessages.length > 20) {
      toast({
        title: "Warning",
        description: `Downloading ${assistantMessages.length} messages may take a while`,
      });
    }

    setIsDownloading(true);
    setProgress({ current: 0, total: assistantMessages.length });

    const allChunks: Int16Array[] = [];

    try {
      // Download each message sequentially
      for (let i = 0; i < assistantMessages.length; i++) {
        const message = assistantMessages[i];
        if (!message) continue;

        setProgress({ current: i + 1, total: assistantMessages.length });

        try {
          const chunks = await downloadTts({
            voice,
            backendUuid: message.content.backendUuid,
          });

          if (chunks.length > 0) {
            allChunks.push(...chunks);
          }
        } catch (error) {
          console.error(
            `[TtsDownload] Failed to download message ${i + 1}:`,
            error,
          );
          // Continue with next message
        }
      }

      if (allChunks.length === 0) {
        toast({
          title: "Download Failed",
          description: "No audio data received",
          variant: "caution",
        });
        return;
      }

      // Download concatenated audio
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `conversation-${timestamp}-${voice}`;

      await downloadWavFile({
        chunks: allChunks,
        filename,
      });

      toast({
        title: "Download Complete",
        description: `Downloaded ${assistantMessages.length} messages as audio`,
      });

      setDialogOpen(false);
    } catch (error) {
      console.error("[TtsDownload] Conversation download failed:", error);
      // Don't show error toast if user just cancelled the save dialog
      if (error instanceof Error && error.message === "Download cancelled") {
        return;
      }
      toast({
        title: "Download Failed",
        description: "Failed to download conversation",
        variant: "caution",
      });
    } finally {
      setIsDownloading(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <>
      <Tooltip content="Download conversation as audio">
        <Button
          onClick={() => setDialogOpen(true)}
          disabled={isThreadInFlight || isDownloading}
          variant="ghost"
          size="sm"
          className="x:box-content x:h-8 x:px-2.5 x:text-muted-foreground"
        >
          {isDownloading ? (
            <TablerLoaderCircle className="x:size-4 x:animate-spin" />
          ) : (
            <TablerDownload className="x:size-4" />
          )}
        </Button>
      </Tooltip>

      <VoiceSelectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onDownload={handleDownload}
        isDownloading={isDownloading}
        progress={isDownloading ? progress : undefined}
      />
    </>
  );
}
