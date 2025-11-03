import { Button } from "@/components/ui/button";
import { persistentQueryClient } from "@/entrypoints/options-page/persistent-query-client";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { persistentQueryClient as csPersistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";

export default function ClearRemoteResourcesCache() {
  const [buttonText, setButtonText] = useToggleButtonText({
    defaultText: "Clear cache",
  });

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await persistentQueryClient.wipeQueryCache();
        await csPersistentQueryClient.wipeQueryCache();
        setButtonText("Cache cleared");
      }}
    >
      {buttonText}
    </Button>
  );
}
