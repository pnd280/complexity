import ExtensionUpdateInfoDialogWrapper from "@/components/ExtensionUpdateInfoDialogWrapper";
import { Portal } from "@/components/ui/portal";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { useHomeDomObserverStore } from "@/plugins/__core__/dom-observers/home/store";

export default function HomepageUpdateAnnouncer() {
  const { isUpdateAvailable } = useExtensionUpdate();

  const slogan = useHomeDomObserverStore((store) => store.slogan, deepEqual);

  const anchor = useMemo(() => {
    if (!slogan) return null;
    return $(slogan).find(">*").first()[0];
  }, [slogan]);

  if (!anchor || document.body.contains(anchor) || !isUpdateAvailable)
    return null;

  return (
    <Portal container={anchor}>
      <ExtensionUpdateInfoDialogWrapper>
        <div className="x:w-64 x:text-xs x:text-muted-foreground">
          A new version of Complexity is available!
        </div>
      </ExtensionUpdateInfoDialogWrapper>
    </Portal>
  );
}
