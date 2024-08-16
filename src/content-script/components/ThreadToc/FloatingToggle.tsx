import { ChevronLeft } from "lucide-react";
import { HTMLAttributes } from "react";

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
