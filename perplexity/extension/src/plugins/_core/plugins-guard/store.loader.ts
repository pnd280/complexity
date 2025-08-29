import { QueryObserver } from "@tanstack/react-query";

import { queryClient } from "@/data/query-client";
import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import { pluginGuardsStore } from "@/plugins/_core/plugins-guard/store";
import { getPermissions } from "@/services/infra/extension-permissions/utils";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "store:pluginGuards": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "store:pluginGuards",
    dependencies: ["cache:extensionSettings"],
    loader: async ({ "cache:extensionSettings": extensionSettings }) => {
      // pluginGuardsStore.subscribe((state) => console.log(state));

      pluginGuardsStore.setState((state) => {
        state.currentLocation = whereAmI();
      });

      spaRouteChangeCompleteSubscribe((url) => {
        pluginGuardsStore.setState((state) => {
          state.currentLocation = whereAmI(url);
        });
      });

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

      const pplxAuthQueryObserver = new QueryObserver(
        queryClient,
        pplxApiQueries.auth.detail(),
      );

      pplxAuthQueryObserver.subscribe((data) => {
        if (data.data == null) return;

        const userData = data.data.user;

        pluginGuardsStore.setState((state) => {
          state.isLoggedIn = Object.keys(data.data).length > 0;
          const hasActiveSub =
            userData.subscription_status != null &&
            userData.subscription_status !== "none";

          state.hasActiveSub = hasActiveSub;

          if (hasActiveSub) {
            if (
              extensionSettings.devMode &&
              extensionSettings.devTools?.overrideSubscriptionTier
            ) {
              state.subTier =
                extensionSettings.devTools.overrideSubscriptionTier;
              return;
            }

            state.subTier =
              userData.subscription_tier === "max" ? "max" : "pro";
          }
        });
      });

      const pplxAuthOrgStatusQueryObserver = new QueryObserver(
        queryClient,
        pplxApiQueries.auth.orgStatus.detail(),
      );

      pplxAuthOrgStatusQueryObserver.subscribe((data) => {
        if (!data.data) return;

        pluginGuardsStore.setState((state) => {
          state.isOrgMember = data.data.is_in_organization;
        });
      });

      pluginGuardsStore.subscribe(
        (state) => state.isLoggedIn,
        (isLoggedIn) => {
          new QueryObserver(
            queryClient,
            pplxApiQueries.userSettings.detail(isLoggedIn),
          ).subscribe((data) => {
            if (!data.data) return;

            pluginGuardsStore.setState((state) => {
              state.hasActiveSub = data.data.subscription_status !== "none";
            });
          });
        },
      );

      const grantedPermissions = (await getPermissions()).permissions;
      if (grantedPermissions) {
        pluginGuardsStore.setState((draft) => {
          draft.grantedPermissions = grantedPermissions;
        });
      }
    },
  });
}
