export const ThreadMessageIndexContext = createContext<number>(0);

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
  return use(ThreadMessageIndexContext);
}
