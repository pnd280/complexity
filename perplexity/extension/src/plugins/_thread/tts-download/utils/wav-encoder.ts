/**
 * Encodes Int16Array PCM audio chunks to WAV format
 */
export class WavEncoder {
  /**
   * Encode PCM audio chunks to WAV format
   * @param chunks - Array of Int16Array chunks containing PCM audio data
   * @param sampleRate - Sample rate in Hz (default: 48000)
   * @param numChannels - Number of audio channels (default: 1 for mono)
   * @returns ArrayBuffer containing the complete WAV file
   */
  static encode(
    chunks: Int16Array[],
    sampleRate = 48000,
    numChannels = 1,
  ): ArrayBuffer {
    // Calculate total samples
    const totalSamples = chunks.reduce((sum, chunk) => sum + chunk.length, 0);

    // Calculate sizes
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = totalSamples * bytesPerSample;
    const fileSize = 44 + dataSize; // 44 bytes for WAV header

    // Create buffer for entire WAV file
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);

    // Write WAV header
    this.writeString(view, 0, "RIFF"); // ChunkID
    view.setUint32(4, fileSize - 8, true); // ChunkSize
    this.writeString(view, 8, "WAVE"); // Format

    // Write fmt sub-chunk
    this.writeString(view, 12, "fmt "); // Subchunk1ID
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, byteRate, true); // ByteRate
    view.setUint16(32, blockAlign, true); // BlockAlign
    view.setUint16(34, bitsPerSample, true); // BitsPerSample

    // Write data sub-chunk
    this.writeString(view, 36, "data"); // Subchunk2ID
    view.setUint32(40, dataSize, true); // Subchunk2Size

    // Write audio data
    let offset = 44;
    for (const chunk of chunks) {
      for (let i = 0; i < chunk.length; i++) {
        const sample = chunk[i];
        if (sample !== undefined) {
          view.setInt16(offset, sample, true);
        }
        offset += 2;
      }
    }

    return buffer;
  }

  /**
   * Write a string to a DataView at the specified offset
   */
  private static writeString(
    view: DataView,
    offset: number,
    str: string,
  ): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
}
