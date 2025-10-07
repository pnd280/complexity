import CopyButton from "@/components/CopyButton";
import { Separator } from "@/components/ui/separator";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import type { BetterCodeBlockFineGrainedOptions } from "@/plugins/thread-better-code-blocks/types";
import { getBetterCodeBlockOptions } from "@/plugins/thread-better-code-blocks/utils";
import ArtifactSimpleModeRenderButton from "@/plugins/thread-better-code-blocks/variants/base/header-buttons/ArtifactSimpleModeRenderButton";
import { ExpandCollapseButton } from "@/plugins/thread-better-code-blocks/variants/base/header-buttons/ExpandCollapseButton";
import { WrapToggleButton } from "@/plugins/thread-better-code-blocks/variants/base/header-buttons/WrapToggleButton";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

import TablerLoaderCircle from "~icons/tabler/loader-2";

const BaseCodeBlockWrapperHeader = memo(function BaseCodeBlockWrapperHeader() {
  const { codeBlock, isHorizontalOverflowing, isVerticalOverflowing } =
    useMirroredCodeBlockContext();

  const language = codeBlock?.content.language ?? null;
  const isInFlight = codeBlock?.states.isInFlight ?? false;
  const code = codeBlock?.content.code ?? "";

  const settings = ExtensionSettingsService.cachedSync;
  const fineGrainedSettings = getBetterCodeBlockOptions(language);
  const globalSettings = settings.plugins["thread:betterCodeBlocks"];

  const placeholderText:
    | BetterCodeBlockFineGrainedOptions["placeholderText"]
    | undefined = fineGrainedSettings?.placeholderText;

  const isSticky =
    fineGrainedSettings?.stickyHeader ?? globalSettings.stickyHeader;

  if (!codeBlock) return null;

  return (
    <div
      data-cplx-code-block-header
      data-sticky={isSticky}
      className="x:flex x:items-center x:justify-between x:rounded-t-lg x:border-b x:border-border/50 x:bg-secondary x:p-2 x:px-4 x:pb-2 x:text-muted-foreground"
    >
      <div className="x:flex x:items-center x:gap-2">
        <div className="x:line-clamp-1 x:font-mono x:text-sm">
          {placeholderText?.title || language}
        </div>
        {!isInFlight && placeholderText?.idle && (
          <div className="x:flex x:items-center x:gap-2">
            <Separator orientation="vertical" className="x:h-4 x:w-[2px]" />
            <div className="x:font-sans x:text-sm">{placeholderText.idle}</div>
          </div>
        )}
      </div>

      <div className="x:flex x:items-center x:gap-4">
        {isInFlight ? (
          <div className="x:flex x:items-center x:gap-2">
            {fineGrainedSettings?.placeholderText?.loading && (
              <div className="x:animate-pulse">
                {fineGrainedSettings?.placeholderText?.loading}
              </div>
            )}
            <TablerLoaderCircle className="x:size-4 x:animate-spin" />
          </div>
        ) : (
          <>
            <ArtifactSimpleModeRenderButton />
            {isHorizontalOverflowing && <WrapToggleButton />}
            <CopyButton content={code} />
            {isVerticalOverflowing && (
              <ExpandCollapseButton
                defaultMaxHeight={
                  fineGrainedSettings?.maxHeight.value ??
                  globalSettings.maxHeight.value
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default BaseCodeBlockWrapperHeader;
