// SPDX-License-Identifier: ISC
/*
 * Copyright (c) 2022-2025 Yahweasel
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

// Size of our shared buffer(s)
const bufSz = 96000;

// Set if we can use shared memory for our output
const canShared =
  typeof SharedArrayBuffer !== "undefined" && self.crossOriginIsolated;

// Incoming buffers if shared memory is used
let incoming: Float32Array[] | null = null;
let incomingH: Int32Array | null = null;
let outgoing: Float32Array[] | null = null;

// Waiter if we're using shared memory
let waiter: Worker | null = null;

// All of our targets/receivers
let receivers: Receiver[] = [];

/**
 * Message handler for messages from the AWP.
 */
async function awpMessage(ev: MessageEvent) {
  const msg = ev.data;
  if (msg.length) {
    // It's raw data
    const len = msg[0].length;
    for (const receiver of receivers) receiver.send(msg, len);
  } else if (msg.c === "buffers") {
    // It's our shared buffers
    incoming = msg.buffers;
    incomingH = msg.head;

    // Wait for data
    let prevVal = Atomics.load(incomingH!, 0);
    while (Atomics.wait(incomingH!, 0, prevVal)) {
      const newVal = Atomics.load(incomingH!, 0);
      if (prevVal !== newVal) {
        onSharedIn(prevVal, newVal);
        prevVal = newVal;
      }

      // Allow other messages to come in
      await new Promise((res) => setTimeout(res, 0));
    }
  }
}

/**
 * Called when data is received through the shared buffer.
 */
function onSharedIn(lo: number, hi: number) {
  // Copy it into buffers
  let len = hi - lo;
  const channels = incoming!.length;
  if (len >= 0) {
    outgoingAlloc(len);
    for (let ci = 0; ci < incoming!.length; ci++)
      outgoing![ci].set(incoming![ci].subarray(lo, hi));
  } else {
    // Wraparound
    const bufLen = incoming![0].length;
    len += bufLen;
    outgoingAlloc(len);
    for (let ci = 0; ci < incoming!.length; ci++) {
      const ic = incoming![ci];
      const oc = outgoing![ci];
      // Lo part
      oc.set(ic.subarray(lo));
      // Hi part
      oc.set(ic.subarray(0, hi), bufLen - lo);
    }
  }

  // And send it
  for (const receiver of receivers) receiver.send(outgoing!, len);
}

/**
 * Allocate space for this many samples in the outgoing arrays.
 */
function outgoingAlloc(len: number) {
  if (outgoing === null) outgoing = [];
  while (outgoing.length < incoming!.length)
    outgoing.push(new Float32Array(len));
  for (let ci = 0; ci < outgoing.length; ci++) {
    if (outgoing[ci].length < len) outgoing[ci] = new Float32Array(len);
  }
}

/**
 * Every receiver is represented by a Receiver.
 */
class Receiver {
  constructor(
    /**
     * The message port targeting this receiver.
     */
    public port: MessagePort,

    // Whether this receiver is willing to accept shared buffers
    wantsShared: boolean,
  ) {
    this.shared = canShared && wantsShared;
    this.outgoing = null;
    this.outgoingH = null;
  }

  /**
   * Send this data.
   * @param data  The data itself, which may be overallocated.
   * @param len  The length of the data in samples.
   */
  send(data: Float32Array[], len: number) {
    if (this.shared && !this.outgoing) {
      // Set up our shared memory buffer
      this.outgoing = [];
      for (let ci = 0; ci < data.length; ci++) {
        this.outgoing.push(new Float32Array(new SharedArrayBuffer(bufSz * 4)));
      }
      this.outgoingH = new Int32Array(new SharedArrayBuffer(4));

      // Tell them about the buffers
      this.port.postMessage({
        c: "buffers",
        buffers: this.outgoing,
        head: this.outgoingH,
      });
    }

    if (this.shared) {
      // Write it into the buffer
      let writeHead = this.outgoingH![0];
      if (writeHead + len > bufSz) {
        // We wrap around
        const brk = bufSz - writeHead;
        for (let i = 0; i < this.outgoing!.length; i++) {
          this.outgoing![i].set(
            data[i % data.length].subarray(0, brk),
            writeHead,
          );
          this.outgoing![i].set(data[i % data.length].subarray(brk, len), 0);
        }
      } else {
        // Simple case
        for (let i = 0; i < this.outgoing!.length; i++)
          this.outgoing![i].set(
            data[i % data.length].subarray(0, len),
            writeHead,
          );
      }
      writeHead = (writeHead + len) % bufSz;
      Atomics.store(this.outgoingH!, 0, writeHead);

      // Notify the worker
      Atomics.notify(this.outgoingH!, 0);
    } else {
      // Fix it up if necessary by reallocating
      if (data[0].length > len) {
        for (let ci = 0; ci < data.length; ci++)
          data[ci] = data[ci].slice(0, len);
      }

      // Just send the data. Minimize allocation by sending plain.
      this.port.postMessage(data);
    }
  }

  /**
   * Whether we're using shared buffers.
   */
  private shared: boolean;

  /**
   * The outgoing data, if shared.
   */
  private outgoing: Float32Array[] | null;

  /**
   * The write head, if shared.
   */
  private outgoingH: Int32Array | null;
}

/**
 * Control messages.
 */
onmessage = (ev) => {
  const msg = ev.data;
  if (msg.c === "in") {
    // The AWP input
    msg.p.onmessage = awpMessage;
  } else if (msg.c === "out") {
    // A receiver
    receivers.push(new Receiver(msg.p, !!msg.shared));
  }
};
