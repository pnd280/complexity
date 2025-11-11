import { useSidebarDomObserverStore } from "@/plugins/__core__/dom-observers/sidebar/store";

export default function usePortalContainer() {
  "use no memo";

  const nativeSidebarWrapper = useSidebarDomObserverStore(
    (store) => store.wrapper,
    deepEqual,
  );

  if (!nativeSidebarWrapper) return;

  const $existingContainer = $("#better-sidebar-container");

  if ($existingContainer.length) return $existingContainer[0];

  const $container = $("<div>");

  $container.attr("id", "better-sidebar-container");

  $(nativeSidebarWrapper).before($container);

  return $container[0];
}
