import { HTMLAttributes } from "react";
import { LuChevronLeft as ChevronLeft } from "react-icons/lu";

import Tooltip from "@/shared/components/Tooltip";

type FloatingToggleProps = HTMLAttributes<HTMLDivElement>;

export default function FloatingToggle({ ...props }: FloatingToggleProps) {
  return (
    <div {...props}>
      <Tooltip
        content="Show Table of Content"
        positioning={{
          placement: "left",
        }}
      >
        <ChevronLeft className="tw-h-5 tw-w-5 tw-cursor-pointer tw-text-muted-foreground tw-transition-colors hover:!tw-text-foreground" />
      </Tooltip>
    </div>
  );
}
