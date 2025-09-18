import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import type { QueryBoxesDomObserverStoreType } from "@/plugins/_core/dom-observers/query-boxes/store";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { isLexical } from "@/plugins/_core/ui/groups/query-box/utils";

const OBSERVER_ID = "submit-on-ctrl-enter";

function isModifierEnterPressed(e: KeyboardEvent) {
  return e.key === "Enter" && (e.ctrlKey || e.metaKey);
}

function isTypeaheadMenuPresent() {
  return (
    $(getDomSelectorsRootService().cachedSync.QUERY_BOX.TYPEAHEAD_MENU).length >
    0
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

          e.stopPropagation();
        }
      });
    }
  });
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:submitOnCtrlEnter": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:submitOnCtrlEnter",
    dependencies: ["cache:pluginsStates", "cache:domSelectors"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["queryBox:submitOnCtrlEnter"]) return;

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
