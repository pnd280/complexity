import { domObserverService } from "@/plugins/__core__/dom-observers";
import { createDomObserverId } from "@/plugins/__core__/dom-observers/types";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

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
