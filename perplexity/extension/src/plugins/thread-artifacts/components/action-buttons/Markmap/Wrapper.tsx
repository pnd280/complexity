import DownloadAsInteractiveHtml from "@/plugins/thread-artifacts/components/action-buttons/Markmap/DownloadAsInteractiveHtml";
import OpenAsInteractiveHtml from "@/plugins/thread-artifacts/components/action-buttons/Markmap/OpenAsInteractiveHtml";

export default function MarkmapArtifactsActionButtonsWrapper() {
  return (
    <div className="x:flex x:items-center x:gap-1">
      <DownloadAsInteractiveHtml />
      <OpenAsInteractiveHtml />
    </div>
  );
}
