import { useLocalStorage } from "@uidotdev/usehooks";

import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEvent } from "@/hooks/useEvent";
import { threadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/plugins/__ui-groups__/elements/thread-message-index-context";
import usePplxTtsRequest from "@/plugins/thread-message-tts/hooks/usePplxTtsRequest";
import { PplxTtsPlayerCoordinator } from "@/plugins/thread-message-tts/player/coordinator";
import type { TtsVoice } from "@/plugins/thread-message-tts/types";
import { TTS_VOICES } from "@/plugins/thread-message-tts/types";

import FaSolidCircleStop from "~icons/fa7-solid/circle-stop";
import TablerLoaderCircle from "~icons/tabler/loader-2";
import TablerVolume from "~icons/tabler/volume";

export function ThreadMessageTtsButton() {
  const messageBlockIndex = useThreadMessageIndexContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const coordinator = PplxTtsPlayerCoordinator.getInstance();

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

  const initTts = async (params?: { voice: TtsVoice }) => {
    coordinator.stopAllPlayers();

    if (isPlaying) {
      return;
    }

    abort();

    await coordinator.startSession({
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

    void playTts({ voice: params?.voice ?? voice, backendUuid });
  };

  const cleanup = useEvent(() => {
    if (!isPlaying) return;

    coordinator.getPlayer().clearBuffer();
    coordinator.stopAllPlayers();
  });

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  if (!isPlaying && isPending) {
    return (
      <div className="x:rounded-full x:p-2 x:text-muted-foreground">
        <TablerLoaderCircle className="x:size-4 x:animate-spin" />
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
        void initTts({ voice: value as TtsVoice });
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
              void initTts();
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
              <FaSolidCircleStop className="x:size-4 x:text-primary" />
            ) : (
              <TablerVolume className="x:size-4" />
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
