import { homeDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/home/store";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import { homeCustomSloganCssResourceConfig } from "@/plugins/home-custom-slogan/index.remote-resources";
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
    PluginsSettingSnapshotsService.getPluginSnapshot(
      "home:customSlogan",
    ).slogan;

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

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:home:customSlogan": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:home:customSlogan",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader: ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
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
