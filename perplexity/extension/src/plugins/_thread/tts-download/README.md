# TTS Download Plugin

A Complexity plugin that enables downloading Perplexity AI messages and conversations as audio files using text-to-speech.

## Features

- **Individual Message Download**: Download any assistant message as a WAV audio file
- **Full Conversation Download**: Download all messages in a thread as a single concatenated audio file
- **Multiple Voice Options**: Choose from 4 TTS voices (Mike, Alex, Kate, Mary)
- **Progress Tracking**: Visual progress indicator when downloading multi-message conversations
- **Seamless Integration**: Download buttons in message action bars and navbar

## How It Works

### Architecture

The plugin uses Perplexity's native `voice_over` WebSocket API to generate TTS audio:

1. **WebSocket Connection**: Establishes connection via `InternalWebSocketManager`
2. **Audio Streaming**: Receives audio as Int16Array chunks via `audio` events
3. **Chunk Collection**: `AudioBufferCollector` accumulates chunks in memory
4. **WAV Encoding**: `WavEncoder` converts PCM chunks to WAV format with proper RIFF headers
5. **File Download**: Uses File System Access API (Chrome) or blob download (fallback)

### Key Components

#### Components
- **`TtsDownloadButton.tsx`**: Individual message download button (in message action bar)
- **`ThreadTtsDownloadButton.tsx`**: Full conversation download button (in navbar)
- **`VoiceSelectionDialog.tsx`**: Voice picker dialog for conversation downloads

#### Hooks
- **`useTtsDownloadRequest.ts`**: Core hook managing WebSocket communication and audio streaming

#### Utilities
- **`AudioBufferCollector`**: Collects and manages audio chunks
- **`WavEncoder`**: Encodes PCM data to WAV format
- **`download-wav.ts`**: Handles WAV file downloads

### Audio Format

- **Sample Rate**: 48kHz
- **Bit Depth**: 16-bit
- **Channels**: Mono (1 channel)
- **Format**: WAV (RIFF header)

## Usage

### Individual Message Download

1. Navigate to any Perplexity thread
2. Hover over an assistant message
3. Click the download icon in the action bar
4. Audio file downloads automatically with default voice

### Full Conversation Download

1. Click the download button in the navbar
2. Select desired voice from the dialog
3. Wait for progress to complete
4. Audio file saves with timestamp in filename

## Settings

- **Default Voice**: Select preferred voice for single-message downloads (Mike, Alex, Kate, Mary)
- **Enabled**: Toggle plugin on/off

## Technical Details

### Dependencies

- `domObservers:thread:messageBlocks` - Required for accessing message content

### WebSocket Protocol

```typescript
// Request
socket.emitWithAck("voice_over", {
  is_page: false,
  version: "2.13",
  completed: true,
  uuid: backendUuid,
  preset: voice,
});

// Response
socket.on("audio", (packet: { data: ArrayLike<number>; uuid: string }) => {
  // Handle audio chunk
});
```

### File Naming

- **Single message**: `message-{uuid.slice(0, 8)}-{voice}.wav`
- **Conversation**: `conversation-{timestamp}-{voice}.wav`

### Error Handling

- WebSocket connection failures
- Missing audio data
- User cancellation (File System Access API)
- Individual message failures in batch downloads (continues with next message)

## Changes to Shared Utilities

### `download-file.ts`

Enhanced to support binary audio data:

- Added `ArrayBuffer` support for `data` parameter
- Added `audio/wav` and `audio/wave` MIME types
- Added `useFilePicker` option for explicit File System Access API control
- Improved error handling to propagate user cancellation

## Future Enhancements

Potential improvements:

- Support for additional audio formats (MP3, OGG)
- Voice selection for individual messages
- Audio quality settings (sample rate, bit depth)
- Batch download with ZIP archive
- Pause/resume for long conversations
- Audio preview before download
