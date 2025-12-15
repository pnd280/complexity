import ExtensionUpdateInfoDialogWrapper from "@/entrypoints/components/ExtensionUpdateInfoDialogWrapper";
import useExtensionUpdate from "@/entrypoints/hooks/useExtensionUpdate";

export default function SidebarUpdateAnnouncer() {
  const { isUpdateAvailable } = useExtensionUpdate();

  if (!isUpdateAvailable) return null;

  return (
    <ExtensionUpdateInfoDialogWrapper>
      <div className="x:group x:relative x:flex x:w-full x:cursor-pointer x:items-start x:gap-2 x:rounded-lg x:border x:border-border/50 x:bg-secondary x:p-4 x:text-sm x:font-medium x:shadow-lg x:transition-all x:hover:scale-105 x:hover:border-primary x:hover:bg-primary/10">
        <span className="x:flex-1 x:text-left x:md:text-balance">
          A new version of the extension is available!
        </span>
        <div className="x:absolute x:-top-1 x:-right-1 x:size-3 x:animate-ping x:rounded-full x:bg-primary" />
        <div className="x:absolute x:-top-1 x:-right-1 x:size-3 x:rounded-full x:bg-primary" />
      </div>
    </ExtensionUpdateInfoDialogWrapper>
  );
}
