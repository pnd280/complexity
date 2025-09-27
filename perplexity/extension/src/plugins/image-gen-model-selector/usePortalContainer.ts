import { DomSelectorsService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";

export default function usePortalContainer() {
  const [wrapper, setWrapper] = useState<HTMLElement | null>(null);

  useEffect(() => {
    domObserverService.subscribe({
      id: createDomObserverId("thread", "imageGenPopper"),
      selector: `${DomSelectorsService.Root.cachedSync.THREAD.POPPER.DESKTOP} ${DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.IMAGE_GEN.HEADER}`,
      onAdd: (node) => {
        setWrapper(node as HTMLElement);
      },
      onRemove: () => {
        setWrapper(null);
      },
      existingCheck: true,
    });

    return () => {
      domObserverService.unsubscribe(
        createDomObserverId("thread", "imageGenPopper"),
      );
    };
  }, []);

  return wrapper;
}
