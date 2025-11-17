import type { QueryBoxType } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/types";

type ScopedQueryBoxStore = {
  type: QueryBoxType;
};

type ScopedQueryBoxContext = {
  store: ScopedQueryBoxStore;
};

export const ScopedQueryBoxContext =
  createContext<ScopedQueryBoxContext | null>(null);

export const ScopedQueryBoxContextProvider = ({
  children,
  storeValue,
}: {
  children: React.ReactNode;
  storeValue: ScopedQueryBoxStore;
}) => {
  return (
    <ScopedQueryBoxContext
      value={{
        store: storeValue,
      }}
    >
      {children}
    </ScopedQueryBoxContext>
  );
};

export function useScopedQueryBoxContext() {
  const context = use(ScopedQueryBoxContext);
  if (!context) {
    throw new Error(
      "useScopedQueryBoxContext must be used within ScopedQueryBoxContextProvider",
    );
  }
  return context;
}
