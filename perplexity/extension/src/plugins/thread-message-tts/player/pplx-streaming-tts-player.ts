import * as AudioAPI from "weasound";

import { APP_CONFIG } from "@/app.config";

export class PplxStreamingTtsPlayer {
  private audioChunks: Int16Array[] = [];
  private audioContext: AudioContext | null = null;
  private weasoundPlayback: AudioAPI.AudioPlayback | null = null;

  private isSessionActive: boolean = false;
  private isPlayingChunks: boolean = false;
  private playbackRate: number = 1;
  private minChunkBuffer: number = 3;
  private hasStartedPlayback: boolean = false;
  private streamingComplete: boolean = false;
  private pendingChunks: Set<string> = new Set();
  private chunkCounter: number = 0;
  private scheduledChunkTimers: Map<string, number> = new Map();
  private verbose: boolean = false;

  private onAudioStart: (() => void) | null = null;
  private onAudioComplete: (() => void) | null = null;

  constructor({
    onAudioStart,
    onAudioComplete,
    minChunkBuffer,
    verbose,
    playbackRate,
  }: {
    onAudioStart?: () => void;
    onAudioComplete?: () => void;
    minChunkBuffer?: number;
    verbose?: boolean;
    playbackRate?: number;
  }) {
    this.onAudioStart = onAudioStart ?? null;
    this.onAudioComplete = onAudioComplete ?? null;
    this.minChunkBuffer = minChunkBuffer ?? 3;
    this.verbose = verbose ?? false;
    this.playbackRate = playbackRate ?? 1;
  }

  public setHandlers(params: {
    onAudioStart?: () => void;
    onAudioComplete?: () => void;
  }): void {
    this.onAudioStart = params.onAudioStart ?? null;
    this.onAudioComplete = params.onAudioComplete ?? null;
  }

  public async startSession() {
    this.clearBuffer();
    this.isSessionActive = true;
    this.resetState();
    await this.initAudioContext();
  }

  private resetState() {
    this.isPlayingChunks = false;
    this.hasStartedPlayback = false;
    this.streamingComplete = false;
    this.pendingChunks.clear();
    this.chunkCounter = 0;
  }

  private setupCompletionListener() {
    if (!this.weasoundPlayback) return;

    if (this.verbose) {
      console.log(
        "Setting up completion listener for weasound playback:",
        this.weasoundPlayback.constructor.name,
      );
    }

    this.weasoundPlayback.on("chunkComplete", (chunkId: string) => {
      this.handleChunkCompletion(chunkId);
    });
  }

  private handleChunkCompletion(chunkId: string) {
    if (!this.pendingChunks.has(chunkId)) {
      return; // Already handled
    }

    if (this.verbose) {
      console.log(
        `Chunk ${chunkId} completed, pending chunks:`,
        this.pendingChunks.size - 1,
        "streaming complete:",
        this.streamingComplete,
      );
    }

    this.pendingChunks.delete(chunkId);

    const timer = this.scheduledChunkTimers.get(chunkId);
    if (timer != null) {
      window.clearTimeout(timer);
      this.scheduledChunkTimers.delete(chunkId);
    }

    if (this.pendingChunks.size === 0 && this.streamingComplete) {
      if (this.verbose) {
        console.log("Player calling onComplete - all chunks finished playing");
      }
      this.onAudioComplete?.();
    }
  }

  private scheduleChunkCompletionTimer(
    chunkId: string,
    latencyMs: number,
    durationSamples: number,
  ) {
    if (this.audioContext == null) return;

    const durationMs = (durationSamples / this.audioContext.sampleRate) * 1000;
    const totalMs = Math.max(0, latencyMs + durationMs);

    const existing = this.scheduledChunkTimers.get(chunkId);
    if (existing != null) {
      window.clearTimeout(existing);
      this.scheduledChunkTimers.delete(chunkId);
    }

    const timerId = window.setTimeout(() => {
      this.handleChunkCompletion(chunkId);
    }, totalMs);

    this.scheduledChunkTimers.set(chunkId, timerId);
  }

  private async initAudioContext() {
    if (!this.isSessionActive) {
      return;
    }

    if (!this.audioContext || this.audioContext.state === "closed") {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    let playbackOptions: AudioAPI.AudioPlaybackOptions = {};

    if (APP_CONFIG.BROWSER === "firefox") {
      playbackOptions = {
        preferredType: "ab",
        bufferSize: 100,
      };
    } else {
      playbackOptions = {
        preferredType: "ab",
      };
    }

    this.weasoundPlayback = await AudioAPI.createAudioPlayback(
      this.audioContext,
      playbackOptions,
    );

    this.weasoundPlayback.setPlaybackRate(this.playbackRate);

    const audioNode =
      this.weasoundPlayback.unsharedNode() ||
      this.weasoundPlayback.sharedNode();

    if (audioNode != null) {
      audioNode.connect(this.audioContext.destination);
    }

    this.setupCompletionListener();
  }

  private async processChunkQueue() {
    if (this.isPlayingChunks || !this.isSessionActive) {
      return;
    }

    this.isPlayingChunks = true;

    try {
      while (this.audioChunks.length > 0) {
        const chunk = this.audioChunks.shift();
        if (!chunk || !this.weasoundPlayback) {
          continue;
        }

        const float32Array = new Float32Array(chunk.length);
        for (let i = 0; i < chunk.length; i++) {
          float32Array[i] = (chunk[i] ?? 0) / 32768.0;
        }

        const chunkId = `chunk_${this.chunkCounter++}`;
        this.pendingChunks.add(chunkId);
        if (this.verbose) {
          console.log(
            `Playing chunk ${chunkId}, total pending:`,
            this.pendingChunks.size,
          );
        }

        const latencyMs = this.weasoundPlayback.play([float32Array]);

        if (this.onAudioStart && !this.hasStartedPlayback) {
          this.hasStartedPlayback = true;
          if (latencyMs > 0) {
            setTimeout(() => {
              this.onAudioStart?.();
            }, latencyMs);
          } else {
            // If no latency info, call immediately
            void this.onAudioStart();
          }
        }

        this.scheduleChunkCompletionTimer(
          chunkId,
          latencyMs,
          float32Array.length,
        );
        await sleep(10);
      }
    } catch (error) {
      console.error("Error playing audio chunk:", error);
    } finally {
      this.isPlayingChunks = false;
    }
  }

  public addChunk(chunk: Int16Array, autoPlay = true) {
    if (!this.isSessionActive) return;

    this.audioChunks.push(chunk);

    if (
      autoPlay &&
      (this.audioChunks.length >= this.minChunkBuffer || this.isPlayingChunks)
    ) {
      void this.processChunkQueue();
    }
  }

  public finishStream() {
    if (!this.isSessionActive) return;

    if (this.verbose) {
      console.log("finishStream called", {
        chunksLength: this.audioChunks.length,
        isPlayingChunks: this.isPlayingChunks,
      });
    }

    this.streamingComplete = true;

    if (this.audioChunks.length > 0 && !this.isPlayingChunks) {
      if (this.verbose) {
        console.log("Starting playback of remaining chunks");
      }
      void this.processChunkQueue();
    }
  }

  public stopSession() {
    this.isSessionActive = false;

    if (this.weasoundPlayback) {
      this.weasoundPlayback.close();
      this.weasoundPlayback = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      void this.audioContext.close();
      this.audioContext = null;
    }

    for (const [, timerId] of this.scheduledChunkTimers) {
      window.clearTimeout(timerId);
    }
    this.scheduledChunkTimers.clear();

    this.resetState();
    this.clearBuffer();
  }

  public clearBuffer() {
    this.audioChunks = [];
  }

  public isActive(): boolean {
    return this.isSessionActive;
  }
}
