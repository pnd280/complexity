import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";

export default function usePortalContainer() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    domObserverService.subscribe({
      id: createDomObserverId("thread", "imageGenPopper"),
      selector: `${DomSelectorsService.Root.cachedSync.THREAD.POPPER.DESKTOP} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.IMAGE_GEN.HEADER}`,
      onAdd: (node) => {
        setContainer(node as HTMLElement);
      },
      onRemove: () => {
        setContainer(null);
      },
      existingCheck: true,
    });

    return () => {
      domObserverService.unsubscribe(
        createDomObserverId("thread", "imageGenPopper"),
      );
    };
  }, []);

  return container;
}
