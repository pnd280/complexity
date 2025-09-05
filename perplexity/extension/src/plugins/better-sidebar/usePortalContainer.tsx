import { useSidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";

export default function usePortalContainer() {
  const nativeSidebarWrapper = useSidebarDomObserverStore(
    (store) => store.wrapper,
    deepEqual,
  );

  return useMemo(() => {
    if (!nativeSidebarWrapper) return null;

    const $existingContainer = $("#better-sidebar-container");

    if ($existingContainer.length) {
      return $existingContainer[0];
    }

    const $container = $("<div>");

    $container.attr("id", "better-sidebar-container");

    $(nativeSidebarWrapper).before($container);

    return $container[0];
  }, [nativeSidebarWrapper]);
}
