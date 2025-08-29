import type { ReactNode } from "react";
import { useImmer } from "use-immer";

import type { ThreadsSearchPayload } from "@/services/externals/pplx-api/pplx-api.types";

export type SourceValue = ThreadsSearchPayload["querySourceFilter"];
export type TypeValue = ThreadsSearchPayload["threadTypeFilter"];
export type WithTemporaryThreadValue =
  ThreadsSearchPayload["withTemporaryThreads"];
export type SortValue = ThreadsSearchPayload["ascending"];

export type ThreadsSearchFiltersState = ThreadsSearchPayload;

export type ThreadsSearchFiltersActions = {
  setSource: (value: SourceValue) => void;
  setType: (value: TypeValue) => void;
  setWithTemporaryThreads: (value: WithTemporaryThreadValue) => void;
  setSort: (value: SortValue) => void;
  reset: () => void;
};

export type ThreadsSearchFiltersContextValue = {
  state: ThreadsSearchFiltersState;
  actions: ThreadsSearchFiltersActions;
};

export const defaultFiltersState: ThreadsSearchFiltersState = {};

export const ThreadsSearchFiltersContext =
  createContext<ThreadsSearchFiltersContextValue | null>(null);

export function useThreadsSearchFilters() {
  const context = useContext(ThreadsSearchFiltersContext);

  if (!context) {
    throw new Error(
      "useThreadsSearchFilters must be used within a ThreadsSearchFiltersProvider",
    );
  }

  return context;
}
