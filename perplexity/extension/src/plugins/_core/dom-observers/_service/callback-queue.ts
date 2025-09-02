import type { MaybePromise } from "@/types/utils.types";

type CallbackQueueTaskPrefix =
  | "home"
  | "queryBoxes"
  | "thread"
  | "sidebar"
  | "spacesPage"
  | "settingsPage";

export type CallbackQueueTaskId = `${CallbackQueueTaskPrefix}:${string}` & {
  readonly __brand: unique symbol;
};

export function createTaskId(
  prefix: CallbackQueueTaskPrefix,
  id?: string,
): CallbackQueueTaskId {
  return `${prefix}:${id ?? "default"}` as CallbackQueueTaskId;
}

export type CallbackWithId = {
  callback: () => MaybePromise<void>;
  id: CallbackQueueTaskId;
};

class FastQueue {
  private queue: CallbackWithId[] = [];
  private idSet = new Set<CallbackQueueTaskId>();

  enqueue(item: CallbackWithId): void {
    if (this.idSet.has(item.id)) return;
    this.queue.push(item);
    this.idSet.add(item.id);
  }

  dequeue(): CallbackWithId | undefined {
    return this.queue.shift();
  }

  markProcessed(item: CallbackWithId): void {
    this.idSet.delete(item.id);
  }

  clear(): void {
    this.queue.length = 0;
    this.idSet.clear();
  }

  get isEmpty(): boolean {
    return this.queue.length === 0;
  }

  get length(): number {
    return this.queue.length;
  }
}

export class CallbackQueue {
  private static instance: CallbackQueue | null = null;
  private queue = new FastQueue();
  private isProcessing = false;
  private shouldStop = false;

  private constructor() {}

  static getInstance(): CallbackQueue {
    if (!CallbackQueue.instance) {
      CallbackQueue.instance = new CallbackQueue();
    }
    return CallbackQueue.instance;
  }

  public enqueueArray(callbacks: CallbackWithId[]): void {
    callbacks.forEach((item) => this.queue.enqueue(item));
    this.processQueue();
  }

  public enqueue(
    callback: () => MaybePromise<void>,
    id: CallbackQueueTaskId,
  ): void {
    this.queue.enqueue({ callback, id });
    this.processQueue();
  }

  private processQueue(): void {
    if (this.isProcessing) return;

    void this.processAllTasks();
  }

  private async processAllTasks(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.shouldStop = false;

    try {
      while (!this.queue.isEmpty && !this.shouldStop) {
        const item = this.queue.dequeue();
        if (!item) break;

        try {
          // Ensure we await the callback, regardless of whether it's sync or async
          await Promise.resolve(item.callback());
        } catch (error) {
          console.error("Error processing callback:", error);
        } finally {
          this.queue.markProcessed(item);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  public clear(): void {
    this.shouldStop = true;
    this.queue.clear();
    this.isProcessing = false;
  }
}
