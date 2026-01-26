import { Button } from "@/components/ui/button";
import { persistentQueryClient as csPersistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { persistentQueryClient } from "@/entrypoints/contexts/options-page/services/persistent-query-client";
import useToggleButtonText from "@/hooks/useToggleButtonText";

export default function ClearRemoteResourcesCache() {
  const [buttonText, setButtonText] = useToggleButtonText({
    defaultText: "Clear cache",
  });

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await persistentQueryClient.wipe();
        await csPersistentQueryClient.wipe();
        setButtonText("Cache cleared");
      }}
    >
      {buttonText}
    </Button>
  );
}
