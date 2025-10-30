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
  return use(ThreadMessageIndexContext);
}
