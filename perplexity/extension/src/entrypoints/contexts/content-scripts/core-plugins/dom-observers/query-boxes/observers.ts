import { queryBoxesDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/query-boxes/store";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";
import { whereAmI } from "@/utils/misc/utils";

export function observeMainQueryBox({ observerId }: { observerId: string }) {
  function cleanup() {
    queryBoxesDomObserverStore.getState().setWrapperNodes({
      main: null,
    });
    queryBoxesDomObserverStore.getState().setTextboxNodes({
      main: null,
    });
  }

  return domObserverService.subscribe({
    id: observerId,
    selector: DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.MAIN,
    onAdd: (node) => {
      if (whereAmI() !== "home" && whereAmI() !== "comet_ntp") {
        cleanup();
        return;
      }

      const $textbox = $(node as HTMLElement);

      const $wrapper = $textbox
        .parents(
          DomSelectorsService.Root.cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
        )
        .first();

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.QUERY_BOX.MAIN_QUERY_BOX,
      );

      $wrapper
        .find(DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER)
        .internalComponentAttr(
          DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
            .COMPONENTS_WRAPPER,
        );

      queryBoxesDomObserverStore.getState().setWrapperNodes({
        main: $wrapper[0],
      });
      queryBoxesDomObserverStore.getState().setTextboxNodes({
        main: $textbox[0],
      });
    },
    onRemove: cleanup,
    existingCheck: true,
  });
}

export function observeSpaceQueryBox({ observerId }: { observerId: string }) {
  function cleanup() {
    queryBoxesDomObserverStore.getState().setWrapperNodes({
      space: null,
    });
    queryBoxesDomObserverStore.getState().setTextboxNodes({
      space: null,
    });
  }

  return domObserverService.subscribe({
    id: observerId,
    selector: DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.SPACE,
    onAdd: (node) => {
      if (whereAmI() !== "collection") {
        cleanup();
        return;
      }

      const $textbox = $(node as HTMLElement);

      const $wrapper = $textbox
        .parents(
          DomSelectorsService.Root.cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
        )
        .first();

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.QUERY_BOX.SPACE_QUERY_BOX,
      );

      $wrapper
        .find(DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER)
        .internalComponentAttr(
          DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
            .COMPONENTS_WRAPPER,
        );

      queryBoxesDomObserverStore.getState().setWrapperNodes({
        space: $wrapper[0],
      });
      queryBoxesDomObserverStore.getState().setTextboxNodes({
        space: $textbox[0],
      });
    },
    onRemove: cleanup,
    existingCheck: true,
  });
}

export function observeFollowUpQueryBox({
  observerId,
}: {
  observerId: string;
}) {
  function cleanup() {
    if (whereAmI() === "thread") return;

    queryBoxesDomObserverStore.getState().setWrapperNodes({
      followUp: null,
    });
    queryBoxesDomObserverStore.getState().setTextboxNodes({
      followUp: null,
    });
  }

  return domObserverService.subscribe({
    id: observerId,
    selector: DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.FOLLOW_UP,
    onAdd: (node) => {
      if (whereAmI() !== "thread") {
        cleanup();
        return;
      }

      const $textbox = $(node as HTMLElement);

      const $wrapper = $textbox
        .parents(
          DomSelectorsService.Root.cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
        )
        .first();

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.QUERY_BOX
          .FOLLOW_UP_QUERY_BOX,
      );

      $wrapper
        .find(DomSelectorsService.Root.cachedSync.QUERY_BOX.ATTR_WRAPPER)
        .internalComponentAttr(
          DomSelectorsService.Root.internalAttributes.QUERY_BOX_CHILD
            .COMPONENTS_WRAPPER,
        );

      queryBoxesDomObserverStore.getState().setWrapperNodes({
        followUp: $wrapper[0],
      });
      queryBoxesDomObserverStore.getState().setTextboxNodes({
        followUp: $textbox[0],
      });
    },
    onRemove: cleanup,
    existingCheck: true,
  });
}

export function observeCometAssistantQueryBox({
  observerId,
}: {
  observerId: string;
}) {
  function cleanup() {
    if (whereAmI() === "comet_assistant") return;

    queryBoxesDomObserverStore.getState().setWrapperNodes({
      cometAssistant: null,
    });
    queryBoxesDomObserverStore.getState().setTextboxNodes({
      cometAssistant: null,
    });
  }

  return domObserverService.subscribe({
    id: observerId,
    selector:
      DomSelectorsService.Root.cachedSync.QUERY_BOX.TEXTBOX.COMET_ASSISTANT,
    onAdd: (node) => {
      if (whereAmI() !== "comet_assistant") {
        cleanup();
        return;
      }

      const $textbox = $(node as HTMLElement);

      const $wrapper = $textbox
        .parents(
          DomSelectorsService.Root.cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
        )
        .first();

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(
        DomSelectorsService.Root.internalAttributes.QUERY_BOX
          .COMET_ASSISTANT_QUERY_BOX,
      );

      queryBoxesDomObserverStore.getState().setWrapperNodes({
        cometAssistant: $wrapper[0],
      });
      queryBoxesDomObserverStore.getState().setTextboxNodes({
        cometAssistant: $textbox[0],
      });
    },
    onRemove: cleanup,
    existingCheck: true,
  });
}
