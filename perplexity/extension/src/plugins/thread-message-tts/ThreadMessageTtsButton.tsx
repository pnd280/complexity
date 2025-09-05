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
import { useEvent } from "@/hooks/useEvent";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/plugins/_core/ui/groups/thread-message-index-context";
import usePplxTtsRequest from "@/plugins/thread-message-tts/hooks/usePplxTtsRequest";
import type { TtsVoice } from "@/plugins/thread-message-tts/types";
import { TTS_VOICES } from "@/plugins/thread-message-tts/types";
import { PplxTtsPlayerCoordinator } from "@/plugins/thread-message-tts/utils/coordinator";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export function ThreadMessageTtsButton() {
  const messageBlockIndex = useThreadMessageIndexContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [firstChunkArrived, setFirstChunkArrived] = useState(false);

  const {
    mutation: { mutateAsync: playTts, isPending },
    abort,
  } = usePplxTtsRequest();

  const onPlayerComplete = useEvent(() => {
    if (isPending) return;
    setPlaying(false);
    setFirstChunkArrived(false);
    abort();
  });

  const onPlayerStop = useEvent(() => {
    setPlaying(false);
    setFirstChunkArrived(false);
    abort();
  });

  const [player] = useState(() =>
    PplxTtsPlayerCoordinator.getInstance().createPlayer({
      onStart: () => {
        setFirstChunkArrived(true);
      },
      onComplete: onPlayerComplete,
      stop: onPlayerStop,
    }),
  );

  const stopTts = useCallback(() => {
    PplxTtsPlayerCoordinator.getInstance().stopAllPlayers();
  }, []);

  const initTts = useCallback(
    async (params?: { voice: TtsVoice }) => {
      if (playing) {
        stopTts();
        return;
      }

      stopTts();
      abort();
      player.startSession();
      setPlaying(true);

      const backendUuid =
        threadMessageBlocksDomObserverStore.getState().messageBlocks?.[
          messageBlockIndex
        ]?.content.backendUuid;

      if (!backendUuid) {
        console.error("No backendUuid found");
        setPlaying(false);
        return;
      }

      const extensionSettings =
        await ExtensionSettingsService.getWithoutCacheInvalidation();
      const selectedVoice =
        params?.voice || extensionSettings.plugins["thread:messageTts"].voice;

      playTts({
        backendUuid,
        voice: selectedVoice,
        onBufferUpdate: (chunk: Int16Array) => player.addChunk(chunk),
        onError: () => {
          setPlaying(false);
        },
      });
    },
    [playing, player, messageBlockIndex, stopTts, playTts, abort],
  );

  useEffect(() => {
    return () => {
      stopTts();
      player.clearBuffer();
      PplxTtsPlayerCoordinator.getInstance().removePlayer(player);
    };
  }, [player, stopTts]);

  if (playing && !firstChunkArrived) {
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
        ExtensionSettingsService.set((draft) => {
          draft.plugins["thread:messageTts"].voice = value as TtsVoice;
        });
      }}
    >
      <Tooltip
        content={playing ? t("common.misc.stop") : t("common.misc.speakAloud")}
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
              if (playing) {
                return;
              }

              e.preventDefault();
              setMenuOpen(true);
            }}
          >
            {playing ? (
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
