export const ThreadMessageIndexContext = createContext<number | null>(null);

export function ThreadMessageIndexContextProvider({
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
}

export function useThreadMessageIndexContext() {
  const context = use(ThreadMessageIndexContext);

  invariant(
    context !== null,
    "useThreadMessageIndexContext must be used within a ThreadMessageIndexContextProvider",
  );

  return context;
}
