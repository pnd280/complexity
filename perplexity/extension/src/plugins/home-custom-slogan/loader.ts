import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { homeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { homeCustomSloganCssResourceConfig } from "@/plugins/home-custom-slogan/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { insertCss, whereAmI } from "@/utils/utils";

let removeCss: (() => void) | null = null;

async function setupCustomSlogan({
  location,
  slogan,
}: {
  location: ReturnType<typeof whereAmI>;
  slogan: HTMLElement | null;
}) {
  const sloganText =
    ExtensionSettingsService.cachedSync.plugins["home:customSlogan"].slogan;

  if (sloganText.length <= 0) return;

  if (location !== "home" || slogan == null) return removeCss?.();

  removeCss = insertCss({
    css: await getVersionedRemoteResource(homeCustomSloganCssResourceConfig),
    id: "custom-slogan",
  });

  const $slogan = $(slogan);

  if (!$slogan.length) return;

  $slogan.attr(
    getDomSelectorsRootService().internalAttributes.HOME.SLOGAN,
    "true",
  );

  const $sloganContent = $("<span>").html(sloganText);

  $sloganContent
    .addClass(
      "x:text-balance x:text-3xl x:md:text-4xl x:animate-in x:fade-in-0",
    )
    .attr(
      `${getDomSelectorsRootService().internalAttributes.HOME.SLOGAN}-content`,
      "true",
    );

  $slogan.append($sloganContent);
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:home:customSlogan": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:home:customSlogan",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["home:customSlogan"]) return;

      homeDomObserverStore.subscribe(
        (store) => store.slogan,
        (slogan) => {
          if (!slogan || document.body.contains(slogan)) return;
          setupCustomSlogan({ location: whereAmI(), slogan });
        },
      );
    },
  });
}
