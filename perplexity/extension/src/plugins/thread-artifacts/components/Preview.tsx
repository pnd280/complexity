import { ARTIFACT_RENDERERS } from "@/plugins/thread-artifacts/consts";
import type { ArtifactLanguage } from "@/plugins/thread-artifacts/types";

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
