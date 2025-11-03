import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { homeDomObserverStore } from "@/plugins/__core__/dom-observers/home/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import { homeCustomSloganCssResourceConfig } from "@/plugins/home-custom-slogan/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { insertCss } from "@/utils/dom-utils/generics";
import { whereAmI } from "@/utils/misc/utils";

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
    css: await getVersionedRemoteResource(
      homeCustomSloganCssResourceConfig,
      persistentQueryClient,
    ),
    id: "custom-slogan",
  });

  const $slogan = $(slogan);

  if (!$slogan.length) return;

  $slogan.attr(DomSelectorsService.Root.internalAttributes.HOME.SLOGAN, "true");

  const $sloganContent = $("<span>").html(sloganText);

  $sloganContent
    .addClass(
      "x:text-balance x:text-3xl x:md:text-4xl x:animate-in x:fade-in-0",
    )
    .attr(
      `${DomSelectorsService.Root.internalAttributes.HOME.SLOGAN}-content`,
      "true",
    );

  $slogan.append($sloganContent);
}

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:home:customSlogan": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:home:customSlogan",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["home:customSlogan"]) return;

      homeDomObserverStore.subscribe(
        (store) => store.slogan,
        (slogan) => {
          if (!slogan || !document.body.contains(slogan)) return;
          void setupCustomSlogan({ location: whereAmI(), slogan });
        },
      );
    },
  });
}
