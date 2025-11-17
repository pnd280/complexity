import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CometPatchInstructions from "@/entrypoints/contexts/options-page/components/CometPatchInstructions";
import { isCometBrowserSync, isCsInjectable } from "@/entrypoints/utils/comet";

export default function CometCompatibility() {
  const { data: isInjectable, refetch } = useQuery({
    queryKey: ["cs-injectability"],
    queryFn: () => {
      return isCsInjectable();
    },
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    enabled: isCometBrowserSync(),
  });

  useEffect(() => {
    const handleFocus = () => {
      if (!isCometBrowserSync()) return;

      void refetch();
    };

    window.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refetch]);

  if (!isCometBrowserSync() || isInjectable !== false) return null;

  return (
    <Dialog>
      <DialogTrigger className="x:w-full">
        <div className="x:group x:relative x:flex x:w-full x:cursor-pointer x:flex-col x:items-start x:gap-1 x:border-b x:border-yellow-300/20 x:bg-amber-300/20 x:p-4 x:text-sm x:font-medium x:shadow-lg x:transition-all">
          <div className="x:text-lg x:font-bold x:text-yellow-500">WARNING</div>
          <div className="x:flex-1 x:text-left x:text-base">
            The extension is having issues working on this browser. Click for
            more information.
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="x:max-w-2xl">
        <CometPatchInstructions />
      </DialogContent>
    </Dialog>
  );
}
