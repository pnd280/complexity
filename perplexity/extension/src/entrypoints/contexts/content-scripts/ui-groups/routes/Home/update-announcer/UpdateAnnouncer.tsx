import { Portal } from "@/components/ui/portal";
import ExtensionUpdateInfoDialogWrapper from "@/entrypoints/components/ExtensionUpdateInfoDialogWrapper";
import { useHomeDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/home/store";
import useExtensionUpdate from "@/entrypoints/hooks/useExtensionUpdate";

export default function UpdateAnnouncer() {
  const { isUpdateAvailable } = useExtensionUpdate();

  const slogan = useHomeDomObserverStore((store) => store.slogan, deepEqual);

  if (!slogan || !isUpdateAvailable) return null;

  const $container = $(slogan).parent().parent();

  if (!$container.length) return null;

  return (
    <Portal container={$container[0]}>
      <ExtensionUpdateInfoDialogWrapper>
        <div className="x:absolute x:bottom-0 x:left-1/2 x:mb-4 x:-translate-x-1/2 x:text-xs x:text-muted-foreground">
          A new version of Complexity is available!
        </div>
      </ExtensionUpdateInfoDialogWrapper>
    </Portal>
  );
}
