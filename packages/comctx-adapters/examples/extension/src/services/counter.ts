export class CounterService {
  private count = 0;
  private listeners: ((count: number) => void)[] = [];

  async increment() {
    this.count++;
    this.notifyListeners();
    return this.count;
  }

  async decrement() {
    this.count--;
    this.notifyListeners();
    return this.count;
  }

  async get() {
    return this.count;
  }

  async onChange(callback: (count: number) => void) {
    this.listeners.push(callback);

    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.count));
  }

  public cleanAllListeners() {
    this.listeners = [];
  }
}
