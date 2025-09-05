import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";

export default function usePortalContainer() {
  const popper = useThreadDomObserverStore(
    (state) => state.$popper?.[0] ?? null,
    deepEqual,
  );

  return useMemo(() => findOptionsGridHeader(popper), [popper]);
}

function findOptionsGridHeader(popper: HTMLElement | null) {
  if (!popper) return null;

  const $header = $(popper)
    .find(
      getDomSelectorsRootService().cachedSync.THREAD.MESSAGE.IMAGE_GEN
        .OPTIONS_GRID,
    )
    .prev();

  if (!$header.length) return null;

  return $header[0];
}
