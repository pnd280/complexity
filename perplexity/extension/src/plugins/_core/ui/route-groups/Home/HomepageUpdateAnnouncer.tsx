import ExtensionUpdateInfoDialogWrapper from "@/components/ExtensionUpdateInfoDialogWrapper";
import { Portal } from "@/components/ui/portal";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { useHomeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";

export default function HomepageUpdateAnnouncer() {
  const { isUpdateAvailable } = useExtensionUpdate();

  const $slogan = useHomeDomObserverStore((store) => store.$slogan);

  if (!$slogan || !$slogan.length || !isUpdateAvailable) return null;

  const $anchor = $slogan.find(">*").first();

  return (
    <Portal container={$anchor[0]}>
      <ExtensionUpdateInfoDialogWrapper>
        <div className="x:w-64 x:text-xs x:text-muted-foreground">
          A new version of Complexity is available!
        </div>
      </ExtensionUpdateInfoDialogWrapper>
    </Portal>
  );
}
