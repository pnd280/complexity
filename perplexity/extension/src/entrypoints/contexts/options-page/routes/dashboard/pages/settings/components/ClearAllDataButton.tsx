import type { WxtStorageItem } from "@wxt-dev/storage";
import type Dexie from "dexie";
import { useNavigate } from "react-router-dom";

import AsyncButton from "@/components/AsyncButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ul } from "@/components/ui/typography";
import { persistentQueryClient as csPersistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { persistentQueryClient } from "@/entrypoints/contexts/options-page/services/persistent-query-client";
import { settingsStorage as extensionIconActionSettingsStorage } from "@/entrypoints/services/features/extension-icon-action/settings";
import { settingsStorage as productionDevModeSettingsStorage } from "@/entrypoints/services/features/production-dev-mode/settings";
import { db } from "@/entrypoints/services/indexed-db";
import { IndexedDbService } from "@/entrypoints/services/indexed-db";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";
import type {
  InferSettingsValue,
  PluginsSettings,
} from "@/entrypoints/services/plugins/settings/types";
import type { PluginsRegistry } from "@/entrypoints/services/plugins/types";
import { getPluginSettingsStorage } from "@/entrypoints/services/plugins/utils";
import type PersistentQueryClient from "@/services/persistent-query-client";

export default function ClearAllDataButton() {
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Clear All Data</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear All Data</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to clear all extension data? This action cannot
          be undone and will wipe the following data:
          <Ul>
            <li>Extension settings</li>
            <li>All custom themes, code blocks rules, etc.</li>
            <li>And any other data stored by the extension</li>
          </Ul>
        </DialogDescription>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button>Cancel</Button>
          </DialogTrigger>
          <AsyncButton
            variant="caution"
            onClick={async () => {
              await resetExtensionSettings({
                db,
                persistentQueryClients: [
                  csPersistentQueryClient,
                  persistentQueryClient,
                ],
                storageItems: [
                  extensionIconActionSettingsStorage,
                  productionDevModeSettingsStorage,
                ],
              });
              void navigate("/plugins");
            }}
          >
            Yes, Clear All Data
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

async function resetExtensionSettings({
  db,
  persistentQueryClients,
  storageItems,
}: {
  db: Dexie;
  persistentQueryClients: PersistentQueryClient[];
  storageItems: WxtStorageItem<unknown, Record<string, unknown>>[];
}) {
  for (const [pluginId, value] of Object.entries(
    PluginsSettingSnapshotsService.getPluginsFallbackValues(),
  ) as [
    keyof PluginsSettings,
    InferSettingsValue<PluginsRegistry[keyof PluginsRegistry]>,
  ][]) {
    await getPluginSettingsStorage(pluginId).setValue(value);
  }

  for (const storageItem of storageItems) {
    await storageItem.setValue(storageItem.fallback);
  }

  await IndexedDbService.clear(db);

  for (const persistentQueryClient of persistentQueryClients) {
    await persistentQueryClient.wipe();
  }
}
