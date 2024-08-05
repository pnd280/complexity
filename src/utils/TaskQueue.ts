const MIN_CHUNK_SIZE = 1;
const MAX_CHUNK_SIZE = 10;
const INITIAL_CHUNK_SIZE = 10;
const TARGET_TIME = 16; // Aiming for 60fps
const TOLERANCE = 0.2;
const RESET_TIMEOUT = 1000;
const CHUNK_SIZE_ADJUSTMENT = 2;
const PROCESSING_TIME_AVERAGE_FACTOR = 2;

export type Task = () => Promise<void>;

class Node {
  constructor(
    public task: Task,
    public next: Node | null = null,
  ) {}
}

export class TaskQueue {
  private static instance: TaskQueue;
  private head: Node | null = null;
  private tail: Node | null = null;
  private isProcessing = false;
  private chunkSize = INITIAL_CHUNK_SIZE;
  private lastProcessingTime = 0;
  private resetTimer: number | null = null;

  private constructor() {}

  static getInstance(): TaskQueue {
    if (!TaskQueue.instance) {
      TaskQueue.instance = new TaskQueue();
    }
    return TaskQueue.instance;
  }

  public enqueue(task: Task): void {
    const newNode = new Node(task);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    if (!this.isProcessing) {
      void this.processQueue();
    }
    this.cancelResetTimer();
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.head) {
      const start = performance.now();
      await this.processChunk();
      const end = performance.now();
      this.adjustChunkSize(end - start);
    }
    this.isProcessing = false;
    this.startResetTimer();
  }

  private async processChunk(): Promise<void> {
    return new Promise((resolve) => {
      const scheduler =
        document.visibilityState === "visible"
          ? requestAnimationFrame
          : queueMicrotask;

      scheduler(async () => {
        const chunk = this.dequeueChunk();
        for (const task of chunk) {
          try {
            await task();
          } catch (error) {
            console.error("Error processing task:", error);
          }
        }
        resolve();
      });
    });
  }

  private dequeueChunk(): Task[] {
    const chunk: Task[] = [];
    for (let i = 0; i < this.chunkSize && this.head; i++) {
      chunk.push(this.head.task);
      this.head = this.head.next;
    }
    if (!this.head) {
      this.tail = null;
    }
    return chunk;
  }

  private adjustChunkSize(processingTime: number): void {
    const avgProcessingTime =
      (processingTime + this.lastProcessingTime) /
      PROCESSING_TIME_AVERAGE_FACTOR;
    const newChunkSize = this.calculateNewChunkSize(avgProcessingTime);

    if (newChunkSize !== this.chunkSize) this.chunkSize = newChunkSize;

    // if (newChunkSize !== this.chunkSize) {
    //   const color = newChunkSize > this.chunkSize ? "green" : "red";
    //   console.log(
    //     `%cChunk size: ${this.chunkSize} -> ${newChunkSize}; Avg: ${avgProcessingTime}ms`,
    //     `color: ${color};`,
    //   );
    // } else {
    //   console.log(
    //     `%cChunk size: ${this.chunkSize}; Avg: ${avgProcessingTime}ms`,
    //     "color: #0091f7;",
    //   );
    // }

    this.lastProcessingTime = processingTime;
  }

  private calculateNewChunkSize(avgProcessingTime: number): number {
    if (avgProcessingTime > TARGET_TIME * (1 + TOLERANCE)) {
      return Math.max(MIN_CHUNK_SIZE, this.chunkSize - CHUNK_SIZE_ADJUSTMENT);
    } else if (avgProcessingTime < TARGET_TIME * (1 - TOLERANCE) && this.head) {
      return Math.min(MAX_CHUNK_SIZE, this.chunkSize + CHUNK_SIZE_ADJUSTMENT);
    }
    return this.chunkSize;
  }

  private startResetTimer(): void {
    this.cancelResetTimer();
    this.resetTimer = window.setTimeout(() => {
      if (this.chunkSize < MAX_CHUNK_SIZE) {
        // console.log(
        //   `Resetting chunk size to ${MAX_CHUNK_SIZE} due to inactivity`,
        // );
        this.chunkSize = MAX_CHUNK_SIZE;
      }
    }, RESET_TIMEOUT);
  }

  private cancelResetTimer(): void {
    if (this.resetTimer !== null) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }
  }
}
