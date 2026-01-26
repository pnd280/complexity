import { APP_CONFIG } from "@/app.config";
import { toast } from "@/components/ui/use-toast";
import useSettings from "@/entrypoints/hooks/useSettings";
import { settingsStorage } from "@/entrypoints/services/features/production-dev-mode/settings";

export default function Version() {
  const { settings, update } = useSettings(settingsStorage);

  const [clicks, setClicks] = useState(0);
  const clickResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <div
      className="x:mx-auto x:mb-4 x:w-fit x:font-mono x:text-xs x:text-muted-foreground"
      onClick={() => {
        if (clickResetTimeoutRef.current) {
          clearTimeout(clickResetTimeoutRef.current);
        }

        const newClickCount = clicks + 1;
        setClicks(newClickCount);

        if (newClickCount >= 7) {
          setClicks(0);

          if (settings.enabled) {
            toast({
              title: "Dev mode already enabled",
            });
            return;
          }

          void update({
            updateFn(_prev) {
              _prev.enabled = true;
            },
          });

          toast({
            title: "Dev mode enabled",
          });
        }

        clickResetTimeoutRef.current = setTimeout(() => {
          setClicks(0);
        }, 1000);
      }}
    >
      v{APP_CONFIG.DISPLAY_VERSION}
    </div>
  );
}
