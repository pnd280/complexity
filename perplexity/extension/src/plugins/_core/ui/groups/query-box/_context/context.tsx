import type { ScopedQueryBoxStoreType } from "@/plugins/_core/ui/groups/query-box/_context/scoped-store";
import { createQueryBoxScopedStore } from "@/plugins/_core/ui/groups/query-box/_context/scoped-store";

type ScopedQueryBoxContext = {
  store: ScopedQueryBoxStoreType;
};

export const ScopedQueryBoxContext =
  createContext<ScopedQueryBoxContext | null>(null);

export const ScopedQueryBoxContextProvider = ({
  children,
  storeValue,
}: {
  children: React.ReactNode;
  storeValue: ScopedQueryBoxStoreType;
}) => {
  const [store] = useState(() => createQueryBoxScopedStore(storeValue));

  useEffect(() => {
    store.setState(storeValue);
  }, [store, storeValue]);

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
