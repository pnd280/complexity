import { invariant } from "@/utils/utils";

export const ThreadMessageContext = createContext<{
  messageBlockIndex: number;
}>({
  messageBlockIndex: 0,
});

export function useThreadMessageContext() {
  const context = use(ThreadMessageContext);

  invariant(
    context != null,
    "useThreadMessageContext must be used within a ThreadMessageContextProvider",
  );

  return context;
}
