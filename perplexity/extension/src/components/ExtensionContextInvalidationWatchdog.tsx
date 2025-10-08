import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ExtensionContextInvalidationWatchdog() {
  const { data: isValidContext, refetch } = useQuery({
    queryKey: ["extensionContextInvalidationWatchdog"],
    queryFn: () => {
      return chrome.runtime.id != null;
    },
    refetchInterval: 10000,
    refetchOnReconnect: "always",
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleFocus = () => {
      void refetch();
    };

    window.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refetch]);

  if (isValidContext !== false) return null;

  return <WarningDialog />;
}

export function WarningDialog() {
  return (
    <Dialog defaultOpen closeOnInteractOutside={false} closeOnEscape={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Page reload required</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div>You have just updated or reloaded the extension.</div>
          <div>
            A page refresh is mandatory to ensure all features work as intended.
          </div>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">I'll do it later</Button>
          </DialogClose>
          <Button
            autoFocus
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
