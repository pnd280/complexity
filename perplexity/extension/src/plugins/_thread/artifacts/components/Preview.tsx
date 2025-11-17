import { ARTIFACT_RENDERERS } from "@/plugins/_thread/artifacts/consts";
import type { ArtifactLanguage } from "@/plugins/_thread/artifacts/types";

export default function ArtifactPreview({
  language,
}: {
  language: ArtifactLanguage;
}) {
  const Component = ARTIFACT_RENDERERS[language];

  return (
    <div className="x:size-full">
      <Component />
    </div>
  );
}
