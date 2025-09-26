// SPDX-License-Identifier: ISC
/*
 * Copyright (c) 2021-2025 Yahweasel
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import * as audioCapture from "./audio-capture";
import * as audioPlayback from "./audio-playback";
import * as util from "./util";

/**
 * Bidirectional audio capture and playback in a single node.
 */
export abstract class AudioBidir {
  /**
   * Create a new capture node associated with this bidirectional node.
   */
  abstract createCapture(
    ms: MediaStream | null,
    mss: AudioNode,
  ): Promise<audioCapture.AudioCapture>;

  /**
   * Create a new playback node associated with this bidirectional node.
   */
  abstract createPlayback(): Promise<audioPlayback.AudioPlayback>;

  /**
   * Get the underlying audio node.
   */
  abstract node(): AudioNode;

  /**
   * Stop, disconnect, and dismantle this AudioBidir.
   */
  abstract close(): void;
}

/**
 * Bidirectional audio node using a ScriptProcessor.
 */
export class AudioBidirSP extends AudioBidir {
  constructor(
    /**
     * AudioContext on which to create the node.
     * @private
     */
    public _ac: AudioContext,
  ) {
    super();

    // Set up our buffers
    this._capture = null;
    this._playback = [];
    this._null = null;

    const sampleRate = _ac.sampleRate;
    const maxBuf = sampleRate >> 1;

    // Create the script processor
    const spBufSize = (this._spBufSize = util.bugNeedLargeBuffers()
      ? 4096
      : 1024);
    const sp = (this._sp = _ac.createScriptProcessor(spBufSize, 1, 1));

    // Set up its event
    sp.onaudioprocess = (ev) => {
      if (this._capture) {
        this._capture._data.push(ev.inputBuffer.getChannelData(0).slice(0));
      }

      const pbs = this._playback.length;
      if (!pbs) return;

      // Get our output buffers
      const outData: Float32Array[] = [];
      for (let i = 0; i < ev.outputBuffer.numberOfChannels; i++)
        outData.push(ev.outputBuffer.getChannelData(i));
      const outLen = outData[0].length;

      // Mix the output
      for (const pb of this._playback) {
        // Check whether it's playing
        if (!pb._playing && pb._bufLen >= outLen * 2) pb._playing = true;
        if (!pb._playing) continue;

        // Cut the buffer if it's too long
        while (pb._bufLen >= maxBuf) {
          pb._bufLen -= pb._buf[0][0].length;
          pb._buf.shift();
        }

        // Copy in data
        let rd = 0,
          remain = outData[0].length;
        while (remain > 0 && pb._buf.length) {
          const inBuf = pb._buf[0];
          if (inBuf[0].length <= remain) {
            // Use this entire buffer
            for (let i = 0; i < outData.length; i++) {
              const oi = outData[i];
              const ii = inBuf[i % inBuf.length];
              for (let s = 0; s < ii.length; s++) oi[rd + s] += ii[s];
            }
            pb._bufLen -= inBuf[0].length;
            pb._buf.shift();
            rd += inBuf[0].length;
            remain -= inBuf[0].length;
          } else {
            // inBuf too big
            // Use part of this buffer
            for (let i = 0; i < outData.length; i++) {
              const oi = outData[i];
              const ii = inBuf[i % inBuf.length];
              for (let s = 0; s < remain; s++) oi[rd + s] += ii[s];
            }
            for (let i = 0; i < inBuf.length; i++)
              inBuf[i] = inBuf[i].subarray(remain);
            pb._bufLen -= remain;
            rd += remain;
            remain = 0;
          }
        }

        // Possibly stop this one playing
        if (!pb._buf.length) pb._playing = false;
      }

      // Check for clipping
      let max = 1;
      for (let i = 0; i < outData.length; i++) {
        const c = outData[i];
        for (let s = 0; s < c.length; s++) max = Math.max(max, Math.abs(c[s]));
      }
      if (max > 1) {
        for (let i = 0; i < outData.length; i++) {
          const c = outData[i];
          for (let s = 0; s < c.length; s++) c[s] /= max;
        }
      }
    };

    // Hook it up
    const n = (this._null = _ac.createConstantSource());
    n.offset.value = 0;
    n.connect(sp);
    sp.connect(_ac.destination);
    n.start();
  }

  override createCapture(
    ms: MediaStream | null,
    mss: AudioNode,
  ): Promise<audioCapture.AudioCapture> {
    if (this._capture) this._capture.close();
    if (this._null) {
      this._null.stop();
      this._null.disconnect(this._sp);
      this._null = null;
    }
    return Promise.resolve(
      (this._capture = new AudioBidirSPCapture(this, ms, mss)),
    );
  }

  override createPlayback(): Promise<audioPlayback.AudioPlayback> {
    const ret = new AudioBidirSPPlayback(this);
    this._playback.push(ret);
    return Promise.resolve(ret);
  }

  override node() {
    return this._sp;
  }

  override close() {
    this._sp.disconnect(this._ac.destination);
    if (this._capture) this._capture.close();
    if (this._null) {
      this._null.stop();
      this._null.disconnect(this._sp);
      this._null = null;
    }
    for (const pb of this._playback.slice(0)) pb.close();
  }

  /**
   * The size of the buffer used for the ScriptProcessor.
   * @private
   */
  _spBufSize: number;

  /**
   * The underlying ScriptProcessor.
   * @private
   */
  _sp: ScriptProcessorNode;

  /**
   * A null source used before input has begun.
   * @private
   */
  _null: ConstantSourceNode | null;

  /**
   * The associated capture node, if any.
   * @private
   */
  _capture: AudioBidirSPCapture | null;

  /**
   * The associated playback nodes.
   * @private
   */
  _playback: AudioBidirSPPlayback[];
}

// Interval that's close enough to AWN for most purposes
const captureInterval = 256;

/**
 * Capture node using a shared script processor.
 */
class AudioBidirSPCapture extends audioCapture.AudioCapture {
  constructor(
    /**
     * The owner of this node.
     */
    public parent: AudioBidirSP,

    /**
     * The associated MediaStream, if there is one.
     */
    private _ms: MediaStream | null,

    /**
     * The associated audio source.
     */
    public mss: AudioNode,
  ) {
    super();
    this._data = [];
    this._interval = setInterval(
      () => this.emitData(),
      (captureInterval * 875) / parent._ac.sampleRate,
    ) as any;
    mss.connect(parent._sp);
  }

  override getSampleRate(): number {
    return this.parent._ac.sampleRate;
  }

  override getLatency(): number {
    let deviceLatency = 0;
    if (this._ms) {
      const inputSettings = this._ms.getAudioTracks()[0].getSettings();
      deviceLatency = (<any>inputSettings).latency || 0;
    }
    return (
      (deviceLatency + this.parent._spBufSize / this.parent._ac.sampleRate) *
      1000
    );
  }

  override close(): void {
    if (this.parent._capture === this) {
      this.parent._capture = null;
      this.mss.disconnect(this.parent._sp);
      clearInterval(this._interval);
    }
  }

  /**
   * Send some data.
   */
  emitData() {
    if (!this._data.length) return;
    const maxBuffers =
      (util.bugNeedLargeBuffers() ? 4096 : 1024) / captureInterval;
    do {
      const data = this._data[0];
      if (data.length > captureInterval) {
        this.emitEvent("data", [data.slice(0, captureInterval)]);
        this._data[0] = data.subarray(captureInterval);
      } else {
        this.emitEvent("data", [data]);
        this._data.shift();
      }
    } while (this._data.length > maxBuffers);
  }

  /**
   * Data to be sent.
   * @private
   */
  _data: Float32Array[];

  /**
   * Interval timer sending data.
   * @private
   */
  _interval: number;
}

/**
 * Playback node using a shared script processor.
 */
class AudioBidirSPPlayback extends audioPlayback.AudioPlayback {
  constructor(
    /**
     * The owner of this node.
     */
    public parent: AudioBidirSP,
  ) {
    super();
    this._closed = false;
    this._bufLen = 0;
    this._buf = [];
    this._playing = false;
  }

  override play(data: Float32Array[]): number {
    if (!this._closed) {
      const prevBufLen = this._bufLen;
      this._bufLen += data[0].length;
      this._buf.push(data);

      /* The latency comes from both the length of the buffer *and* the fact
       * that ScriptProcessor only pulls as often as you specify. */
      return (
        ((prevBufLen + this.parent._sp.bufferSize / 2) /
          this.parent._ac.sampleRate) *
        1000
      );
    }

    return 0;
  }

  override playing(): boolean {
    return this._buf.length > 0;
  }

  override channels(): number {
    return 1;
  }

  override latency(): number {
    return (this.parent._sp.bufferSize / 2 / this.parent._ac.sampleRate) * 1000;
  }

  override sharedNode(): AudioNode {
    return this.parent.node();
  }

  override close(): void {
    const p = this.parent;
    for (let i = 0; i < p._playback.length; i++) {
      if (this === p._playback[i]) {
        p._playback.splice(i, 1);
        break;
      }
    }
    this._closed = true;
    this._bufLen = 0;
    this._buf = [];
  }

  /**
   * Set when this has been closed.
   */
  private _closed: boolean;

  /**
   * Size (in samples) of buffers to play.
   * @private
   */
  _bufLen: number;

  /**
   * Buffered data.
   * @private
   */
  _buf: Float32Array[][];

  /**
   * Set while this is playing.
   * @private
   */
  _playing: boolean;
}

/**
 * Test for whether a shared, bidirectional node will be used.
 */
export const audioCapturePlaybackShared = util.bugNeedSharedNodes;

/**
 * Create an appropriate audio capture from an AudioContext and a MediaStream.
 * @param ac  The AudioContext for the nodes.
 * @param ms  The MediaStream or AudioNode from which to create a capture.
 */
export async function createAudioCapture(
  ac: AudioContext,
  ms: MediaStream | AudioNode,
  opts: audioCapture.AudioCaptureOptions = {},
): Promise<audioCapture.AudioCapture> {
  const isMediaStream = !!(<MediaStream>ms).getAudioTracks;
  let useShared = audioCapturePlaybackShared();
  if (opts.demandedType) useShared = opts.demandedType === "shared-sp";
  else if (opts.preferredType) useShared = opts.preferredType === "shared-sp";
  else if (
    isMediaStream &&
    util.bugPreferMediaRecorderPCM() &&
    util.supportsMediaRecorder(<MediaStream>ms, "video/x-matroska; codecs=pcm")
  )
    useShared = false;

  if (useShared) {
    /* Safari's audio subsystem is not to be trusted. It's why we have
     * bidirection capture/playback. */
    const acp: AudioContext & { rteAb?: AudioBidir } = ac;
    let ab = acp.rteAb;
    if (!ab) ab = acp.rteAb = new AudioBidirSP(ac);
    let node = <AudioNode>ms;
    let realMS: MediaStream | null = null;
    if ((<MediaStream>ms).getAudioTracks) {
      // Looks like a MediaStream
      realMS = <MediaStream>ms;
      node = ac.createMediaStreamSource(<MediaStream>ms);
    }
    return ab.createCapture(realMS, node);
  }

  return audioCapture.createAudioCaptureNoBidir(ac, ms, opts);
}

/**
 * Create an appropriate audio playback from an AudioContext.
 */
export async function createAudioPlayback(
  ac: AudioContext,
  opts: audioPlayback.AudioPlaybackOptions = {},
): Promise<audioPlayback.AudioPlayback> {
  let useShared = audioCapturePlaybackShared();
  if (opts.demandedType) useShared = opts.demandedType === "shared-sp";
  else if (opts.preferredType) useShared = opts.preferredType === "shared-sp";

  if (useShared) {
    // Use the bidir that was (hopefully) created with the capture
    const acp: AudioContext & { rteAb?: AudioBidir } = ac;
    let ab = acp.rteAb;
    if (!ab) ab = acp.rteAb = new AudioBidirSP(ac);
    return ab.createPlayback();
  }

  return audioPlayback.createAudioPlaybackNoBidir(ac, opts);
}
