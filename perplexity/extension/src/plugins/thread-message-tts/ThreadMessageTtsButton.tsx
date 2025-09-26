import { useLocalStorage } from "@uidotdev/usehooks";
import { FaStopCircle } from "react-icons/fa";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { LuLoaderCircle } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/plugins/_core/ui/groups/thread-message-index-context";
import usePplxTtsRequest from "@/plugins/thread-message-tts/hooks/usePplxTtsRequest";
import { PplxTtsPlayerCoordinator } from "@/plugins/thread-message-tts/player/coordinator";
import type { TtsVoice } from "@/plugins/thread-message-tts/types";
import { TTS_VOICES } from "@/plugins/thread-message-tts/types";

export function ThreadMessageTtsButton() {
  const messageBlockIndex = useThreadMessageIndexContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const coordinator = useMemo(() => PplxTtsPlayerCoordinator.getInstance(), []);

  const backendUuid =
    threadMessageBlocksDomObserverStore.getState().messageBlocks?.[
      messageBlockIndex
    ]?.content.backendUuid;

  const [voice, setVoice] = useLocalStorage<TtsVoice>(
    "cplx.plugins.thread:messageTts.voice",
    "Mike",
  );

  const { playTts, isPending, abort } = usePplxTtsRequest({
    onBufferUpdate: (chunk: Int16Array) =>
      coordinator.getPlayer().addChunk(chunk),
    onStreamComplete: () => coordinator.getPlayer().finishStream(),
    onError: () => {
      setIsPlaying(false);
    },
  });

  const initTts = useCallback(
    async (params?: { voice: TtsVoice }) => {
      if (isPlaying) {
        coordinator.stopAllPlayers();
        return;
      }

      coordinator.stopAllPlayers();
      abort();
      coordinator.startSession({
        onAudioStart: () => setIsPlaying(true),
        onAudioComplete: () => {
          abort();
          setIsPlaying(false);
        },
        onPlayerStop: () => {
          abort();
          setIsPlaying(false);
        },
      });

      if (!backendUuid) {
        console.error("No backendUuid found");
        setIsPlaying(false);
        return;
      }

      playTts({ voice: params?.voice ?? voice, backendUuid });
    },
    [abort, backendUuid, isPlaying, playTts, voice, coordinator],
  );

  if (!isPlaying && isPending) {
    return (
      <div className="x:rounded-full x:p-2 x:text-muted-foreground">
        <LuLoaderCircle className="x:size-4 x:animate-spin" />
      </div>
    );
  }

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      open={menuOpen}
      onOpenChange={({ open }) => setMenuOpen(open)}
      onSelect={({ value }) => {
        initTts({ voice: value as TtsVoice });
        setVoice(value as TtsVoice);
      }}
    >
      <Tooltip
        content={
          isPlaying ? t("common.misc.stop") : t("common.misc.speakAloud")
        }
      >
        <DropdownMenuTrigger asChild>
          <div
            tabIndex={0}
            className="x:cursor-pointer x:rounded-full x:p-2 x:text-muted-foreground x:transition-all x:hover:bg-muted/50 x:hover:text-foreground x:active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (menuOpen) return;
              initTts();
            }}
            onContextMenu={(e) => {
              if (isPlaying) {
                return;
              }

              e.preventDefault();
              setMenuOpen(true);
            }}
          >
            {isPlaying ? (
              <FaStopCircle className="x:size-4 x:text-primary" />
            ) : (
              <HiOutlineSpeakerWave className="x:size-4" />
            )}
          </div>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent>
        {TTS_VOICES.map((voice) => (
          <DropdownMenuItem key={voice} value={voice}>
            {voice}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
