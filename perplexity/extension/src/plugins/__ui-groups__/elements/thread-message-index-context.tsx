import { invariant } from "@/utils/misc/utils";

export const ThreadMessageIndexContext = createContext<number>(0);

export const ThreadMessageIndexContextProvider = memo(
  function ThreadMessageIndexContextProvider({
    messageBlockIndex,
    children,
  }: {
    messageBlockIndex: number;
    children: React.ReactNode;
  }) {
    return (
      <ThreadMessageIndexContext value={messageBlockIndex}>
        {children}
      </ThreadMessageIndexContext>
    );
  },
);

export function useThreadMessageIndexContext() {
  const context = use(ThreadMessageIndexContext);

  invariant(
    context != null,
    "useThreadMessageIndexContext must be used within a ThreadMessageIndexContextProvider",
  );

  return context;
}
