const MIN_CHUNK_SIZE = 50;
const MAX_CHUNK_SIZE = 500;
const INITIAL_CHUNK_SIZE = 100;

export type Task = () => Promise<void>;

class Node {
  task: Task;
  next: Node | null;

  constructor(task: Task) {
    this.task = task;
    this.next = null;
  }
}

export class TaskQueue {
  private static instance: TaskQueue;
  private head: Node | null = null;
  private tail: Node | null = null;
  private isProcessing = false;
  private chunkSize = INITIAL_CHUNK_SIZE;
  private lastProcessingTime = 0;

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
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    if (!this.isProcessing) {
      void this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.head) {
      const start = performance.now();
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          const chunk = this.dequeueChunk();
          this.processChunk(chunk).then(() => {
            const end = performance.now();
            this.adjustChunkSize(end - start);
            resolve();
          });
        });
      });
    }
    this.isProcessing = false;
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

  private async processChunk(chunk: Task[]): Promise<void> {
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
      this.head // Check if there are more tasks in the queue
    ) {
      this.chunkSize = Math.min(
        MAX_CHUNK_SIZE,
        Math.floor(this.chunkSize * 1.2)
      );
    }
    this.lastProcessingTime = processingTime;
  }
}
