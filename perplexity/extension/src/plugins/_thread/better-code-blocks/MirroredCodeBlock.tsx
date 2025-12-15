import { PluginsStatesV2Service } from "@/entrypoints/services/externals/cplx-api/plugins-states";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import { isAutonomousArtifactLanguageString } from "@/plugins/_thread/artifacts/index.public";
import { useMirroredCodeBlockContext } from "@/plugins/_thread/better-code-blocks/MirroredCodeBlockContext";
import ArtifactPlaceholderWrapper from "@/plugins/_thread/better-code-blocks/variants/artifact-placeholders/Wrapper";
import BaseCodeBlockWrapper from "@/plugins/_thread/better-code-blocks/variants/base/Wrapper";

export default function MirroredCodeBlock() {
  const { codeBlock } = useMirroredCodeBlockContext();

  const { isMobile } = useIsMobileStore();
  if (isMobile) return <BaseCodeBlockWrapper />;

  const isAutonomousArtifactLanguage =
    PluginsStatesV2Service.cachedEnableStates?.["thread:artifacts"] &&
    isAutonomousArtifactLanguageString(codeBlock?.content.language);

  if (isAutonomousArtifactLanguage) return <ArtifactPlaceholderWrapper />;

  if (!codeBlock) return null;

  return <BaseCodeBlockWrapper />;
}
