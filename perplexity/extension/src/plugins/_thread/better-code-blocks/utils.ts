import type { CodeBlock } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/code-blocks/types";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/plugins/_thread/better-code-blocks/indexed-db/query-keys";
import type { BetterCodeBlockFineGrainedOptions } from "@/plugins/_thread/better-code-blocks/types";

export function createMirroredPortalContainer(
  codeBlock: CodeBlock,
  codeBlockIndex: number,
): HTMLElement | null {
  if (!codeBlock.nodes.$wrapper) return null;

  const $existingPortalContainer = codeBlock.nodes.$wrapper.prev();

  if (
    $existingPortalContainer[0] &&
    $existingPortalContainer.internalComponentAttr() ===
      DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE
        .MIRRORED_CODE_BLOCK
  ) {
    return $existingPortalContainer[0];
  }

  const $portalContainer = $("<div>")
    .internalComponentAttr(
      DomSelectorsService.Root.internalAttributes.THREAD.MESSAGE
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
    ? persistentQueryClient.queryClient
        .getQueryData<
          BetterCodeBlockFineGrainedOptions[]
        >(betterCodeBlocksFineGrainedOptionsQueries.list.all())
        ?.find((option) => option.language === language)
    : null;

  return fineGrainedSettings;
}
