import SortFilter from "@/plugins/command-menu/pages/threads/filters/SortFilter";
import SourceFilter from "@/plugins/command-menu/pages/threads/filters/SourceFilter";
import TemporaryThreadsFilter from "@/plugins/command-menu/pages/threads/filters/TemporaryThreadsFilter";
import TypeFilter from "@/plugins/command-menu/pages/threads/filters/TypeFilter";

export default function ThreadsSearchFilters() {
  return (
    <div className="x:sticky x:top-0 x:isolate x:z-10 x:flex x:items-center x:justify-between x:bg-background x:p-2">
      <div className="x:flex x:items-center x:justify-center x:gap-2">
        <SourceFilter />
        <TypeFilter />
        <TemporaryThreadsFilter />
      </div>
      <SortFilter />
    </div>
  );
}
