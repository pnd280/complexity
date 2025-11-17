import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import type { DomSelectors } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";
import type { MaybePromise } from "@/types/utils.types";
import { waitForSpaIdle } from "@/utils/dom-utils/generics";
import type { whereAmI } from "@/utils/misc/utils";

export const locationWaits: Partial<
  Record<ReturnType<typeof whereAmI>, () => MaybePromise<boolean>>
> = (() => {
  let domSelectorsPromise: Promise<DomSelectors> | null = null;
  function getDomSelectors() {
    if (!domSelectorsPromise) {
      domSelectorsPromise = DomSelectorsService.Proxy.getCache();
    }
    return domSelectorsPromise;
  }

  async function checkThreadLoaded() {
    await waitForSpaIdle();
    return true;
  }

  async function checkHomeLoaded() {
    const domSelectors = await getDomSelectors();
    return $(domSelectors.HOME.SLOGAN).length > 0;
  }

  async function checkCometNtpLoaded() {
    const domSelectors = await getDomSelectors();
    return $(domSelectors.HOME.COMET_HOME_MAIN_WRAPPER).length > 0;
  }

  return {
    thread: checkThreadLoaded,
    home: checkHomeLoaded,
    comet_ntp: checkCometNtpLoaded,
  };
})();
