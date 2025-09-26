import { PplxStreamingTtsPlayer } from "@/plugins/thread-message-tts/player/pplx-streaming-tts-player";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export class PplxTtsPlayerCoordinator {
  private static instance: PplxTtsPlayerCoordinator;

  private player: PplxStreamingTtsPlayer | null = null;
  private onPlayerStop: (() => void) | null = null;

  private constructor() {}

  public static getInstance(): PplxTtsPlayerCoordinator {
    if (PplxTtsPlayerCoordinator.instance == null) {
      PplxTtsPlayerCoordinator.instance = new PplxTtsPlayerCoordinator();
    }
    return PplxTtsPlayerCoordinator.instance;
  }

  public getPlayer(): PplxStreamingTtsPlayer {
    if (this.player == null) {
      const playbackRate =
        ExtensionSettingsService.cachedSync.plugins["thread:messageTts"]
          .playbackRate;

      this.player = new PplxStreamingTtsPlayer({
        playbackRate,
      });
    }
    return this.player;
  }

  public startSession(params: {
    onAudioStart?: () => void;
    onAudioComplete?: () => void;
    onPlayerStop?: () => void;
  }): void {
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

    player.startSession();
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
