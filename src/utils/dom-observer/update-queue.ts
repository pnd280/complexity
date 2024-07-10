import { UpdateTask } from '@/types/DOMObserver';

const MIN_CHUNK_SIZE = 50;
const MAX_CHUNK_SIZE = 500;
const INITIAL_CHUNK_SIZE = 100;

export class UpdateQueue {
  private tasks: UpdateTask[] = [];
  private isProcessing = false;
  private chunkSize = INITIAL_CHUNK_SIZE;
  private lastProcessingTime = 0;

  public enqueue(task: UpdateTask): void {
    this.tasks.push(task);
    if (!this.isProcessing) {
      void this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.tasks.length > 0) {
      const start = performance.now();
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          const chunk = this.tasks.splice(0, this.chunkSize);
          this.processChunk(chunk).then(() => {
            const end = performance.now();
            this.adjustChunkSize(end - start);
            resolve(null);
          });
        });
      });
    }
    this.isProcessing = false;
  }

  private async processChunk(chunk: UpdateTask[]): Promise<void> {
    for (const task of chunk) {
      try {
        await task();
      } catch (error) {
        console.error('Error processing task:', error);
      }
    }
  }

  private adjustChunkSize(processingTime: number): void {
    const targetTime = 16; // Aiming for 60fps
    if (processingTime > targetTime * 1.2) {
      this.chunkSize = Math.max(
        MIN_CHUNK_SIZE,
        Math.floor(this.chunkSize * 0.8)
      );
    } else if (
      processingTime < targetTime * 0.8 &&
      this.tasks.length > this.chunkSize
    ) {
      this.chunkSize = Math.min(
        MAX_CHUNK_SIZE,
        Math.floor(this.chunkSize * 1.2)
      );
    }
    this.lastProcessingTime = processingTime;
  }
}
