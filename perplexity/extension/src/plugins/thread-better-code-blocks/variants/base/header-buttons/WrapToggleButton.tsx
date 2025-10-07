import Tooltip from "@/components/Tooltip";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

import TablerTextWrap from "~icons/tabler/text-wrap";
import TablerTextWrapDisabled from "~icons/tabler/text-wrap-disabled";

export function WrapToggleButton() {
  const { isWrapped, setIsWrapped } = useMirroredCodeBlockContext();

  return (
    <Tooltip
      content={
        isWrapped
          ? t("plugin-better-code-blocks.headerButtons.wrap.unwrap")
          : t("plugin-better-code-blocks.headerButtons.wrap.wrap")
      }
    >
      <div
        className="x:cursor-pointer x:text-muted-foreground x:transition-colors x:hover:text-foreground"
        onClick={() => setIsWrapped(!isWrapped)}
      >
        {isWrapped ? (
          <TablerTextWrapDisabled className="x:size-4" />
        ) : (
          <TablerTextWrap className="x:size-4" />
        )}
      </div>
    </Tooltip>
  );
}
