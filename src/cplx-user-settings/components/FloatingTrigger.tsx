import { HTMLAttributes } from "react";

import useRouter from "@/content-script/hooks/useRouter";
import Cplx from "@/shared/components/icons/Cplx";
import Tooltip from "@/shared/components/Tooltip";
import useCplxUserSettings from "@/shared/hooks/useCplxUserSettings";
import { cn } from "@/utils/cn";
import { whereAmI } from "@/utils/utils";

export default function FloatingTrigger({
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const location = whereAmI(useRouter().url);

  const { data, mutation: updateCplxUserSettings } = useCplxUserSettings();

  const isFirstVisit = data?.data?.isFirstVisit;

  const handleInformed = () => {
    if (!isFirstVisit) return;

    updateCplxUserSettings.mutate((draft) => {
      draft.isFirstVisit = false;
    });
  };

  return (
    <div
      className={cn(
        "tw-fixed tw-right-4 tw-z-0 tw-font-sans tw-transition-all tw-animate-in tw-fade-in",
        {
          "tw-bottom-[4rem] tw-hidden lg:tw-block": location === "thread",
          "tw-bottom-[5rem] tw-block md:tw-bottom-[4rem]":
            location !== "thread",
        },
      )}
      onMouseEnter={handleInformed}
      onClick={handleInformed}
      {...props}
    >
      <Tooltip
        content={
          isFirstVisit
            ? "Click to open the Settings menu for Complexity!"
            : "Settings"
        }
        positioning={{
          placement: "left",
        }}
        portal={false}
        defaultOpen={isFirstVisit}
      >
        <div
          className={cn(
            "tw-group tw-m-2 tw-flex tw-size-8 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-full tw-bg-muted tw-transition-all tw-duration-300 hover:tw-shadow-[0_0_10px_var(--accent-foreground)]",
          )}
        >
          <Cplx
            className={cn(
              "tw-size-4 tw-text-muted-foreground tw-transition-colors tw-duration-300 group-hover:tw-text-accent-foreground",
            )}
          />
        </div>
      </Tooltip>
    </div>
  );
}
