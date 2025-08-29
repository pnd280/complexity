import { homeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";
import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { whereAmI } from "@/utils/utils";

export function findSlogan() {
  if (whereAmI() !== "home") return;

  const $slogan = $(DomSelectorsService.cachedSync.HOME.SLOGAN);

  if (
    homeDomObserverStore.getState().$slogan != null &&
    (!$slogan.length ||
      $slogan.internalComponentAttr() ===
        DomSelectorsService.internalAttributes.HOME.SLOGAN)
  )
    return;

  $slogan.internalComponentAttr(
    DomSelectorsService.internalAttributes.HOME.SLOGAN,
  );

  homeDomObserverStore.setState({
    $slogan,
  });
}
