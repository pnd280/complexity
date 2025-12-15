import MermaidDownloadSvg from "@/plugins/_thread/artifacts/components/action-buttons/Mermaid/DownloadSvg";
import MermaidOpenInPlayground from "@/plugins/_thread/artifacts/components/action-buttons/Mermaid/OpenInPlayground";

export default function MermaidArtifactsActionButtonsWrapper() {
  return (
    <div className="x:flex x:items-center x:gap-1">
      <MermaidDownloadSvg />
      <MermaidOpenInPlayground />
    </div>
  );
}
