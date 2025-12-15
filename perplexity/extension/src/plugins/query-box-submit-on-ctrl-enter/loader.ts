import {
  queryBoxesDomObserverStore,
  type QueryBoxesDomObserverStoreType,
} from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/query-boxes/store";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { isLexical } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/utils";

const OBSERVER_ID = "submit-on-ctrl-enter";

function isModifierEnterPressed(e: KeyboardEvent) {
  return e.key === "Enter" && (e.ctrlKey || e.metaKey);
}

function isTypeaheadMenuPresent() {
  return (
    $(DomSelectorsService.Root.cachedSync.QUERY_BOX.TYPEAHEAD_MENU).length > 0
  );
}

function submitOnCtrlEnter(
  queryBoxTextboxes: QueryBoxesDomObserverStoreType["textbox"],
) {
  Object.values(queryBoxTextboxes).forEach((textbox) => {
    if (!textbox) return;

    const $textbox = $(textbox);

    if (!$textbox.length || $textbox.attr(OBSERVER_ID)) return;

    $textbox.attr(OBSERVER_ID, "true");

    if (isLexical(textbox)) {
      textbox.addEventListener(
        "keydown",
        function (e) {
          if (e.key === "Enter") {
            if (isModifierEnterPressed(e) || isTypeaheadMenuPresent())
              return true;

            if (e.shiftKey) {
              return true;
            }

            e.stopPropagation();
            return false;
          }

          return true;
        },
        true,
      );
    } else {
      $textbox.on("keydown", (e) => {
        if (e.key === "Enter") {
          if (
            isModifierEnterPressed(e as unknown as KeyboardEvent) ||
            isTypeaheadMenuPresent()
          )
            return;

          if ((e as unknown as KeyboardEvent).shiftKey) {
            return;
          }

          e.stopPropagation();
        }
      });
    }
  });
}

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:submitOnCtrlEnter": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:submitOnCtrlEnter",
    dependencies: ["cache:pluginsEnableStatesV2", "cache:domSelectors"],
    loader: ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      if (!pluginsEnableStates["queryBox:submitOnCtrlEnter"]) return;

      queryBoxesDomObserverStore.subscribe(
        (store) => ({
          main: store.textbox.main,
          space: store.textbox.space,
          followUp: store.textbox.followUp,
          cometAssistant: store.textbox.cometAssistant,
        }),
        ({ main, space, followUp, cometAssistant }) => {
          submitOnCtrlEnter({
            main,
            space,
            followUp,
            cometAssistant,
          });
        },
        {
          equalityFn: deepEqual,
        },
      );
    },
  });
}
