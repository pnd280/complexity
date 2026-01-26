import { useQuery } from "@tanstack/react-query";

import MarkdownRenderer from "@/components/MarkdownRenderer";
import { persistentQueryClient } from "@/entrypoints/contexts/options-page/services/persistent-query-client";
import { cplxApiQueries } from "@/entrypoints/services/externals/cplx-api/query-keys";

export default function Psa() {
  const { data } = useQuery(cplxApiQueries.psa.detail());

  useEffect(() => {
    void persistentQueryClient.persist();
  }, [data]);

  if (data == null || data.length === 0) return null;

  return (
    <div
      id="psa"
      className="x:hidden x:max-h-[250px] x:overflow-y-auto x:border-b x:bg-primary/10 x:p-4 x:md:block"
    >
      <MarkdownRenderer markdown={data} className="x:text-foreground" />
    </div>
  );
}
