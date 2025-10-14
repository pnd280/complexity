import { domObserverService } from "@/plugins/__core__/dom-observers";
import { createDomObserverId } from "@/plugins/__core__/dom-observers/types";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

const OBSERVER_ID = createDomObserverId("queryBoxes", "followUp:leftToolbar");

export default function useLeftToolbarPortalContainer() {
  const [llContainer, setLlContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    domObserverService.subscribe({
      id: OBSERVER_ID,
      selector: `${DomSelectorsService.Root.cplxAttribute(DomSelectorsService.Root.internalAttributes.QUERY_BOX.FOLLOW_UP_QUERY_BOX)} ${DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER} ${
        DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER_CHILD
          .LEFT_ATTR_WRAPPER
      }`,
      onAdd: (node) => {
        const $existingContainer = $(
          DomSelectorsService.Root.cplxAttribute(
            DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
              .CPLX_LEFT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
          ),
        );

        if ($existingContainer[0]) {
          setLlContainer($existingContainer[0]!);
          return;
        }

        const $leftAttrWrapper = $(node);

        $leftAttrWrapper.internalComponentAttr(
          DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
            .PPLX_LEFT_TOOLBAR_COMPONENTS_WRAPPER,
        );

        const $container = $("<div>")
          .addClass("x:[&:empty]:hidden x:flex x:items-center x:justify-center")
          .internalComponentAttr(
            DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
              .CPLX_LEFT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
          );

        $leftAttrWrapper.prepend($container);

        setLlContainer($container[0]!);
      },
      onRemove: () => {
        setLlContainer(null);
      },
      existingCheck: true,
    });

    return () => {
      domObserverService.unsubscribe(OBSERVER_ID);
    };
  }, []);

  return {
    ll: llContainer,
  };
}
