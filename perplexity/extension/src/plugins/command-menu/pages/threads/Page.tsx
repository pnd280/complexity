import type { ThreadsSearchPayload } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import CommandPage from "@/plugins/command-menu/components/CommandPage";
import { ThreadsSearchFiltersProvider } from "@/plugins/command-menu/pages/threads/filters/ContextProvider";
import ThreadsSearchFilters from "@/plugins/command-menu/pages/threads/filters/Index";
import ThreadCommandItems from "@/plugins/command-menu/pages/threads/ThreadCommandItems";

declare module "@/plugins/command-menu/store/slices/pages/types" {
  interface CommandMenuPagesArgsRegistry {
    threads: ThreadsSearchPayload;
  }
}

export default function ThreadsPage() {
  return (
    <CommandPage pageId="threads">
      <ThreadsSearchFiltersProvider>
        <ThreadsSearchFilters />
        <ThreadCommandItems />
      </ThreadsSearchFiltersProvider>
    </CommandPage>
  );
}
