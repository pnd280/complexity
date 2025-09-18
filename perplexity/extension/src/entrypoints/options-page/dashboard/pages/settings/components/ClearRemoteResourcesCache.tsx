import { storage } from "@wxt-dev/storage";

import { Button } from "@/components/ui/button";
import {
  invalidateQueryClientCache,
  softCacheBusterKey,
} from "@/data/query-client/utils";
import useToggleButtonText from "@/hooks/useToggleButtonText";

export default function ClearRemoteResourcesCache() {
  const [buttonText, setButtonText] = useToggleButtonText({
    defaultText: "Clear cache",
  });

  return (
    <Button
      variant="outline"
      onClick={() => {
        storage.setItem(softCacheBusterKey, "invalidated");
        invalidateQueryClientCache();
        setButtonText("Cache cleared");
      }}
    >
      {buttonText}
    </Button>
  );
}
