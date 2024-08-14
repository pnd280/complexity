import { HTMLAttributes } from "react";

import Cplx from "@/shared/components/icons/Cplx";
import Tooltip from "@/shared/components/Tooltip";

export default function FloatingTrigger({
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="right-md tw-fixed tw-bottom-[4rem] tw-font-sans" {...props}>
      <Tooltip
        content="Complexity"
        positioning={{
          placement: "left",
        }}
      >
        <div className="tw-group tw-m-2 tw-flex tw-size-8 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-bg-muted tw-transition-all tw-duration-300 hover:tw-shadow-[0_0_10px_var(--accent-foreground)]">
          <Cplx className="tw-size-4 tw-text-muted-foreground tw-transition-colors tw-duration-300 group-hover:tw-text-accent-foreground" />
        </div>
      </Tooltip>
    </div>
  );
}
