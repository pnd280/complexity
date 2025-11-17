import { homeDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/home/store";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";

export function observeSlogan({ observerId }: { observerId: string }) {
  return domObserverService.subscribe({
    id: observerId,
    selector: DomSelectorsService.Root.cachedSync.HOME.SLOGAN,
    onAdd: (node) => {
      const $slogan = $(node as HTMLElement);

      if (!$slogan.length) return;

      $slogan.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.HOME.SLOGAN,
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
