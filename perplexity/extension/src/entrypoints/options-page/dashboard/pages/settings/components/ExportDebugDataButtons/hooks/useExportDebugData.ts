import { useQueryClient } from "@tanstack/react-query";

import { APP_CONFIG } from "@/app.config";
import { getPlatform } from "@/hooks/usePlatformDetection";
import { extensionPermissionsQueries } from "@/services/infra/extension-api-wrappers/extension-permissions/query-keys";
import { useExtensionPermissions } from "@/services/infra/extension-api-wrappers/extension-permissions/useExtensionPermissions";
import { ExtensionSettingsStorageService } from "@/services/infra/extension-api-wrappers/extension-settings/storage/service-init.bg-worker";

export type ExportMetadata = {
  cplxVersion: string;
  platform: string;
  browser: string;
  ua: string;
};

export type ExportDialogState = {
  isOpen: boolean;
  action: "copy" | "save" | null;
  metadata: ExportMetadata | null;
};

export function useExportDebugData() {
  "use memo";

  const queryClient = useQueryClient();

  const { data: permissions, handleRevokePermission } =
    useExtensionPermissions();

  const [dialogState, setDialogState] = useState<ExportDialogState>({
    isOpen: false,
    action: null,
    metadata: null,
  });

  const getExportMetadata = (): ExportMetadata => {
    return {
      cplxVersion: APP_CONFIG.VERSION,
      platform: getPlatform(),
      browser: APP_CONFIG.BROWSER,
      ua: navigator.userAgent,
    };
  };

  const buildExportData = async (): Promise<string> => {
    await sleep(300);
    return JSON.stringify(
      {
        time: new Date().toTimeString(),
        cplxVersion: APP_CONFIG.VERSION,
        platform: getPlatform(),
        browser: APP_CONFIG.BROWSER,
        ua: navigator.userAgent,
        extensions: permissions?.permissions?.includes("management")
          ? (await chrome.management.getAll())
              .map((extension) => ({
                id: extension.id,
                name: extension.name,
                version: extension.version,
                description: extension.description,
                hostPermissions: extension.hostPermissions,
                isEnabled: extension.enabled,
              }))
              .filter((extension) => extension.id !== chrome.runtime.id)
          : null,
        settings: await ExtensionSettingsStorageService.Instance.getValue(),
      },
      null,
      2,
    );
  };

  const openDialog = (action: "copy" | "save") => {
    setDialogState({
      isOpen: true,
      action,
      metadata: getExportMetadata(),
    });
  };

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      action: null,
      metadata: null,
    });
  };

  const copyToClipboard = async () => {
    const data = await buildExportData();
    await navigator.clipboard.writeText(data);
    closeDialog();
  };

  const saveAsFile = async () => {
    try {
      const data = await buildExportData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `complexity-debug-data-${new Date().toISOString()}.json`,
        types: [
          {
            description: "JSON File",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(data);
      await writable.close();
      closeDialog();
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Failed to save file:", error);
      }
    }
  };

  const handleConfirm = async () => {
    if (dialogState.action === "copy") {
      await copyToClipboard();
    } else if (dialogState.action === "save") {
      await saveAsFile();
    }
  };

  const toggleManagementPermission = async () => {
    const hasPermission = permissions?.permissions?.includes("management");

    if (hasPermission) {
      await handleRevokePermission({ permissions: ["management"] });
    } else {
      try {
        await chrome.permissions.request({ permissions: ["management"] });
        void queryClient.invalidateQueries({
          queryKey: extensionPermissionsQueries.permissions.all(),
        });
      } catch (error) {
        alert(`Error granting permissions: ${error}`);
      }
    }
  };

  return {
    dialogState,
    openDialog,
    closeDialog,
    handleConfirm,
    permissions,
    toggleManagementPermission,
  };
}
