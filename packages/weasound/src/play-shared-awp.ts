// SPDX-License-Identifier: ISC
/*
 * Copyright (c) 2018-2025 Yahweasel
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

/* These declarations are from https://github.com/joanrieu at
 * https://github.com/microsoft/TypeScript/issues/28308#issuecomment-650802278 */
interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean;
}

declare const AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare function registerProcessor(
  name: string,
  processorCtor: (new (
    options?: AudioWorkletNodeOptions,
  ) => AudioWorkletProcessor) & {
    parameterDescriptors?: any[];
  },
): void;

// Ample buffer size
const bufSz = 48000 * 5;

// Maximum amount to buffer before we start skipping data
const maxBuf = bufSz >> 1;

// Processor to play data
class SharedPlaybackProcessor extends AudioWorkletProcessor {
  done: boolean;

  idealBuf: number;

  inUse: boolean[];
  incoming: Float32Array[][];
  incomingH: Int32Array[];
  readHead: number[];
  playing: boolean[];
  playbackRate: number[];

  constructor(options?: AudioWorkletNodeOptions) {
    super(options);

    const sampleRate = options!.parameterData!.sampleRate;

    // Start with empty buffers
    this.inUse = [];
    this.incoming = [];
    this.incomingH = [];
    this.readHead = [];
    this.playing = [];
    this.playbackRate = [];

    // Try to keep about 50ms buffered
    this.idealBuf = Math.round(sampleRate / 20);

    this.done = false;

    this.port.onmessage = (ev) => {
      this.onmessage(-1, ev);
    };
  }

  /**
   * Message handler from any input port.
   */
  onmessage(idx: number, ev: MessageEvent) {
    const msg = ev.data;
    if (msg.length) {
      // Raw data. Add it to the unshared buffer.
      const incoming = this.incoming[idx];
      while (incoming.length < msg.length)
        incoming.push(new Float32Array(bufSz));
      let writeHead = this.incomingH[idx][0];
      const len = msg[0].length;
      if (writeHead + len > bufSz) {
        // We wrap around
        const brk = bufSz - writeHead;
        for (let i = 0; i < msg.length; i++) {
          incoming[i].set(msg[i].subarray(0, brk), writeHead);
          incoming[i].set(msg[i].subarray(brk), 0);
        }
      } else {
        // Simple case
        for (let i = 0; i < msg.length; i++) incoming[i].set(msg[i], writeHead);
      }
      writeHead = (writeHead + len) % bufSz;
      this.incomingH[idx][0] = writeHead;
    } else if (msg.c === "buffers") {
      // Use their buffers
      this.incoming[idx] = msg.buffers;
      this.incomingH[idx] = msg.head;
      this.readHead[idx] = Atomics.load(msg.head, 0) as unknown as number;
    } else if (msg.c === "in") {
      // Assign a new buffer for it
      let idx = 0;
      for (idx = 0; idx < this.inUse.length && this.inUse[idx]; idx++) {}
      let crossOriginIsolated = true;
      if (typeof self !== "undefined")
        crossOriginIsolated = !!self.crossOriginIsolated;
      if (idx >= this.inUse.length) {
        // Create a new one
        this.inUse.push(true);
        this.incoming.push([]);
        this.incomingH.push(
          typeof SharedArrayBuffer !== "undefined" && crossOriginIsolated
            ? new Int32Array(new SharedArrayBuffer(4))
            : new Int32Array(1),
        );
        this.readHead.push(0);
        this.playing.push(false);
        this.playbackRate.push(1.0);
      } else {
        this.inUse[idx] = true;
        this.incoming[idx] = [];
        this.incomingH[idx] =
          typeof SharedArrayBuffer !== "undefined" && crossOriginIsolated
            ? new Int32Array(new SharedArrayBuffer(4))
            : new Int32Array(1);
        this.readHead[idx] = 0;
        this.playing[idx] = false;
        this.playbackRate[idx] = 1.0;
      }
      (<MessagePort>msg.p).onmessage = (ev) => {
        this.onmessage(idx, ev);
      };
    } else if (msg.c === "rate") {
      // Sanitize and clamp playback rate per input
      let r = Number(msg.r);
      if (!isFinite(r) || !(r > 0)) r = 1;
      if (r < 0.25) r = 0.25;
      if (r > 4) r = 4;
      this.playbackRate[idx] = r;
    } else if (msg.c === "stop") {
      this.inUse[idx] = false;
    } else if (msg.c === "done") {
      this.done = true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ) {
    if (this.done) return false;
    if (
      outputs.length === 0 ||
      outputs[0].length === 0 ||
      this.inUse.length === 0
    )
      return true;

    const out = outputs[0];
    const outLen = out[0].length;

    for (let idx = 0; idx < this.inUse.length; idx++) {
      if (!this.inUse[idx]) continue;

      const writeHead =
        typeof Atomics !== "undefined"
          ? Atomics.load(this.incomingH[idx], 0)
          : this.incomingH[idx][0];
      let readHead = this.readHead[idx];
      const incoming = this.incoming[idx];
      let inLen = writeHead - readHead;
      if (inLen < 0) inLen += incoming[0].length;

      if (!this.playing[idx]) {
        // Check whether we should start playing
        if (inLen >= this.idealBuf) this.playing[idx] = true;
        else continue;
      }

      // Check if we have too much data
      if (inLen >= maxBuf) {
        // Move up the read head
        readHead = (readHead + inLen - this.idealBuf) % incoming[0].length;
        inLen = this.idealBuf;
      }

      // Or too little
      if (inLen === 0) {
        this.playing[idx] = false;
        continue;
      }

      // Play some data
      const playbackRate = this.playbackRate[idx];
      if (Math.abs(playbackRate - 1) < 1e-6) {
        const len = Math.min(inLen, outLen);
        if (readHead + len > incoming[0].length) {
          // This wraps around the input data, so read in two goes
          const brk = incoming[0].length - readHead;
          for (let i = 0; i < out.length; i++) {
            const outc = out[i];
            const inc = incoming[i % incoming.length];
            let outs = 0;
            for (let ins = readHead; ins < readHead + brk; ins++)
              outc[outs++] += inc[ins];
            for (let ins = 0; ins < len - brk; ins++) outc[outs++] += inc[ins];
          }
        } else {
          // Read this much of the input
          for (let i = 0; i < out.length; i++) {
            const outc = out[i];
            const inc = incoming[i % incoming.length];
            let outs = 0;
            for (let ins = readHead; ins < readHead + len; ins++)
              outc[outs++] += inc[ins];
          }
        }

        this.readHead[idx] = readHead = (readHead + len) % incoming[0].length;
        if (readHead === writeHead) this.playing[idx] = false;
      } else {
        // Resample
        const bufLen = incoming[0].length;
        let i = 0;
        let readHeadF = readHead;

        for (; i < outLen; i++) {
          const ihi = ~~readHeadF;
          const ihiNext = ihi + 1;

          // Make sure we have enough data
          let needed = ihiNext - readHead;
          if (needed < 0) needed += bufLen;
          if (needed >= inLen) break;

          const ilo = ihi % bufLen;
          const ihi_ = ihiNext % bufLen;
          const frac = readHeadF - ihi;

          for (let c = 0; c < out.length; c++) {
            const inc = incoming[c % incoming.length];
            const slo = inc[ilo];
            const shi = inc[ihi_];
            out[c][i] += slo * (1 - frac) + shi * frac;
          }

          readHeadF += playbackRate;
        }

        this.readHead[idx] = ~~readHeadF % bufLen;

        // Don't fill the rest with silence, just stop producing
      }
    }

    // Check for clipping
    let max = 1;
    for (let i = 0; i < out.length; i++) {
      const c = out[i];
      for (let s = 0; s < c.length; s++) max = Math.max(max, Math.abs(c[s]));
    }
    if (max > 1) {
      for (let i = 0; i < out.length; i++) {
        const c = out[i];
        for (let s = 0; s < c.length; s++) c[s] /= max;
      }
    }

    return true;
  }
}

registerProcessor("rtennui-play-shared", SharedPlaybackProcessor);
