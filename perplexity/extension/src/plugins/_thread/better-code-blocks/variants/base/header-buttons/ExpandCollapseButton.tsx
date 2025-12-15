import Tooltip from "@/components/Tooltip";
import { useMirroredCodeBlockContext } from "@/plugins/_thread/better-code-blocks/MirroredCodeBlockContext";

import TablerChevronDown from "~icons/tabler/chevron-down";
import TablerChevronUp from "~icons/tabler/chevron-up";

type ExpandCollapseButtonProps = {
  defaultMaxHeight: number;
};

export function ExpandCollapseButton({
  defaultMaxHeight,
}: ExpandCollapseButtonProps) {
  const { maxHeight, setMaxHeight } = useMirroredCodeBlockContext();

  return (
    <Tooltip
      content={
        maxHeight === defaultMaxHeight
          ? t("plugin-better-code-blocks.headerButtons.expand.expand")
          : t("plugin-better-code-blocks.headerButtons.expand.collapse")
      }
    >
      <div
        className="x:cursor-pointer x:text-muted-foreground x:transition-colors x:hover:text-foreground"
        onClick={() =>
          setMaxHeight(maxHeight === defaultMaxHeight ? 9999 : defaultMaxHeight)
        }
      >
        {maxHeight === defaultMaxHeight ? (
          <TablerChevronDown className="x:size-4" />
        ) : (
          <TablerChevronUp className="x:size-4" />
        )}
      </div>
    </Tooltip>
  );
}
