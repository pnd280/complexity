import { queryClient } from "@/data/query-client";
import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import type { CodeBlock } from "@/plugins/_core/dom-observers/thread/code-blocks/types";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/plugins/thread-better-code-blocks/indexed-db/query-keys";
import type { BetterCodeBlockFineGrainedOptions } from "@/plugins/thread-better-code-blocks/types";

export function createMirroredPortalContainer(
  codeBlock: CodeBlock,
  codeBlockIndex: number,
): HTMLElement | null {
  if (!codeBlock.nodes.$wrapper) return null;

  const $existingPortalContainer = codeBlock.nodes.$wrapper.prev();

  if (
    $existingPortalContainer[0] &&
    $existingPortalContainer.internalComponentAttr() ===
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE
        .MIRRORED_CODE_BLOCK
  ) {
    return $existingPortalContainer[0];
  }

  const $portalContainer = $("<div>")
    .internalComponentAttr(
      getDomSelectorsRootService().internalAttributes.THREAD.MESSAGE
        .MIRRORED_CODE_BLOCK,
    )
    .attr({
      "data-language": codeBlock.content.language,
      "data-index": codeBlockIndex,
    });

  codeBlock.nodes.$wrapper.before($portalContainer);

  return $portalContainer[0]!;
}

export function getBetterCodeBlockOptions(
  language: string | null,
): BetterCodeBlockFineGrainedOptions | undefined | null {
  const fineGrainedSettings = language
    ? queryClient
        .getQueryData<
          BetterCodeBlockFineGrainedOptions[]
        >(betterCodeBlocksFineGrainedOptionsQueries.list.all())
        ?.find((option) => option.language === language)
    : null;

  return fineGrainedSettings;
}
