import { storage } from "@wxt-dev/storage";

import { Button } from "@/components/ui/button";
import { persistentQueryClient } from "@/entrypoints/options-page/persistent-query-client";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { persistentQueryClient as csPersistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";

export default function ClearRemoteResourcesCache() {
  const [buttonText, setButtonText] = useToggleButtonText({
    defaultText: "Clear cache",
  });

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await storage.removeItem(persistentQueryClient.softCacheBusterKey);
        await storage.removeItem(csPersistentQueryClient.softCacheBusterKey);
        await persistentQueryClient.wipeQueryCache();
        await csPersistentQueryClient.wipeQueryCache();
        setButtonText("Cache cleared");
      }}
    >
      {buttonText}
    </Button>
  );
}
