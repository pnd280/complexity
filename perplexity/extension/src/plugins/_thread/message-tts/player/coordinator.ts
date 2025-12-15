import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import { PplxStreamingTtsPlayer } from "@/plugins/_thread/message-tts/player/pplx-streaming-tts-player";

export class PplxTtsPlayerCoordinator {
  private static instance: PplxTtsPlayerCoordinator =
    new PplxTtsPlayerCoordinator();

  private player: PplxStreamingTtsPlayer | null = null;
  private onPlayerStop: (() => void) | null = null;

  private constructor() {}

  public static getInstance(): PplxTtsPlayerCoordinator {
    return PplxTtsPlayerCoordinator.instance;
  }

  public getPlayer(): PplxStreamingTtsPlayer {
    if (this.player == null) {
      const playbackRate =
        PluginsSettingSnapshotsService.getPluginSnapshot(
          "thread:messageTts",
        ).playbackRate;

      this.player = new PplxStreamingTtsPlayer({
        playbackRate,
      });
    }
    return this.player;
  }

  public async startSession(params: {
    onAudioStart?: () => void;
    onAudioComplete?: () => void;
    onPlayerStop?: () => void;
  }): Promise<void> {
    const player = this.getPlayer();

    if (player.isActive()) {
      player.stopSession();
      this.onPlayerStop?.();
    }

    player.setHandlers({
      onAudioStart: params.onAudioStart,
      onAudioComplete: params.onAudioComplete,
    });
    this.onPlayerStop = params.onPlayerStop ?? null;

    await player.startSession();
  }

  public stopAllPlayers(): void {
    const player = this.player;
    if (player?.isActive()) {
      player.stopSession();
      this.onPlayerStop?.();
    }
    this.onPlayerStop = null;
  }
}
