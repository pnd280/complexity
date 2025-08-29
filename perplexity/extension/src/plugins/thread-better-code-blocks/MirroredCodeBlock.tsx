import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { isAutonomousArtifactLanguageString } from "@/plugins/artifacts/index.public";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import ArtifactPlaceholderWrapper from "@/plugins/thread-better-code-blocks/variants/artifact-placeholders/Wrapper";
import BaseCodeBlockWrapper from "@/plugins/thread-better-code-blocks/variants/base/Wrapper";
import { PluginsStatesService } from "@/services/features/plugins-states";

const MirroredCodeBlock = memo(function MirroredCodeBlock() {
  const { codeBlock } = useMirroredCodeBlockContext();

  const { isMobile } = useIsMobileStore();
  if (isMobile) return <BaseCodeBlockWrapper />;

  const isAutonomousArtifactLanguage =
    PluginsStatesService.cachedEnableStates?.["thread:artifacts"] &&
    isAutonomousArtifactLanguageString(codeBlock?.content.language);

  if (isAutonomousArtifactLanguage) return <ArtifactPlaceholderWrapper />;

  if (!codeBlock) return null;

  return <BaseCodeBlockWrapper />;
});

export default MirroredCodeBlock;
