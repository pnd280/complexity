import { APP_CONFIG } from "@/app.config";
import { toast } from "@/components/ui/use-toast";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function Version() {
  const { mutation, settings } = useExtensionSettings();
  const [clicks, setClicks] = useState(0);
  const clickResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (clickResetTimeoutRef.current) {
      clearTimeout(clickResetTimeoutRef.current);
    }

    const newClickCount = clicks + 1;
    setClicks(newClickCount);

    if (newClickCount >= 7) {
      setClicks(0);

      if (settings?.devMode) {
        toast({
          title: "Dev mode already enabled",
        });
        return;
      }

      mutation.mutate((draft) => {
        draft.devMode = true;
      });

      toast({
        title: "Dev mode enabled",
      });
    }

    clickResetTimeoutRef.current = setTimeout(() => {
      setClicks(0);
    }, 1000);
  };

  return (
    <div
      className="x:mx-auto x:mb-4 x:w-fit x:font-mono x:text-xs x:text-muted-foreground"
      onClick={handleClick}
    >
      v{APP_CONFIG.DISPLAY_VERSION}
    </div>
  );
}
