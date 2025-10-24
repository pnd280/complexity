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
import { persistentQueryClient } from "@/entrypoints/options-page/persistent-query-client";
import { persistentQueryClient as csPersistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import { db } from "@/services/infra/indexed-db";

export default function ClearAllDataButton() {
  const navigate = useNavigate();

  const handleClearData = async () => {
    await ExtensionSettingsService.reset();
    await db.clearAll();
    await persistentQueryClient.wipeQueryCache();
    await csPersistentQueryClient.wipeQueryCache();
    void navigate("/plugins");
  };

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
          <AsyncButton variant="caution" onClick={handleClearData}>
            Yes, Clear All Data
          </AsyncButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
