import type { OmitKeyof } from "@tanstack/react-query";

import type { ThreadsSearchPayload } from "@/services/externals/pplx-api/pplx-api.types";

export type SourceValue = ThreadsSearchPayload["querySourceFilter"];
export type TypeValue = ThreadsSearchPayload["threadTypeFilter"];
export type WithTemporaryThreadValue =
  ThreadsSearchPayload["withTemporaryThreads"];
export type SortValue = ThreadsSearchPayload["ascending"];

export type ThreadsSearchFiltersState = OmitKeyof<
  ThreadsSearchPayload,
  "limit" | "offset" | "searchValue"
>;

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

export const defaultFiltersState: ThreadsSearchFiltersState = {
  withTemporaryThreads: true,
};

export const ThreadsSearchFiltersContext =
  createContext<ThreadsSearchFiltersContextValue | null>(null);

export function useThreadsSearchFilters() {
  const context = use(ThreadsSearchFiltersContext);

  invariant(
    context != null,
    "useThreadsSearchFilters must be used within a ThreadsSearchFiltersProvider",
  );

  return context;
}
