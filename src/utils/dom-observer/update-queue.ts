import { UpdateTask } from '@/types/DOMObserver';

export class UpdateQueue {
  private queue: UpdateTask[] = [];
  private isProcessing = false;

  public enqueue(task: UpdateTask): void {
    this.queue.push(task);
    if (!this.isProcessing) {
      void this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error('Error processing task:', error);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    this.isProcessing = false;
  }
}
