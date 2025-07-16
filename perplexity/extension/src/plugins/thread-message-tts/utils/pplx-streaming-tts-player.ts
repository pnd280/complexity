import { Howl } from "howler";

const AUDIO_CONFIG = {
  sampleRate: 44100,
  bytesPerSample: 2,
  pcmFormat: 1,
  wavHeaderSize: 44,
  channels: 1,
  bitsPerSample: 16,
} as const;

const WAV_HEADER = {
  riffChunkId: 0x52494646,
  waveFormat: 0x57415645,
  fmtChunkId: 0x666d7420,
  dataChunkId: 0x64617461,
} as const;

type PlaybackState = {
  isPlaying: boolean;
  isPending: boolean;
};

export class PplxStreamingTtsPlayer {
  private audioChunks: Int16Array[] = [];
  private activeSound: Howl | null = null;
  private playbackState: PlaybackState = {
    isPlaying: false,
    isPending: false,
  };
  private speed: number = 1;
  private isSessionActive: boolean = false;
  private onStart: (() => void) | null = null;
  private onComplete: (() => void) | null = null;

  constructor({
    onStart,
    onComplete,
    speed,
  }: {
    onStart?: () => void;
    onComplete?: () => void;
    speed?: number;
  }) {
    this.onStart = onStart ?? null;
    this.onComplete = onComplete ?? null;
    this.speed = speed ?? 1;
  }

  public startSession() {
    this.clearBuffer();
    this.isSessionActive = true;
    this.resetPlaybackState();
  }

  private resetPlaybackState() {
    this.playbackState = {
      isPlaying: false,
      isPending: false,
    };
  }

  private createWavHeader(dataLength: number): ArrayBuffer {
    const headerBuffer = new ArrayBuffer(AUDIO_CONFIG.wavHeaderSize);
    const view = new DataView(headerBuffer);

    view.setUint32(0, WAV_HEADER.riffChunkId, false);
    view.setUint32(4, 36 + dataLength, true);
    view.setUint32(8, WAV_HEADER.waveFormat, false);
    view.setUint32(12, WAV_HEADER.fmtChunkId, false);
    view.setUint32(16, 16, true);
    view.setUint16(20, AUDIO_CONFIG.pcmFormat, true);
    view.setUint16(22, AUDIO_CONFIG.channels, true);
    view.setUint32(24, AUDIO_CONFIG.sampleRate, true);
    view.setUint32(28, AUDIO_CONFIG.sampleRate * AUDIO_CONFIG.channels * AUDIO_CONFIG.bytesPerSample, true);
    view.setUint16(32, AUDIO_CONFIG.channels * AUDIO_CONFIG.bytesPerSample, true);
    view.setUint16(34, AUDIO_CONFIG.bitsPerSample, true);
    view.setUint32(36, WAV_HEADER.dataChunkId, false);
    view.setUint32(40, dataLength, true);

    return headerBuffer;
  }

  private createWavBlob(chunk: Int16Array): Blob {
    const dataLength = chunk.length * AUDIO_CONFIG.bytesPerSample;
    const headerBuffer = this.createWavHeader(dataLength);
    const chunkBuffer = new ArrayBuffer(dataLength);
    const chunkView = new DataView(chunkBuffer);

    for (let i = 0; i < chunk.length; i++) {
      chunkView.setInt16(i * AUDIO_CONFIG.bytesPerSample, chunk[i], true);
    }

    return new Blob([headerBuffer, chunkBuffer], { type: "audio/wav" });
  }

  private handleSoundEnd(objectUrl: string) {
    URL.revokeObjectURL(objectUrl);
    this.audioChunks.shift();
    this.playbackState.isPlaying = false;
    this.playbackState.isPending = false;
    this.playNextChunk();
  }

  public addChunk(chunk: Int16Array, autoPlay: boolean = false) {
    if (!this.isSessionActive) return;

    if (this.audioChunks.length === 0 && this.onStart) {
      this.onStart();
    }

    this.audioChunks.push(chunk);
    if (autoPlay) this.playNextChunk();
  }

  public async playNextChunk(): Promise<void> {
    if (!this.isSessionActive) return;
    if (this.playbackState.isPlaying || this.playbackState.isPending) {
      return;
    }

    if (!this.audioChunks.length) {
      if (this.onComplete) {
        this.onComplete();
        
        // Trigger automatic WAV file download
        this.downloadCompleteAudio();
      }
      return;
    }

    const chunk = this.audioChunks[0];
    if (!chunk) return;

    this.playbackState.isPending = true;
    try {
      const blob = this.createWavBlob(chunk);
      const objectUrl = URL.createObjectURL(blob);
      this.activeSound = new Howl({
        src: [objectUrl],
        format: ["wav"],
        autoplay: true,
        rate: this.speed,
        onend: () => this.handleSoundEnd(objectUrl),
        onloaderror: () => {
          URL.revokeObjectURL(objectUrl);
          this.audioChunks.shift();
          this.playbackState.isPending = false;
          this.playNextChunk();
        },
      });
      this.playbackState.isPlaying = true;
    } catch (error) {
      console.error("Audio playback failed:", error);
      this.audioChunks.shift();
      this.playbackState.isPending = false;
      this.playNextChunk();
    }
  }

  private downloadCompleteAudio() {
    // Create a complete WAV file from all audio chunks
    const allChunks = this.audioChunks.slice();
    if (allChunks.length === 0) return;

    // Combine all chunks into a single array
    const totalLength = allChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combinedChunk = new Int16Array(totalLength);
    let offset = 0;

    for (const chunk of allChunks) {
      combinedChunk.set(chunk, offset);
      offset += chunk.length;
    }

    // Create WAV blob and download
    const blob = this.createWavBlob(combinedChunk);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tts_audio_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public stop() {
    this.isSessionActive = false;
    if (this.activeSound) {
      this.activeSound.stop();
      this.activeSound.unload();
      this.activeSound = null;
    }
    this.resetPlaybackState();
    this.clearBuffer();
  }

  public clearBuffer() {
    this.audioChunks = [];
  }

  public setSpeed(speed: number) {
    this.speed = speed;
    if (this.activeSound) {
      this.activeSound.rate(speed);
    }
  }
}
