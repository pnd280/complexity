import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import { homeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";
import { whereAmI } from "@/utils/utils";

export function findSlogan() {
  if (whereAmI() !== "home") return;

  const $slogan = $(getDomSelectorsRootService().cachedSync.HOME.SLOGAN);

  if (
    homeDomObserverStore.getState().$slogan != null &&
    (!$slogan.length ||
      $slogan.internalComponentAttr() ===
        getDomSelectorsRootService().internalAttributes.HOME.SLOGAN)
  )
    return;

  $slogan.internalComponentAttr(
    getDomSelectorsRootService().internalAttributes.HOME.SLOGAN,
  );

  homeDomObserverStore.setState({
    $slogan,
  });
}
