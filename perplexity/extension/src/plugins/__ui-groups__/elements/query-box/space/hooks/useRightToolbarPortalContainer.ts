import { domObserverService } from "@/plugins/__core__/dom-observers";
import { createDomObserverId } from "@/plugins/__core__/dom-observers/types";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";

const OBSERVER_ID = createDomObserverId("queryBoxes", "space:rightToolbar");

export default function useRightToolbarPortalContainer() {
  const [rlContainer, setRlContainer] = useState<HTMLElement | null>(null);
  const [rrContainer, setRrContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    domObserverService.subscribe({
      id: OBSERVER_ID,
      selector: `${DomSelectorsService.Root.cplxAttribute(DomSelectorsService.Root.internalAttributes.QUERY_BOX.SPACE_QUERY_BOX)} ${DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER} ${
        DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER_CHILD
          .RIGHT_ATTR_WRAPPER
      }`,
      onAdd: (node) => {
        (function findOrCreateRlContainer() {
          const $existingContainer = $(
            DomSelectorsService.Root.cplxAttribute(
              DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
                .CPLX_RIGHT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
            ),
          );

          if ($existingContainer[0]) {
            setRlContainer($existingContainer[0]!);
            return;
          }

          const $rightAttrWrapper = $(node);

          $rightAttrWrapper.internalComponentAttr(
            DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
              .PPLX_RIGHT_TOOLBAR_COMPONENTS_WRAPPER,
          );

          const $container = $("<div>")
            .addClass(
              "x:[&:empty]:hidden x:flex x:items-center x:justify-center",
            )
            .internalComponentAttr(
              DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
                .CPLX_RIGHT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
            );

          $rightAttrWrapper.prepend($container);

          setRlContainer($container[0]!);
        })();
      },
      onRemove: () => {
        setRlContainer(null);
        setRrContainer(null);
      },
      existingCheck: true,
    });

    return () => {
      domObserverService.unsubscribe(OBSERVER_ID);
    };
  }, []);

  return {
    rl: rlContainer,
    rr: rrContainer,
  };
}
