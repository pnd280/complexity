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
import { PluginRegistry } from "@/data/plugin-registry";
import usePplxIncognitoMode from "@/hooks/usePplxIncognitoMode";
import { errorDialogManager } from "@/plugins/_core/plugins-guard/error-manager";
import {
  type GuardConditions,
  type AdditionalCheckParams,
  type AdditionalCheckFn,
  checkDeviceType,
  checkAuthStatus,
  checkPplxSubStatus,
  checkPluginDependencies,
  checkIncognito,
  checkLocation,
  checkBrowser,
  checkRequiredPermissions,
} from "@/plugins/_core/plugins-guard/guards";
import { usePluginGuardsStore } from "@/plugins/_core/plugins-guard/store";
import { PluginsStatesService } from "@/services/features/plugins-states";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import type { whereAmI } from "@/utils/misc/utils";

type CsUiPluginsGuardProps = GuardConditions & {
  children: React.ReactNode;
  additionalCheck?: AdditionalCheckFn;
  onNotSatisfiedAllConditions?: () => void;
  fallback?: React.ReactNode;
  suspenseFallback?: React.ReactNode;
  customMessage?: string;
};

function CsUiPluginsGuardError({
  dependentPluginIds,
  location,
  errorMessage,
  customMessage,
}: Omit<CsUiPluginsGuardProps, "children"> & { errorMessage?: string }) {
  const componentKey = useMemo(
    () =>
      errorDialogManager.generateComponentKey({
        dependentPluginIds,
        location,
        customMessage,
        errorMessage,
      }),
    [dependentPluginIds, location, customMessage, errorMessage],
  );

  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const [shouldShowDialog] = useState(() =>
    errorDialogManager.registerError(componentKey, handleClose),
  );

  useEffect(() => {
    if (shouldShowDialog) {
      setOpen(true);
    }
    return () => {
      errorDialogManager.unregisterCallback(componentKey, handleClose);
    };
  }, [componentKey, shouldShowDialog, handleClose]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      errorDialogManager.clearError(componentKey);
    } else {
      setOpen(true);
    }
  };

  const traces = useErrorTraces({
    errorMessage,
    customMessage,
    location,
    dependentPluginIds,
  });
  const pluginsError = usePluginsError(dependentPluginIds);

  if (!shouldShowDialog) {
    return null;
  }

  return (
    <Dialog
      closeOnInteractOutside={false}
      open={open}
      onOpenChange={({ open: newOpen }: { open: boolean }) =>
        handleOpenChange(newOpen)
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complexity encountered an error</DialogTitle>
          <DialogDescription>
            {dependentPluginIds?.length != null &&
              dependentPluginIds?.length > 0 &&
              pluginsError}
            {traces}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function useGuardConditions(props: CsUiPluginsGuardProps) {
  const {
    currentLocation,
    hasActiveSub,
    isLoggedIn,
    isMobile,
    isOrgMember,
    grantedPermissions,
    subTier,
  } = usePluginGuardsStore();

  const hasRequiredPermissions = checkRequiredPermissions(props, {
    grantedPermissions,
  });
  const pluginsStates = PluginsStatesService.getEnableStatesCachedSync();
  const isIncognito = usePplxIncognitoMode();

  const deviceValid = checkDeviceType(props, { isMobile });
  const authValid = checkAuthStatus(props, { isLoggedIn });
  const accountValid = checkPplxSubStatus(props, {
    hasActiveSub,
    isOrgMember,
    isLoggedIn,
    subTier,
  });
  const dependenciesValid = checkPluginDependencies(props, {
    pluginsStates,
  });
  const locationValid = checkLocation(props, {
    currentLocation,
  });
  const incognitoValid = checkIncognito(props, { isIncognito });
  const browserValid = checkBrowser(props);

  return {
    hasRequiredPermissions,
    deviceValid,
    authValid,
    accountValid,
    dependenciesValid,
    locationValid,
    incognitoValid,
    browserValid,
    pluginsStates,
  };
}

export default function CsUiPluginsGuard(
  props: CsUiPluginsGuardProps,
): React.ReactNode | null {
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [key, setKey] = useState(0);
  const errorRef = useRef<Error | null>(null);

  useEffect(() => {
    setRetryCount(0);
    setError(null);
    setKey(0);
    errorRef.current = null;
  }, [props.children]);

  useEffect(() => {
    if (errorRef.current && retryCount < 3) {
      const currentError = errorRef.current;

      if (
        currentError.message.includes(
          "Failed to fetch dynamically imported module",
        ) &&
        chrome.runtime.id == null
      ) {
        return;
      }

      console.error(
        `[CPLX] Plugin error, retry attempt ${retryCount + 1}/3: ${currentError.message}`,
      );

      setKey((prevKey) => prevKey + 1);

      errorRef.current = null;
    }
  }, [retryCount]);

  const {
    hasRequiredPermissions,
    deviceValid,
    authValid,
    accountValid,
    dependenciesValid,
    locationValid,
    incognitoValid,
    browserValid,
    pluginsStates,
  } = useGuardConditions(props);

  const settings = ExtensionSettingsService.cachedSync;
  const additionalCheckParams: AdditionalCheckParams = {
    ...props,
    pluginsStates,
    settings,
  };
  const additionalCheckValid =
    props.additionalCheck?.(additionalCheckParams) ?? true;

  const allConditionsMet = [
    hasRequiredPermissions,
    deviceValid,
    authValid,
    accountValid,
    dependenciesValid,
    locationValid,
    incognitoValid,
    browserValid,
    additionalCheckValid,
  ].every(Boolean);

  if (!allConditionsMet) {
    props.onNotSatisfiedAllConditions?.();
    return props.fallback;
  }

  if (error && retryCount >= 3) {
    return <CsUiPluginsGuardError {...props} errorMessage={error.message} />;
  }

  return (
    <ErrorBoundary
      key={key}
      fallback={({ error: boundaryError }: { error: Error }) => {
        if (!errorRef.current) {
          errorRef.current = boundaryError;
        }

        if (
          boundaryError.message.includes(
            "Failed to fetch dynamically imported module",
          ) &&
          chrome.runtime.id == null
        ) {
          return null;
        }

        return (
          <RenderError
            boundaryError={boundaryError}
            setRetryCount={setRetryCount}
            setError={setError}
            retryCount={retryCount}
          />
        );
      }}
    >
      <Suspense fallback={props.suspenseFallback}>{props.children}</Suspense>
    </ErrorBoundary>
  );
}

function RenderError({
  boundaryError,
  setRetryCount,
  setError,
  retryCount,
}: {
  boundaryError: Error;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  retryCount: number;
}) {
  useEffect(() => {
    if (retryCount < 3) {
      setRetryCount((prev) => (prev < 3 ? prev + 1 : prev));
      return;
    }

    setError(boundaryError);
  }, [retryCount, setRetryCount, setError, boundaryError]);

  // Never render UI here; let the parent branch render CsUiPluginsGuardError
  return null;
}

function useErrorTraces({
  errorMessage,
  customMessage,
  location,
  dependentPluginIds,
}: {
  errorMessage?: string;
  customMessage?: string;
  location?: ReturnType<typeof whereAmI>[];
  dependentPluginIds?: GuardConditions["dependentPluginIds"];
}) {
  const tracesAsString = JSON.stringify(
    {
      errorMessage,
      customMessage,
      browser: APP_CONFIG.BROWSER,
      version: APP_CONFIG.VERSION,
      location,
      dependentPluginIds,
      currentUrl: window.location.href,
      settings: ExtensionSettingsService.cachedSync,
      pluginsStates: PluginsStatesService.getEnableStatesCachedSync(),
    },
    null,
    4,
  );

  return (
    <div className="x:flex x:flex-col">
      <div>Debugging information:</div>
      <div className="x:relative x:my-4 x:max-h-[300px] x:overflow-auto x:rounded-md x:bg-secondary x:p-2 x:font-mono">
        <CopyButton
          className="x:sticky x:top-2 x:right-2 x:float-right"
          content={tracesAsString}
        />
        <DebugInfoList traces={JSON.parse(tracesAsString)} />
      </div>
    </div>
  );
}

function usePluginsError(
  dependentPluginIds?: GuardConditions["dependentPluginIds"],
) {
  return dependentPluginIds?.length != null ? (
    <div>
      <div className="x:mt-2 x:text-sm x:text-muted-foreground">
        Disable these plugins if errors persist.
      </div>
      <Ul>
        {dependentPluginIds.map((pluginId) => (
          <li key={pluginId} className="x:text-foreground">
            {PluginRegistry.manifests[pluginId]?.title || pluginId}
          </li>
        ))}
      </Ul>
    </div>
  ) : null;
}

function DebugInfoList({ traces }: { traces: Record<string, unknown> }) {
  return (
    <Ul>
      {Object.entries(traces).map(([key, value]) => (
        <li key={key}>
          {key}: {typeof value === "string" ? value : JSON.stringify(value)}
        </li>
      ))}
    </Ul>
  );
}
