import { QueryObserver } from "@tanstack/react-query";

import { spaRouteChangeCompleteSubscribe } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import {
  pluginGuardsStore,
  type PluginGuardsStoreType,
} from "@/entrypoints/contexts/content-scripts/services/ui-guard/store";
import { getPermissions } from "@/entrypoints/services/extension-api-wrappers/permissions/utils";
import type {
  PplxAuthSessionApiResponse,
  PplxOrgSettingsApiResponse,
} from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";
import {
  settingsStorage,
  type ProductionDevMode,
} from "@/entrypoints/services/features/production-dev-mode/settings";
import { isMobileStore } from "@/hooks/is-mobile-store";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "store:pluginGuards": PluginGuardsStoreType;
  }
}

const getPplxAuthQueryObserver = () =>
  new QueryObserver(
    persistentQueryClient.queryClient,
    pplxApiQueries.auth.detail(),
  );

const getPplxAuthOrgStatusQueryObserver = () =>
  new QueryObserver(
    persistentQueryClient.queryClient,
    pplxApiQueries.auth.orgStatus.detail(),
  );

export default function () {
  AsyncLoaderRegistry.register({
    id: "store:pluginGuards",
    dependencies: [
      "cache:pluginSettingSnapshots",
      "store:pluginGuards:authApiPrefetch",
    ],
    loader: async ({ "store:pluginGuards:authApiPrefetch": authData }) => {
      // pluginGuardsStore.subscribe((state) => console.log(state));

      const prodDevMode = await settingsStorage.getValue();

      setupLocationTracking();
      setupMobileStateSubscription();
      setupAuthenticationTracking(authData, prodDevMode);

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

function initAuthStatus({
  data,
  prodDevMode,
}: {
  data: PplxAuthSessionApiResponse;
  prodDevMode: ProductionDevMode;
}) {
  const userData = data.user;

  pluginGuardsStore.setState((state) => {
    const isLoggedIn = Object.keys(data).length > 0;

    state.isLoggedIn = isLoggedIn;

    if (!isLoggedIn) return;

    const hasActiveSub =
      userData.subscription_status !== undefined &&
      userData.subscription_status !== "none";

    state.hasActiveSub = hasActiveSub;

    if (hasActiveSub) {
      if (prodDevMode.enabled && prodDevMode.options.overrideSubscriptionTier) {
        state.subTier = prodDevMode.options.overrideSubscriptionTier;
        return;
      }

      state.subTier = userData.subscription_tier === "max" ? "max" : "pro";
    }
  });
}

function setupAuthenticationTracking(
  authData: {
    authDetail: PplxAuthSessionApiResponse;
    orgDetail: PplxOrgSettingsApiResponse;
  },
  prodDevMode: ProductionDevMode,
) {
  initAuthStatus({ data: authData.authDetail, prodDevMode });

  getPplxAuthQueryObserver().subscribe((data) => {
    if (data.status !== "success" || data.fetchStatus !== "idle") return;

    initAuthStatus({ data: data.data, prodDevMode });
  });

  pluginGuardsStore.setState((state) => {
    state.isOrgMember = authData.orgDetail.is_in_organization;
  });

  getPplxAuthOrgStatusQueryObserver().subscribe((data) => {
    if (data.status !== "success" || data.fetchStatus !== "idle") return;

    pluginGuardsStore.setState((state) => {
      state.isOrgMember = data.data.is_in_organization;
    });
  });

  // const unsubscribeLoginGuard = pluginGuardsStore.subscribe(
  //   (store) => store.isLoggedIn,
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
