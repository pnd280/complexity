import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { domObserverService } from "@/services/features/dom-observer";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { whereAmI } from "@/utils/utils";

const OBSERVER_ID = {
  MAIN_QUERY_BOX: "cplx-main-query-box",
  SPACE_QUERY_BOX: "cplx-space-query-box",
  FOLLOW_UP_QUERY_BOX: "cplx-follow-up-query-box",
};

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
    selector: getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.MAIN,
    onAdd: (node) => {
      if (whereAmI() !== "home" && whereAmI() !== "comet_ntp") {
        cleanup();
        return;
      }

      const $textbox = $(node as HTMLElement);

      const $wrapper = $textbox
        .parents(
          getDomSelectorsRootService().cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
        )
        .first();

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(OBSERVER_ID.MAIN_QUERY_BOX);

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
    selector: getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.SPACE,
    onAdd: (node) => {
      if (whereAmI() !== "collection") {
        cleanup();
        return;
      }

      const $textbox = $(node as HTMLElement);

      const $wrapper = $textbox
        .parents(
          getDomSelectorsRootService().cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
        )
        .first();

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(OBSERVER_ID.SPACE_QUERY_BOX);

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
    queryBoxesDomObserverStore.getState().setWrapperNodes({
      followUp: null,
    });
    queryBoxesDomObserverStore.getState().setTextboxNodes({
      followUp: null,
    });
  }

  return domObserverService.subscribe({
    id: observerId,
    selector:
      getDomSelectorsRootService().cachedSync.QUERY_BOX.TEXTBOX.FOLLOW_UP,
    onAdd: (node) => {
      if (whereAmI() !== "thread") {
        cleanup();
        return;
      }

      const $textbox = $(node as HTMLElement);

      const $wrapper = $textbox
        .parents(
          getDomSelectorsRootService().cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
        )
        .first();

      if (!$wrapper.length) return;

      $wrapper.internalComponentAttr(OBSERVER_ID.FOLLOW_UP_QUERY_BOX);

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
