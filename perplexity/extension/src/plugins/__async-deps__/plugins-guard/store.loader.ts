import { QueryObserver } from "@tanstack/react-query";

import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import {
  pluginGuardsStore,
  type PluginGuardsStoreType,
} from "@/plugins/__async-deps__/plugins-guard/store";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import type { PplxAuthSessionApiResponse } from "@/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { getPermissions } from "@/services/infra/extension-api-wrappers/extension-permissions/utils";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";
import { queryClient } from "@/services/infra/query-client";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "store:pluginGuards": PluginGuardsStoreType;
  }
}

export const pplxAuthQueryObserver = new QueryObserver(
  queryClient,
  pplxApiQueries.auth.detail(),
);

export const pplxAuthOrgStatusQueryObserver = new QueryObserver(
  queryClient,
  pplxApiQueries.auth.orgStatus.detail(),
);

export default function () {
  AsyncLoaderRegistry.register({
    id: "store:pluginGuards",
    dependencies: ["cache:extensionSettings"],
    loader: async ({ "cache:extensionSettings": extensionSettings }) => {
      // pluginGuardsStore.subscribe((state) => console.log(state));

      setupLocationTracking();
      setupMobileStateSubscription();
      setupAuthenticationTracking(extensionSettings);

      await setupPermissionsTracking();

      return pluginGuardsStore.getState();
    },
  });
}

function setupLocationTracking() {
  pluginGuardsStore.setState((state) => {
    state.currentLocation = whereAmI();
  });

  spaRouteChangeCompleteSubscribe((url) => {
    pluginGuardsStore.setState((state) => {
      state.currentLocation = whereAmI(url);
    });
  });
}

function setupMobileStateSubscription() {
  isMobileStore.subscribe(
    (store) => store.isMobile,
    (isMobile) => {
      pluginGuardsStore.setState((state) => {
        state.isMobile = isMobile;
      });
    },
    {
      fireImmediately: true,
    },
  );
}

export function initAuthStatus({
  data,
  extensionSettings,
}: {
  data: PplxAuthSessionApiResponse;
  extensionSettings?: ExtensionSettings;
}) {
  const userData = data.user;

  pluginGuardsStore.setState((state) => {
    state.isLoggedIn = Object.keys(data).length > 0;
    const hasActiveSub =
      userData.subscription_status != null &&
      userData.subscription_status !== "none";

    state.hasActiveSub = hasActiveSub;

    if (hasActiveSub) {
      if (
        extensionSettings &&
        extensionSettings.devMode &&
        extensionSettings.devTools?.overrideSubscriptionTier
      ) {
        state.subTier = extensionSettings.devTools.overrideSubscriptionTier;
        return;
      }

      state.subTier = userData.subscription_tier === "max" ? "max" : "pro";
    }
  });
}

function setupAuthenticationTracking(extensionSettings: ExtensionSettings) {
  pplxAuthQueryObserver.subscribe((data) => {
    if (
      data.status !== "success" ||
      data.fetchStatus !== "idle" ||
      data.data == null
    )
      return;

    initAuthStatus({ data: data.data, extensionSettings });
  });

  pplxAuthOrgStatusQueryObserver.subscribe((data) => {
    if (
      data.status !== "success" ||
      data.fetchStatus !== "idle" ||
      data.data == null
    )
      return;

    pluginGuardsStore.setState((state) => {
      state.isOrgMember = data.data.is_in_organization;
    });
  });

  // const unsubscribeLoginGuard = pluginGuardsStore.subscribe(
  //   (state) => state.isLoggedIn,
  //   (isLoggedIn) => {
  //     if (isLoggedIn === false) return;

  //     setTimeout(() => {
  //       unsubscribeLoginGuard();
  //     }, 0);

  //     new QueryObserver(
  //       queryClient,
  //       pplxApiQueries.userSettings.detail(isLoggedIn),
  //     ).subscribe((data) => {
  //       if (!data.data) return;

  //       pluginGuardsStore.setState((state) => {
  //         state.hasActiveSub = data.data.subscription_status !== "none";
  //       });
  //     });
  //   },
  //   {
  //     fireImmediately: true,
  //   },
  // );
}

async function setupPermissionsTracking() {
  const grantedPermissions = (await getPermissions()).permissions;
  if (grantedPermissions) {
    pluginGuardsStore.setState((draft) => {
      draft.grantedPermissions = grantedPermissions;
    });
  }
}
