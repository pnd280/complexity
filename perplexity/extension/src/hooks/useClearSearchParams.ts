import { useSearchParams } from "react-router-dom";

export default function useClearSearchParams({
  enabled,
  params,
}: {
  enabled: boolean;
  params?: string[] | null;
}) {
  const [_, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!enabled) return;

    if (params == null) {
      setSearchParams(new URLSearchParams(), {
        replace: true,
      });
    } else {
      setSearchParams(
        (currentSearchParams) => {
          const newSearchParams = new URLSearchParams(currentSearchParams);
          params.forEach((param) => {
            newSearchParams.delete(param);
          });
          return newSearchParams;
        },
        {
          replace: true,
        },
      );
    }
  }, [enabled, params, setSearchParams]);
}
