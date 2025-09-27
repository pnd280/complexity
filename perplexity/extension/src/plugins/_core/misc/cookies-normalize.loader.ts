import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getCookie, setCookie } from "@/utils/dom-utils/generics";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:cookiesNormalization": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "plugin:cookiesNormalization",
    dependencies: [],
    loader: () => {
      deepResearchTooltipImpressions();

      unifiedEngineTooltip();

      labsTooltip();
    },
  });
}

function deepResearchTooltipImpressions() {
  const pplxDeepResearchTooltipImpression = getCookie(
    "pplx.deep-research-tooltip-impressions",
  );

  if (
    pplxDeepResearchTooltipImpression == null ||
    Number(pplxDeepResearchTooltipImpression) < 10
  ) {
    setCookie("pplx.deep-research-tooltip-impressions", "999", 365);
  }
}

function unifiedEngineTooltip() {
  const pplxUnifiedEngineTooltip = getCookie(
    "pplx.unified-engine-tooltip-shown",
  );

  if (pplxUnifiedEngineTooltip !== "true") {
    setCookie("pplx.unified-engine-tooltip-shown", "true", 365);
  }
}

function labsTooltip() {
  const segmentedControlPopoverStudio = getCookie(
    "segmented-control-popover-studio",
  );

  if (
    segmentedControlPopoverStudio == null ||
    Number(segmentedControlPopoverStudio) < 5
  ) {
    setCookie("segmented-control-popover-studio", "999", 365);
  }
}
