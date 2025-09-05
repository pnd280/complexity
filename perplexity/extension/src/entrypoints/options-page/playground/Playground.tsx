import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";

type CountStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

const CounterContext = createContext<StoreApi<CountStore> | null>(null);

function CounterDisplay() {
  const countStore = useContext(CounterContext);
  if (!countStore)
    throw new Error("CounterDisplay must be used within CounterProvider");
  const { count } = useStore(countStore);

  return (
    <div className="text-2xl font-bold text-center mb-4">
      <span className="text-blue-600">Count: </span>
      <span className="text-gray-800">{count}</span>
    </div>
  );
}

function CounterControls() {
  const countStore = useContext(CounterContext);
  if (!countStore)
    throw new Error("CounterControls must be used within CounterProvider");
  const { increment, decrement } = useStore(countStore);

  return (
    <div className="flex gap-2 justify-center mb-4">
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        onClick={decrement}
      >
        -
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        onClick={increment}
      >
        +
      </button>
    </div>
  );
}

function CounterReset() {
  const countStore = useContext(CounterContext);
  if (!countStore)
    throw new Error("CounterReset must be used within CounterProvider");
  const { reset, count } = useStore(countStore);

  return (
    <div className="text-center">
      <button
        disabled={count === 0}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={reset}
      >
        Reset
      </button>
    </div>
  );
}

function Counter() {
  const [countStore] = useState(() =>
    createStore<CountStore>((set) => ({
      count: 0,
      increment: () =>
        set((state: { count: number }) => ({ count: state.count + 1 })),
      decrement: () =>
        set((state: { count: number }) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    })),
  );

  return (
    <CounterContext.Provider value={countStore}>
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
        <CounterDisplay />
        <CounterControls />
        <CounterReset />
      </div>
    </CounterContext.Provider>
  );
}

export function Playground() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Counter />
      <Counter />
    </div>
  );
}
