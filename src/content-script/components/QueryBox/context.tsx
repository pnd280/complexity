/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext } from "react";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { FocusMode } from "@/content-script/components/QueryBox";
import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import { isValidFocus } from "@/types/model-selector.types";
import ChromeStorage from "@/utils/ChromeStorage";
import { extensionExec } from "@/utils/hof";

type ScopedQueryBoxContext = {
  type: "main" | "follow-up";
  focusMode: FocusMode["code"] | null;
  setFocusMode: (focusMode: FocusMode["code"] | null) => void;
  includeSpaceFiles: boolean;
  setIncludeSpaceFiles: (includeSpaceFiles: boolean) => void;
  includeOrgFiles: boolean;
  setIncludeOrgFiles: (includeOrgFiles: boolean) => void;
};

const createScopedQueryBoxContext = (type: "main" | "follow-up") =>
  createWithEqualityFn<ScopedQueryBoxContext>()(
    immer(
      (set, get): ScopedQueryBoxContext => ({
        type,
        focusMode: null,
        setFocusMode: (focusMode) => {
          if (get().type === "main") {
            ChromeStorage.setStorageValue({
              key: "defaultFocusMode",
              value: focusMode,
            });
          }

          return set({ focusMode });
        },
        includeSpaceFiles: false,
        setIncludeSpaceFiles: (includeSpaceFiles) => set({ includeSpaceFiles }),
        includeOrgFiles: false,
        setIncludeOrgFiles: (includeOrgFiles) => set({ includeOrgFiles }),
      }),
    ),
  );

export const mainQueryBoxStore = createScopedQueryBoxContext("main");
export const followUpQueryBoxStore = createScopedQueryBoxContext("follow-up");

export const QueryBoxContext = createContext<ScopedQueryBoxContext | null>(
  null,
);

const QueryBoxContextProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: typeof mainQueryBoxStore | typeof followUpQueryBoxStore;
}) => {
  const queryBoxStore = store();

  const {
    includeOrgFiles,
    setIncludeOrgFiles,
    includeSpaceFiles,
    setIncludeSpaceFiles,
  } = queryBoxStore;

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
    <QueryBoxContext.Provider value={queryBoxStore}>
      {children}
    </QueryBoxContext.Provider>
  );
};

export const MainQueryBoxContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <QueryBoxContextProvider store={mainQueryBoxStore}>
    {children}
  </QueryBoxContextProvider>
);

export const FollowUpQueryBoxContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <QueryBoxContextProvider store={followUpQueryBoxStore}>
    {children}
  </QueryBoxContextProvider>
);

async function initQueryBoxStore() {
  const { defaultFocusMode } = await ChromeStorage.getStore();
  if (isValidFocus(defaultFocusMode)) {
    mainQueryBoxStore.setState((state) => {
      state.focusMode = defaultFocusMode;
    });
  }
}

extensionExec(() => initQueryBoxStore())();
