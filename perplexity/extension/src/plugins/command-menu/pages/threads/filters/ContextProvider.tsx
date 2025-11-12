import type { ReactNode } from "react";
import { useMutative } from "use-mutative";

import {
  defaultFiltersState,
  ThreadsSearchFiltersContext,
  type SortValue,
  type SourceValue,
  type ThreadsSearchFiltersState,
  type TypeValue,
  type WithTemporaryThreadValue,
} from "@/plugins/command-menu/pages/threads/filters/context";

export function ThreadsSearchFiltersProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, updateState] =
    useMutative<ThreadsSearchFiltersState>(defaultFiltersState);

  const actions = {
    setSource: (value: SourceValue) => {
      updateState((draft) => {
        draft.querySourceFilter = value;
      });
    },
    setType: (value: TypeValue) => {
      updateState((draft) => {
        draft.threadTypeFilter = value;
      });
    },
    setWithTemporaryThreads: (value: WithTemporaryThreadValue) => {
      updateState((draft) => {
        draft.withTemporaryThreads = value;
      });
    },
    setSort: (value: SortValue) => {
      updateState((draft) => {
        draft.ascending = value;
      });
    },
    reset: () => {
      updateState(defaultFiltersState);
    },
  };

  return (
    <ThreadsSearchFiltersContext value={{ state, actions }}>
      {children}
    </ThreadsSearchFiltersContext>
  );
}
