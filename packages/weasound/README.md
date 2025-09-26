# Weasound

(Pronounced to rhyme with "resound")

Capturing and playing raw audio on browsers is difficult. There are several
different subsystems, none of which work very well. Weasound fixes that. It
provides interfaces for capturing and playing back raw, PCM audio, and chooses
the best one for the particular browser it's being run on. It was originally
written for a WebRTC replacement, but has since evolved into its own package.

If loaded from a script (`<script type="text/javascript"
src="weasound.min.js"></script>`), Weasound's API is exposed on the global
object `Weasound`. It can also be imported as a module or `require`d in most
bundlers. It cannot be used in Node.js.

## Capture

```js
/**
 * Create an appropriate audio capture from an AudioContext and a MediaStream.
 * @param ac  The AudioContext for the nodes.
 * @param ms  The MediaStream or AudioNode from which to create a capture.
 */
export async function createAudioCapture(
    ac: AudioContext, ms: MediaStream | AudioNode,
    opts: AudioCaptureOptions = {}
): Promise<AudioCapture>;
```

Use `await Weasound.createAudioCapture(ac, ms)` to create an audio capture
object. An `AudioContext` is necessary and must be created yourself. Audio
capture objects can be created from either `MediaStream`s or `AudioNode`s. If
using an `AudioNode`, it must (of course) be on the provided `AudioContext`.

(`opts` is only for overriding the type of capture, and usually should not be
used, as the best capture technology will be chosen automatically.)

The `AudioCapture` interface is as follows:

```js
/**
 * General interface for any audio capture subsystem, user-implementable.
 *
 * Events:
 * * data(Float32Array[]): Audio data event. Each element of the array is a
 *   single channel of audio data.
 * * vad(null): Audio VAD change event. Fired every time the VAD status changes.
 */
abstract class AudioCapture extends events.EventEmitter {
    /**
     * Get the sample rate of this capture. Must never change. Usually *but not
     * always* follows an AudioContext.
     */
    getSampleRate(): number;

    /**
     * Get the current VAD state.
     */
    getVADState(): VADState;

    /**
     * Set the current VAD state. Subclasses may want to block this and do the
     * VAD themselves.
     */
    setVADState(to: VADState);

    /**
     * Stop this audio capture and remove any underlying data.
     */
    close(): void;

    /**
     * Pipe data to this message port, using shared memory if requested (and
     * possible). Message will be either a Float32Array[] (array of channels),
     * or, if using shared memory, a single message of the form
     * {
     *   c: "buffers",
     *   buffers: Float32Array[],
     *   head: Int32Array
     * }
     * In the "buffers" case, the buffers are a shared memory buffer, and head
     * is a write head into each buffer. The writer will update the head with
     * each write, using the buffers as ring buffers. The receiver must be fast
     * enough to read the buffers before the ring wraps around.
     */
    pipe(to: MessagePort, shared = false);
}
```

Importantly, use the `data` event to capture data. Weasound does _not_ use the
browser's built-in event system, instead providing its own (mainly for the
ability to capture all events, but also to avoid unneeded intermediate
objects). Use `audioCapture.on("data", chunk => ...)`, like Node, or see the
Events section below.

You can use `pipe` to send the data to a message port (and, e.g., a worker),
and it also supports shared memory. As some capture mechanisms use workers,
using shared memory in this way can be a _major_ performance boon. If piped,
data may not also be sent by the standard `data` event.

Make sure to `close` an `AudioCapture` when you're done with it!

The `AudioCapture` interface is capable of passing through voice activity
detection (VAD) events, but Weasound does not implement VAD itself, and simply
passes through events given to it by `setVADState`. `AudioCapture` can be used
without any consideration of this VAD system if you don't need it.

## Playback

```js
/**
 * Create an appropriate audio playback from an AudioContext.
 */
export async function createAudioPlayback(
    ac: AudioContext, opts: AudioPlaybackOptions = {}
): Promise<AudioPlayback> {
```

Use `await Weasound.createAudioPlayback(ac)` to create an audio playback
object. Note that you don't provide the audio to play back here, but rather,
provide it to the playback object "live". Each audio playback subsystem simply
creates an `AudioNode` on the given `AudioContext`; it is then necessary for
you to connect that audio node to actually play audio.

(`opts` is only for overriding the type of playback, and usually should not be
used, as the best playback technology will be chosen automatically.)

The `AudioPlayback` interface is as follows:

```js
/**
 * General interface for any audio playback subsystem, user implementable.
 */
abstract class AudioPlayback extends events.EventEmitter {
    /**
     * Play this audio.
     */
    play(data: Float32Array[]): void;

    /**
     * Pipe audio from this message port. Same format as pipe() in
     * AudioCapture.
     */
    pipeFrom(port: MessagePort): void;

    /**
     * Get the underlying number of channels.
     */
    channels(): number;

    /**
     * Get the underlying AudioNode, *if* there is a unique audio node for this
     * playback.
     */
    unsharedNode(): AudioNode | null;

    /**
     * Get the underlying AudioNode, if it's shared.
     */
    sharedNode(): AudioNode | null;

    /**
     * Stop this audio playback and remove any underlying data.
     */
    close(): void;
}
```

Each `AudioPlayback` will have one or the other of `unsharedNode` or
`sharedNode` set. That is, if `audioPlayback.sharedNode()` is `null`, then
`audioPlayback.unsharedNode()` won't be, and vice-versa. In either case, it
must be connected; certain playback mechanisms use a single audio node shared
by multiple playbacks, in which case you shouldn't connect it multiple times.
Remember your previous shared audio node and make sure not to connect it again.

Quite simply, play audio by calling `play`. It plays the audio "now" (really,
after some short buffer time), or if there's already audio queued, plays the
given audio after all currently queued audio has played, in a sample-perfect
way.

Audio data _must_ be in the sample rate of the audio context. Resample it
yourself if your audio data is not the correct sample rate.

Like `AudioCapture`, audio can also be sent over a pipe, or using shared
memory, using `pipeFrom`. Close this audio playback with `close`.

## Events

```js
/**
 * General-purpose event emitter.
 */
class EventEmitter {
    /**
     * Set an event handler.
     * @param ev  Event name, or "*" for all events.
     * @param handler  Event handler for this event.
     */
    on(ev: string, handler: EventHandler);

    /**
     * Set a one-time event handler.
     * @param ev  Event name, or "*" for all events.
     * @param handler  Event handler for this event.
     */
    once(ev: string, handler: EventHandler);

    /**
     * Remove an event handler.
     * @param ev  Event name.
     * @param handler  Handler to remove.
     */
    off(ev: string, handler: EventHandler);
}
```

Events are (roughly) in the style of Node.js, with the exception that it's
possible to create a universal event handler with `"*"`. A separate event
system is used because the browser's event system wraps everything in unneeded
`Event` objects.

`EventEmitter` is exported and can be subclassed.

## Demo

The file `demo/loopback/loopback.html` is a very simple demonstration of using
the capture and playback mechanisms as a loopback. It uses libav.js for
resampling (in case the input and output sample rates aren't the same).

The file `demo/playback/playback.html` is an equally simple demonstration of
using the playback subsystem only to play an audio file. The audio file must be
decodable by libav.js.
