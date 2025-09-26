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

/**
 * True if this browser is Chrome. Really just used by isSafari, below.
 */
export function isChrome() {
  // Edge is Chrome, Opera is Chrome, Brave is Chrome...
  return navigator.userAgent.indexOf("Chrome") >= 0;
}

/**
 * True if this browser is Safari (and NOT Chrome). Used to work around some
 * Safari-specific bugs.
 */
export function isSafari(): boolean {
  // Chrome pretends to be Safari
  return navigator.userAgent.indexOf("Safari") >= 0 && !isChrome();
}

/**
 * True if this browser is Firefox.
 */
export function isFirefox(): boolean {
  return navigator.userAgent.indexOf("Firefox") >= 0;
}

/**
 * True if this browser is on Android. Used to work around some
 * Android-Chrome-specific bugs.
 */
export function isAndroid(): boolean {
  return navigator.userAgent.indexOf("Android") >= 0;
}

/**
 * Bug workaround check: True if we need to use shared audio nodes. This used
 * to be true on Safari, because it has trouble if you use audio nodes for both
 * input and output. But, Safari can now use AudioBuffers for output, so
 * nothing needs shared nodes.
 */
export function bugNeedSharedNodes(): boolean {
  return false;
}

/**
 * Bug check: On Chrome, we prefer MediaRecorder PCM for capture, because it
 * works better than the alternatives, except on Android, where it doesn't work
 * at all.
 */
export function bugPreferMediaRecorderPCM(): boolean {
  return isChrome() && !isAndroid();
}

/**
 * Connected to the above, true if we can use MediaRecorder at all. Ideally we
 * should just be able to check for the correct filetype support, but in June
 * 2023, Chrome started lying about support for PCM audio, so we're forced to
 * actually try starting a MediaRecorder instance to know whether it works
 * reliably, so a MediaStream can be provided to give a more reliable result.
 */
export function supportsMediaRecorder(
  ms:
    | (MediaStream & { rteSupportsMediaRecorder?: Record<string, boolean> })
    | null,
  mimeType: string,
): boolean {
  if (
    typeof MediaRecorder === "undefined" ||
    (!MediaRecorder.isTypeSupported(mimeType) && isAndroid())
  ) {
    // No support at all. Note that Android's support is just bad.
    return false;
  }
  if (!ms) return true;
  if (typeof ms.rteSupportsMediaRecorder !== "object")
    ms.rteSupportsMediaRecorder = Object.create(null);
  if (typeof ms.rteSupportsMediaRecorder![mimeType] === "boolean")
    return ms.rteSupportsMediaRecorder![mimeType];

  // Need to actually try it
  try {
    const mr = new MediaRecorder(ms, { mimeType });
    mr.ondataavailable = () => {};
    mr.start(20);
    mr.stop();
    ms.rteSupportsMediaRecorder![mimeType] = true;
  } catch (ex) {
    ms.rteSupportsMediaRecorder![mimeType] = false;
  }

  return ms.rteSupportsMediaRecorder![mimeType];
}

/**
 * Bug check: Don't use AudioBuffer-based playback on Firefox, because it's not
 * reliably seamless.
 */
export function bugUnreliableAudioBuffers(): boolean {
  return isFirefox();
}

/**
 * Bug check: On Chrome, ScriptProcessor is only reliable with large buffers.
 * On most Chrome, we use MediaRecorder + AudioBuffer, so this doesn't affect
 * us, but on Android, we still capture with a ScriptProcessor.
 */
export function bugNeedLargeBuffers(): boolean {
  return isChrome();
}
