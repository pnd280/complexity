import { UpdateTask } from '@/types/DOMObserver';

class Node {
  constructor(
    public task: UpdateTask,
    public next: Node | null = null
  ) {}
}

export class UpdateQueue {
  private head: Node | null = null;
  private tail: Node | null = null;
  private isProcessing = false;

  public enqueue(task: UpdateTask): void {
    const newNode = new Node(task);
    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    if (!this.isProcessing) {
      void this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.head) {
      const task = this.head.task;
      this.head = this.head.next;
      if (!this.head) this.tail = null;

      try {
        await task();
      } catch (error) {
        console.error('Error processing task:', error);
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    this.isProcessing = false;
  }
}
