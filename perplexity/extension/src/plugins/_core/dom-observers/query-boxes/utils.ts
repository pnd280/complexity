import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { isInternalNodeExists } from "@/plugins/_core/dom-observers/utils";
import { getActiveQueryBox } from "@/plugins/_core/ui/groups/query-box/utils";
import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { whereAmI } from "@/utils/utils";

const OBSERVER_ID = {
  MAIN_QUERY_BOX: "cplx-main-query-box",
  SPACE_QUERY_BOX: "cplx-space-query-box",
  FOLLOW_UP_QUERY_BOX: "cplx-follow-up-query-box",
};

export function findMainQueryBox() {
  if (whereAmI() !== "home" && whereAmI() !== "comet_ntp") {
    queryBoxesDomObserverStore.getState().setWrapperNodes({
      main: null,
    });

    queryBoxesDomObserverStore.getState().setTextboxNodes({
      main: null,
    });

    return;
  }

  const existingMainQueryBox =
    queryBoxesDomObserverStore.getState().wrapper.main;

  if (
    existingMainQueryBox != null &&
    isInternalNodeExists({
      node: existingMainQueryBox,
      selector: `[${OBSERVER_ID.MAIN_QUERY_BOX}]`,
    })
  )
    return;

  const $mainQueryBoxTextbox = getActiveQueryBox({ type: "main" });

  if (!$mainQueryBoxTextbox.length) return;

  $mainQueryBoxTextbox.attr(OBSERVER_ID.MAIN_QUERY_BOX, "true");

  queryBoxesDomObserverStore.getState().setWrapperNodes({
    main: $mainQueryBoxTextbox[0],
  });

  queryBoxesDomObserverStore.getState().setTextboxNodes({
    main: $mainQueryBoxTextbox.find(
      DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.MAIN,
    )[0],
  });
}

export function findSpaceQueryBox() {
  if (whereAmI() !== "collection") {
    queryBoxesDomObserverStore.getState().setWrapperNodes({
      space: null,
    });

    queryBoxesDomObserverStore.getState().setTextboxNodes({
      space: null,
    });

    return;
  }

  const existingSpaceQueryBox =
    queryBoxesDomObserverStore.getState().wrapper.space;

  if (
    existingSpaceQueryBox != null &&
    isInternalNodeExists({
      node: existingSpaceQueryBox,
      selector: `[${OBSERVER_ID.SPACE_QUERY_BOX}]`,
    })
  )
    return;

  const $spaceQueryBox = getActiveQueryBox({
    type: "space",
  });

  if (!$spaceQueryBox.length) return;

  $spaceQueryBox.attr(OBSERVER_ID.SPACE_QUERY_BOX, "true");

  queryBoxesDomObserverStore.getState().setWrapperNodes({
    space: $spaceQueryBox[0],
  });

  queryBoxesDomObserverStore.getState().setTextboxNodes({
    space: $spaceQueryBox.find(
      DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.SPACE,
    )[0],
  });
}

export async function findFollowUpQueryBox() {
  if (whereAmI() !== "thread") {
    queryBoxesDomObserverStore.getState().setWrapperNodes({
      followUp: null,
    });

    queryBoxesDomObserverStore.getState().setTextboxNodes({
      followUp: null,
    });

    return;
  }

  const existingFollowUpQueryBox =
    queryBoxesDomObserverStore.getState().wrapper.followUp;

  if (
    existingFollowUpQueryBox != null &&
    isInternalNodeExists({
      node: existingFollowUpQueryBox,
      selector: `[${OBSERVER_ID.FOLLOW_UP_QUERY_BOX}]`,
    })
  )
    return;

  const $followUpQueryBox = getActiveQueryBox({
    type: "follow-up",
  });

  // Assume that the follow up query box is always visible in a thread, loop until it's visible
  if (!$followUpQueryBox.length) {
    await sleep(200);
    CallbackQueue.getInstance().enqueue(
      findFollowUpQueryBox,
      createTaskId("queryBoxes", "followUp"),
    );
    return;
  }

  $followUpQueryBox.attr(OBSERVER_ID.FOLLOW_UP_QUERY_BOX, "true");

  queryBoxesDomObserverStore.getState().setWrapperNodes({
    followUp: $followUpQueryBox[0],
  });

  queryBoxesDomObserverStore.getState().setTextboxNodes({
    followUp: $followUpQueryBox.find(
      DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.FOLLOW_UP,
    )[0],
  });
}
