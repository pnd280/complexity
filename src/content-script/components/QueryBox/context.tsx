import { ReactNode, createContext } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { useQueryBoxStore } from "@/content-script/session-store/query-box";

type ScopedQueryBoxContext = {
  includeSpaceFiles: boolean;
  setIncludeSpaceFiles: (includeSpaceFiles: boolean) => void;
  includeOrgFiles: boolean;
  setIncludeOrgFiles: (includeOrgFiles: boolean) => void;
};

export const mainQueryBoxScopedContext = create<ScopedQueryBoxContext>()(
  immer((set) => ({
    includeSpaceFiles: false,
    setIncludeSpaceFiles: (includeSpaceFiles) => set({ includeSpaceFiles }),
    includeOrgFiles: false,
    setIncludeOrgFiles: (includeOrgFiles) => set({ includeOrgFiles }),
  })),
);

export const followUpQueryBoxScopedContext = create<ScopedQueryBoxContext>()(
  immer((set) => ({
    includeSpaceFiles: false,
    setIncludeSpaceFiles: (includeSpaceFiles) => set({ includeSpaceFiles }),
    includeOrgFiles: false,
    setIncludeOrgFiles: (includeOrgFiles) => set({ includeOrgFiles }),
  })),
);

type QueryBoxContext = {
  context: "main" | "follow-up";
} & ScopedQueryBoxContext;

export const QueryBoxContext = createContext<QueryBoxContext | null>(null);

const QueryBoxContextProvider = ({
  children,
  contextType,
  context,
}: {
  children: ReactNode;
  contextType: "main" | "follow-up";
  context:
    | typeof mainQueryBoxScopedContext
    | typeof followUpQueryBoxScopedContext;
}) => {
  const {
    includeSpaceFiles,
    setIncludeSpaceFiles,
    includeOrgFiles,
    setIncludeOrgFiles,
  } = context();

  const selectedSpaceUuid = useQueryBoxStore(
    ({ selectedSpaceUuid }) => selectedSpaceUuid,
  );

  useEffect(() => {
    if (selectedSpaceUuid) {
      setIncludeOrgFiles(false);
      setIncludeSpaceFiles(true);
    }

    if (!selectedSpaceUuid) {
      setIncludeSpaceFiles(false);
    }
  }, [setIncludeSpaceFiles, setIncludeOrgFiles, selectedSpaceUuid]);

  useEffect(() => {
    if (includeOrgFiles) setIncludeSpaceFiles(false);
  }, [includeOrgFiles, setIncludeSpaceFiles]);

  useEffect(() => {
    if (includeSpaceFiles) setIncludeOrgFiles(false);
  }, [includeSpaceFiles, setIncludeOrgFiles]);

  return (
    <QueryBoxContext.Provider
      value={{
        context: contextType,
        includeSpaceFiles,
        setIncludeSpaceFiles,
        includeOrgFiles,
        setIncludeOrgFiles,
      }}
    >
      {children}
    </QueryBoxContext.Provider>
  );
};

export const MainQueryBoxContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <QueryBoxContextProvider
    contextType="main"
    context={mainQueryBoxScopedContext}
  >
    {children}
  </QueryBoxContextProvider>
);

export const FollowUpQueryBoxContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <QueryBoxContextProvider
    contextType="follow-up"
    context={followUpQueryBoxScopedContext}
  >
    {children}
  </QueryBoxContextProvider>
);
