import { useQuery } from "@tanstack/react-query";

import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";

export default function Psa() {
  const { data } = useQuery(cplxApiQueries.psa.detail());

  return (
    <div
      id="psa"
      className="x:max-h-[250px] x:overflow-y-auto x:border-b x:bg-primary/10 x:p-4"
    >
      {data ? (
        <MarkdownRenderer markdown={data} className="x:text-foreground" />
      ) : (
        <div className="x:flex x:flex-col x:gap-4">
          <Skeleton className="x:h-8 x:w-1/3 x:bg-primary-foreground" />
          <Skeleton className="x:h-5 x:w-3/4 x:bg-primary-foreground" />
          <Skeleton className="x:h-5 x:w-1/2 x:bg-primary-foreground" />
        </div>
      )}
    </div>
  );
}
