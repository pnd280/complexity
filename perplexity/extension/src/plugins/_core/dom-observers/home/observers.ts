import { homeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";

export function observeSlogan({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector: getDomSelectorsRootService().cachedSync.HOME.SLOGAN,
    onAdd: (node) => {
      const $slogan = $(node as HTMLElement);

      if (!$slogan.length) return;

      $slogan.internalComponentAttr(
        getDomSelectorsRootService().internalAttributes.HOME.SLOGAN,
      );

      homeDomObserverStore.setState({
        slogan: $slogan[0],
      });
    },
    onRemove: () => {
      homeDomObserverStore.setState({
        slogan: null,
      });
    },
    existingCheck: true,
  });
}
