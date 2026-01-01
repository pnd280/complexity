/**
 * Collects audio chunks for download
 */
export class AudioBufferCollector {
  private chunks: Int16Array[] = [];

  /**
   * Add an audio chunk to the collection
   */
  addChunk(chunk: Int16Array): void {
    this.chunks.push(chunk);
  }

  /**
   * Get all collected chunks
   */
  getAllChunks(): Int16Array[] {
    return this.chunks;
  }

  /**
   * Clear all collected chunks
   */
  clear(): void {
    this.chunks = [];
  }

  /**
   * Get total number of samples across all chunks
   */
  getTotalSamples(): number {
    return this.chunks.reduce((total, chunk) => total + chunk.length, 0);
  }

  /**
   * Check if any chunks have been collected
   */
  hasChunks(): boolean {
    return this.chunks.length > 0;
  }
}
