import { ReactNode, createContext } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type ScopedQueryBoxContext = {
  focusModeIncludeFiles: boolean;
  setFocusModeIncludeFiles: (focusModeIncludeFiles: boolean) => void;
};

export const mainQueryBoxScopedContext = create<ScopedQueryBoxContext>()(
  immer((set) => ({
    focusModeIncludeFiles: true,
    setFocusModeIncludeFiles: (focusModeIncludeFiles) =>
      set({ focusModeIncludeFiles }),
  })),
);

export const followUpQueryBoxScopedContext = create<ScopedQueryBoxContext>()(
  immer((set) => ({
    focusModeIncludeFiles: true,
    setFocusModeIncludeFiles: (focusModeIncludeFiles) =>
      set({ focusModeIncludeFiles }),
  })),
);

type QueryBoxContext = {
  context: "main" | "follow-up";
  focusModeIncludeFiles: boolean;
  setFocusModeIncludeFiles: (focusModeIncludeFiles: boolean) => void;
};

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
  const { focusModeIncludeFiles, setFocusModeIncludeFiles } = context();

  return (
    <QueryBoxContext.Provider
      value={{
        context: contextType,
        focusModeIncludeFiles,
        setFocusModeIncludeFiles,
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
