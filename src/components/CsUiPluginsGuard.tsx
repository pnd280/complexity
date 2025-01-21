import { Suspense } from "react";

import { APP_CONFIG } from "@/app.config";
import CopyButton from "@/components/CopyButton";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Ul } from "@/components/ui/typography";
import { PLUGINS_METADATA } from "@/data/plugins/plugins-data";
import { useSpaRouter } from "@/features/plugins/_core/spa-router/listeners";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import usePplxAuth from "@/hooks/usePplxAuth";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage/extension-local-storage";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import {
  PluginsStates,
  PluginsStatesService,
} from "@/services/plugins-states/plugins-states";
import { whereAmI } from "@/utils/utils";
import packageJson from "~/package.json";

type CsUiPluginsGuardProps = {
  dependentPluginIds?: PluginId[];
  location?: ReturnType<typeof whereAmI>[];
  desktopOnly?: boolean;
  mobileOnly?: boolean;
  children: React.ReactNode;
  requiresLoggedIn?: boolean;
  allowedAccountTypes?: ("free" | "pro" | "enterprise")[];
  additionalCheck?: (
    props: Omit<CsUiPluginsGuardProps, "additionalCheck" | "children"> & {
      pluginsEnableStates: PluginsStates["pluginsEnableStates"];
      settings: ExtensionLocalStorage;
    },
  ) => boolean;
  onNotSatisfiedAllConditions?: () => void;
};

export default function CsUiPluginsGuard({
  dependentPluginIds,
  location,
  children,
  desktopOnly = false,
  mobileOnly = false,
  requiresLoggedIn = false,
  allowedAccountTypes = ["free", "pro", "enterprise"],
  additionalCheck,
  onNotSatisfiedAllConditions,
}: CsUiPluginsGuardProps) {
  const { url } = useSpaRouter();
  const currentLocation = whereAmI(url);
  const { isMobile } = useIsMobileStore();
  const { isLoggedIn, isOrgMember } = usePplxAuth();
  const { data: pplxUserSettings } = usePplxUserSettings();
  const { pluginsEnableStates } = PluginsStatesService.getCachedSync();

  if (desktopOnly && isMobile) {
    return null;
  }

  if (mobileOnly && !isMobile) {
    return null;
  }

  if (requiresLoggedIn && !isLoggedIn) {
    return null;
  }

  const hasActivePplxSub =
    pplxUserSettings?.subscription_status != null &&
    pplxUserSettings?.subscription_status !== "none";

  if (isOrgMember && !allowedAccountTypes.includes("enterprise")) {
    onNotSatisfiedAllConditions?.();
    return null;
  }

  if (!allowedAccountTypes.includes("free") && !hasActivePplxSub) {
    onNotSatisfiedAllConditions?.();
    return null;
  }

  if (
    (dependentPluginIds &&
      !dependentPluginIds.some(
        (pluginId) => pluginsEnableStates?.[pluginId],
      )) ||
    (location && !location.some((loc) => loc === currentLocation))
  ) {
    onNotSatisfiedAllConditions?.();
    return null;
  }

  if (
    additionalCheck &&
    !additionalCheck({
      dependentPluginIds,
      location,
      desktopOnly,
      requiresLoggedIn,
      allowedAccountTypes,
      pluginsEnableStates,
      settings: ExtensionLocalStorageService.getCachedSync(),
    })
  ) {
    onNotSatisfiedAllConditions?.();
    return null;
  }

  return (
    <ErrorBoundary
      fallback={({ error }: { error: Error }) => (
        <ErrorDialog
          dependentPluginIds={dependentPluginIds}
          location={location}
          errorMessage={error.message}
        />
      )}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function ErrorDialog({
  dependentPluginIds,
  location,
  errorMessage,
}: Omit<CsUiPluginsGuardProps, "children"> & {
  errorMessage?: string;
}) {
  const pluginsError = (
    <div>
      Error has occurred in (one of) the following plugin(s):
      <Ul>
        {dependentPluginIds?.map((pluginId) => {
          const pluginName = PLUGINS_METADATA[pluginId].title;

          return (
            <li key={pluginId} className="tw-text-foreground">
              {pluginName ?? pluginId}
            </li>
          );
        })}
      </Ul>
      <div>Please disable these plugins if the errors continue to occur.</div>
    </div>
  );

  const tracesAsString = JSON.stringify(
    {
      errorMessage,
      browser: APP_CONFIG.BROWSER,
      version: packageJson.version,
      location,
      dependentPluginIds,
      currentUrl: window.location.href,
      settings: ExtensionLocalStorageService.getCachedSync(),
      pluginsStates: PluginsStatesService.getCachedSync(),
    },
    null,
    4,
  );

  const traces = (
    <div className="tw-flex tw-flex-col">
      <div>
        Please provide the following details to the maintainer, alongside a
        screenshot of the page and browser console logs:
      </div>
      <div className="tw-relative tw-my-4 tw-max-h-[300px] tw-overflow-auto tw-rounded-md tw-bg-secondary tw-p-2 tw-font-mono">
        <CopyButton
          className="tw-sticky tw-right-2 tw-top-2 tw-float-right"
          content={tracesAsString}
        />
        <Ul>
          <li>Error: {errorMessage}</li>
          <li>Browser: {APP_CONFIG.BROWSER}</li>
          <li>Version: {packageJson.version}</li>
          <li>Location: {location?.join(", ")}</li>
          <li>Dependent plugin ids: {dependentPluginIds?.join(", ")}</li>
          <li>Current url: {window.location.href}</li>
          <li>
            Settings:{" "}
            {JSON.stringify(ExtensionLocalStorageService.getCachedSync())}
          </li>
          <li>
            Plugins states:{" "}
            {JSON.stringify(PluginsStatesService.getCachedSync())}
          </li>
        </Ul>
      </div>
    </div>
  );

  return (
    <Dialog defaultOpen open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complexity encountered an error</DialogTitle>
          <DialogDescription>
            {dependentPluginIds &&
              dependentPluginIds.length > 0 &&
              pluginsError}
            {traces}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
