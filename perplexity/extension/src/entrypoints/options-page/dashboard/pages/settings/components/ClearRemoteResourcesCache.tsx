import { storage } from "@wxt-dev/storage";

import { Button } from "@/components/ui/button";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import {
  invalidateQueryClientCache,
  softCacheBusterKey,
} from "@/services/infra/query-client/utils";

export default function ClearRemoteResourcesCache() {
  const [buttonText, setButtonText] = useToggleButtonText({
    defaultText: "Clear cache",
  });

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await storage.setItem(softCacheBusterKey, "invalidated");
        await invalidateQueryClientCache();
        setButtonText("Cache cleared");
      }}
    >
      {buttonText}
    </Button>
  );
}
